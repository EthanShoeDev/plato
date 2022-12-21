import { Vector3 } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { RigidBody, RigidBodyApi, RigidBodyProps } from "@react-three/rapier";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Mesh, Vector3Tuple } from "three";
import { vecArrayToObject } from "./helper";
import { useControls } from "./useControls";

export default function Ball(props: RigidBodyProps & { radius: number }) {
  const controls = useControls();
  const initialPosition = useMemo<Vector3>(
    () => props.position ?? [0, 5, 0],
    []
  );
  const body = useRef<RigidBodyApi>(null!);

  useFrame(() => {
    const { reset } = controls.current;

    if (reset) {
      body.current.setTranslation(vecArrayToObject(initialPosition));
      body.current.setLinvel(vecArrayToObject([0, 0, 0]));
      body.current.setAngvel(vecArrayToObject([0, 0, 0]));
    }
  });

  return (
    <RigidBody
      {...props}
      colliders="ball"
      ref={body}
      canSleep={false}
      enabledTranslations={[false, true, true]}
      enabledRotations={[true, false, false]}
    >
      <mesh>
        <sphereGeometry args={[props.radius]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
    </RigidBody>
  );
}
