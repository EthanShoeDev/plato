import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useIsSSR } from "../hooks/ssr.hook";
import Loading from "./loading";
import styles from "../styles/backgroundCanvas.module.css";

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
    <>
      <Loading />
      <div className={styles.spacer} />
    </>
  ) : (
    <Suspense fallback={<Loading />}>
      <DynamicCanvasBackgroundAnimation />
    </Suspense>
  );
};

export default AsyncCanvasBackgroundAnimation;
