import { SphereProps, Triplet, useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Mesh } from "three";
import { useControls } from "./useControls";

export default function Ball(
  props: SphereProps & { radius: number; mass: number }
) {
  const controls = useControls();
  const initialPosition: Triplet = useMemo(
    () => props.position ?? [0, 2, 0],
    []
  );

  const [ref, sphereApi] = useSphere(
    () => ({
      args: [props.radius],
      ...props,
    }),
    useRef<Mesh>(null)
  );

  const ballRot = useRef<Triplet>([0, 0, 0]);
  const ballPos = useRef<Triplet>(initialPosition);
  const ballVel = useRef<Triplet>([0, 0, 0]);
  useEffect(() => {
    sphereApi.position.subscribe((p) => (ballPos.current = p));
    sphereApi.velocity.subscribe((v) => (ballVel.current = v));
    sphereApi.rotation.subscribe((r) => (ballRot.current = r));
    sphereApi.angularFactor.set(1, 0, 0);
    sphereApi.linearFactor.set(0, 1, 1);
  }, []);

  useFrame(() => {
    const { reset } = controls.current;

    if (reset) {
      sphereApi.position.set(...initialPosition);
      sphereApi.velocity.set(0, 0, 0);
      sphereApi.angularVelocity.set(0, 0, 0);
    }

    const x = ballPos.current[0];
    if (x > 0.02 || x < -0.02) {
      sphereApi.position.set(0, ballPos.current[1], ballPos.current[2]);
      sphereApi.velocity.set(0, ballVel.current[1], ballVel.current[2]);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[props.radius]} />
      <meshStandardMaterial color={"red"} />
    </mesh>
  );
}
