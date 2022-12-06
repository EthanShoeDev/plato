import React from "react";
import { useIsSSR } from "../hooks/ssr.hook";
import Loading from "./loading";
import { TypeAnimation } from "react-type-animation";

const AnimatedHeading = (
  props: React.HtmlHTMLAttributes<CSSStyleDeclaration>
) => {
  return (
    <TypeAnimation
      sequence={[
        "Welcome to my portfolio.", // Types 'One'
        2000, // Waits 1s
        "I'm a full stack software developer.", // Deletes 'One' and types 'Two'
        3000, // Waits 2s
        "Check out some of my projects below.", // Types 'Three' without deleting 'Two'
        6000,
        // () => {
        //   console.log("Done typing!"); // Place optional callbacks anywhere in the array
        // },
      ]}
      wrapper="h1"
      repeat={Infinity}
      style={{ fontSize: "2em" }}
      cursor={true}
      {...props}
    />
  );
};

export default AnimatedHeading;
