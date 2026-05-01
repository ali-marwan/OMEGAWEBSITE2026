"use client";

import { useEffect, useRef } from "react";

/**
 * WebGPU grass-field background — sandbox port of the Verdana demo,
 * adapted to OMEGA's warm palette (graphite base · sand tip ·
 * omega-orange highlight). Used as the visual layer of the /insights
 * hero only — not on the homepage.
 *
 * What's kept from the demo:
 *   - 60K instanced grass blades (down from 120K — same look, half the
 *     GPU cost on mid-tier hardware).
 *   - TSL compute shaders for blade physics (wind + cursor push +
 *     camera-sphere push).
 *   - Sky gradient + exponential fog.
 *   - Mouse raycast onto a Y=0 plane to drive the cursor sphere.
 *
 * What's removed for OMEGA:
 *   - Scroll-driven camera path (would fight the rest of the page
 *     scroll).
 *   - Per-stage parameter system + settings panel (dev-only tools).
 *   - Depth of field (kept the codepath simple and the chunk small;
 *     can be added later behind another perf gate).
 *
 * Lifecycle:
 *   The whole renderer (R, scene, mesh, material) is created inside
 *   useEffect and torn down on unmount. The animation loop is driven
 *   by `renderer.setAnimationLoop` and stopped on cleanup. ResizeObserver
 *   keeps the canvas crisp through layout changes.
 */
