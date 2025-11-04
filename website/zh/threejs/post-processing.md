# Three.js 进阶 - 后期处理 (Post-processing)

## 🎨 什么是后期处理 (Post-processing)？

后期处理 (Post-processing) 是在场景渲染完成后，在最终图像上应用各种视觉效果的技术。这些效果包括模糊、发光、色彩校正、景深、运动模糊等，可以极大地增强场景的视觉质量。

## 🏗️ 基础后期处理设置

### EffectComposer 基础

```javascript
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// 创建后期处理组合器
const composer = new EffectComposer(renderer);

// 添加渲染通道
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
```

### 常见的后期处理效果

#### 发光效果 (Bloom)

```javascript
// 添加发光效果
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), // 分辨率
    1.5,  // 强度
    0.4,  // 半径
    0.85  // 阈值
);

composer.addPass(bloomPass);

// 动态调整发光参数
bloomPass.strength = 1.5;   // 发光强度
bloomPass.radius = 0.4;     // 发光半径
bloomPass.threshold = 0.85; // 阈值（超过此亮度的像素才会发光）
```

## ⚙️ 常用后期处理效果

### 复合效果 (ShaderPass)

```javascript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// 创建自定义着色器通道
const vignettePass = new ShaderPass({
    uniforms: {
        tDiffuse: { value: null },
        offset: { value: 1.0 },
        darkness: { value: 1.2 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float offset;
        uniform float darkness;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        
        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
            float dist = dot(uv, uv) * darkness;
            gl_FragColor = vec4(texel.rgb * (1.0 - dist), texel.a);
        }
    `
});

composer.addPass(vignettePass);
```

### 色彩校正 (Color Correction)

```javascript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// 颜色分级效果
const colorCorrectionPass = new ShaderPass({
    uniforms: {
        tDiffuse: { value: null },
        brightness: { value: 0.1 },
        contrast: { value: 1.2 },
        saturation: { value: 1.1 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float brightness;
        uniform float contrast;
        uniform float saturation;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        
        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);
            
            // 调整亮度
            vec3 color = texel.rgb + vec3(brightness);
            
            // 调整对比度
            color = (color - 0.5) * contrast + 0.5;
            
            // 调整饱和度
            vec3 luminance = vec3(0.299, 0.587, 0.114);
            float gray = dot(color, luminance);
            color = mix(vec3(gray), color, saturation);
            
            gl_FragColor = vec4(color, texel.a);
        }
    `
});

composer.addPass(colorCorrectionPass);
```

### 景深效果 (Depth of Field)

```javascript
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

// 创建景深效果
const bokehPass = new BokehPass(
    scene,
    camera,
    {
        focus: 1.0,           // 焦点距离
        aspect: camera.aspect, // 相机宽高比
        aperture: 0.025,      // 光圈大小
        maxblur: 0.01         // 最大模糊半径
    }
);

composer.addPass(bokehPass);
```

### 运动模糊 (Motion Blur)

```javascript
// 运动模糊需要特殊处理，一般使用自定义着色器
const motionBlurPass = new ShaderPass({
    uniforms: {
        tDiffuse: { value: null },
        tPrevious: { value: null },
        motionStrength: { value: 0.5 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tPrevious;
        uniform float motionStrength;
        varying vec2 vUv;
        
        void main() {
            vec4 currentColor = texture2D(tDiffuse, vUv);
            vec4 previousColor = texture2D(tPrevious, vUv);
            
            // 简单的运动模糊效果
            vec4 color = mix(previousColor, currentColor, 0.9);
            gl_FragColor = color;
        }
    `
});
```

## 🎯 完整后期处理示例

```javascript
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 10, 20);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10);
camera.lookAt(0, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 基础光照
const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 创建发光点光源
const pointLight = new THREE.PointLight(0xff9900, 2, 100);
pointLight.position.set(0, 5, 5);
pointLight.castShadow = true;
scene.add(pointLight);

// 创建几何体
const geometry = new THREE.TorusKnotGeometry(1, 0.4, 128, 32);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x00aaff,
    emissive: 0x002255,
    metalness: 0.8,
    roughness: 0.2
});
const torusKnot = new THREE.Mesh(geometry, material);
torusKnot.castShadow = true;
scene.add(torusKnot);

// 地面
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222,
    metalness: 0.3,
    roughness: 0.7
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -2;
plane.receiveShadow = true;
scene.add(plane);

// 设置后期处理
const composer = new EffectComposer(renderer);

// 添加渲染通道
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// 添加发光效果
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,  // 强度
    0.4,  // 半径
    0.85  // 阈值
);
composer.addPass(bloomPass);

// 添加输出通道
const outputPass = new OutputPass();
composer.addPass(outputPass);

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 旋转几何体
    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.01;
    
    // 也可以动态调整后期处理参数
    bloomPass.strength = 0.5 + Math.sin(Date.now() * 0.002) * 0.5;
    
    // 使用后期处理组合器渲染
    composer.render();
}

