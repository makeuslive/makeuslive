'use client'

import { memo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'
import type { Points as PointsType } from 'three'

const StarBackground = memo((props: any) => {
  const ref = useRef<PointsType | null>(null)

  // Optimize: Reduce star count significantly for smoother mobile performance
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(1200), { radius: 1.2 })
  )

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15 // Slower rotation
      ref.current.rotation.y -= delta / 20
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        stride={3}
        positions={new Float32Array(sphere)}
        frustumCulled={true}
        {...props}
      >
        <PointMaterial
          transparent
          color="#fff"
          size={0.003} // Slightly larger to compensate for fewer stars
          sizeAttenuation={true}
          depthWrite={false}
          blending={2} // AdditiveBlending for better performance
        />
      </Points>
    </group>
  )
})

StarBackground.displayName = 'StarBackground'

export const StarsCanvas = memo(() => {
  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ powerPreference: 'high-performance', antialias: false, alpha: true }}
        dpr={[1, 1.5]} // Limit pixel ratio to save battery/performance on mobile
      >
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  )
})

StarsCanvas.displayName = 'StarsCanvas'

