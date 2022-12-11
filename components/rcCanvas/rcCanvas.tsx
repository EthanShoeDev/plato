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
import { QuarterPipe } from "./quarterPipe";
import niceColors from "nice-color-palettes";

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

  const ballRot = useRef<Triplet>([0, 0, 0]);
  const ballPos = useRef<Triplet>(initialPosition);
  const ballVel = useRef<Triplet>([0, 0, 0]);
  useEffect(() => {
    sphereApi.position.subscribe((p) => (ballPos.current = p));
    sphereApi.velocity.subscribe((v) => (ballVel.current = v));
    sphereApi.rotation.subscribe((r) => (ballRot.current = r));
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

    const x = ballPos.current[0];
    if (x > 0.02 || x < -0.02) {
      sphereApi.position.set(0, ballPos.current[1], ballPos.current[2]);
      sphereApi.velocity.set(0, ballVel.current[1], ballVel.current[2]);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[props.radius]} />
      <meshStandardMaterial color={"red"} />
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
