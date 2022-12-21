import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import styles from "../../styles/rcCanvas.module.css";
import { useToggledControl } from "./useToggleControl";
import Vehicle from "./vehicle";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { QuarterPipe } from "./quarterPipe";
import Ball from "./ball";
import { DataConnection, Peer } from "peerjs";

import { Physics, RigidBody, Debug, RigidBodyProps } from "@react-three/rapier";

function Plane(props: RigidBodyProps) {
  return (
    <RigidBody {...props}>
      <mesh>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </RigidBody>
  );
}

const RCCanvas = () => {
  const ToggledDebug = useToggledControl(Debug, "?");

  const [remoteId, setRemoteId] = useState("");
  const [localPeerId, setLocalPeerId] = useState("");
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const peer = useRef<Peer>(null!);

  useEffect(() => {
    peer.current = new Peer();
    peer.current.on("open", (id) => {
      console.log("Peer id: " + id);
      setLocalPeerId(id);
    });
    peer.current.on("connection", (conn) => {
      setConnection(conn);
    });
  }, []);

  return (
    <>
      <div className={styles.gameCanvas}>
        <Canvas gl={{ antialias: true }}>
          <Suspense>
            <PerspectiveCamera makeDefault fov={70} position={[-50, 10, 0]} />
            <OrbitControls />
            <Stats />
            <ambientLight intensity={0.5} />
            <spotLight intensity={0.5} position={[0, 40, 0]} />
            <Physics
              gravity={[0, -9.81, 0]}
              interpolate={false}
              timeStep={1 / 120}
            >
              <Plane
                rotation={[-Math.PI / 2, 0, 0]}
                userData={{ id: "floor" }}
              />
              <Plane
                rotation={[-Math.PI / 2, 0, 0]}
                userData={{ id: "floor" }}
              />
              <Plane
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 30, 0]}
                userData={{ id: "ceiling" }}
              />
              <Plane
                rotation={[0, 0, 0]}
                position={[0, 10, -30]}
                userData={{ id: "wall-1" }}
              />
              <Plane
                rotation={[Math.PI, 0, 0]}
                position={[0, 10, 30]}
                userData={{ id: "wall-2" }}
              />
              <QuarterPipe
                position={[0, 30, 30]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              <QuarterPipe
                position={[0, 0, 30]}
                rotation={[2 * Math.PI, 0, 0]}
              />
              <QuarterPipe position={[0, 0, -30]} rotation={[0, Math.PI, 0]} />
              <QuarterPipe
                position={[0, 30, -30]}
                rotation={[Math.PI / 2, Math.PI, 0]}
              />
              <Vehicle
                mass={10}
                position={[0, 3, 10]}
                rotation={[0, Math.PI, 0]}
                controllable={true}
                connection={connection}
              />
              {connection != null && (
                <Vehicle
                  position={[0, 3, -10]}
                  rotation={[0, 0, 0]}
                  controllable={false}
                  connection={connection}
                />
              )}

              <Ball
                position={[0, 4.5, 0]}
                userData={{ id: "ball-1" }}
                radius={2.5}
                mass={2}
              />
              <ToggledDebug />
            </Physics>
            <color attach="background" args={["#303030"]} />
          </Suspense>

          {/* <ContactShadows
          scale={1}
          blur={0.4}
          opacity={0.2}
          position={[-0, -1.5, 0]}
        /> */}
        </Canvas>
      </div>
      <div>
        <label>
          Remote Peer Id:
          <input
            type="text"
            name="remoteId"
            value={remoteId}
            onChange={(e) => setRemoteId(e.target.value)}
          />
        </label>
        <button
          onClick={(e) => {
            console.log("Connecting to " + remoteId);
            setConnection(peer.current.connect(remoteId));
          }}
        >
          Connect
        </button>
        <p onClick={(e) => navigator.clipboard.writeText(localPeerId)}>
          Your peer id: {localPeerId}
        </p>
      </div>
    </>
  );
};

export default RCCanvas;
