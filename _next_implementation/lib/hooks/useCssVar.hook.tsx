import { useIsClient } from 'usehooks-ts';

export function useCssVar(varName: string, defaultValue?: string) {
  const isClient = useIsClient();
  if (!isClient) return defaultValue;
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    varName,
  );
  return value;
}
