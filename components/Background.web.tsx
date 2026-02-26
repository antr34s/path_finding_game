import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NODE_COUNT = 100;
const SPREAD_XY = 9;
const SPREAD_Z = 5;
const CONNECT_DIST = 3.2;
const ROT_SPEED = 0.04;
const CURSOR_CONNECT_DIST = 5;
const MAX_CURSOR_LINES = 8;

function randomColor(): number {
  const r = Math.random();
  if (r < 0.60) return 0x00ffcc; // cyan
  if (r < 0.85) return 0x3b8cff; // blue
  return 0xff006e;               // pink
}

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.set(0, 0, 14);

    // --- Nodes (rotating group) ---
    const positions: THREE.Vector3[] = [];
    const group = new THREE.Group();

    for (let i = 0; i < NODE_COUNT; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * SPREAD_XY * 2,
        (Math.random() - 0.5) * SPREAD_XY * 2,
        (Math.random() - 0.5) * SPREAD_Z * 2,
      );
      positions.push(pos);

      const color = randomColor();

      const innerGeo = new THREE.SphereGeometry(0.07, 7, 7);
      const innerMat = new THREE.MeshBasicMaterial({ color });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      inner.position.copy(pos);

      const outerGeo = new THREE.SphereGeometry(0.22, 7, 7);
      const outerMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.08 });
      const outer = new THREE.Mesh(outerGeo, outerMat);
      outer.position.copy(pos);

      group.add(inner, outer);
    }

    // --- Static edges ---
    const edgePts: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (positions[i].distanceTo(positions[j]) < CONNECT_DIST) {
          edgePts.push(...positions[i].toArray(), ...positions[j].toArray());
        }
      }
    }

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePts, 3));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.13 });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    group.add(edges);

    scene.add(group);

    // --- Cursor node (lives in world space, does not rotate) ---
    const cursorInnerGeo = new THREE.SphereGeometry(0.10, 8, 8);
    const cursorInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cursorMesh = new THREE.Mesh(cursorInnerGeo, cursorInnerMat);
    cursorMesh.visible = false;
    scene.add(cursorMesh);

    const cursorHaloGeo = new THREE.SphereGeometry(0.30, 8, 8);
    const cursorHaloMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.12 });
    const cursorHalo = new THREE.Mesh(cursorHaloGeo, cursorHaloMat);
    cursorHalo.visible = false;
    scene.add(cursorHalo);

    // --- Cursor edges (pre-allocated, updated every frame) ---
    const cursorEdgeGeo = new THREE.BufferGeometry();
    const cursorEdgeBuf = new Float32Array(MAX_CURSOR_LINES * 2 * 3);
    const cursorEdgeAttr = new THREE.BufferAttribute(cursorEdgeBuf, 3);
    cursorEdgeAttr.setUsage(THREE.DynamicDrawUsage);
    cursorEdgeGeo.setAttribute('position', cursorEdgeAttr);
    cursorEdgeGeo.setDrawRange(0, 0);
    const cursorEdgeMat = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.45 });
    const cursorEdges = new THREE.LineSegments(cursorEdgeGeo, cursorEdgeMat);
    cursorEdges.visible = false;
    scene.add(cursorEdges);

    // --- Mouse state ---
    const mouse = new THREE.Vector2(9999, 9999);
    const intersectPoint = new THREE.Vector3();
    const cursorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const tmpWorldPos = new THREE.Vector3();
    let cursorActive = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      cursorActive = true;
    };

    const onMouseLeave = () => {
      cursorActive = false;
      cursorMesh.visible = false;
      cursorHalo.visible = false;
      cursorEdges.visible = false;
      cursorEdgeGeo.setDrawRange(0, 0);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // --- Animation ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate the node graph
      group.rotation.y = t * ROT_SPEED;
      group.rotation.x = Math.sin(t * 0.025) * 0.18;
      group.updateMatrixWorld(true);

      // Cursor
      if (cursorActive) {
        raycaster.setFromCamera(mouse, camera);
        const hit = raycaster.ray.intersectPlane(cursorPlane, intersectPoint);

        if (hit) {
          const pulse = 1 + Math.sin(t * 4) * 0.18;
          cursorMesh.position.copy(intersectPoint);
          cursorMesh.scale.setScalar(pulse);
          cursorMesh.visible = true;

          cursorHalo.position.copy(intersectPoint);
          cursorHalo.scale.setScalar(pulse);
          cursorHalo.visible = true;

          cursorEdges.visible = true;

          // Rebuild cursor-to-node edges
          let lineCount = 0;
          for (let i = 0; i < positions.length && lineCount < MAX_CURSOR_LINES; i++) {
            tmpWorldPos.copy(positions[i]).applyMatrix4(group.matrixWorld);
            if (intersectPoint.distanceTo(tmpWorldPos) < CURSOR_CONNECT_DIST) {
              const base = lineCount * 6;
              cursorEdgeBuf[base + 0] = intersectPoint.x;
              cursorEdgeBuf[base + 1] = intersectPoint.y;
              cursorEdgeBuf[base + 2] = intersectPoint.z;
              cursorEdgeBuf[base + 3] = tmpWorldPos.x;
              cursorEdgeBuf[base + 4] = tmpWorldPos.y;
              cursorEdgeBuf[base + 5] = tmpWorldPos.z;
              lineCount++;
            }
          }

          cursorEdgeAttr.needsUpdate = true;
          cursorEdgeGeo.setDrawRange(0, lineCount * 2);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      cursorEdgeGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
