import { useEffect, useState } from 'react';
import { useIsClient } from '@uidotdev/usehooks';

export function useCssVar(varName: string, defaultValue?: string) {
  const isClient = useIsClient();
  const [value, setValue] = useState<string | undefined>(defaultValue);

  useEffect(() => {
    if (!isClient) return;

    const handleUpdate = () => {
      const newValue = getComputedStyle(
        document.documentElement,
      ).getPropertyValue(varName);
      setValue(newValue);
    };

    handleUpdate();

    const observer = new MutationObserver(handleUpdate);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [isClient, varName]);

  return value;
}
