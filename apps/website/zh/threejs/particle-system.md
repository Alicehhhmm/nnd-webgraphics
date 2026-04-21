# Three.js 进阶 - 粒子系统 (Particle System)

## ⚗️ 什么是粒子系统 (Particle System)？

粒子系统 (Particle System) 是一种用于模拟复杂物理现象（如烟雾、火焰、水流、爆炸、星云等）的技术。通过创建大量小的粒子并控制它们的行为，可以实现各种视觉效果。

## 🏗️ 基础粒子系统

### 使用 Points 和 BufferGeometry

最简单的粒子系统是使用 Points 对象：

```javascript
import * as THREE from 'three';

// 创建粒子几何体
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 5000;

// 创建粒子位置数组
const positions = new Float32Array(particleCount * 3); // 3个值 (x, y, z) 每个粒子
const colors = new Float32Array(particleCount * 3);   // 3个颜色值 (r, g, b) 每个粒子

// 随机初始化粒子位置
for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;     // x
    positions[i + 1] = (Math.random() - 0.5) * 10; // y
    positions[i + 2] = (Math.random() - 0.5) * 10; // z
    
    // 随机颜色
    colors[i] = Math.random();     // r
    colors[i + 1] = Math.random(); // g
    colors[i + 2] = Math.random(); // b
}

// 将数据添加到几何体
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// 创建粒子材质
const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,                 // 粒子大小
    vertexColors: true,        // 使用顶点颜色
    transparent: true,         // 启用透明
    opacity: 0.8,              // 透明度
    sizeAttenuation: true      // 距离衰减（远处的粒子更小）
});

// 创建粒子系统
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);
```

## ⚙️ 粒子属性控制

### 粒子大小和透明度

