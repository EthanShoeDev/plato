import type { BoxProps, Triplet, WheelInfoOptions } from "@react-three/cannon";
import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { PerspectiveCameraProps, useFrame, useThree } from "@react-three/fiber";
import { ReactNode, useMemo } from "react";
import { useEffect, useRef } from "react";
import {
  Group,
  Mesh,
  PerspectiveCamera,
  Vector3,
  Raycaster,
  Plane,
} from "three";

import { Chassis } from "./chassis";
import { useControls } from "./useControls";
import { Wheel } from "./wheel";

export type VehicleProps = Required<
  Pick<BoxProps, "angularVelocity" | "position" | "rotation">
> & {
  back?: number;
  force?: number;
  front?: number;
  height?: number;
  maxBrake?: number;
  radius?: number;
  steer?: number;
  width?: number;
  controllable?: boolean;
};

const XYPlane = new Plane(new Vector3(0, 0, 1), 0);

function Vehicle({
  angularVelocity,
  back = -1.15,
  force = 1500,
  front = 1.3,
  height = -0.04,
  maxBrake = 50,
  position,
  radius = 0.7,
  rotation,
  steer = 0.5,
  width = 1.2,
  controllable = true,
}: VehicleProps) {
  const wheels = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];

  const controls = useControls();

  const wheelInfo: WheelInfoOptions = {
    axleLocal: [-1, 0, 0], // This is inverted for asymmetrical wheel models (left v. right sided)
    customSlidingRotationalSpeed: -30,
    dampingCompression: 4.4,
    dampingRelaxation: 10,
    directionLocal: [0, -1, 0], // set to same as Physics Gravity
    frictionSlip: 2,
    maxSuspensionForce: 1e4,
    maxSuspensionTravel: 0.3,
    radius,
    suspensionRestLength: 0.3,
    suspensionStiffness: 30,
    useCustomSlidingRotationalSpeed: true,
  };

  const wheelInfo1: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [-width / 2, height, front],
    isFrontWheel: true,
  };
  const wheelInfo2: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [width / 2, height, front],
    isFrontWheel: true,
  };
  const wheelInfo3: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [-width / 2, height, back],
    isFrontWheel: false,
  };
  const wheelInfo4: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [width / 2, height, back],
    isFrontWheel: false,
  };

  const [chassisBody, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      angularVelocity,
      args: [1.7, 1, 4],
      mass: 500,
      onCollide: (e) => console.log("bonk", e.body.userData),
      position,
      rotation,
    }),
    useRef<Mesh>(null)
  );

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
      wheels,
    }),
    useRef<Group>(null)
  );

  const carRotation = useRef([...rotation]);
  const carPosition = useRef([...position]);
  const carAngularVelocity = useRef([0, 0, 0]);
  useEffect(() => {
    vehicleApi.sliding.subscribe((v) => v && console.log("sliding", v));
    chassisApi.rotation.subscribe((r) => (carRotation.current = r));
    chassisApi.position.subscribe((p) => (carPosition.current = p));
    chassisApi.angularVelocity.subscribe(
      (a) => (carAngularVelocity.current = a)
    );
  }, []);

  const { camera } = useThree();
  const mouseXYPlaneIndicator = useRef<Mesh>(null!);
  const mouseRay = useMemo(() => new Raycaster(), []);

  useFrame((state) => {
    const { backward, brake, forward, left, reset, right } = controls.current;

    if (controllable) {
      for (let e = 2; e < 4; e++) {
        vehicleApi.applyEngineForce(
          forward || backward ? force * (forward && !backward ? -1 : 1) : 0,
          2
        );
      }

      for (let s = 0; s < 2; s++) {
        vehicleApi.setSteeringValue(
          left || right ? steer * (left && !right ? 1 : -1) : 0,
          s
        );
      }

      for (let b = 2; b < 4; b++) {
        vehicleApi.setBrake(brake ? maxBrake : 0, b);
      }

      mouseRay.setFromCamera(state.mouse, camera);
      mouseRay.ray.intersectPlane(
        XYPlane,
        mouseXYPlaneIndicator.current.position
      );

      const torque = mouseXYPlaneIndicator
        .current!.position.clone()
        .sub(new Vector3(...carPosition.current))
        .multiplyScalar(1999);

      // chassisApi.applyTorque([torque.x, torque.y, torque.z]);
    }

    if (reset) {
      chassisApi.position.set(...position);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(...angularVelocity);
      chassisApi.rotation.set(...rotation);
    }

    const currentAngularVelocity = carAngularVelocity.current;
    chassisApi.angularVelocity.set(0, 0, currentAngularVelocity[2]);
    // chassisApi.rotation.set(0, rotation[1] + rotation[1], rotation[1]);
    //TODO
  });

  return (
    <group ref={vehicle} position={[0, -0.4, 0]}>
      {controllable ? (
        <mesh ref={mouseXYPlaneIndicator}>
          <meshBasicMaterial color={"pink"} />
          <sphereGeometry args={[0.5]} />
        </mesh>
      ) : null}
      <Chassis ref={chassisBody} />
      <Wheel ref={wheels[0]} radius={radius} leftSide />
      <Wheel ref={wheels[1]} radius={radius} />
      <Wheel ref={wheels[2]} radius={radius} leftSide />
      <Wheel ref={wheels[3]} radius={radius} />
    </group>
  );
}

export default Vehicle;
