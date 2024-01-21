// import { Vector2 } from "@dimforge/rapier2d";
// import { useLayoutEffect, useRef } from "react";
// import * as THREE from "three";
// import styles from "../../styles/backgroundCanvas.module.css";

// const DEBUG_RENDER = true;

// async function initGame(div: HTMLDivElement) {
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera();
//   camera.position.set(0, 0, 5);
//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(div.clientWidth, div.clientHeight);
//   renderer.setClearColor(0x292929, 1);
//   // High pixel Ratio make the rendering extremely slow, so we cap it.
//   const pixelRatio = window.devicePixelRatio
//     ? Math.min(window.devicePixelRatio, 1.5)
//     : 1;
//   renderer.setPixelRatio(pixelRatio);
//   div.appendChild(renderer.domElement);

//   let ambientLight = new THREE.AmbientLight(0x606060);
//   scene.add(ambientLight);
//   let light = new THREE.PointLight(0xffffff, 1, 1000);
//   scene.add(light);

//   // For the debug-renderer.
//   let material = new THREE.LineBasicMaterial({
//     color: 0xffffff,
//     vertexColors: true,
//   });
//   let geometry = new THREE.BufferGeometry();
//   let lines = new THREE.LineSegments(geometry, material);
//   scene.add(lines);

//   function onWindowResize() {
//     console.log("resize");
//     camera.aspect = div.clientWidth / div.clientHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(div.clientWidth, div.clientHeight);
//   }
//   window.addEventListener("resize", onWindowResize, false);

//   const RAPIER = await import("@dimforge/rapier2d");

//   // Use the RAPIER module here.
//   let gravity = { x: 0.0, y: -9.81 };
//   let world = new RAPIER.World(gravity);

//   // Create the ground
//   let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.05);
//   world.createCollider(groundColliderDesc);

//   // Create a dynamic rigid-body.
//   let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 1.0);
//   let rigidBody = world.createRigidBody(rigidBodyDesc);

//   // Create a cuboid collider attached to the dynamic rigidBody.
//   let colliderDesc = RAPIER.ColliderDesc.cuboid(0.1, 0.1);
//   let collider = world.createCollider(colliderDesc, rigidBody);
//   function onKeyDown(event: KeyboardEvent) {
//     if (event.key != "r") return;
//     console.log("reset");
//     rigidBody.setLinvel(new Vector2(0, 0), true);
//     rigidBody.setTranslation(new Vector2(0, 2), true);
//   }
//   window.addEventListener("keydown", onKeyDown);

//   // Game loop. Replace by your own game loop system.
//   let frameLoop = () => {
//     // Step the simulation forward.
//     world.step();

//     // Get and print the rigid-body's position.
//     let position = rigidBody.translation();
//     // console.log("Rigid-body position: ", position.x, position.y);

//     //Graphics

//     if (DEBUG_RENDER) {
//       let buffers = world.debugRender();
//       lines.visible = true;
//       const vertices3d = Array.from(buffers.vertices).reduce(
//         (list: number[], elem, i) => {
//           list.push(elem);
//           if ((i + 1) % 2 === 0) list.push(0);
//           return list;
//         },
//         []
//       );
//       lines.geometry.setAttribute(
//         "position",
//         new THREE.BufferAttribute(Float32Array.from(vertices3d), 3)
//       );
//       lines.geometry.setAttribute(
//         "color",
//         new THREE.BufferAttribute(buffers.colors, 4)
//       );
//     } else {
//       lines.visible = false;
//     }
//     renderer.render(scene, camera);
//     requestAnimationFrame(frameLoop);
//   };

//   frameLoop();

//   return () => {
//     window.removeEventListener("resize", onWindowResize);
//     window.removeEventListener("keydown", onKeyDown);
//   };
// }

// export default function RapierCanvas() {
//   const ref = useRef<HTMLDivElement>(null!);

//   useLayoutEffect(() => {
//     const tearDown = initGame(ref.current);
//     return () => {
//       ref.current.removeChild(ref.current.children[0]);
//       tearDown.then((d) => d());
//     };
//   });

//   return <div ref={ref} className={styles.backgroundCanvas}></div>;
// }
