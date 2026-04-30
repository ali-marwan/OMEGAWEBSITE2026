"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/omega-logo-final.glb";

// Preload the GLB so the model is in browser cache by the time the
// Canvas mounts. This dramatically reduces the visible "pop-in".
useGLTF.preload(MODEL_PATH);

/**
 * Imperative handle exposed by `OmegaLogo3D`.
 *
 * The hero scroll journey lives outside the R3F Canvas and drives this
 * component frame-to-frame via two scalar values (0 → 1 each):
 *
 *   - `setExplode(v)` — separates the model's parts radially outward
 *     from the geometric center along their own outward vectors. At
 *     `v = 0` the logo is fully assembled, at `v = 1` the parts have
 *     pushed out by ~0.35 world units (calibrated for the model's
 *     bounding diagonal). No chaos, no debris — each part travels in
 *     a single deterministic direction so the result reads as a
 *     controlled exploded view.
 *
 *   - `setRecede(v)` — eases the materials toward a more matte, less
 *     reflective state and applies a partial opacity reduction. Used
 *     to settle the logo as a quiet background object near the
 *     Service System section without making it disappear entirely.
 */
export type OmegaLogo3DHandle = {
  setExplode(value: number): void;
  setRecede(value: number): void;
};

type Part = {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  /** Outward unit vector from the model's center to this mesh's centroid. */
  direction: THREE.Vector3;
};

/**
 * GLB-driven OMEGA brand object.
 *
 * Material direction (matte graphite / charcoal — engineered, not plastic):
 *   color           #1a1a1a
 *   metalness       0.55  (subtle metallic shimmer, not chrome)
 *   roughness       0.40  (controlled gloss, not mirror)
 *   envMapIntensity 0.85  (HDRI reflections register without overpowering)
 *
 * Idle motion (atmospheric only, never playful):
 *   - Gentle vertical float (~4 % of unit, 0.5 Hz)
 *   - Quiet parallax tilt on Y / X axes (low amplitude, low frequency)
 *
 * Camera lives outside this component (in the Canvas) so the model
 * focuses purely on what *it* renders.
 */
export const OmegaLogo3D = forwardRef<OmegaLogo3DHandle, unknown>(
  function OmegaLogo3D(_props, handleRef) {
    const groupRef = useRef<THREE.Group>(null);
    const explodeRef = useRef(0);
    const recedeRef = useRef(0);

    // useGLTF returns the parsed scene + animations.
    const gltf = useGLTF(MODEL_PATH);

    // Clone so multiple mounts (e.g. fast refresh) don't share state.
    const clonedScene = useMemo(
      () => (gltf.scene as THREE.Group).clone(true),
      [gltf.scene]
    );

    // Walk the cloned scene once: re-skin every mesh with our matte
    // graphite material, collect part records (base position +
    // outward direction), and re-center the whole group at the
    // origin so transforms pivot around the geometric center.
    const parts = useMemo<Part[]>(() => {
      const collected: Part[] = [];

      // Compute bounding box of the entire scene to find its centroid.
      const sceneBox = new THREE.Box3().setFromObject(clonedScene);
      const sceneCenter = sceneBox.getCenter(new THREE.Vector3());

      clonedScene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;

        // Premium architectural material — matte graphite with subtle
        // controlled reflections. Materials are unique per mesh so we
        // can tweak metalness/roughness/opacity per-part on recede.
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#1a1a1a"),
          metalness: 0.55,
          roughness: 0.4,
          envMapIntensity: 0.85,
        });
        mesh.material = material;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        // Compute this mesh's centroid in world space, then take the
        // outward vector from the scene's centroid. That direction
        // becomes its explode trajectory.
        const meshBox = new THREE.Box3().setFromObject(mesh);
        const meshCenter = meshBox.getCenter(new THREE.Vector3());
        const direction = meshCenter.clone().sub(sceneCenter);
        if (direction.lengthSq() < 1e-4) {
          // Single-mesh model fallback — push gently upward.
          direction.set(0, 1, 0);
        }
        direction.normalize();

        collected.push({
          mesh,
          base: mesh.position.clone(),
          direction,
        });
      });

      return collected;
    }, [clonedScene]);

    // Re-center the cloned scene at origin so the wrapping <group>
    // can apply a clean rotation pivot.
    useEffect(() => {
      const box = new THREE.Box3().setFromObject(clonedScene);
      const center = box.getCenter(new THREE.Vector3());
      clonedScene.position.sub(center);

      // Normalize size so different exports of the GLB land in the
      // same rough screen footprint. We aim for a ~2.4-unit bounding
      // diagonal — fits comfortably inside the 35° FOV at z = 4.
      const size = box.getSize(new THREE.Vector3());
      const diag = size.length();
      const target = 2.4;
      if (diag > 1e-4) {
        const k = target / diag;
        clonedScene.scale.setScalar(k);
      }
    }, [clonedScene]);

    useImperativeHandle(handleRef, () => ({
      setExplode(value: number) {
        explodeRef.current = Math.max(0, Math.min(1, value));
      },
      setRecede(value: number) {
        recedeRef.current = Math.max(0, Math.min(1, value));
      },
    }));

    useFrame((state) => {
      const t = state.clock.elapsedTime;

      // Premium idle — barely-there breathing motion. No bounce.
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(t * 0.5) * 0.04;
        groupRef.current.rotation.y = Math.sin(t * 0.32) * 0.07;
        groupRef.current.rotation.x = Math.cos(t * 0.27) * 0.025;
      }

      // Apply explode: each mesh travels along its outward vector by
      // a magnitude proportional to the explode scalar. Calibrated so
      // even at full explode the parts stay clearly related to the
      // original logo silhouette — not a particle blast.
      const explodeMag = explodeRef.current * 0.35;
      for (const { mesh, base, direction } of parts) {
        mesh.position.x = base.x + direction.x * explodeMag;
        mesh.position.y = base.y + direction.y * explodeMag;
        mesh.position.z = base.z + direction.z * explodeMag;
      }

      // Apply recede: ease toward a flatter, dimmer material as the
      // logo settles into a background role.
      const r = recedeRef.current;
      for (const { mesh } of parts) {
        const m = mesh.material as THREE.MeshStandardMaterial;
        m.metalness = 0.55 - r * 0.25; // 0.55 → 0.30
        m.roughness = 0.4 + r * 0.3; // 0.40 → 0.70
        m.envMapIntensity = 0.85 - r * 0.45; // 0.85 → 0.40
        const op = 1 - r * 0.5; // 1.00 → 0.50
        if (m.opacity !== op) m.opacity = op;
        if (m.transparent !== r > 0) m.transparent = r > 0;
      }
    });

    return <primitive ref={groupRef} object={clonedScene} />;
  }
);