export default function GrassFieldCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three/webgpu");
      const TSL = await import("three/tsl");
      const {
        Fn,
        uniform,
        float,
        vec3,
        instancedArray,
        instanceIndex,
        uv,
        positionGeometry,
        positionWorld,
        sin,
        cos,
        pow,
        smoothstep,
        mix,
        sqrt,
        select,
        hash,
        time,
        deltaTime,
        PI,
        mx_noise_float,
      } = TSL;

      if (disposed) return;

      const BLADE_COUNT = 60_000;
      const FIELD_SIZE = 30;

      // ── OMEGA-warm palette ─────────────────────────────────────────
      const PAL = {
        background: "#0c0b0a",
        ground: "#070605",
        bladeBase: "#1a1108",
        bladeTip: "#c88842",
        goldenTip: "#f26a1b",
        greenTip: "#4a3015",
        mid: "#5a3818",
        fog: "#0a0907",
        skyTop: "#050505",
        skyMidHigh: "#0c0b0a",
        skyMidLow: "#1a120a",
        skyHorizon: "#2a1a0a",
      };

      // ── Sky texture ────────────────────────────────────────────────
      function buildSkyTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 2;
        canvas.height = 512;
        const ctx = canvas.getContext("2d")!;
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0.0, PAL.skyTop);
        grad.addColorStop(0.35, PAL.skyMidHigh);
        grad.addColorStop(0.65, PAL.skyMidLow);
        grad.addColorStop(1.0, PAL.skyHorizon);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 2, 512);
        const tex = new THREE.CanvasTexture(canvas);
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        return tex;
      }

      // ── Scene + camera + renderer ──────────────────────────────────
      const scene = new THREE.Scene();
      scene.background = buildSkyTexture();
      scene.fog = new THREE.FogExp2(PAL.fog, 0.035);

      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
      camera.position.set(0, 8, 18);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGPURenderer({ antialias: true });
      const dpr = w < 1200 ? 1.5 : Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);
      Object.assign(renderer.domElement.style, {
        width: "100%",
        height: "100%",
        display: "block",
      });

      try {
        await renderer.init();
      } catch {
        // WebGPU init failed despite navigator.gpu being present —
        // bail quietly. The static fallback in the parent stays visible.
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        return;
      }
      if (disposed) {
        renderer.dispose?.();
        return;
      }

      // ── GPU buffers ────────────────────────────────────────────────
      const bladeData = instancedArray(BLADE_COUNT, "vec4");
      const bendState = instancedArray(BLADE_COUNT, "vec4");
      const bladeBound = instancedArray(BLADE_COUNT, "float");

      // ── Uniforms ───────────────────────────────────────────────────
      const mouseWorld = uniform(new THREE.Vector3(99999, 0, 99999));
      const mouseRadius = uniform(6.1);
      const mouseStrength = uniform(4.0);
      const outerRadius = uniform(9.4);
      const outerStrength = uniform(1.45);
      const camSphereWorld = uniform(new THREE.Vector3(99999, 0, 99999));
      const camSphereRadius = uniform(15.0);
      const camSphereStrength = uniform(5.9);

      const grassDensity = uniform(1.0);
      const windSpeed = uniform(1.3);
      const windAmplitude = uniform(0.21);
      const bladeWidth = uniform(4.0);
      const bladeTipWidth = uniform(0.19);
      const bladeHeight = uniform(1.6);
      const bladeHeightVariation = uniform(0.5);
      const bladeLean = uniform(1.1);
      const noiseAmplitude = uniform(1.85);
      const noiseFrequency = uniform(0.3);
      const noise2Amplitude = uniform(0.2);
      const noise2Frequency = uniform(15);
      const bladeColorVariation = uniform(0.93);
      const groundRadius = uniform(13.8);
      const groundFalloff = uniform(2.4);
      const bladeBaseColor = uniform(new THREE.Color(PAL.bladeBase));
      const bladeTipColor = uniform(new THREE.Color(PAL.bladeTip));
      const backgroundColor = uniform(new THREE.Color(PAL.background));
      const groundColor = uniform(new THREE.Color(PAL.ground));
      const fogStart = uniform(6.5);
      const fogEnd = uniform(12.0);
      const fogIntensity = uniform(1.0);
      const fogColor = uniform(new THREE.Color(PAL.fog));
      const goldenTipColor = uniform(new THREE.Color(PAL.goldenTip));
      const greenTipColor = uniform(new THREE.Color(PAL.greenTip));
      const midColor = uniform(new THREE.Color(PAL.mid));

      const noise2D = Fn(([x, z]: [unknown, unknown]) =>
        // @ts-ignore TSL operator types
        mx_noise_float(vec3(x, float(0), z)).mul(0.5).add(0.5)
      );

      // ── Compute init ───────────────────────────────────────────────
      const computeInit = Fn(() => {
        const blade = bladeData.element(instanceIndex);
        const col = instanceIndex.mod(245);
        const row = instanceIndex.div(245);
        const jx = hash(instanceIndex).sub(0.5);
        const jz = hash(instanceIndex.add(7919)).sub(0.5);
        const wx = col
          .toFloat()
          .add(jx)
          .div(float(245))
          .sub(0.5)
          .mul(FIELD_SIZE);
        const wz = row
          .toFloat()
          .add(jz)
          .div(float(245))
          .sub(0.5)
          .mul(FIELD_SIZE);
        blade.x.assign(wx);
        blade.y.assign(wz);
        blade.z.assign(hash(instanceIndex.add(1337)).mul(PI.mul(2)));
        // @ts-ignore TSL types
        const n1 = noise2D(wx.mul(noiseFrequency), wz.mul(noiseFrequency));
        const n2 = noise2D(
          // @ts-ignore TSL types
          wx.mul(noiseFrequency.mul(noise2Frequency)).add(50),
          // @ts-ignore TSL types
          wz.mul(noiseFrequency.mul(noise2Frequency)).add(50)
        );
        const clump = n1
          .mul(noiseAmplitude)
          .sub(noise2Amplitude)
          .add(n2.mul(noise2Amplitude).mul(2))
          .max(0);
        blade.w.assign(clump);
        const dist = sqrt(wx.mul(wx).add(wz.mul(wz)));
        // @ts-ignore TSL types
        const edgeNoise = noise2D(wx.mul(0.25).add(100), wz.mul(0.25).add(100));
        const maxR = float(12.0).add(edgeNoise.sub(0.5).mul(6.0));
        const boundary = float(1).sub(smoothstep(maxR.sub(1.5), maxR, dist));
        bladeBound
          .element(instanceIndex)
          .assign(select(boundary.lessThan(0.05), float(0), boundary));
      })().compute(BLADE_COUNT);

      // ── Compute update (per frame) ─────────────────────────────────
      const computeUpdate = Fn(() => {
        const blade = bladeData.element(instanceIndex);
        const bend = bendState.element(instanceIndex);
        const bx = blade.x;
        const bz = blade.y;

        const w1 = sin(
          bx.mul(0.35).add(bz.mul(0.12)).add(time.mul(windSpeed))
        );
        const w2 = sin(
          bx
            .mul(0.18)
            .add(bz.mul(0.28))
            .add(time.mul(windSpeed.mul(0.67)))
            .add(1.7)
        );
        const windX = w1.add(w2).mul(windAmplitude);
        const windZ = w1.sub(w2).mul(windAmplitude.mul(0.55));

        const lw = deltaTime.mul(4.0).saturate();
        bend.x.assign(mix(bend.x, windX, lw));
        bend.y.assign(mix(bend.y, windZ, lw));

        const dx = bx.sub(mouseWorld.x);
        const dz = bz.sub(mouseWorld.z);
        const dist = sqrt(dx.mul(dx).add(dz.mul(dz))).add(0.0001);
        const falloff = float(1).sub(dist.div(mouseRadius).saturate());
        const influence = falloff.mul(falloff).mul(mouseStrength);
        const pushX = dx.div(dist).mul(influence);
        const pushZ = dz.div(dist).mul(influence);

        const odx = bx.sub(mouseWorld.x);
        const odz = bz.sub(mouseWorld.z);
        const odist = sqrt(odx.mul(odx).add(odz.mul(odz))).add(0.0001);
        const ofalloff = float(1).sub(odist.div(outerRadius).saturate());
        const oinfluence = ofalloff.mul(ofalloff).mul(outerStrength);
        const opushX = odx.div(odist).mul(oinfluence);
        const opushZ = odz.div(odist).mul(oinfluence);

        const cdx = bx.sub(camSphereWorld.x);
        const cdz = bz.sub(camSphereWorld.z);
        const cdist = sqrt(cdx.mul(cdx).add(cdz.mul(cdz))).add(0.0001);
        const cfalloff = float(1).sub(cdist.div(camSphereRadius).saturate());
        const cinfluence = cfalloff.mul(cfalloff).mul(camSphereStrength);
        const cpushX = cdx.div(cdist).mul(cinfluence);
        const cpushZ = cdz.div(cdist).mul(cinfluence);

        const totalPushX = pushX.add(opushX).add(cpushX);
        const totalPushZ = pushZ.add(opushZ).add(cpushZ);

        const targetMag = sqrt(
          totalPushX.mul(totalPushX).add(totalPushZ.mul(totalPushZ))
        );
        const currentMag = sqrt(bend.z.mul(bend.z).add(bend.w.mul(bend.w)));
        const lm = select(
          targetMag.greaterThan(currentMag),
          deltaTime.mul(12.0),
          deltaTime.mul(1)
        ).saturate();
        bend.z.assign(mix(bend.z, totalPushX, lm));
        bend.w.assign(mix(bend.w, totalPushZ, lm));
      })().compute(BLADE_COUNT);

      // ── Blade geometry ─────────────────────────────────────────────
      function createBladeGeometry() {
        const segs = 5;
        const W = 0.055;
        const H = 1.0;
        const verts: number[] = [];
        const norms: number[] = [];
        const uvArr: number[] = [];
        const idx: number[] = [];
        for (let i = 0; i <= segs; i++) {
          const t = i / segs;
          const y = t * H;
          const hw = W * 0.5 * (1.0 - t * 0.82);
          verts.push(-hw, y, 0, hw, y, 0);
          norms.push(0, 0, 1, 0, 0, 1);
          uvArr.push(0, t, 1, t);
        }
        for (let i = 0; i < segs; i++) {
          const b = i * 2;
          idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        geo.setAttribute("normal", new THREE.Float32BufferAttribute(norms, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvArr, 2));
        geo.setIndex(idx);
        return geo;
      }

      // ── Grass material ─────────────────────────────────────────────
      const grassMat = new THREE.MeshBasicNodeMaterial({
        side: THREE.DoubleSide,
        fog: true,
      });

      grassMat.positionNode = Fn(() => {
        const blade = bladeData.element(instanceIndex);
        const bend = bendState.element(instanceIndex);
        const worldX = blade.x;
        const worldZ = blade.y;
        const rotY = blade.z;
        const boundary = bladeBound.element(instanceIndex);
        const visible = select(
          hash(instanceIndex.add(9999)).lessThan(grassDensity.mul(0.5)),
          float(1),
          float(0)
        );
        const hVar = hash(instanceIndex.add(5555)).mul(bladeHeightVariation);
        const heightScale = float(0.35)
          .add(blade.w)
          .add(hVar)
          .mul(boundary)
          .mul(visible);
        const taper = float(1).sub(uv().y.mul(float(1).sub(bladeTipWidth)));
        const lx = positionGeometry.x
          .mul(bladeWidth)
          .mul(taper)
          .mul(heightScale.sign());
        const ly = positionGeometry.y.mul(heightScale).mul(bladeHeight);
        const cY = cos(rotY);
        const sY = sin(rotY);
        const rx = lx.mul(cY);
        const rz = lx.mul(sY);
        const t = uv().y;
        const bendFactor = pow(t, 1.8);
        const staticBendX = hash(instanceIndex.add(7777))
          .sub(0.5)
          .mul(bladeLean);
        const staticBendZ = hash(instanceIndex.add(8888))
          .sub(0.5)
          .mul(bladeLean);
        const bendX = staticBendX.add(bend.x).add(bend.z);
        const bendZ = staticBendZ.add(bend.y).add(bend.w);
        const relX = rx.add(bendX.mul(bendFactor).mul(bladeHeight));
        const relY = ly;
        const relZ = rz.add(bendZ.mul(bendFactor).mul(bladeHeight));
        const origLen = sqrt(rx.mul(rx).add(ly.mul(ly)).add(rz.mul(rz)));
        const newLen = sqrt(relX.mul(relX).add(relY.mul(relY)).add(relZ.mul(relZ)));
        const scale = origLen.div(newLen.max(0.0001));
        return vec3(
          worldX.add(relX.mul(scale)),
          relY.mul(scale),
          worldZ.add(relZ.mul(scale))
        );
      })();

      grassMat.colorNode = Fn(() => {
        const t = uv().y;
        const clump = bladeData.element(instanceIndex).w.saturate();
        const bladeHash = hash(instanceIndex.add(4242));
        const isGolden = bladeHash.lessThan(0.4);
        const lowerGrad = smoothstep(float(0.0), float(0.45), t);
        const upperGrad = smoothstep(float(0.4), float(0.85), t);
        const tipMix = float(1)
          .sub(bladeColorVariation)
          .add(clump.mul(bladeColorVariation));
        const greenTip = mix(greenTipColor, bladeTipColor, tipMix);
        const warmTip = mix(greenTipColor, goldenTipColor, tipMix);
        const tipFinal = mix(
          greenTip,
          warmTip,
          select(isGolden, float(1), float(0))
        );
        const lowerColor = mix(bladeBaseColor, midColor, lowerGrad);
        const grassColor = mix(lowerColor, tipFinal, upperGrad);
        const blade = bladeData.element(instanceIndex);
        const dist = sqrt(blade.x.mul(blade.x).add(blade.y.mul(blade.y)));
        const fogFactor = smoothstep(fogStart, fogEnd, dist).mul(fogIntensity);
        return mix(grassColor, fogColor, fogFactor);
      })();

      grassMat.opacityNode = Fn(() => {
        const blade = bladeData.element(instanceIndex);
        const dist = sqrt(blade.x.mul(blade.x).add(blade.y.mul(blade.y)));
        const fadeEnd = select(
          fogIntensity.greaterThan(0.01),
          fogEnd.add(2.0),
          float(15.0)
        );
        const fadeFactor = float(1).sub(
          smoothstep(fadeEnd.sub(5.0), fadeEnd, dist)
        );
        return smoothstep(float(0.0), float(0.1), uv().y).mul(fadeFactor);
      })();
      grassMat.transparent = true;

      const bladeGeo = createBladeGeometry();
      const grass = new THREE.InstancedMesh(bladeGeo, grassMat, BLADE_COUNT);
      grass.frustumCulled = false;
      scene.add(grass);
      const dummy = new THREE.Object3D();
      for (let i = 0; i < BLADE_COUNT; i++) grass.setMatrixAt(i, dummy.matrix);
      grass.instanceMatrix.needsUpdate = true;

      // ── Ground ─────────────────────────────────────────────────────
      const groundMat = new THREE.MeshBasicNodeMaterial();
      groundMat.colorNode = Fn(() => {
        const wx = positionWorld.x;
        const wz = positionWorld.z;
        const dist = sqrt(wx.mul(wx).add(wz.mul(wz)));
        // @ts-ignore TSL types
        const edgeNoise = noise2D(wx.mul(0.25).add(100), wz.mul(0.25).add(100));
        const maxR = groundRadius.add(edgeNoise.sub(0.5).mul(4.0));
        const t = smoothstep(maxR.sub(groundFalloff), maxR, dist);
        return mix(groundColor, backgroundColor, t);
      })();
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(FIELD_SIZE * 5, FIELD_SIZE * 5),
        groundMat
      );
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      // ── Lighting ───────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dirLight = new THREE.DirectionalLight(0xfff4e0, 1.5);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      // ── Mouse raycast ──────────────────────────────────────────────
      const raycaster = new THREE.Raycaster();
      const mouseNDC = new THREE.Vector2();
      const grassPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hitPoint = new THREE.Vector3();

      function onMouseMove(e: MouseEvent) {
        const rect = container!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
          mouseWorld.value.set(99999, 0, 99999);
          return;
        }
        mouseNDC.set((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1);
        raycaster.setFromCamera(mouseNDC, camera);
        if (raycaster.ray.intersectPlane(grassPlane, hitPoint)) {
          mouseWorld.value.copy(hitPoint);
        }
      }
      function onMouseLeave() {
        mouseWorld.value.set(99999, 0, 99999);
      }
      window.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseleave", onMouseLeave);

      // ── Resize ─────────────────────────────────────────────────────
      let resizeRaf = 0;
      const onResize = () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          const cw = container!.clientWidth || window.innerWidth;
          const ch = container!.clientHeight || window.innerHeight;
          camera.aspect = cw / ch;
          camera.updateProjectionMatrix();
          const newDpr =
            cw < 1200 ? 1.5 : Math.min(window.devicePixelRatio, 2);
          renderer.setPixelRatio(newDpr);
          renderer.setSize(cw, ch);
        });
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(container);
      window.addEventListener("resize", onResize);

      // ── Boot + animate ─────────────────────────────────────────────
      await renderer.computeAsync(computeInit);
      if (disposed) return;

      // Quiet pre-warm so first paint is the warmed-up scene.
      renderer.domElement.style.opacity = "0";
      renderer.domElement.style.transition = "opacity 600ms ease";
      for (let i = 0; i < 3; i++) {
        renderer.compute(computeUpdate);
        await renderer.renderAsync(scene, camera);
        await new Promise((r) => requestAnimationFrame(r));
        if (disposed) return;
      }
      renderer.domElement.style.opacity = "1";

      // Subtle, slow auto-orbit so the scene breathes even without
      // cursor movement. Single radius / single rate — calm, not busy.
      const orbitRadius = 18;
      const orbitHeight = 8;
      const orbitSpeed = 0.04; // radians per second

      const start = performance.now();

      function frame() {
        if (disposed) return;
        const t = (performance.now() - start) / 1000;
        const angle = t * orbitSpeed;
        camera.position.set(
          Math.sin(angle) * orbitRadius,
          orbitHeight,
          Math.cos(angle) * orbitRadius
        );
        camera.lookAt(0, 0.4, 0);

        // Camera-sphere push uses the camera's ground projection so
        // the grass parts naturally as the camera orbits.
        camSphereWorld.value.set(camera.position.x, 0, camera.position.z);
        const camHeight = camera.position.y;
        const proximityT = Math.max(0, 1 - camHeight / 10);
        const proxCurve = proximityT * proximityT;
        camSphereRadius.value = Math.min(
          15,
          15 * (0.3 + proxCurve * 0.7)
        );
        camSphereStrength.value = 5.9 * (0.1 + proxCurve * 0.9);

        renderer.compute(computeUpdate);
        renderer.renderAsync(scene, camera);
      }
      renderer.setAnimationLoop(frame);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect();
        window.removeEventListener("mousemove", onMouseMove);
        container?.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(resizeRaf);
        try {
          bladeGeo.dispose();
          (groundMat as unknown as { dispose?: () => void }).dispose?.();
          (grassMat as unknown as { dispose?: () => void }).dispose?.();
          renderer.dispose?.();
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        } catch {
          // best-effort teardown — swallow disposal errors so they
          // don't surface as console noise on hot-reload.
        }
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0"
      style={{ contain: "strict" }}
    />
  );
}
