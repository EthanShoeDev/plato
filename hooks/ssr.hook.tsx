import { useEffect, useState } from "react";

export function useIsSSR() {
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(typeof window === "undefined");
  }, []);
  return isSSR;
}
