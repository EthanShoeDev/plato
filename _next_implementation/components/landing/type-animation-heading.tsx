'use client';

import { TypeAnimation } from 'react-type-animation';

export function TypeAnimationHeading({ ...props }: { className?: string }) {
  return (
    <TypeAnimation
      sequence={[
        'Welcome to my portfolio.', // Types 'One'
        2000, // Waits 1s
        "I'm a full stack software developer.", // Deletes 'One' and types 'Two'
        3000, // Waits 2s
        'Check out some of my projects below.', // Types 'Three' without deleting 'Two'
        6000,
        // () => {
        //   console.log("Done typing!"); // Place optional callbacks anywhere in the array
        // },
      ]}
      repeat={Infinity}
      cursor={true}
      {...props}
    />
  );
}
