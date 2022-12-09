import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useIsSSR } from "../../hooks/ssr.hook";
import Loading from "../loading";
import styles from "../../styles/backgroundCanvas.module.css";

const DynamicCanvasBackgroundAnimation = dynamic(
  () => import("./canvasBackgroundEffect"),
  {
    ssr: true,
    suspense: true,
  }
);

const FallBackLoading = () => (
  <>
    <Loading className={styles.loading} />
    <div className={styles.spacer} />
  </>
);

const AsyncCanvasBackgroundAnimation = () => {
  const isSSR = useIsSSR();

  return isSSR ? (
    <FallBackLoading />
  ) : (
    <Suspense fallback={<FallBackLoading />}>
      <DynamicCanvasBackgroundAnimation />
    </Suspense>
  );
};

export default AsyncCanvasBackgroundAnimation;
