'use client'

import { memo, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Figma Glass Effect Parameters
interface GlassConfig {
    frost?: number        // 0-100, blur amount
    refraction?: number   // 0-100, light bending
    depth?: number        // 0-100, 3D depth
    lightAngle?: number   // degrees, -180 to 180
    lightIntensity?: number // 0-1
    dispersion?: number   // 0-100, chromatic aberration
    backgroundColor?: string // rgba color
}

const defaultConfig: GlassConfig = {
    frost: 100,
    refraction: 100,
    depth: 55,
    lightAngle: -30,
    lightIntensity: 0.2,
    dispersion: 100,
    backgroundColor: 'rgba(6, 6, 6, 0.5)',
}

// Custom glass shader
const glassVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const glassFragmentShader = `
  uniform float uTime;
  uniform float uFrost;
  uniform float uRefraction;
  uniform float uDepth;
  uniform float uLightAngle;
  uniform float uLightIntensity;
  uniform float uDispersion;
  uniform vec2 uResolution;
  uniform vec3 uBackgroundColor;
  uniform float uBackgroundOpacity;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Improved noise functions for better frosted glass
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Fractal Brownian Motion for realistic frost texture
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate light direction from angle (-30° = top-left)
    float angleRad = uLightAngle * 3.14159265 / 180.0;
    vec2 lightDir = vec2(cos(angleRad), sin(angleRad));
    
    // ===== FROSTED BLUR SIMULATION =====
    float frostAmount = uFrost / 100.0;
    
    // Multi-sample blur using fbm for realistic frost texture
    float blurStrength = frostAmount * 0.08;
    vec3 blurColor = vec3(0.0);
    float totalWeight = 0.0;
    
    // Sample multiple points to simulate blur
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      float angle = fi * 0.392699; // ~22.5 degrees
      float dist = (1.0 + mod(fi, 4.0)) * blurStrength;
      
      vec2 offset = vec2(cos(angle), sin(angle)) * dist;
      offset += vec2(fbm(uv * 20.0 + uTime * 0.05), fbm(uv * 20.0 + 100.0)) * blurStrength;
      
      vec2 sampleUv = uv + offset;
      float weight = 1.0 / (1.0 + length(offset) * 10.0);
      
      // Add subtle color variation for dispersion
      float dispersionOffset = uDispersion / 100.0 * 0.01;
      float r = fbm((sampleUv - lightDir * dispersionOffset) * 8.0) * 0.15;
      float g = fbm(sampleUv * 8.0) * 0.15;
      float b = fbm((sampleUv + lightDir * dispersionOffset) * 8.0) * 0.15;
      
      blurColor += vec3(r, g, b) * weight;
      totalWeight += weight;
    }
    blurColor /= totalWeight;
    
    // ===== REFRACTION SIMULATION =====
    float refractionAmount = uRefraction / 100.0;
    vec2 refractOffset = lightDir * refractionAmount * 0.015;
    float refractNoise = fbm(uv * 6.0 + uTime * 0.02) * refractionAmount * 0.02;
    
    // ===== DEPTH SIMULATION =====
    float depthFactor = uDepth / 100.0;
    float centerDist = length(uv - 0.5);
    float depthGradient = 1.0 - centerDist * depthFactor * 0.5;
    
    // ===== LIGHT REFLECTION =====
    // Specular highlight from light angle
    float lightDot = dot(normalize(vec2(0.5) - uv), lightDir);
    float specular = pow(max(0.0, lightDot), 8.0) * uLightIntensity * 0.6;
    
    // Fresnel-like edge glow
    float fresnel = pow(1.0 - abs(dot(vec3(0.0, 0.0, 1.0), normalize(vec3(uv - 0.5, 0.3)))), 3.0);
    float fresnelGlow = fresnel * uLightIntensity * 0.3;
    
    // ===== EDGE HIGHLIGHTS (Bevel effect) =====
    float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float edgeHighlight = 0.0;
    if (edgeDist < 0.03) {
      float edgeFactor = 1.0 - (edgeDist / 0.03);
      edgeFactor = pow(edgeFactor, 2.0);
      
      // Stronger highlight on light-facing edges (top-left for -30°)
      float edgeLight = 0.0;
      if (uv.x < 0.03) edgeLight += (1.0 - uv.y) * 0.5;
      if (uv.y < 0.03) edgeLight += (1.0 - uv.x) * 0.5;
      
      edgeHighlight = edgeFactor * (0.15 + edgeLight * 0.2) * uLightIntensity;
    }
    
    // ===== COMBINE ALL EFFECTS =====
    vec3 baseColor = uBackgroundColor;
    
    // Add blur contribution
    baseColor += blurColor * frostAmount;
    
    // Add lighting
    baseColor += vec3(specular + fresnelGlow + edgeHighlight);
    
    // Apply depth gradient
    baseColor *= depthGradient;
    
    // Subtle inner glow
    float innerGlow = (1.0 - centerDist * 1.5) * 0.05;
    baseColor += vec3(innerGlow);
    
    // Final output
    gl_FragColor = vec4(baseColor, uBackgroundOpacity);
  }
`

interface GlassPlaneMeshProps {
    config: GlassConfig
}

function GlassPlaneMesh({ config }: GlassPlaneMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const { viewport } = useThree()

    // Parse background color
    const parseColor = (color: string): [number, number, number, number] => {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
        if (match) {
            return [
                parseInt(match[1]) / 255,
                parseInt(match[2]) / 255,
                parseInt(match[3]) / 255,
                match[4] ? parseFloat(match[4]) : 1,
            ]
        }
        return [0.024, 0.024, 0.024, 0.5]
    }

    const [r, g, b, a] = parseColor(config.backgroundColor || 'rgba(6, 6, 6, 0.5)')

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uFrost: { value: config.frost ?? 100 },
        uRefraction: { value: config.refraction ?? 100 },
        uDepth: { value: config.depth ?? 55 },
        uLightAngle: { value: config.lightAngle ?? -30 },
        uLightIntensity: { value: config.lightIntensity ?? 0.4 },
        uDispersion: { value: config.dispersion ?? 100 },
        uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
        uBackgroundColor: { value: new THREE.Vector3(r, g, b) },
        uBackgroundOpacity: { value: a },
    }), [config, viewport, r, g, b, a])

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial
            material.uniforms.uTime.value = state.clock.elapsedTime
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <planeGeometry args={[viewport.width, viewport.height]} />
            <shaderMaterial
                vertexShader={glassVertexShader}
                fragmentShader={glassFragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
            />
        </mesh>
    )
}

interface GlassEffectProps {
    className?: string
    config?: GlassConfig
}

export const GlassEffect = memo<GlassEffectProps>(({ className, config = defaultConfig }) => {
    const mergedConfig = { ...defaultConfig, ...config }

    return (
        <div className={className} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
            <Canvas
                gl={{
                    alpha: true,
                    antialias: false,
                    powerPreference: 'high-performance',
                }}
                camera={{ position: [0, 0, 1], fov: 75 }}
                style={{ position: 'absolute', inset: 0 }}
            >
                <GlassPlaneMesh config={mergedConfig} />
            </Canvas>
        </div>
    )
})

GlassEffect.displayName = 'GlassEffect'
