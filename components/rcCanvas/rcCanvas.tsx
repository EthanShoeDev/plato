import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import styles from "../../styles/backgroundCanvas.module.css";
import { useToggledControl } from "./useToggleControl";
import { Debug, Physics, PlaneProps, usePlane } from "@react-three/cannon";
import { Mesh } from "three";
import Vehicle from "./vehicle";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { QuarterPipe } from "./quarterPipe";
import Ball from "./ball";

function Plane(props: PlaneProps) {
  const [ref] = usePlane(
    () => ({
      material: "ground",
      type: "Static",
      ...props,
    }),
    useRef<Mesh>(null)
  );
  return (
    <mesh receiveShadow ref={ref}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#303030" />
    </mesh>
  );
}

const RCCanvas = () => {
  const ToggledDebug = useToggledControl(Debug, "?");

  return (
    <div className={styles.backgroundCanvas}>
      <Canvas gl={{ antialias: true }} shadows>
        <PerspectiveCamera makeDefault fov={70} position={[-50, 10, 0]} />
        <OrbitControls />
        <Stats />
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.5} position={[0, 40, 0]} />
        <Physics
          // broadphase="SAP"
          broadphase="Naive"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 1e-3,
          }}
          stepSize={1 / 120}
        >
          <Debug>
            <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: "floor" }} />
            <Plane
              rotation={[Math.PI / 2, 0, 0]}
              position={[0, 30, 0]}
              userData={{ id: "ceiling" }}
            />
            <Plane
              rotation={[0, 0, 0]}
              position={[0, 10, -30]}
              userData={{ id: "wall-1" }}
            />
            <Plane
              rotation={[Math.PI, 0, 0]}
              position={[0, 10, 30]}
              userData={{ id: "wall-2" }}
            />
            <QuarterPipe
              position={[0, 30, 30]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            <QuarterPipe position={[0, 0, 30]} />
            <QuarterPipe position={[0, 0, -30]} rotation={[0, Math.PI, 0]} />
            <QuarterPipe
              position={[0, 30, -30]}
              rotation={[Math.PI / 2, Math.PI, 0]}
            />
            <Vehicle
              position={[0, 3, 10]}
              rotation={[0, Math.PI, 0]}
              angularVelocity={[0, 0.5, 0]}
              controllable={true}
            />
            {/* <Vehicle
              position={[0, 3, -10]}
              rotation={[0, 0, 0]}
              angularVelocity={[0, 0.5, 0]}
              controllable={false}
            /> */}
            <Ball
              position={[0, 2.5, 0]}
              userData={{ id: "ball-1" }}
              radius={2.5}
              mass={0.1}
            />
          </Debug>
        </Physics>
        <color attach="background" args={["#303030"]} />
      </Canvas>
    </div>
  );
};

export default RCCanvas;
