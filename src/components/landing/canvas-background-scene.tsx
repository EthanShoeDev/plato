import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useWindowSize } from '@uidotdev/usehooks';
import { useScroll } from '@use-gesture/react';
import * as THREE from 'three';

import { useCssVar } from '@/lib/hooks/useCssVar.hook';
import { cn } from '@/lib/utils';

import TypeAnimationHeading from './type-animation-heading';

const colors = ['#69d2e7', '#a7dbd8', '#e0e4cc', '#f38630', '#fa6900'];

const randRange = (range: number, center = 0) =>
  Math.random() * range - range / 2 + center;
function setRayToRandomStart(position: THREE.Vector3) {
  position.x = randRange(180);
  position.y = randRange(180);
  position.z = randRange(100, -500);
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
function Rays({ count = 100000, speed = 0.01 }) {
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        color: colors[Math.floor(Math.random() * 5)] as string,
        scale: 1,
      })),
    [count],
  );
  const ref = useRef<THREE.InstancedMesh>(null!);
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(count)
          .fill(null)
          .flatMap((_, i) => tempColor.set(data[i]!.color).toArray()),
      ),
    [count, data],
  );

  useLayoutEffect(() => {
    for (let id = 0; id < count; id++) {
      ref.current.getMatrixAt(id, tempObject.matrix);
      tempObject.position.setFromMatrixPosition(tempObject.matrix);
      tempObject.rotation.x = (90 * Math.PI) / 180;
      setRayToRandomStart(tempObject.position);
      tempObject.position.z = randRange(600, -300);

      tempObject.updateMatrix();
      ref.current.setMatrixAt(id, tempObject.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [count, ref]);

  useFrame((_, delta) => {
    for (let id = 0; id < count; id++) {
      ref.current.getMatrixAt(id, tempObject.matrix);
      tempObject.position.setFromMatrixPosition(tempObject.matrix);
      tempObject.position.z += (speed * 1 + 5) * delta;

      if (tempObject.position.z >= 5) {
        setRayToRandomStart(tempObject.position);
      }

      tempObject.updateMatrix();
      ref.current.setMatrixAt(id, tempObject.matrix);
    }

    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.3, 0.3, 1, 20]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </cylinderGeometry>
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  );
}

export default function CanvasBackgroundScene() {
  const windowSize = useWindowSize();
  const [scrollPosition, setScrollPosition] = useState(0);
  useScroll(({ xy: [, y] }) => setScrollPosition(y), {
    target: window,
  });

  const switchToStaticPos = scrollPosition > (windowSize?.height ?? 9999);

  const bgColorString = useCssVar('--background', '0 0% 3.9%')!;
  const bgColor = useMemo(() => {
    const c = new THREE.Color();
    c.setStyle(`hsl(${bgColorString.split(' ').join(', ')})`);
    return c;
  }, [bgColorString]);

  useEffect(
    () => console.log('switchToStaticPos', switchToStaticPos),
    [switchToStaticPos],
  );

  return (
    <div>
      <div
        className={cn(
          'w-full z-[-2]',
          switchToStaticPos ? 'h-screen' : 'h-[200vh]',
        )}
      />
      <div
        className={cn(
          'fixed w-full h-screen bg-primary top-0 left-0 pointer-events-none z-[-1] ',
          switchToStaticPos && 'relative',
        )}
      >
        <Canvas
          gl={{ antialias: true }}
          camera={{ fov: 50, near: 0.1, far: 1000 }}
        >
          <color attach="background" args={[bgColor]} />
          <Rays count={400} speed={scrollPosition} />
          <fog attach="fog" color={bgColor} near={50} far={400} />
        </Canvas>
        <TypeAnimationHeading
          className={cn(
            'mx-auto text-4xl font-[600] top-1/2 left-0 right-0 w-full absolute z-10 text-center',
          )}
        />
      </div>
    </div>
  );
}
