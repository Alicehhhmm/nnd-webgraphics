# Three.js 基础 - 阴影 (Shadow)

## 🌚 什么是阴影 (Shadow)？

在 Three.js 中，阴影 (Shadow) 是使 3D 场景更具真实感的重要元素。阴影让物体与环境产生联系，增强深度感和立体感。要实现阴影效果，需要光源、投射阴影的物体和接收阴影的表面共同配合。

## ⚙️ 启用阴影系统

在使用阴影之前，需要在渲染器上启用阴影映射：

```javascript
import * as THREE from 'three';

// 创建渲染器并启用阴影
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 启用阴影映射
renderer.shadowMap.enabled = true;

// 选择阴影映射类型
renderer.shadowMap.type = THREE.PCFShadowMap; // 默认值
// 其他选项：
// THREE.BasicShadowMap - 性能最好，质量最低
// THREE.PCFShadowMap - 默认值，平衡性能和质量
// THREE.PCFSoftShadowMap - 性能较低，但阴影更柔和
```

## 🪐 使物体投射阴影

### 设置物体投射阴影

```javascript
// 使网格投射阴影
mesh.castShadow = true;

// 示例：创建一个投射阴影的立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true; // 立方体会向其他物体投射阴影
scene.add(cube);
```

### 设置物体接收阴影

```javascript
// 使网格接收阴影
mesh.receiveShadow = true;

// 示例：创建一个接收阴影的平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true; // 平面会接收其他物体的阴影
plane.rotation.x = -Math.PI / 2; // 旋转使平面朝上
scene.add(plane);
```

## 💡 光源阴影配置

### 方向光阴影

```javascript
// 创建带阴影的方向光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;

// 配置阴影相机（正交投影）
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;

// 阴影贴图大小（影响阴影质量）
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// 阴影偏移（防止阴影自遮挡问题）
directionalLight.shadow.bias = -0.0001;

scene.add(directionalLight);
```

### 点光源阴影

```javascript
// 创建带阴影的点光源
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(5, 10, 5);
pointLight.castShadow = true;

// 点光源阴影的相机配置
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 100;

// 点光源阴影贴图大小
pointLight.shadow.mapSize.width = 512;
pointLight.shadow.mapSize.height = 512;

// 阴影偏移
pointLight.shadow.bias = -0.0001;

scene.add(pointLight);
```

### 聚光灯阴影

```javascript
// 创建带阴影的聚光灯
const spotLight = new THREE.SpotLight(0x00ff00, 1, 100, Math.PI / 4, 0.5, 1);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;

// 聚光灯阴影相机配置
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 100;
spotLight.shadow.camera.fov = 50; // 场景角度

// 阴影贴图大小
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

// 阴影偏移
spotLight.shadow.bias = -0.0001;

scene.add(spotLight);
```

## 🔧 阴影优化技术

### 阴影偏移 (Shadow Bias)

用于解决阴影自遮挡问题（阴影贴图精度问题导致的伪影）：

```javascript
// 简单的阴影偏移
directionalLight.shadow.bias = -0.0001;

// 根据光照角度进行自适应偏移
directionalLight.shadow.normalBias = 0.1; // 根据表面法线偏移
```

### 阴影贴图大小

平衡性能和质量：

```javascript
// 高质量阴影（性能较低）
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// 低质量阴影（性能较高）
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;

// 根据光源重要性设置不同大小
```

### 阴影相机范围优化

```javascript
// 精确设置阴影相机范围以提高阴影质量
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

// 更新投影矩阵以应用更改
directionalLight.shadow.camera.updateProjectionMatrix();
```

## 🚨 常见阴影问题和解决方案

### 阴影闪烁

```javascript
// 增加阴影偏移
directionalLight.shadow.bias = -0.001;

// 或者使用法线偏移
directionalLight.shadow.normalBias = 0.05;
```

### 阴影分辨率低

```javascript
// 提高阴影贴图分辨率
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// 但注意这会影响性能
```

### 阴影不显示

```javascript
// 检查必需的条件
// 1. 渲染器启用阴影
renderer.shadowMap.enabled = true;

// 2. 光源启用阴影
light.castShadow = true;

// 3. 投射阴影的物体设置正确
mesh.castShadow = true;

// 4. 接收阴影的表面设置正确
mesh.receiveShadow = true;

// 5. 光源足够亮
light.intensity > 0;
```

## 📸 完整示例

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 8, 10);
camera.lookAt(0, 0, 0);

// 创建渲染器并启用阴影
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 柔和阴影
document.body.appendChild(renderer.domElement);

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
scene.add(ambientLight);

// 配置方向光阴影
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;

// 配置阴影相机
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// 阴影贴图配置
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// 阴影偏移（解决自遮挡问题）
directionalLight.shadow.bias = -0.0001;

scene.add(directionalLight);

// 创建投射阴影的物体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00aaff,
    roughness: 0.3,
    metalness: 0.7
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-2, 1, 0);
cube.castShadow = true; // 投射阴影
cube.receiveShadow = true; // 也接收阴影
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00,
    roughness: 0.5,
    metalness: 0.2
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(2, 1.2, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// 创建接收阴影的地面
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xdddddd,
    roughness: 0.8,
    metalness: 0.1
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // 旋转使平面朝上
plane.position.y = -0.5;
plane.receiveShadow = true; // 接收阴影
scene.add(plane);

// 创建额外的几何体
const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff00ff,
    roughness: 0.2,
    metalness: 0.9
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 2, 3);
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    
    // 旋转物体以展示动态阴影
    const time = Date.now() * 0.001;
    
    cube.rotation.x = time;
    cube.rotation.y = time;
    
    sphere.rotation.x = time;
    sphere.rotation.y = time;
    
    torus.rotation.x = time * 0.5;
    torus.rotation.y = time * 0.5;
    
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

## 🚀 性能优化

### 限制阴影范围

```javascript
// 只对重要物体启用阴影
// 对远处的物体禁用阴影
distantObject.castShadow = false;
distantObject.receiveShadow = false;
```

### 动态调整阴影质量

```javascript
// 根据设备性能动态调整阴影质量
function adjustShadowQuality() {
    if (isLowPerformanceDevice()) {
        renderer.shadowMap.type = THREE.BasicShadowMap;
        directionalLight.shadow.mapSize.width = 512;
        directionalLight.shadow.mapSize.height = 512;
    } else {
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
    }
}
```

### 阴影剔除

```javascript
// 光源只影响特定范围内的物体
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
```

## 🔜 下一步

学习完阴影基础后，您可以继续了解：
- [动画 (Animation)](../threejs/animation) - 学习如何为场景制作动画
- [加载器 (Loader)](../threejs/loader) - 学习如何加载外部模型和资源
- [粒子系统 (Particle System)](../threejs/particle-system) - 学习如何创建粒子效果