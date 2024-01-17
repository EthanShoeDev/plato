import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useIsClient } from '@uidotdev/usehooks';

import { cn } from '@/lib/utils';

import { Skeleton } from '../ui/skeleton';
import TypeAnimationHeading from './type-animation-heading';

const CanvasBackgroundScene = lazy(() =>
  import('./canvas-background-scene').then(({ CanvasBackgroundScene }) => ({
    default: CanvasBackgroundScene,
  })),
);

const TypingIndicator = React.memo(() => {
  const [count, setCount] = useState(0);
  return (
    <div className="top-1/2 left-0 right-0 w-full absolute z-10">
      <TypeAnimationHeading
        onClick={() => setCount(count + 1)}
        className="mx-auto text-4xl font-[600] top-1/2 left-0 right-0 w-full z-10 text-center"
      />
      <p className="text-4xl">{count}</p>
      <button className="z-20" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
});

const Fallback = React.memo(({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="h-screen w-full p-4 flex">
      <div />
      <Skeleton className="grow relative">
        <div>
          <div>
            <canvas />
          </div>
        </div>
        {children}
      </Skeleton>
    </div>
  );
});

export function CanvasBackgroundSceneSSR() {
  const isClient = useIsClient();
  const typingIndicatorInstance = useMemo(() => <TypingIndicator />, []);

  if (!isClient) {
    return <Fallback></Fallback>;
  } else {
    return (
      <Suspense fallback={<Fallback>{typingIndicatorInstance}</Fallback>}>
        <CanvasBackgroundScene>{typingIndicatorInstance}</CanvasBackgroundScene>
      </Suspense>
    );
  }
}
