import { useEffect, useMemo, useRef } from 'react';
import { Euler, useFrame, useThree, Vector3 } from '@react-three/fiber';
import {
  RapierRigidBody,
  RigidBodyProps,
  useRevoluteJoint,
} from '@react-three/rapier';
import * as THREE from 'three';

import { useControls } from '../../hooks/useControls';
import { vecArrayToObject } from '../helper';
import { Wheel } from '../objects/wheel';
import { useGameState } from '../rocketCar';
import { Chassis } from './chassis';

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
    [],
  );
  const initialRotation = useMemo<Euler>(
    () => props.rotation ?? new THREE.Euler(0, Math.PI, 0),
    [],
  );

  const chassisApi = useRef<RapierRigidBody>(null!);
  const wheels = [
    useRef<RapierRigidBody>(null!),
    useRef<RapierRigidBody>(null!),
    useRef<RapierRigidBody>(null!),
    useRef<RapierRigidBody>(null!),
  ];

  const joints = useRef(createJoints(chassisApi, wheels));

  const { camera } = useThree();
  const mouseXZPlaneIndicator = useRef<THREE.Mesh>(null!);
  const mouseDirectionArrow = useRef<THREE.Mesh>(null!);
  const mouseRay = useMemo(() => new THREE.Raycaster(), []);

  useEffect(() => {
    for (let i = 0; i < joints.current.length; i++) {
      joints.current[i]!.current!.configureMotorPosition(
        props.targetTravel ?? 0,
        props.stiffness ?? 0,
        props.dampening ?? 0,
      );
    }
    if (!props.controllable) {
      useGameState.subscribe(
        (state) => state.lastMessageFromPeer,
        (currentMessage, lastMessage) => {
          if (
            currentMessage == null ||
            lastMessage == null ||
            currentMessage.messageIdx < lastMessage.messageIdx
          )
            return;

          const payload = currentMessage.vehicle;
          payload.pos[2] *= -1;
          payload.vel[2] *= -1;

          payload.rot[1] += Math.PI;
          payload.rot[0] *= -1;
          payload.angVel[0] *= -1;

          chassisApi.current.setTranslation(
            tempEuler.fromArray(payload.pos),
            true,
          );
          chassisApi.current.setRotation(
            tempQuaternion.setFromEuler(tempEuler.fromArray(payload.rot)),
            true,
          );
          chassisApi.current.setLinvel(tempEuler.fromArray(payload.vel), true);
          chassisApi.current.setAngvel(
            tempEuler.fromArray(payload.angVel),
            true,
          );
        },
      );
    } else {
      useGameState.setState({ vehicleApi: chassisApi.current });
    }
  }, []);

  const tempVec3 = useMemo(() => new THREE.Vector3(), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  useFrame((state, delta) => {
    try {
      const { backward, boost, forward, reset, spin, jump } = controls.current;

      if (props.controllable) {
        mouseRay.setFromCamera(state.mouse, camera);
        mouseRay.ray.intersectPlane(
          XZPlane,
          mouseXZPlaneIndicator.current.position,
        );

        const vecToPointer = mouseXZPlaneIndicator
          .current!.position.clone()
          .sub(chassisApi.current.translation());

        // mouseDirectionArrow.current.lookAt(chassisApi.current.translation());
        mouseDirectionArrow.current.position.copy(
          mouseXZPlaneIndicator.current.position,
        );

        const currentRotation = chassisApi.current.rotation();
        tempVec3.set(0, 0, 1);
        tempVec3.applyQuaternion(currentRotation);

        const angleToPointer = tempVec3.angleTo(vecToPointer);

        const cross = tempVec3.cross(vecToPointer);
        const direction = cross.x > 0 ? 1 : -1;
        const offset = angleToPointer + Math.PI / 2;
        mouseDirectionArrow.current.rotation.set(offset * direction, 0, 0);
        const torque = angleToPointer * 7000 * delta;

        if (angleToPointer > 0.1)
          chassisApi.current.applyTorqueImpulse(
            vecArrayToObject([direction * torque, 0, 0]),
            true,
          );

        if (boost) {
          chassisApi.current.applyImpulse(
            tempVec3.set(0, 0, 100).applyQuaternion(currentRotation),
            true,
          );
        }
        if (jump) {
          chassisApi.current.applyImpulse(
            tempVec3.set(0, 100, 0).applyQuaternion(currentRotation),
            true,
          );
        }
        if (forward) {
          // console.log("forward");
          for (let i = 0; i < joints.current.length; i++) {
            joints.current[i].current!.configureMotorVelocity(200, 0);
          }
        }
        if (backward) {
          // console.log("backward");
          for (let i = 0; i < joints.current.length; i++) {
            joints.current[i].current!.configureMotorVelocity(-200, 0);
          }
        }
        if (!forward && !backward) {
          // console.log("not forward");
          for (let i = 0; i < joints.current.length; i++) {
            joints.current[i].current!.configureMotorVelocity(0, 0);
          }
        }

        // if (spin) {
        //   chassisApi.rotation.set(
        //     carRotation.current[0],
        //     carRotation.current[1],
        //     carRotation.current[2] + Math.PI
        //   );
        // }
      }

      if (reset) {
        chassisApi.current.setTranslation(
          vecArrayToObject(initialPosition),
          true,
        );
        const euler = new THREE.Euler();
        if (initialRotation instanceof THREE.Euler) euler.copy(initialRotation);
        else euler.set(...initialRotation);
        chassisApi.current.setRotation(
          new THREE.Quaternion().setFromEuler(euler),
          true,
        );
        chassisApi.current.setLinvel(vecArrayToObject([0, 0, 0]), true);
        chassisApi.current.setAngvel(vecArrayToObject([0, 0, 0]), true);
      }
    } catch (e) {
      console.log(e);
      console.log(props.controllable);
    }
  });

  return (
    <group>
      {props.controllable ? (
        <mesh ref={mouseXZPlaneIndicator} visible={true}>
          <meshBasicMaterial color={'pink'} />
          <sphereGeometry args={[0.5]} />
        </mesh>
      ) : null}
      <Chassis {...props} ref={chassisApi} />
      <Wheel ref={wheels[0]} radius={wheelRadius} leftSide />
      <Wheel ref={wheels[1]} radius={wheelRadius} />
      <Wheel ref={wheels[2]} radius={wheelRadius} leftSide />
      <Wheel ref={wheels[3]} radius={wheelRadius} />
      <mesh ref={mouseDirectionArrow} visible={false}>
        <meshBasicMaterial color={'pink'} />
        <cylinderGeometry args={[0.2, 0.2, 3]} />
      </mesh>
    </group>
  );
}

