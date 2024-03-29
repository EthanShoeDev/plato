import { useEffect, useState } from 'react';
import {
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
  Stats,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  Physics,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from '@react-three/rapier';
import { DataConnection, Peer } from 'peerjs';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { quartObjectToArray, vecObjectToArray } from './helper';
import Ball from './objects/ball';
import { QuarterPipe } from './objects/quarterPipe';
import Vehicle from './objects/vehicle';

export type PhysicsPacket = {
  pos: [number, number, number];
  rot: [number, number, number];
  vel: [number, number, number];
  angVel: [number, number, number];
};

export type MessagePayload = {
  messageIdx: number;
  vehicle: PhysicsPacket;
  ball: PhysicsPacket;
};
export interface GameState {
  lastMessageFromPeer: MessagePayload | null;
  updateFromPeer: (message: MessagePayload) => void;
  activeConnection: DataConnection | null;
  peerClient: Peer | null;
  localPeerId: string | null;
  ballApi: RapierRigidBody | null;
  vehicleApi: RapierRigidBody | null;
  connectionIntervalId: number | null;
  isHost: boolean | null;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set) => ({
    lastMessageFromPeer: null,
    updateFromPeer: (message) => set({ lastMessageFromPeer: message }),
    activeConnection: null,
    peerClient: null,
    localPeerId: null,
    ballApi: null,
    vehicleApi: null,
    connectionIntervalId: null,
    isHost: null,
  })),
);

function pollData(conn: DataConnection): number {
  let idx = 0;
  return window.setInterval(() => {
    const { vehicleApi, ballApi } = useGameState.getState();
    if (!vehicleApi || !ballApi) return;

    const payload: MessagePayload = {
      messageIdx: idx++,
      vehicle: {
        pos: vecObjectToArray(vehicleApi.translation()),
        rot: quartObjectToArray(vehicleApi.rotation()).slice(0, 3) as any,
        vel: vecObjectToArray(vehicleApi.linvel()),
        angVel: vecObjectToArray(vehicleApi.angvel()),
      },
      ball: {
        pos: vecObjectToArray(ballApi.translation()),
        rot: quartObjectToArray(ballApi.rotation()).slice(0, 3) as any,
        vel: vecObjectToArray(ballApi.linvel()),
        angVel: vecObjectToArray(ballApi.angvel()),
      },
    };
    conn.send(payload);
  }, 50);
}

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

function Scene() {
  const activeConnection = useGameState((state) => state.activeConnection);
  const updateFromPeer = useGameState((state) => state.updateFromPeer);

  useEffect(() => {
    const client = new Peer();
    client.on('open', (id) => {
      console.log('Peer id: ' + id);
      useGameState.setState({ localPeerId: id });
    });
    client.on('connection', (conn) => {
      console.log(`Connected: ` + conn.label);
      const intervalId = pollData(conn);
      useGameState.setState({
        activeConnection: conn,
        connectionIntervalId: intervalId,
        isHost: true,
      });
      conn.on('data', (data) => {
        updateFromPeer(data as MessagePayload);
      });
    });
    client.on('disconnected', (currentId) => {
      console.log(`Disconnected: ` + currentId);
      const gameState = useGameState.getState();
      window.clearInterval(gameState.connectionIntervalId!);
      useGameState.setState({
        activeConnection: null,
        connectionIntervalId: null,
      });
    });
    client.on('error', (err: Error) => {
      console.log(`Peer error: ` + err.message);
    });
    useGameState.setState({ peerClient: client });
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault fov={70} position={[-50, 10, 0]} />
      <OrbitControls />
      <Stats />
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.5} position={[0, 40, 0]} />
      <Physics
        gravity={[0, -9.81, 0]}
        interpolate={false}
        timeStep={1 / 120}
        debug={true}
      >
        <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: 'floor' }} />
        <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: 'floor' }} />
        <Plane
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 30, 0]}
          userData={{ id: 'ceiling' }}
        />
        <Plane
          rotation={[0, 0, 0]}
          position={[0, 10, -30]}
          userData={{ id: 'wall-1' }}
        />
        <Plane
          rotation={[Math.PI, 0, 0]}
          position={[0, 10, 30]}
          userData={{ id: 'wall-2' }}
        />
        <QuarterPipe position={[0, 30, 30]} rotation={[-Math.PI / 2, 0, 0]} />
        <QuarterPipe position={[0, 0, 30]} rotation={[2 * Math.PI, 0, 0]} />
        <QuarterPipe position={[0, 0, -30]} rotation={[0, Math.PI, 0]} />
        <QuarterPipe
          position={[0, 30, -30]}
          rotation={[Math.PI / 2, Math.PI, 0]}
        />
        <Vehicle
          mass={10}
          position={[0, 6, 10]}
          rotation={[0, Math.PI, 0]}
          controllable={true}
        />
        {activeConnection != null && (
          <Vehicle
            position={[0, 6, -10]}
            rotation={[0, 0, 0]}
            controllable={false}
          />
        )}

        <Ball
          position={[0, 4.5, 0]}
          userData={{ id: 'ball-1' }}
          radius={2.5}
          mass={2}
        />
      </Physics>
      <color attach="background" args={['#303030']} />

      {/* <ContactShadows
          scale={1}
          blur={0.4}
          opacity={0.2}
          position={[-0, -1.5, 0]}
        /> */}
    </>
  );
}

const RCCanvas = () => {
  const [remoteId, setRemoteId] = useState('');
  const localPeerId = useGameState((state) => state.localPeerId);
  const [dpr, setDpr] = useState(0.75);

  return (
    <>
      <div className="">
        <Canvas gl={{ antialias: true, alpha: false }} dpr={dpr}>
          <PerformanceMonitor
            bounds={(_) => [20, 240]}
            onIncline={() => setDpr(Math.min(dpr + 0.25, 1.5))}
            onDecline={() => setDpr(Math.max(dpr - 0.25, 0.75))}
          />
          <Scene />
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
            console.log('Connecting to ' + remoteId);
            const connection = useGameState
              .getState()
              .peerClient?.connect(remoteId);
            if (!connection) return;
            const intervalId = pollData(connection);
            useGameState.setState({
              activeConnection: connection,
              connectionIntervalId: intervalId,
              isHost: false,
            });
            const { updateFromPeer } = useGameState.getState();
            connection.on('data', (data) => {
              updateFromPeer(data as MessagePayload);
            });
          }}
        >
          Connect
        </button>
        <p onClick={(_) => navigator.clipboard.writeText(localPeerId ?? '')}>
          Your peer id: {localPeerId} 📋
        </p>
      </div>
    </>
  );
};

export default RCCanvas;
