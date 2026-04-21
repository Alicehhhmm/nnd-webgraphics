# Three.js 进阶 - 性能优化 (Performance Optimization)

## ⚡ 为什么需要性能优化？

Three.js 应用的性能直接影响用户体验。良好的性能确保应用流畅运行，在各种设备上都能提供良好的体验。性能优化是专业 Three.js 开发的重要组成部分。

## 📊 性能监控

### 使用浏览器开发者工具

```javascript
// 基础性能监控
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

function updateFPS() {
    frameCount++;
    const now = performance.now();
    
    if (now >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;
        
        console.log(`FPS: ${fps}`);
        
        // 根据 FPS 调整设置
        if (fps < 30) {
            // 降低质量设置
            reduceQuality();
        } else if (fps > 55) {
            // 可以提高质量设置
            increaseQuality();
        }
    }
}
```

### 使用 Stats.js 监控

```javascript
// 引入 Stats.js
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);

// 在动画循环中更新
function animate() {
    stats.begin(); // 开始统计
    
    // 渲染逻辑
    renderer.render(scene, camera);
    
    stats.end(); // 结束统计
    requestAnimationFrame(animate);
}
```

## 🏗️ 场景优化

### 几何体优化

```javascript
// 使用实例化网格 (InstancedMesh) 渲染大量相似对象
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });

// 创建实例化网格（例如渲染 1000 个立方体）
const instancedMesh = new THREE.InstancedMesh(geometry, material, 1000);
scene.add(instancedMesh);

// 设置每个实例的变换
const matrix = new THREE.Matrix4();
for (let i = 0; i < 1000; i++) {
    matrix.setPosition(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    instancedMesh.setMatrixAt(i, matrix);
    
    // 还可以设置颜色
    const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
    );
    instancedMesh.setColorAt(i, color);
}

instancedMesh.instanceMatrix.needsUpdate = true;
if (instancedMesh.instanceColor) {
    instancedMesh.instanceColor.needsUpdate = true;
}
```

### 减少绘制调用 (Draw Calls)

```javascript
// 合并相似的几何体
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// 将多个几何体合并为一个
const geometries = [];
// ... 添加多个几何体到数组

const mergedGeometry = mergeBufferGeometries(geometries);
const mergedMesh = new THREE.Mesh(mergedGeometry, material);
scene.add(mergedMesh);
```

## 🎨 渲染优化

### 使用对象池

```javascript
// 对象池模式减少垃圾回收
class ObjectPool {
    constructor(createFn, resetFn) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
    }
    
    get() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        return this.createFn();
    }
    
    release(obj) {
        this.resetFn(obj);
        this.pool.push(obj);
    }
}

// 粒子系统对象池示例
const particlePool = new ObjectPool(
    () => new THREE.Vector3(), // 创建新对象
    (obj) => obj.set(0, 0, 0)  // 重置对象
);
```

### 视锥剔除 (Frustum Culling)

```javascript
// Three.js 自动处理视锥剔除，但可以优化
mesh.frustumCulled = true; // 确保启用（默认值）

// 对于大场景，使用 LOD (Level of Detail)
const lod = new THREE.LOD();

// 添加不同细节级别的模型
const highDetailModel = loadHighDetailModel();
const mediumDetailModel = loadMediumDetailModel();
const lowDetailModel = loadLowDetailModel();

lod.addLevel(highDetailModel, 0);
lod.addLevel(mediumDetailModel, 20);  // 距离相机 20 单位外使用
lod.addLevel(lowDetailModel, 100);    // 距离相机 100 单位外使用

scene.add(lod);
```

### 材质优化

