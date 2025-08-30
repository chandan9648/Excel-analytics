import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";

// Restored enhanced 3D column chart (axes + grid + labels)
const ThreeDChartWrapper = ({ data = [], xKey, yKey }) => {
  const barSpacing = 1.1; // compact spacing between bars
  const baseBarWidth = 0.6; // bar thickness

  const { values, labels, colors, scale, maxHeight } = useMemo(() => {
    const vals = data.map((d) => Number(d?.[yKey]) || 0);
    const lbs = data.map((d) => String(d?.[xKey] ?? ""));
    const max = Math.max(1, ...vals);
    const targetMaxHeight = 6; // world units (fits camera nicely)
    const s = max > targetMaxHeight ? targetMaxHeight / max : 1;
    const palette = [
      "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899",
      "#22c55e", "#06b6d4", "#eab308", "#f97316"
    ];
    const cols = vals.map((_, i) => palette[i % palette.length]);
    return { values: vals, labels: lbs, colors: cols, scale: s, maxHeight: targetMaxHeight };
  }, [data, xKey, yKey]);

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow bg-white">
      <Canvas camera={{ position: [8, 7, 12], fov: 50 }}>
        {/* Scene background and lighting */}
        <color attach="background" args={["#0b1220"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[8, 12, 6]} intensity={0.7} />
        <OrbitControls enablePan enableZoom  />

        {/* Ground grid */}
        <Grid args={[20, 20]} cellColor="#1f2937" sectionColor="#334155" infiniteGrid fadeDistance={25} fadeStrength={2} position={[0, 0, 0]} />

        {/* Axes */}
        {/* X-axis */}
        <mesh position={[((values.length - 1) * barSpacing) / 2, 0.01, 0]}>
          <boxGeometry args={[values.length * barSpacing + 0.4, 0.02, 0.02]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
        {/* Y-axis */}
        <mesh position={[-0.6, maxHeight / 2, 0]}>
          <boxGeometry args={[0.02, maxHeight + 0.4, 0.02]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>

        {/* Bars + X labels, centered along X */}
        <group position={[ -((values.length - 1) * barSpacing) / 2, 0, 0 ]}>
          {values.map((v, i) => {
            const h = Math.max(0.001, v * scale); // avoid zero height
            const x = i * barSpacing;
            const color = colors[i];
            const label = labels[i] ?? "";
            const short = label.length > 12 ? label.slice(0, 12) + "…" : label;
            return (
              <group key={i} position={[x, 0, 0]}>
                <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[baseBarWidth, h, baseBarWidth]} />
                  <meshStandardMaterial color={color} />
                </mesh>
                {/* numeric value label above bar */}
                <Text
                  position={[0, h + 0.25, 0]}
                  fontSize={0.28}
                  color="#e5e7eb"
                  anchorX="center"
                  anchorY="bottom"
                >
                  {String(Math.round((values[i] + Number.EPSILON) * 100) / 100)}
                </Text>
                {short && (
                  <Text
                    position={[0, 0.012, baseBarWidth / 2 + 0.008]}
                    rotation={[-Math.PI / 2.15, 0.18, 0]}
                    fontSize={0.26}
                    color="#cbd5e1"
                    anchorX="center"
                    anchorY="top"
                    maxWidth={2.2}
                  >
                    {short}
                  </Text>
                )}
              </group>
            );
          })}
        </group>
      </Canvas>
    </div>
  );
};

export default ThreeDChartWrapper;
