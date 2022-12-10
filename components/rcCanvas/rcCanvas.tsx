import React, { useRef, useEffect, useMemo, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import styles from "../../styles/backgroundCanvas.module.css";
import { useToggledControl } from "./useToggleControl";
import {
  CylinderArgs,
  CylinderProps,
  Debug,
  Physics,
  PlaneProps,
  SphereArgs,
  SphereProps,
  Triplet,
  useBox,
  useCylinder,
  useHingeConstraint,
  useLockConstraint,
  usePlane,
  useSphere,
} from "@react-three/cannon";
import { Camera, Group, Mesh, Vector3 } from "three";
import Vehicle from "./vehicle";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { useControls } from "./useControls";

function Plane(props: PlaneProps) {
  const [ref] = usePlane(
    () => ({ material: "ground", type: "Static", ...props }),
    useRef<Group>(null)
  );
  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </group>
  );
}

function Ball(props: SphereProps & { radius: number; mass: number }) {
  const controls = useControls();
  const initialPosition: Triplet = useMemo(
    () => props.position ?? [0, 2, 0],
    []
  );

  const [ref, sphereApi] = useSphere(
    () => ({
      args: [props.radius],
      ...props,
    }),
    useRef<Mesh>(null)
  );

  useEffect(() => {
    sphereApi.angularFactor.set(1, 0, 0);
    sphereApi.linearFactor.set(0, 1, 1);
  }, []);

  useFrame(() => {
    const { reset } = controls.current;

    if (reset) {
      sphereApi.position.set(...initialPosition);
      sphereApi.velocity.set(0, 0, 0);
      sphereApi.angularVelocity.set(0, 0, 0);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[props.radius]} />
      <meshStandardMaterial color={"red"} metalness={3} />
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
        <ambientLight intensity={0.03} />
        <spotLight intensity={0.5} position={[0, 50, 0]} />
        <Physics
          broadphase="Naive"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 1e-3,
          }}
          stepSize={1 / 120}
        >
          <ToggledDebug>
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
            <Vehicle
              position={[0, 3, 10]}
              rotation={[0, Math.PI, 0]}
              angularVelocity={[0, 0.5, 0]}
              controllable={true}
            />
            <Vehicle
              position={[0, 3, -10]}
              rotation={[0, 0, 0]}
              angularVelocity={[0, 0.5, 0]}
              controllable={false}
            />
            <Ball
              position={[0, 2.5, 0]}
              userData={{ id: "ball-1" }}
              radius={2.5}
              mass={0.1}
            />
          </ToggledDebug>
        </Physics>
        <color attach="background" args={["#303030"]} />
      </Canvas>
    </div>
  );
};

export default RCCanvas;
