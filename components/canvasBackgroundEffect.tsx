import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import styles from "../styles/backgroundCanvas.module.css";
import Loading from "./loading";
import { useIsSSR } from "../hooks/ssr.hook";
import useScrollPosition from "../hooks/useScrollPosition.hook";
import { useWindowSize } from "../hooks/windowSize.hook";
import Stats from "three/examples/jsm/libs/stats.module";

type Size = { height: number; width: number };
class AnimationState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  rays: THREE.Mesh[];
  dispose: () => void;
  scrollPosition = 0;
  disposed = false;
  stats: Stats;

  constructor(readonly containerRef: HTMLDivElement, size?: Size) {
    // Setup scene
    if (!size)
      size = {
        // height: window.innerHeight + 300,
        height: containerRef.clientHeight,
        width: containerRef.clientWidth,
      };
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111524);
    this.scene.fog = new THREE.Fog(this.scene.background, 50, 300);
    this.camera = new THREE.PerspectiveCamera(
      50,
      size.width / size.height,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(size.width, size.height);
    containerRef.appendChild(this.renderer.domElement);
    this.stats = Stats();
    containerRef.appendChild(this.stats.dom);

    // Setup cube
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 20);
    const materials = [
      new THREE.MeshBasicMaterial({
        color: 0xb19166,
      }),
      new THREE.MeshBasicMaterial({
        color: 0x878a92,
      }),
      new THREE.MeshBasicMaterial({
        color: 0x59558d,
      }),
      new THREE.MeshBasicMaterial({
        color: 0x597a59,
      }),
    ];
    this.rays = Array.from({ length: 300 }, (v, i) => {
      const ray = new THREE.Mesh(
        geometry,
        materials[Math.floor(materials.length * Math.random())]
      );
      this.scene.add(ray);
      ray.rotation.x = (90 * Math.PI) / 180;
      this.setRayToRandomStart(ray);
      return ray;
    });

    this.dispose = () => {
      this.disposed = true;
      containerRef.removeChild(this.renderer.domElement);
      containerRef.removeChild(this.stats.domElement);
      geometry.dispose();
      materials.forEach((material) => material.dispose());
    };

    this.animate();
  }

  setRayToRandomStart(ray: THREE.Mesh) {
    const randRange = (range: number, center = 0) =>
      Math.random() * range - range / 2 + center;

    ray.position.x = randRange(180);
    ray.position.y = randRange(180);
    ray.position.z = randRange(150, -275);
  }

  updateSize(size: Size) {
    this.camera.aspect = size.width / size.height;
    this.camera.updateProjectionMatrix();
    // this.renderer.setSize(size.width, size.height + 300);
    this.renderer.setSize(size.width, size.height);
  }

  setScrollPos(val: number) {
    this.scrollPosition = val;
  }

  animate() {
    if (!this.disposed) requestAnimationFrame(this.animate.bind(this));

    this.rays.forEach((ray) => {
      ray.rotation.y += 0.01;
      ray.position.z += 0.01 * this.scrollPosition + 0.05;

      if (ray.position.z >= 5) this.setRayToRandomStart(ray);
    });

    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }
}

const CanvasBackgroundAnimation = () => {
  const scrollPosition = useScrollPosition();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationState = useRef<AnimationState | null>(null);
  const windowSize = useWindowSize();

  useEffect(
    () =>
      animationState.current?.updateSize({
        height: windowSize.height,
        width: document.body.clientWidth,
      }),
    [windowSize]
  );
  useEffect(() => {
    animationState.current?.setScrollPos(scrollPosition);
  }, [scrollPosition]);

  useEffect(() => {
    if (!containerRef.current) return;
    animationState.current = new AnimationState(containerRef.current!);
    return animationState.current.dispose;
  }, []);

  return <div ref={containerRef} className={styles.backgroundCanvas} />;
};

export default CanvasBackgroundAnimation;
