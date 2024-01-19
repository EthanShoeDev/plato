import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useIsClient, useWindowSize } from '@uidotdev/usehooks';
import { useScroll } from '@use-gesture/react';
import { ErrorBoundary } from 'react-error-boundary';

import { cn } from '@/lib/utils';

import { Skeleton } from '../ui/skeleton';
import { TypeAnimationHeading } from './type-animation-heading';

const CanvasBackgroundScene = lazy(() =>
  import('./canvas-background-scene').then(({ CanvasBackgroundScene }) => ({
    default: CanvasBackgroundScene,
  })),
);

const TypingIndicator = React.memo(() => {
  return (
    <div className="top-0 left-0 right-0 bottom-0 w-full absolute z-10 flex items-center justify-center">
      <TypeAnimationHeading className="mx-auto text-4xl font-[600] top-1/2 left-0 right-0 w-full z-10 text-center" />
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

function CanvasBackgroundWithTextTyping() {
  const isClient = useIsClient();
  const typingIndicatorInstance = useMemo(() => <TypingIndicator />, []);

  const canvas = useMemo(
    () =>
      !isClient ? (
        <Fallback />
      ) : (
        <Suspense fallback={<Fallback />}>
          <ErrorBoundary fallback={<p>{"My cool graphic didn't load :("}</p>}>
            <CanvasBackgroundScene />
          </ErrorBoundary>
        </Suspense>
      ),
    [isClient],
  );

  const windowSize = useWindowSize();
  const [scrollPosition, setScrollPosition] = useState(0);
  useScroll(({ xy: [, y] }) => setScrollPosition(y), {
    target: window,
  });
  const switchToStaticPos = scrollPosition > (windowSize?.height ?? 9999);

  return (
    <div className="bg-background">
      <div
        className={cn(
          'w-full z-[-2]',
          switchToStaticPos ? 'h-screen' : 'h-[200vh]',
        )}
      />
      <div
        className={cn(
          'fixed w-full h-screen top-0 left-0 bg-background',
          switchToStaticPos && 'relative',
        )}
      >
        {canvas}
        {typingIndicatorInstance}
      </div>
    </div>
  );
}

export function CanvasBackgroundSceneSSR() {
  const isClient = useIsClient();

  return isClient ? <CanvasBackgroundWithTextTyping /> : <Fallback />;
}
