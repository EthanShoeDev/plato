import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import styles from "../../styles/backgroundCanvas.module.css";
import { useToggledControl } from "./useToggleControl";
import { Mesh } from "three";
import Vehicle from "./vehicle";
import {
  OrbitControls,
  PerspectiveCamera,
  Stats,
  ContactShadows,
} from "@react-three/drei";
import { QuarterPipe } from "./quarterPipe";
import Ball from "./ball";
import { Physics, RigidBody, Debug, RigidBodyProps } from "@react-three/rapier";

function Plane(props: RigidBodyProps) {
  return (
    <RigidBody {...props}>
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </RigidBody>
  );
}

const RCCanvas = () => {
  const ToggledDebug = useToggledControl(Debug, "?");

  return (
    <div className={styles.backgroundCanvas}>
      <Canvas gl={{ antialias: true }} shadows>
        <Suspense>
          <PerspectiveCamera makeDefault fov={70} position={[-50, 10, 0]} />
          <OrbitControls />
          <Stats />
          <ambientLight intensity={0.5} />
          <spotLight intensity={0.5} position={[0, 40, 0]} />
          <Physics
            gravity={[0, -9.81, 0]}
            interpolate={false}
            timeStep={1 / 120}
          >
            <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: "floor" }} />
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
            <QuarterPipe position={[0, 0, 30]} rotation={[2 * Math.PI, 0, 0]} />
            <QuarterPipe position={[0, 0, -30]} rotation={[0, Math.PI, 0]} />
            <QuarterPipe
              position={[0, 30, -30]}
              rotation={[Math.PI / 2, Math.PI, 0]}
            />
            <Vehicle
              mass={10}
              position={[0, 3, 10]}
              rotation={[0, Math.PI, 0]}
              controllable={true}
            />
            {/* <Vehicle
              position={[0, 3, -10]}
              rotation={[0, 0, 0]}
              controllable={false}
            /> */}
            <Ball
              position={[0, 4.5, 0]}
              userData={{ id: "ball-1" }}
              radius={2.5}
              mass={2}
            />
            <ToggledDebug />
          </Physics>
          <color attach="background" args={["#303030"]} />
        </Suspense>

        {/* <ContactShadows
          scale={1}
          blur={0.4}
          opacity={0.2}
          position={[-0, -1.5, 0]}
        /> */}
      </Canvas>
    </div>
  );
};

export default RCCanvas;