```javascript
// 使用自定义着色器控制粒子大小
const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
        pointTexture: { value: new THREE.TextureLoader().load('path/to/particle.png') },
        time: { value: 0 }
    },
    vertexShader: `
        attribute float size;
        varying float vAlpha;
        
        void main() {
            vAlpha = 1.0 - position.y / 5.0; // 上方的粒子更透明
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform sampler2D pointTexture;
        varying float vAlpha;
        
        void main() {
            gl_FragColor = vec4(texture2D(pointTexture, gl_PointCoord).rgb, vAlpha);
        }
    `
});

// 为每个粒子设置不同的大小
const sizes = new Float32Array(particleCount);
for (let i = 0; i < particleCount; i++) {
    sizes[i] = Math.random() * 0.5 + 0.1; // 随机大小
}
particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
```

## 🌊 动态粒子系统

### 实时更新粒子位置

```javascript
// 在动画循环中更新粒子
function updateParticles(time) {
    const positions = particleGeometry.attributes.position.array;
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // 更新粒子位置（简单示例：随机漂移）
        positions[i] += (Math.random() - 0.5) * 0.01;     // x
        positions[i + 1] += (Math.random() - 0.5) * 0.01; // y
        positions[i + 2] += (Math.random() - 0.5) * 0.01; // z
        
        // 重置超出范围的粒子
        if (Math.abs(positions[i]) > 10) positions[i] = (Math.random() - 0.5) * 2;
        if (Math.abs(positions[i + 1]) > 10) positions[i + 1] = (Math.random() - 0.5) * 2;
        if (Math.abs(positions[i + 2]) > 10) positions[i + 2] = (Math.random() - 0.5) * 2;
    }
    
    // 标记位置属性需要更新
    particleGeometry.attributes.position.needsUpdate = true;
}

// 在动画循环中调用
function animate(time) {
    requestAnimationFrame(animate);
    
    updateParticles(time);
    
    renderer.render(scene, camera);
}
```

### 使用速度向量

```javascript
// 添加速度属性
const velocities = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i += 3) {
    velocities[i] = (Math.random() - 0.5) * 0.01;     // x 速度
    velocities[i + 1] = (Math.random() - 0.5) * 0.01; // y 速度
    velocities[i + 2] = (Math.random() - 0.5) * 0.01; // z 速度
}
particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

// 更新粒子位置基于速度
function updateParticlesWithVelocity(deltaTime) {
    const positions = particleGeometry.attributes.position.array;
    const velocities = particleGeometry.attributes.velocity.array;
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // 更新位置
        positions[i] += velocities[i] * deltaTime * 60;
        positions[i + 1] += velocities[i + 1] * deltaTime * 60;
        positions[i + 2] += velocities[i + 2] * deltaTime * 60;
        
        // 简单的边界处理
        if (Math.abs(positions[i]) > 10) {
            velocities[i] *= -0.8; // 反弹并损失能量
            positions[i] = Math.sign(positions[i]) * 10;
        }
        if (Math.abs(positions[i + 1]) > 10) {
            velocities[i + 1] *= -0.8;
            positions[i + 1] = Math.sign(positions[i + 1]) * 10;
        }
        if (Math.abs(positions[i + 2]) > 10) {
            velocities[i + 2] *= -0.8;
            positions[i + 2] = Math.sign(positions[i + 2]) * 10;
        }
    }
    
    particleGeometry.attributes.position.needsUpdate = true;
}
```

## 🧪 高级粒子效果

### 烟雾/云效果

```javascript
// 创建烟雾效果
function createSmokeEffect() {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 在中心附近创建粒子
        positions[i3] = (Math.random() - 0.5) * 2;     // x
        positions[i3 + 1] = Math.random() * 2;         // y (偏向正方向)
        positions[i3 + 2] = (Math.random() - 0.5) * 2; // z
        
        sizes[i] = Math.random() * 0.5 + 0.2;
        opacities[i] = Math.random() * 0.5 + 0.3;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    // 烟雾材质
    const smokeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            texture: { value: new THREE.TextureLoader().load('path/to/smoke-particle.png') },
            time: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            attribute float opacity;
            varying float vOpacity;
            
            void main() {
                vOpacity = opacity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D texture;
            varying float vOpacity;
            
            void main() {
                vec4 texColor = texture2D(texture, gl_PointCoord);
                gl_FragColor = vec4(texColor.rgb, texColor.a * vOpacity);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    return new THREE.Points(geometry, smokeMaterial);
}

const smokeEffect = createSmokeEffect();
scene.add(smokeEffect);
```

### 火焰效果

```javascript
// 创建火焰效果
function createFireEffect() {
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const life = new Float32Array(particleCount); // 生命周期
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 在底部区域创建粒子
        positions[i3] = (Math.random() - 0.5) * 1;   // x
        positions[i3 + 1] = Math.random() * 0.5;     // y (底部)
        positions[i3 + 2] = (Math.random() - 0.5) * 1; // z
        
        // 火焰颜色 (从黄色到红色)
        const colorIntensity = Math.random();
        if (colorIntensity > 0.7) {
            colors[i3] = 1.0;         // r - 红色
            colors[i3 + 1] = 0.7;     // g - 绿色
            colors[i3 + 2] = 0.3;     // b - 蓝色
        } else if (colorIntensity > 0.3) {
            colors[i3] = 1.0;         // r
            colors[i3 + 1] = 0.4;     // g
            colors[i3 + 2] = 0.1;     // b
        } else {
            colors[i3] = 1.0;         // r
            colors[i3 + 1] = 0.1;     // g
            colors[i3 + 2] = 0.0;     // b
        }
        
        life[i] = Math.random(); // 随机生命周期
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('life', new THREE.BufferAttribute(life, 1));
    
    // 火焰材质
    const fireMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const fireSystem = new THREE.Points(geometry, fireMaterial);
    
    // 火焰动画
    function animateFire(time) {
        const positions = geometry.attributes.position.array;
        const life = geometry.attributes.life.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // 更新生命周期
            life[i] -= 0.01;
            
            if (life[i] <= 0) {
                // 重置粒子
                positions[i3] = (Math.random() - 0.5) * 0.5;
                positions[i3 + 1] = Math.random() * 0.1;
                positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
                life[i] = 1.0;
            } else {
                // 火焰上升效果
                positions[i3 + 1] += 0.02;
                positions[i3] += (Math.random() - 0.5) * 0.01;
                positions[i3 + 2] += (Math.random() - 0.5) * 0.01;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.life.needsUpdate = true;
    }
    
    fireSystem.userData.animate = animateFire;
    return fireSystem;
}

const fireEffect = createFireEffect();
scene.add(fireEffect);
```

## ⚡ 性能优化

### 粒子数量管理

```javascript
// 根据性能动态调整粒子数量
let currentParticleCount = 5000;
const maxParticles = 10000;
const minParticles = 1000;

function adjustParticleCount() {
    // 检测帧率
    const frameTime = performance.now() - lastFrameTime;
    const fps = 1000 / frameTime;
    
    if (fps < 30 && currentParticleCount > minParticles) {
        // 帧率太低，减少粒子
        currentParticleCount = Math.max(minParticles, currentParticleCount - 500);
        recreateParticleSystem();
    } else if (fps > 50 && currentParticleCount < maxParticles) {
        // 帧率很高，可以增加粒子
        currentParticleCount = Math.min(maxParticles, currentParticleCount + 200);
        recreateParticleSystem();
    }
}

// 使用实例化网格替代 Points（在某些情况下更好）
function createInstancedParticles() {
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    
    const instancedMesh = new THREE.InstancedMesh(particleGeometry, particleMaterial, particleCount);
    
    // 为每个实例设置变换矩阵
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < particleCount; i++) {
        matrix.setPosition(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        instancedMesh.setMatrixAt(i, matrix);
    }
    
    instancedMesh.instanceMatrix.needsUpdate = true;
    return instancedMesh;
}
```

### 粒子生命周期管理

```javascript
// 粒子池系统
class ParticlePool {
    constructor(maxParticles = 1000) {
        this.activeParticles = [];
        this.inactiveParticles = [];
        
        // 预创建粒子
        for (let i = 0; i < maxParticles; i++) {
            const particle = {
                position: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                life: 0,
                maxLife: 0
            };
            this.inactiveParticles.push(particle);
        }
    }
    
    getParticle() {
        if (this.inactiveParticles.length > 0) {
            const particle = this.inactiveParticles.pop();
            this.activeParticles.push(particle);
            return particle;
        }
        return null;
    }
    
    returnParticle(particle) {
        const index = this.activeParticles.indexOf(particle);
        if (index !== -1) {
            this.activeParticles.splice(index, 1);
            this.inactiveParticles.push(particle);
        }
    }
    
    update(deltaTime) {
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const particle = this.activeParticles[i];
            particle.life -= deltaTime;
            
            if (particle.life <= 0) {
                this.returnParticle(particle);
            } else {
                particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
            }
        }
    }
}
```

## 📸 完整示例

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// 创建粒子系统
const particleCount = 3000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

// 初始化粒子
for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // 在球体上随机分布
    const radius = 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // 粒子颜色
    colors[i3] = Math.random() * 0.5 + 0.5;     // r
    colors[i3 + 1] = Math.random() * 0.5 + 0.3; // g
    colors[i3 + 2] = Math.random() * 0.8 + 0.2; // b
    
    // 粒子大小
    sizes[i] = Math.random() * 0.2 + 0.05;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// 粒子材质
const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);

