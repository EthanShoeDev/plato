import React, { useRef, useEffect, useMemo, useLayoutEffect } from "react";
import * as THREE from "three";
import useScrollPosition from "../../hooks/useScrollPosition.hook";
import { useWindowSize } from "../../hooks/windowSize.hook";
import { Canvas, useFrame } from "@react-three/fiber";
import niceColors from "nice-color-palettes";
import styles from "../../styles/backgroundCanvas.module.css";

const randRange = (range: number, center = 0) =>
  Math.random() * range - range / 2 + center;
function setRayToRandomStart(position: THREE.Vector3) {
  position.x = randRange(180);
  position.y = randRange(180);
  position.z = randRange(100, -500);
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
function Rays({ count = 100000 }) {
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        color: niceColors[3][Math.floor(Math.random() * 5)],
        scale: 1,
      })),
    []
  );
  const scrollPosition = useScrollPosition();
  const ref = useRef<THREE.InstancedMesh>(null!);
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(count)
          .fill(null)
          .flatMap((_, i) => tempColor.set(data[i].color).toArray())
      ),
    []
  );

  useLayoutEffect(() => {
    for (let id = 0; id < count; id++) {
      ref.current.getMatrixAt(id, tempObject.matrix);
      tempObject.position.setFromMatrixPosition(tempObject.matrix);
      tempObject.rotation.x = (90 * Math.PI) / 180;
      setRayToRandomStart(tempObject.position);
      tempObject.position.z = randRange(600, -300);

      tempObject.updateMatrix();
      ref.current.setMatrixAt(id, tempObject.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    for (let id = 0; id < count; id++) {
      ref.current.getMatrixAt(id, tempObject.matrix);
      tempObject.position.setFromMatrixPosition(tempObject.matrix);
      tempObject.position.z += (scrollPosition * 1 + 5) * delta;

      if (tempObject.position.z >= 5) {
        setRayToRandomStart(tempObject.position);
      }

      tempObject.updateMatrix();
      ref.current.setMatrixAt(id, tempObject.matrix);
    }

    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderBufferGeometry args={[0.3, 0.3, 1, 20]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </cylinderBufferGeometry>
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  );
}

const CanvasBackgroundAnimation = () => {
  const windowSize = useWindowSize();
  const scrollPosition = useScrollPosition();

  const switchToStaticPos = scrollPosition > windowSize.height;

  return (
    <>
      <div
        className={switchToStaticPos ? styles.spacerStatic : styles.spacer}
      />
      <div
        className={`${styles.backgroundCanvas} ${
          switchToStaticPos && styles.backgroundCanvasAbsolute
        }`}
      >
        <Canvas
          gl={{ antialias: true }}
          camera={{ fov: 50, near: 0.1, far: 1000 }}
        >
          <color attach="background" args={["#111524"]} />
          <Rays count={400} />
          <fog attach="fog" color="#111524" near={50} far={400} />
        </Canvas>
      </div>
    </>
  );
};

export default CanvasBackgroundAnimation;
