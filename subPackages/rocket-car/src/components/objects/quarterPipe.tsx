/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshCollider, RigidBody, RigidBodyProps } from '@react-three/rapier';
import niceColors from 'nice-color-palettes';
import * as THREE from 'three';
import { Mesh } from 'three';
import { GLTF } from 'three-stdlib';

import qpipe from '../../assets/models/qPipe.glb';

type GLTFResult = GLTF & {
  nodes: {
    qPipe: THREE.Mesh;
  };
  materials: {};
};

export function QuarterPipe(props: RigidBodyProps) {
  const { nodes, materials } = useGLTF(qpipe) as unknown as GLTFResult;

  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <MeshCollider type="trimesh">
        <mesh receiveShadow geometry={nodes.qPipe.geometry}>
          <meshStandardMaterial color={niceColors[50][0]} />
        </mesh>
      </MeshCollider>
    </RigidBody>
  );
}

useGLTF.preload(qpipe);