// 创建中央吸引点
const centerPoint = new THREE.Vector3(0, 0, 0);

// 动画循环
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    
    // 更新粒子系统
    const positions = geometry.attributes.position.array;
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 获取当前位置
        const pos = new THREE.Vector3(
            positions[i3],
            positions[i3 + 1],
            positions[i3 + 2]
        );
        
        // 计算到中心点的向量
        const toCenter = new THREE.Vector3().subVectors(centerPoint, pos).normalize();
        
        // 应用吸引力
        const attractionForce = 0.01;
        pos.add(toCenter.multiplyScalar(attractionForce * delta * 60));
        
        // 添加一些随机运动
        pos.x += (Math.random() - 0.5) * 0.02;
        pos.y += (Math.random() - 0.5) * 0.02;
        pos.z += (Math.random() - 0.5) * 0.02;
        
        // 限制粒子在球体内
        if (pos.length() > 6) {
            pos.normalize().multiplyScalar(6);
        }
        
        // 更新位置
        positions[i3] = pos.x;
        positions[i3 + 1] = pos.y;
        positions[i3 + 2] = pos.z;
    }
    
    geometry.attributes.position.needsUpdate = true;
    
    // 旋转整个粒子系统
    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.x += 0.0005;
    
    renderer.render(scene, camera);
}

// 处理窗口大小变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
```

## 🔜 下一步

学习完粒子系统后，您可以继续了解：
- [物理引擎 (Physics)](../threejs/physics) - 学习如何添加物理效果
- [后期处理 (Post-processing)](../threejs/post-processing) - 学习如何添加视觉效果
- [性能优化 (Performance Optimization)](../threejs/performance-optimization) - 学习如何优化应用性能