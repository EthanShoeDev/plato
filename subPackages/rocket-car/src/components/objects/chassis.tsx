import { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from '@react-three/rapier';
import type { Material, Mesh } from 'three';
import { type GLTF } from 'three-stdlib';

import beetleGlb from '../../assets/models/Beetle.glb';

useGLTF.preload(beetleGlb);

// Initially Auto-generated by: https://github.com/pmndrs/gltfjsx
// Model via KrStolorz on Sketchfab, CC-BY-4.0
// https://sketchfab.com/3d-models/low-poly-volkswagen-beetle-f680ad7e98e445eaafed1a70f2c53911

const beetleMaterials = [
  'Black paint',
  'Black plastic',
  'Chrom',
  'Glass',
  'Headlight',
  'Interior (dark)',
  'Interior (light)',
  'License Plate',
  'Orange plastic',
  'Paint',
  'Reflector',
  'Reverse lights',
  'Rubber',
  'Steel',
  'Tail lights',
  'Underbody',
] as const;
type BeetleMaterial = (typeof beetleMaterials)[number];

const beetleNodes = [
  'chassis_1',
  'chassis_2',
  'chassis_3',
  'chassis_4',
  'chassis_5',
  'chassis_6',
  'chassis_7',
  'chassis_8',
  'chassis_9',
  'chassis_10',
  'chassis_11',
  'chassis_12',
  'chassis_13',
  'chassis_14',
  'chassis_15',
  'chassis_16',
] as const;
type BeetleNode = (typeof beetleNodes)[number];

type BeetleGLTF = GLTF & {
  materials: Record<BeetleMaterial, Material>;
  nodes: Record<BeetleNode, Mesh>;
};

export const Chassis = forwardRef<RapierRigidBody>(
  (props: RigidBodyProps, ref) => {
    const { nodes, materials } = useGLTF(beetleGlb) as unknown as BeetleGLTF;

    return (
      <RigidBody
        {...props}
        ref={ref}
        mass={100}
        colliders={false}
        canSleep={false}
        enabledTranslations={[false, true, true]}
        enabledRotations={[true, false, false]}
        angularDamping={10}
        onSleep={() => console.log('chassis sleeping')}
        userData={{ name: 'chassis' }}
      >
        <CuboidCollider args={[0.85, 0.5, 2]} collisionGroups={0x0001ffff} />
        <group position={[0, -0.85, 0]}>
          <mesh
            material={materials['Orange plastic']}
            geometry={nodes.chassis_1.geometry}
          />
          <mesh
            material={materials['Orange plastic']}
            geometry={nodes.chassis_2.geometry}
          />
          <mesh
            material={materials['Orange plastic']}
            geometry={nodes.chassis_3.geometry}
          />
          <mesh
            material={materials['Orange plastic']}
            geometry={nodes.chassis_4.geometry}
          />
          <mesh
            material={materials['Orange plastic']}
            geometry={nodes.chassis_5.geometry}
          />
          <mesh
            material={materials['Orange plastic']}
            geometry={nodes.chassis_6.geometry}
          />
          <mesh
            material={materials['Orange plastic']}
            geometry={nodes.chassis_7.geometry}
          />
          <mesh geometry={nodes.chassis_8.geometry} />
          <mesh
            material={materials.Rubber}
            geometry={nodes.chassis_9.geometry}
            material-transparent={false}
            material-color="black"
          />
          <mesh geometry={nodes.chassis_10.geometry} />
          <mesh geometry={nodes.chassis_11.geometry} />
          <mesh geometry={nodes.chassis_12.geometry} />
          <mesh geometry={nodes.chassis_13.geometry} />
          <mesh geometry={nodes.chassis_14.geometry} />
          <mesh geometry={nodes.chassis_15.geometry} />
          <mesh geometry={nodes.chassis_16.geometry} />
        </group>
      </RigidBody>
    );
  },
);