```javascript
// 共享材质
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff });
const mesh1 = new THREE.Mesh(geometry1, sharedMaterial);
const mesh2 = new THREE.Mesh(geometry2, sharedMaterial);
const mesh3 = new THREE.Mesh(geometry3, sharedMaterial);
// 这样只需要一次材质切换

// 使用纹理图集 (Texture Atlas)
const textureAtlas = new THREE.TextureLoader().load('atlas.png');
const material = new THREE.MeshBasicMaterial({
    map: textureAtlas,
    transparent: true
});

// 在几何体上设置 UV 坐标以使用图集的不同部分
const uvAttribute = geometry.getAttribute('uv');
// ... 设置 UV 以引用图集中的不同区域
```

## ⚙️ 渲染器优化

### 启用各种优化选项

```javascript
// 渲染器配置优化
const renderer = new THREE.WebGLRenderer({
    antialias: false,        // 如果不需要抗锯齿，禁用以提高性能
    alpha: false,            // 如果不需要透明背景，禁用
    logarithmicDepthBuffer: false, // 大场景才需要
    powerPreference: "high-performance" // 优先使用高性能 GPU
});

// 启用多线程渲染
renderer.getContextAttributes().preserveDrawingBuffer = false;

// 色调映射 (对于高性能场景可考虑简化)
renderer.toneMapping = THREE.NoToneMapping; // 或使用更简单的映射
```

### 缓存优化

```javascript
// 禁用不必要的自动更新
geometry.attributes.position.needsUpdate = false;
material.needsUpdate = false;

// 使用索引几何体减少顶点数量
const indexedGeometry = new THREE.BufferGeometry();
// ... 设置索引
const indices = [0, 1, 2, 2, 3, 0]; // 示例索引
indexedGeometry.setIndex(indices);

// 启用缓存
geometry.computeVertexNormals(); // 预计算法线
geometry.computeBoundingBox();   // 预计算边界框
geometry.computeBoundingSphere(); // 预计算边界球
```

## 🚀 GPU 优化

### 使用合适的缓冲区几何体

```javascript
// 优化顶点数据
const positions = new Float32Array([
    // 顶点数据
]);
const normals = new Float32Array([
    // 法线数据
]);
const uvs = new Float32Array([
    // UV 数据
]);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

// 确保数据类型正确以优化 GPU 传输
// 使用 Float32Array 而不是普通数组
```

### 纹理优化

```javascript
// 纹理内存管理
const texture = new THREE.TextureLoader().load('texture.jpg');

// 设置适当的过滤器
texture.minFilter = THREE.LinearFilter; // 或 THREE.LinearMipmapLinearFilter
texture.magFilter = THREE.LinearFilter;

// 使用纹理压缩 (在构建时)
// 使用 DDS, PVR, KTX 等格式

// 异步纹理加载
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (url, loaded, total) => {
    if (loaded === total) {
        // 所有纹理加载完成，可以开始渲染
        startRendering();
    }
};
```

## 📱 设备自适应优化

### 根据设备性能调整设置

```javascript
// 检测设备性能
function detectDevicePerformance() {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    const isWebGL2 = !!renderer.getContext().getParameter(renderer.getContext().VERSION).match(/WebGL 2/);
    
    return {
        isMobile,
        isLowEnd,
        isWebGL2,
        concurrency: navigator.hardwareConcurrency
    };
}

// 根据性能调整设置
const deviceSpecs = detectDevicePerformance();

if (deviceSpecs.isMobile || deviceSpecs.isLowEnd) {
    // 降低质量设置
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // 限制像素比
    renderer.shadowMap.type = THREE.BasicShadowMap; // 简单阴影
    renderer.toneMapping = THREE.NoToneMapping; // 无色调映射
} else {
    // 高质量设置
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 柔和阴影
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // 高质量色调映射
}
```

### 动态质量调整

