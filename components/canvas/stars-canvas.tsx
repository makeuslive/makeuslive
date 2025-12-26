'use client'

import { memo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, type PointsProps } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'
import type { Points as PointsType } from 'three'

const StarBackground = memo((props: PointsProps) => {
  const ref = useRef<PointsType | null>(null)
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  )

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        stride={3}
        positions={new Float32Array(sphere)}
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
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
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  )
})

StarsCanvas.displayName = 'StarsCanvas'

