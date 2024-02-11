import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, Vector3 } from '@react-three/fiber';
import { RigidBody, RigidBodyApi, RigidBodyProps } from '@react-three/rapier';
import { Mesh, Vector3Tuple } from 'three';
import * as THREE from 'three';

import { useControls } from '../../hooks/useControls';
import { vecArrayToObject } from '../helper';
import { useGameState } from '../rocketCar';

export default function Ball(props: RigidBodyProps & { radius: number }) {
  const controls = useControls();
  const initialPosition = useMemo<Vector3>(
    () => props.position ?? [0, 5, 0],
    [],
  );
  const body = useRef<RigidBodyApi>(null!);
  const tempVec3 = useMemo(() => new THREE.Vector3(), []);
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);
  const isHost = useGameState((state) => state.isHost);

  useEffect(() => {
    useGameState.setState({ ballApi: body.current });
    const unSubscribe = useGameState.subscribe(
      (state) => state.lastMessageFromPeer,
      (currentMessage, lastMessage) => {
        if (
          currentMessage == null ||
          lastMessage == null ||
          isHost ||
          currentMessage.messageIdx < lastMessage.messageIdx
        )
          return;

        let payload = currentMessage.ball;
        payload.pos[2] *= -1;
        payload.vel[2] *= -1;

        payload.rot[1] += Math.PI;
        payload.rot[0] *= -1;
        payload.angVel[0] *= -1;

        const currentPos = body.current.translation();
        if (currentPos.distanceTo(tempVec3.fromArray(payload.pos)) > 0.1) {
          body.current.setTranslation(tempVec3.fromArray(payload.pos));
          body.current.setRotation(
            tempQuaternion.setFromEuler(tempEuler.fromArray(payload.rot)),
          );
          body.current.setLinvel(tempVec3.fromArray(payload.vel));
          body.current.setAngvel(tempVec3.fromArray(payload.angVel));
        }
      },
    );
    return unSubscribe;
  }, [isHost]);

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
        <meshStandardMaterial color={'red'} />
      </mesh>
    </RigidBody>
  );
}
