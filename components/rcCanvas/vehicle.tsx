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
  Quaternion,
  Euler,
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

const XZPlane = new Plane(new Vector3(1, 0, 0), 0);

function Vehicle({
  angularVelocity,
  back = -1.15,
  force = 75,
  front = 1.3,
  height = -0.46,
  maxBrake = 50,
  position,
  radius = 0.34,
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
    maxSuspensionForce: 1e6,
    maxSuspensionTravel: 0.4,
    radius,
    suspensionRestLength: 0.3,
    suspensionStiffness: 200,
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
      mass: 10,
      // onCollide: (e) => console.log("bonk", e.body.userData),
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
  const carVelocity = useRef([0, 0, 0]);
  // const carAngularVelocity = useRef([0, 0, 0]);
  useEffect(() => {
    vehicleApi.sliding.subscribe((v) => v && console.log("sliding", v));
    chassisApi.rotation.subscribe((r) => (carRotation.current = r));
    chassisApi.position.subscribe((p) => (carPosition.current = p));
    chassisApi.velocity.subscribe((v) => (carVelocity.current = v));
    chassisApi.linearFactor.set(0, 1, 1);
    chassisApi.angularFactor.set(1, 0, 0);
    chassisApi.angularDamping.set(0.999);

    // chassisApi.angularVelocity.subscribe(
    //   (a) => (carAngularVelocity.current = a)
    // );
  }, []);

  const { camera } = useThree();
  const mouseXZPlaneIndicator = useRef<Mesh>(null!);
  const mouseRay = useMemo(() => new Raycaster(), []);

  useFrame((state, delta) => {
    const { backward, boost, forward, reset, spin, jump } = controls.current;

    if (controllable) {
      for (let e = 1; e < 4; e++) {
        vehicleApi.applyEngineForce(
          forward || backward ? force * (forward && !backward ? -4 : 4) : 0,
          2
        );
      }

      // for (let b = 2; b < 4; b++) {
      //   vehicleApi.setBrake(brake ? maxBrake : 0, b);
      // }

      mouseRay.setFromCamera(state.mouse, camera);
      mouseRay.ray.intersectPlane(
        XZPlane,
        mouseXZPlaneIndicator.current.position
      );

      const vecToPointer = mouseXZPlaneIndicator
        .current!.position.clone()
        .sub(new Vector3(...carPosition.current));

      const forwardVec = new Vector3(0, 0, 1);
      forwardVec.applyEuler(new Euler(...carRotation.current)); //apply the orientation of

      const angleToPointer = forwardVec.angleTo(vecToPointer);
      const cross = forwardVec.cross(vecToPointer);

      if (boost) {
        chassisApi.applyLocalForce([0, 0, 299], [0, 0, 0]);
      }
      if (jump) {
        chassisApi.applyLocalForce([0, 99, 0], [0, 0, 0]);
      }

      if (spin) {
        chassisApi.rotation.set(
          carRotation.current[0],
          carRotation.current[1],
          carRotation.current[2] + Math.PI
        );
      }

      const direction = cross.x > 0 ? 1 : -1;
      const torque = angleToPointer * 19900 * delta;
      chassisApi.applyTorque([direction * torque, 0, 0]);
    }

    if (reset) {
      chassisApi.position.set(...position);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(...angularVelocity);
      chassisApi.rotation.set(...rotation);
    }

    const x = carPosition.current[0];
    if (x > 0.01 || x < -0.01) {
      console.log("RESET CAR" + x);
      chassisApi.position.set(
        0,
        carPosition.current[1],
        carPosition.current[2]
      );
      chassisApi.velocity.set(
        0,
        carVelocity.current[1],
        carVelocity.current[2]
      );
    }
  });

  return (
    <group ref={vehicle}>
      {controllable ? (
        <mesh ref={mouseXZPlaneIndicator} visible={false}>
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