// 处理窗口大小变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

animate();
```

## 🚀 高级后期处理技术

### 多重效果组合

```javascript
// 创建多个效果并按顺序应用
function createAdvancedPostProcessing() {
    const composer = new EffectComposer(renderer);
    
    // 基础渲染
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // 发光效果
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
    );
    composer.addPass(bloomPass);
    
    // 色彩校正
    const colorCorrectionPass = new ShaderPass({
        uniforms: {
            tDiffuse: { value: null },
            brightness: { value: 0.1 },
            contrast: { value: 1.2 },
            saturation: { value: 1.1 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float brightness;
            uniform float contrast;
            uniform float saturation;
            uniform sampler2D tDiffuse;
            varying vec2 vUv;
            
            void main() {
                vec4 texel = texture2D(tDiffuse, vUv);
                
                vec3 color = texel.rgb + vec3(brightness);
                color = (color - 0.5) * contrast + 0.5;
                vec3 luminance = vec3(0.299, 0.587, 0.114);
                float gray = dot(color, luminance);
                color = mix(vec3(gray), color, saturation);
                
                gl_FragColor = vec4(color, texel.a);
            }
        `
    });
    composer.addPass(colorCorrectionPass);
    
    // 景深效果（如果需要）
    // const bokehPass = new BokehPass(scene, camera, {...});
    // composer.addPass(bokehPass);
    
    // 最终输出
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    
    return composer;
}
```

### 性能优化

```javascript
// 根据性能动态启用/禁用效果
class PostProcessingManager {
    constructor(composer) {
        this.composer = composer;
        this.effects = new Map();
        this.enabled = true;
    }
    
    addEffect(name, pass) {
        this.effects.set(name, pass);
        this.composer.addPass(pass);
    }
    
    enableEffect(name) {
        const pass = this.effects.get(name);
        if (pass) {
            pass.enabled = true;
        }
    }
    
    disableEffect(name) {
        const pass = this.effects.get(name);
        if (pass) {
            pass.enabled = false;
        }
    }
    
    updatePerformanceBased() {
        // 检测性能并调整效果
        if (this.isLowPerformanceDevice()) {
            this.disableEffect('bloom'); // 禁用计算密集型效果
        } else {
            this.enableEffect('bloom');
        }
    }
    
    isLowPerformanceDevice() {
        // 简单的性能检测
        return /mobile|android|iphone|ipad/i.test(navigator.userAgent);
    }
    
    render() {
        if (this.enabled) {
            this.composer.render();
        } else {
            renderer.render(scene, camera);
        }
    }
}
```

### 自定义后期处理效果

```javascript
// 创建自定义的故障效果
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const glitchPass = new ShaderPass({
    uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        amount: { value: 0.1 },
        angle: { value: 0.01 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform float amount;
        uniform float angle;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        
        void main() {
            vec2 uv = vUv;
            
            // 添加故障效果
            float offset = amount * sin(vUv.y * 10.0 + time * 5.0);
            uv.x += offset * 0.05;
            
            vec4 color = texture2D(tDiffuse, uv);
            
            // 颜色偏移
            vec4 red = texture2D(tDiffuse, uv + 0.01);
            vec4 blue = texture2D(tDiffuse, uv - 0.01);
            
            color.r = red.r;
            color.b = blue.b;
            
            gl_FragColor = color;
        }
    `
});

// 在动画中更新时间
function animate() {
    requestAnimationFrame(animate);
    
    glitchPass.uniforms.time.value = Date.now() * 0.001;
    
    composer.render();
}
```

## ⚡ 性能考虑

### 分辨率管理

```javascript
// 降低后期处理分辨率以提高性能
bloomPass.resolution = new THREE.Vector2(
    Math.floor(window.innerWidth * 0.5),
    Math.floor(window.innerHeight * 0.5)
);

// 或者使用自适应分辨率
function updateResolution() {
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const width = Math.floor(window.innerWidth / 2) * pixelRatio;
    const height = Math.floor(window.innerHeight / 2) * pixelRatio;
    
    composer.setSize(width, height);
}
```

### 效果启用/禁用管理

```javascript
// 根据设置或性能动态控制效果
const postProcessingSettings = {
    bloom: true,
    colorCorrection: true,
    depthOfField: false
};

function updatePostProcessingEffects() {
    // 根据设置启用/禁用效果
    if (bloomPass) bloomPass.enabled = postProcessingSettings.bloom;
    if (colorCorrectionPass) colorCorrectionPass.enabled = postProcessingSettings.colorCorrection;
    
    // ... 更新其他效果
}
```

## 🔜 下一步

学习完后期处理后，您可以继续了解：
- [性能优化 (Performance Optimization)](../threejs/performance-optimization) - 学习如何优化应用性能