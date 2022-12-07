import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import styles from "../styles/backgroundCanvas.module.css";
import useScrollPosition from "../hooks/useScrollPosition.hook";
import { useWindowSize } from "../hooks/windowSize.hook";
import Stats from "three/examples/jsm/libs/stats.module";

const RCCanvas = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current!.appendChild(renderer.domElement);

    const render_stats = Stats();
    render_stats.domElement.style.position = "absolute";
    render_stats.domElement.style.top = "1px";
    render_stats.domElement.style.zIndex = "100";
    containerRef.current!.appendChild(render_stats.domElement);

    const physics_stats = Stats();
    physics_stats.domElement.style.position = "absolute";
    physics_stats.domElement.style.top = "50px";
    physics_stats.domElement.style.zIndex = "100";
    containerRef.current!.appendChild(physics_stats.domElement);
  }, []);

  return <div ref={containerRef} className={styles.backgroundCanvas} />;
};

export default RCCanvas;
