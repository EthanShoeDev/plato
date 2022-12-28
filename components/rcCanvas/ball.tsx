import { Vector3 } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { RigidBody, RigidBodyApi, RigidBodyProps } from "@react-three/rapier";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Mesh, Vector3Tuple } from "three";
import * as THREE from "three";

import { vecArrayToObject } from "./helper";
import { useGameState } from "./rcCanvas";
import { useControls } from "./useControls";

export default function Ball(props: RigidBodyProps & { radius: number }) {
  const controls = useControls();
  const initialPosition = useMemo<Vector3>(
    () => props.position ?? [0, 5, 0],
    []
  );
  const body = useRef<RigidBodyApi>(null!);
  const tempEuler = useMemo(() => new THREE.Euler(), []);
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  useEffect(() => {
    useGameState.setState({ ballApi: body.current });
    useGameState.subscribe(
      (state) => state.lastMessageFromPeer,
      (currentMessage, lastMessage) => {
        if (currentMessage == null || lastMessage == null) return;

        let payload = currentMessage.ball;
        payload.pos[2] *= -1;
        payload.vel[2] *= -1;

        payload.rot[1] += Math.PI;
        payload.rot[0] *= -1;
        payload.angVel[0] *= -1;

        body.current.setTranslation(tempEuler.fromArray(payload.pos));
        body.current.setRotation(
          tempQuaternion.setFromEuler(tempEuler.fromArray(payload.rot))
        );
        body.current.setLinvel(tempEuler.fromArray(payload.vel));
        body.current.setAngvel(tempEuler.fromArray(payload.angVel));
      }
    );
  }, []);

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