function createJoints(
  chassisApi: React.MutableRefObject<RapierRigidBody>,
  wheels: React.MutableRefObject<RapierRigidBody>[],
  positions?: {
    front?: number;
    back?: number;
    horizontal?: number;
    height?: number;
  },
) {
  const {
    front = 1.4,
    back = 1.4,
    horizontal = 0.7,
    height = 0.6,
  } = positions ?? {};
  return [
    useRevoluteJoint(
      chassisApi as React.MutableRefObject<RapierRigidBody>,
      wheels[0] as React.MutableRefObject<RapierRigidBody>,
      [
        [-horizontal, -height, front],
        [0, 0, 0],
        [1, 0, 0],
      ],
    ),
    useRevoluteJoint(
      chassisApi as React.MutableRefObject<RapierRigidBody>,
      wheels[1] as React.MutableRefObject<RapierRigidBody>,
      [
        [horizontal, -height, front],
        [0, 0, 0],
        [1, 0, 0],
      ],
    ),
    useRevoluteJoint(
      chassisApi as React.MutableRefObject<RapierRigidBody>,
      wheels[2] as React.MutableRefObject<RapierRigidBody>,
      [
        [-horizontal, -height, -back],
        [0, 0, 0],
        [1, 0, 0],
      ],
    ),
    useRevoluteJoint(
      chassisApi as React.MutableRefObject<RapierRigidBody>,
      wheels[3] as React.MutableRefObject<RapierRigidBody>,
      [
        [horizontal, -height, -back],
        [0, 0, 0],
        [1, 0, 0],
      ],
    ),
  ];
}

export default Vehicle;
