import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useIsSSR } from "../hooks/ssr.hook";
import Loading from "./loading";

const DynamicCanvasBackgroundAnimation = dynamic(
  () => import("./canvasBackgroundEffect"),
  {
    ssr: true,
    suspense: true,
  }
);

const AsyncCanvasBackgroundAnimation = () => {
  const isSSR = useIsSSR();

  return isSSR ? (
    <Loading />
  ) : (
    <Suspense fallback={<Loading />}>
      <DynamicCanvasBackgroundAnimation />
    </Suspense>
  );
};

export default AsyncCanvasBackgroundAnimation;
