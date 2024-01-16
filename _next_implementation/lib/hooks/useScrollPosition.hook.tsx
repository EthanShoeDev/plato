import { RefObject, useEffect, useState } from 'react';

export const useScrollPosition = (scrollChildRef?: RefObject<HTMLElement>) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!scrollChildRef?.current) return setScrollPosition(0);
    const node = scrollChildRef.current;
    const scrollNode = node.closest('[data-radix-scroll-area-viewport]');
    if (!scrollNode) return setScrollPosition(0);
    //find parent with data-radix-scroll-area-viewport
    const updatePosition = () => {
      setScrollPosition(scrollNode.scrollTop);
    };
    scrollNode.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => scrollNode?.removeEventListener('scroll', updatePosition);
  }, [scrollPosition, scrollChildRef]);

  return scrollPosition;
};
