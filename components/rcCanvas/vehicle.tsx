import {
  Euler,
  PerspectiveCameraProps,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  RigidBodyProps,
  useRevoluteJoint,
  RigidBodyApiRef,
  RigidBodyApi,
  JointApi,
} from "@react-three/rapier";
import { ReactNode, useLayoutEffect, useMemo } from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { Chassis } from "./chassis";
import { vecArrayToObject } from "./helper";
import { useControls } from "./useControls";
import { Wheel } from "./wheel";
import { Vector3 } from "@react-three/fiber";

export type VehicleProps = RigidBodyProps & {
  wheelPosition?: {
    back: number;
    front: number;
    height: number;
    width: number;
  };
  force?: number;
  maxBrake?: number;
  radius?: number;
  steer?: number;
  controllable?: boolean;
  height?: number;
  width?: number;
  length?: number;
  targetTravel?: number;
  dampening?: number;
  stiffness?: number;
};

const XZPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

function Vehicle(props: VehicleProps) {
  const wheelRadius = props.radius ?? 0.4;

  const controls = useControls();

  const initialPosition = useMemo<Vector3>(
    () => props.position ?? [0, 2, 0],
    []
  );
  const initialRotation = useMemo<Euler>(
    () => props.rotation ?? new THREE.Euler(0, Math.PI, 0),
    []
  );

  const chassisApi = useRef<RigidBodyApi>(null!);
  const wheels = [
    useRef<RigidBodyApi>(null!),
    useRef<RigidBodyApi>(null!),
    useRef<RigidBodyApi>(null!),
    useRef<RigidBodyApi>(null!),
  ];

  const joints = useRef<JointApi[]>(createJoints(chassisApi, wheels));

  const { camera } = useThree();
  const mouseXZPlaneIndicator = useRef<THREE.Mesh>(null!);
  const mouseRay = useMemo(() => new THREE.Raycaster(), []);

  useEffect(() => {
    for (let i = 0; i < joints.current.length; i++) {
      joints.current[i].configureMotorPosition(
        props.targetTravel ?? 0,
        props.stiffness ?? 0,
        props.dampening ?? 0
      );
    }
  }, []);

  const tempVec3 = useMemo(() => new THREE.Vector3(), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  useFrame((state, delta) => {
    const { backward, boost, forward, reset, spin, jump } = controls.current;

    if (props.controllable) {
      mouseRay.setFromCamera(state.mouse, camera);
      mouseRay.ray.intersectPlane(
        XZPlane,
        mouseXZPlaneIndicator.current.position
      );

      const vecToPointer = mouseXZPlaneIndicator
        .current!.position.clone()
        .sub(chassisApi.current.translation());

      const currentRotation = chassisApi.current.rotation();
      const forwardVec = tempVec3.set(0, 0, 1);
      forwardVec.applyQuaternion(currentRotation); //apply the orientation of

      const angleToPointer = forwardVec.angleTo(vecToPointer);
      const cross = forwardVec.cross(vecToPointer);

      if (boost) {
        chassisApi.current.applyImpulse(
          tempVec3.set(0, 0, 100).applyQuaternion(currentRotation)
        );
      }
      if (jump) {
        chassisApi.current.applyImpulse(
          tempVec3.set(0, 100, 0).applyQuaternion(currentRotation)
        );
      }
      if (forward) {
        // console.log("forward");
        for (let i = 0; i < joints.current.length; i++) {
          joints.current[i].configureMotorVelocity(200, 0);
        }
      }
      if (backward) {
        // console.log("backward");
        for (let i = 0; i < joints.current.length; i++) {
          joints.current[i].configureMotorVelocity(-200, 0);
        }
      }
      if (!forward && !backward) {
        // console.log("not forward");
        for (let i = 0; i < joints.current.length; i++) {
          joints.current[i].configureMotorVelocity(0, 0);
        }
      }

      // if (spin) {
      //   chassisApi.rotation.set(
      //     carRotation.current[0],
      //     carRotation.current[1],
      //     carRotation.current[2] + Math.PI
      //   );
      // }

      const direction = cross.x > 0 ? 1 : -1;
      const torque = angleToPointer * 4000 * delta;
      // chassisApi.current.applyTorqueImpulse(
      //   vecArrayToObject([direction * torque, 0, 0])
      // );
    }

    if (reset) {
      chassisApi.current.setTranslation(vecArrayToObject(initialPosition));
      const euler = new THREE.Euler();
      if (initialRotation instanceof THREE.Euler) euler.copy(initialRotation);
      else euler.set(...initialRotation);
      chassisApi.current.setRotation(
        new THREE.Quaternion().setFromEuler(euler)
      );
      chassisApi.current.setLinvel(vecArrayToObject([0, 0, 0]));
      chassisApi.current.setAngvel(vecArrayToObject([0, 0, 0]));
    }
  });

  return (
    <group>
      {props.controllable ? (
        <mesh ref={mouseXZPlaneIndicator} visible={false}>
          <meshBasicMaterial color={"pink"} />
          <sphereGeometry args={[0.5]} />
        </mesh>
      ) : null}
      <Chassis {...props} ref={chassisApi} />
      <Wheel ref={wheels[0]} radius={wheelRadius} leftSide />
      <Wheel ref={wheels[1]} radius={wheelRadius} />
      <Wheel ref={wheels[2]} radius={wheelRadius} leftSide />
      <Wheel ref={wheels[3]} radius={wheelRadius} />
    </group>
  );
}

function createJoints(
  chassisApi: RigidBodyApiRef,
  wheels: RigidBodyApiRef[],
  positions?: {
    front?: number;
    back?: number;
    horizontal?: number;
    height?: number;
  }
): JointApi[] {
  const {
    front = 1.4,
    back = 1.4,
    horizontal = 0.7,
    height = 0.6,
  } = positions ?? {};
  return [
    useRevoluteJoint(
      chassisApi as RigidBodyApiRef,
      wheels[0] as RigidBodyApiRef,
      [
        [-horizontal, -height, front],
        [0, 0, 0],
        [1, 0, 0],
      ]
    ),
    useRevoluteJoint(
      chassisApi as RigidBodyApiRef,
      wheels[1] as RigidBodyApiRef,
      [
        [horizontal, -height, front],
        [0, 0, 0],
        [1, 0, 0],
      ]
    ),
    useRevoluteJoint(
      chassisApi as RigidBodyApiRef,
      wheels[2] as RigidBodyApiRef,
      [
        [-horizontal, -height, -back],
        [0, 0, 0],
        [1, 0, 0],
      ]
    ),
    useRevoluteJoint(
      chassisApi as RigidBodyApiRef,
      wheels[3] as RigidBodyApiRef,
      [
        [horizontal, -height, -back],
        [0, 0, 0],
        [1, 0, 0],
      ]
    ),
  ];
}

export default Vehicle;
