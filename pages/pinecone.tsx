import { Effects, OrbitControls } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { AsciiEffect } from "three-stdlib";
import { PineconeModel } from "../components/pineconeModel";
import styles from "../styles/pinecone.module.css";

function AsciiRenderer({
  renderIndex = 1,
  bgColor = "black",
  fgColor = "white",
  characters = " .:-+*=%@#",
  invert = true,
  color = false,
  resolution = 0.15,
}) {
  // Reactive state
  const { size, gl, scene, camera } = useThree();

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, {
      invert,
      color,
      resolution,
    });
    effect.domElement.style.position = "absolute";
    effect.domElement.style.top = "0px";
    effect.domElement.style.left = "0px";
    effect.domElement.style.pointerEvents = "none";
    return effect;
  }, [characters, invert, color, resolution]);

  // Styling
  useLayoutEffect(() => {
    effect.domElement.style.color = fgColor;
    effect.domElement.style.backgroundColor = bgColor;
  }, [fgColor, bgColor]);

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.style.opacity = "0";
    gl.domElement.parentNode?.appendChild(effect.domElement);
    return () => {
      gl.domElement.style.opacity = "1";
      gl.domElement.parentNode?.removeChild(effect.domElement);
    };
  }, [effect]);

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height);
  }, [effect, size]);

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera);
  }, renderIndex);

  // This component returns nothing, it is a purely logical
  return <></>;
}

export default function PineconePage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.canvas}>
        <Canvas>
          <PineconeScene />
        </Canvas>
      </div>
    </div>
  );
}

function PineconeScene() {
  const modelRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    modelRef.current?.rotateY(delta * 0.04);
  });

  return (
    <>
      <color attach="background" args={["black"]} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <PineconeModel ref={modelRef} />
      <OrbitControls />
      <AsciiRenderer
        fgColor="white"
        bgColor="black"
        resolution={0.25}
        // characters=" 01"
      />
    </>
  );
}
