import React, { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const RocketCarCanvas = lazy(() => import('./rocketCar'));

function useIsClient() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export const SsrRocketCar = ({
  fallback,
}: {
  fallback: () => React.ReactNode;
}) => {
  const isClient = useIsClient();

  return !isClient ? (
    fallback()
  ) : (
    <Suspense fallback={fallback()}>
      <ErrorBoundary fallback={<p>{'Rocket car had an error :('}</p>}>
        <RocketCarCanvas />
      </ErrorBoundary>
    </Suspense>
  );
};

export default SsrRocketCar;