```javascript
// 基于性能动态调整质量
class QualityManager {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.currentQuality = 'high';
        this.fpsHistory = [];
    }
    
    update() {
        // 计算平均 FPS
        const avgFps = this.calculateAverageFps();
        
        // 根据 FPS 调整质量
        if (avgFps < 30 && this.currentQuality !== 'low') {
            this.setQuality('low');
        } else if (avgFps > 50 && this.currentQuality === 'low') {
            this.setQuality('medium');
        } else if (avgFps > 55 && this.currentQuality === 'medium') {
            this.setQuality('high');
        }
    }
    
    setQuality(level) {
        this.currentQuality = level;
        
        switch (level) {
            case 'low':
                this.renderer.setPixelRatio(0.75);
                this.renderer.shadowMap.type = THREE.BasicShadowMap;
                break;
            case 'medium':
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                this.renderer.shadowMap.type = THREE.PCFShadowMap;
                break;
            case 'high':
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                break;
        }
    }
    
    calculateAverageFps() {
        // 实现 FPS 计算逻辑
        return 60; // 示例值
    }
}

const qualityManager = new QualityManager(renderer, scene, camera);
```

## 🧹 内存管理

### 及时释放资源

```javascript
// 资源清理函数
function disposeResources(object) {
    object.traverse((child) => {
        if (child.geometry) {
            child.geometry.dispose();
        }
        
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
            } else {
                child.material.dispose();
            }
        }
        
        if (child.texture) {
            child.texture.dispose();
        }
    });
}

// 使用 WeakMap 进行自动清理提示
const resourcesToClean = new WeakMap();

// 移除对象时清理资源
function removeObject(object) {
    disposeResources(object);
    scene.remove(object);
}
```

### 纹理管理

```javascript
// 纹理管理器
class TextureManager {
    constructor() {
        this.loadedTextures = new Map();
    }
    
    loadTexture(url) {
        if (this.loadedTextures.has(url)) {
            return this.loadedTextures.get(url);
        }
        
        const texture = new THREE.TextureLoader().load(url);
        this.loadedTextures.set(url, texture);
        return texture;
    }
    
    disposeUnused() {
        // 实现未使用纹理的清理逻辑
        // 可以基于引用计数或其他策略
    }
}

const textureManager = new TextureManager();
```

## 📈 优化检查清单

### 渲染优化
- [ ] 限制绘制调用数量
- [ ] 合并相似的几何体
- [ ] 使用实例化网格渲染重复对象
- [ ] 启用视锥剔除
- [ ] 使用 LOD 系统

### 材质优化
- [ ] 共享相似材质
- [ ] 使用纹理图集
- [ ] 避免不必要的材质切换
- [ ] 优化着色器复杂度

### 几何体优化
- [ ] 使用索引几何体
- [ ] 减少顶点数量
- [ ] 使用适当的几何体分段数
- [ ] 合并静态几何体

### 内存管理
- [ ] 及时释放不再使用的资源
- [ ] 使用对象池
- [ ] 监控内存使用情况
- [ ] 避免内存泄漏

### 设备适配
- [ ] 检测设备性能
- [ ] 动态调整质量设置
- [ ] 限制像素比
- [ ] 使用适当的阴影类型

## 📊 性能基准测试

```javascript
// 性能基准测试工具
class PerformanceBenchmark {
    constructor() {
        this.tests = [];
    }
    
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }
    
    async runAll() {
        const results = {};
        
        for (const test of this.tests) {
            const startTime = performance.now();
            await test.testFunction();
            const endTime = performance.now();
            
            results[test.name] = endTime - startTime;
        }
        
        return results;
    }
}

// 使用示例
const benchmark = new PerformanceBenchmark();

benchmark.addTest('renderSingleFrame', () => {
    renderer.render(scene, camera);
});

benchmark.addTest('updatePhysics', () => {
    world.step(1/60);
});

// 运行基准测试
benchmark.runAll().then(results => {
    console.table(results);
});
```

## 🔜 下一步

恭喜！您已经完成了 Three.js 的学习路径。现在您可以：

- 回顾 [阅读指南](../guide/) 中的所有内容
- 查看 [示例页面](/zh/examples) 中的实际应用
- 开始创建自己的 Web 图形学项目
- 探索更高级的图形学概念，如 WebGPU
- 贡献您的知识到这个文档项目