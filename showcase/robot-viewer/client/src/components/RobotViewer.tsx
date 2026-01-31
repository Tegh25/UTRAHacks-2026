import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useRobotStore } from '../hooks/useRobotModel';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const MODEL_PATH = '/models/Buggy.gltf';

const HIGHLIGHT_COLOR = new THREE.Color('#c026d3');
const GREY_COLOR = new THREE.Color('#aaaaaa');
const LERP_SPEED = 0.5;
// Deterministic fallback direction for meshes at the exact center
function deterministicDir(index: number): THREE.Vector3 {
  const angle = (index + 1) * 2.399963; // golden angle
  return new THREE.Vector3(Math.cos(angle), 0.5, Math.sin(angle)).normalize();
}

function LoadedModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);

  const highlightedParts = useRobotStore((s) => s.highlightedParts);
  const selectPart = useRobotStore((s) => s.selectPart);
  const highlightParts = useRobotStore((s) => s.highlightParts);
  const explodeStrength = useRobotStore((s) => s.explodeStrength);

  // Auto-center and scale
  const { scaleFactor, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 2 / maxDim;
    return {
      scaleFactor: s,
      offset: new THREE.Vector3(-center.x * s, -center.y * s, -center.z * s),
    };
  }, [scene]);

  // Compute the model-space center for explode directions
  const modelCenter = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return box.getCenter(new THREE.Vector3());
  }, [scene]);

  // Collect all meshes — every named mesh is its own selectable part
  const meshEntries = useMemo(() => {
    const entries: {
      mesh: THREE.Mesh;
      partId: string;
      originals: THREE.Material[];
      origPos: THREE.Vector3;
      explodeDir: THREE.Vector3;
      currentOffset: THREE.Vector3;
    }[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const partId = mesh.name || mesh.parent?.name;
        if (!partId) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        // Compute world-space center of this mesh for the explode direction
        const meshBox = new THREE.Box3().setFromObject(mesh);
        const meshCenter = meshBox.getCenter(new THREE.Vector3());
        const dir = meshCenter.clone().sub(modelCenter);
        if (dir.length() < 0.001) {
          dir.copy(deterministicDir(entries.length));
        }
        dir.normalize();

        // Tag the mesh with its partId immediately during traversal
        mesh.userData.partId = partId;

        entries.push({
          mesh,
          partId,
          originals: mats.map((m) => m.clone()),
          origPos: mesh.position.clone(),
          explodeDir: dir,
          currentOffset: new THREE.Vector3(0, 0, 0),
        });
      }
    });
    console.log('[RobotViewer] Discovered parts:', entries.map((e) => e.partId));
    return entries;
  }, [scene, modelCenter]);

  // Each frame: highlight selected part, grey out others, animate explode
  useFrame(() => {
    const hasHighlight = highlightedParts.length > 0;
    const pulse = 0.6 + Math.sin(Date.now() * 0.004) * 0.2;

    for (const entry of meshEntries) {
      const { mesh, partId, originals, origPos, explodeDir, currentOffset } = entry;
      const isHighlighted = highlightedParts.includes(partId);
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      // --- Material: highlight, grey, or restore ---
      mats.forEach((mat, i) => {
        const std = mat as THREE.MeshStandardMaterial;
        const orig = originals[i] as THREE.MeshStandardMaterial;

        if (isHighlighted) {
          std.emissive.copy(HIGHLIGHT_COLOR);
          std.emissiveIntensity = pulse;
          std.color.copy(orig.color);
          std.opacity = 1;
          std.transparent = false;
          std.depthWrite = true;
        } else if (hasHighlight) {
          std.emissive.set('#000000');
          std.emissiveIntensity = 0;
          std.color.copy(GREY_COLOR);
          std.opacity = 0.4;
          std.transparent = true;
          std.depthWrite = false;
        } else {
          std.emissive.copy(orig.emissive);
          std.emissiveIntensity = orig.emissiveIntensity;
          std.color.copy(orig.color);
          std.opacity = orig.opacity;
          std.transparent = orig.transparent;
          std.depthWrite = true;
        }
      });

      // --- Explode: push non-highlighted parts outward, lerp back when no selection ---
      const targetOffset = new THREE.Vector3();
      if (hasHighlight && !isHighlighted) {
        targetOffset.copy(explodeDir).multiplyScalar(explodeStrength);
      }

      currentOffset.lerp(targetOffset, LERP_SPEED);
      mesh.position.copy(origPos).add(currentOffset);
    }
  });

  // Click handler — use the clicked mesh's partId directly
  const handleClick = (e: { object: THREE.Object3D; stopPropagation: () => void }) => {
    e.stopPropagation();
    const partId = e.object.userData.partId as string | undefined;
    if (partId) {
      highlightParts([partId]);
      selectPart(partId);
    }
  };

  return (
    <>
      <group ref={groupRef}>
        <primitive
          object={scene}
          scale={scaleFactor}
          position={offset}
          onClick={handleClick}
        />
      </group>
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#94a3b8" wireframe />
    </mesh>
  );
}

export default function RobotViewer() {
  const clearHighlights = useRobotStore((s) => s.clearHighlights);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <Canvas
      shadows
      camera={{ position: [3, 3, 3], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
      onPointerMissed={() => clearHighlights()}
    >
      <color attach="background" args={['#f1f5f9']} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 4, -3]} intensity={0.3} />

      <Environment preset="city" />

      <Suspense fallback={<LoadingFallback />}>
        <LoadedModel />
      </Suspense>

      <Grid
        args={[20, 20]}
        position={[0, -0.15, 0]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#cbd5e1"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#94a3b8"
        fadeDistance={15}
        fadeStrength={1}
        infiniteGrid
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.1}
        minDistance={0.5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
    </Canvas>
  );
}
