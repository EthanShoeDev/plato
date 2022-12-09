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
        <meshBasicMaterial color="#303030" />
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

  // const [dummyRef, dummyApi] = useBox(
  //   () => ({
  //     args: [1.7, 1, 4],
  //     position: [0, 5, 0],
  //   }),
  //   useRef<Mesh>(null)
  // );

  // Use a lock constraint to prevent the ball from moving in the Z direction
  // useLockConstraint(ref, dummyRef, {
  //   // localOffsetB: new THREE.Vector3(0, 0, 1),
  //   // localAngleB: new THREE.Euler(0, 0, 0),
  // });

  // Use a hinge constraint to prevent the ball from rotating around the Z axis
  // useHingeConstraint(ref, dummyRef, {
  //   pivotA: [0, 0, 1],
  //   axisA: [0, 0, 1],
  //   pivotB: [0, 0, 1],
  //   axisB: [0, 0, 1],
  // });

  // const ballPosition = useRef<Triplet>([...initialPosition]);
  // const ballVelocity = useRef<Triplet>([0, 0, 0]);

  useEffect(() => {
    sphereApi.angularFactor.set(0, 0, 1);
    sphereApi.linearFactor.set(1, 1, 0);
    // sphereApi.
    // sphereApi?.position?.subscribe((p) => (ballPosition.current = p));
    // sphereApi?.velocity?.subscribe((v) => (ballVelocity.current = v));
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
      <meshStandardMaterial color={"red"} />
    </mesh>
  );
}

const RCCanvas = () => {
  const ToggledDebug = useToggledControl(Debug, "?");

  return (
    <div className={styles.backgroundCanvas}>
      <Canvas gl={{ antialias: true }} shadows>
        <PerspectiveCamera makeDefault fov={70} position={[0, 5, 20]} />
        <OrbitControls />
        <Stats />
        <ambientLight intensity={0.5} />
        <Physics
          broadphase="Naive"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 1e-3,
          }}
        >
          <Debug>
            <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: "floor" }} />
            <Vehicle
              position={[10, 5, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              angularVelocity={[0, 0.5, 0]}
              controllable={true}
            />
            <Vehicle
              position={[-10, 3, 0]}
              rotation={[0, Math.PI / 2, 0]}
              angularVelocity={[0, 0.5, 0]}
              controllable={false}
            />
            <Ball
              position={[0, 2.5, 0]}
              userData={{ id: "ball-1" }}
              radius={1.5}
              mass={1}
            />
          </Debug>
        </Physics>
        <color attach="background" args={["#303030"]} />
      </Canvas>
    </div>
  );
};

export default RCCanvas;
