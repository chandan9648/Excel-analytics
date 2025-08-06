import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const ThreeDChartWrapper = ({ data, yKey }) => {
  const barWidth = 0.5;

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow bg-white">
      <Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {data.map((item, index) => {
          const height = Number(item[yKey]) || 1;
          return (
            <mesh key={index} position={[index * (barWidth + 0.2), height / 2, 0]}>
              <boxGeometry args={[barWidth, height, barWidth]} />
              <meshStandardMaterial color="blue" />
            </mesh>
          );
        })}
      </Canvas>
    </div>
  );
};

export default ThreeDChartWrapper;
