import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useIsSSR } from "../../hooks/ssr.hook";
import Loading from "../loading";
import styles from "../../styles/backgroundCanvas.module.css";

const DynamicCanvasRcCanvas = dynamic(() => import("./rcCanvas"), {
  ssr: false,
  suspense: false,
});

const FallBackLoading = () => (
  <>
    <Loading className={styles.loading} />
    <div className={styles.spacer} />
  </>
);

const AsyncCanvasRcCanvas = () => {
  const isSSR = useIsSSR();

  return isSSR ? (
    <FallBackLoading />
  ) : (
    <Suspense fallback={<FallBackLoading />}>
      <DynamicCanvasRcCanvas />
    </Suspense>
  );
};

export default AsyncCanvasRcCanvas;
