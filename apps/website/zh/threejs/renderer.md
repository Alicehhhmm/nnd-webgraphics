# Three.js 基础 - 渲染器 (Renderer)

## 🖼️ 什么是渲染器 (Renderer)？

在 Three.js 中，渲染器 (Renderer) 负责将场景和相机组合起来，生成可以在屏幕上显示的图像。渲染器是连接 Three.js 世界和浏览器显示的桥梁。

## 🏗️ 创建渲染器

最常见的渲染器是 WebGLRenderer：

```javascript
import * as THREE from 'three';

// 创建 WebGL 渲染器
const renderer = new THREE.WebGLRenderer();
```

## ⚙️ 渲染器配置

### 基本设置

```javascript
// 设置渲染器大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 将渲染器的 DOM 元素添加到页面中
document.body.appendChild(renderer.domElement);

// 或者添加到指定容器
// container.appendChild(renderer.domElement);
```

### 像素比设置

为了在高分辨率显示器上获得更好的效果：

```javascript
// 设置像素比（通常等于设备像素比）
renderer.setPixelRatio(window.devicePixelRatio);
```

### 背景设置

```javascript
// 设置背景色
renderer.setClearColor(0xffffff); // 白色背景
// 或
renderer.setClearColor(0xaaaaaa, 1); // 第二个参数是透明度
```

### 渲染窗口设置

```javascript
// 设置渲染区域（用于多窗口或多视口渲染）
renderer.setViewport(0, 0, width, height);
```

## 🎨 渲染器属性

### 输出编码

```javascript
renderer.outputEncoding = THREE.sRGBEncoding;
```

### 阴影映射

```javascript
// 启用阴影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 柔和阴影
```

### 清除颜色和深度缓冲

```javascript
// 在渲染前清除缓冲区
renderer.clear();
```

## 🎯 渲染过程

### 基本渲染循环

```javascript
function animate() {
    requestAnimationFrame(animate);
    
    // 更新动画
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // 渲染场景和相机
    renderer.render(scene, camera);
}

animate();
```

### 渲染特定部分

```javascript
// 渲染特定场景的特定部分
renderer.render(scene, camera, renderTarget, forceClear);
```

## 📸 完整示例

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 启用抗锯齿
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 创建几何体和材质
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 创建网格并添加到场景
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
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

## 🚨 常见问题和性能优化

### 窗口大小变化

```javascript
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比以提高性能
}

window.addEventListener('resize', onWindowResize, false);
```

### 性能优化技巧

1. **合理设置渲染器参数**：
```javascript
const renderer = new THREE.WebGLRenderer({
    antialias: false, // 如果不需要抗锯齿，关闭以提高性能
    powerPreference: "high-performance" // 优先使用高性能 GPU
});
```

2. **使用适当的像素比**：
```javascript
// 对于性能敏感的应用，限制最大像素比
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

3. **清除设置**：
```javascript
renderer.autoClear = false; // 手动控制是否清除缓冲区
```

## 🔧 高级渲染器选项

### 阴影设置

```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

### 后处理

```javascript
// 设置输出编码以支持后处理效果
renderer.outputEncoding = THREE.sRGBEncoding;
```

## 🔜 下一步

学习完渲染器基础后，您可以继续了解：
- [几何体 (Geometry)](../threejs/geometry) - 学习如何创建 3D 形状
- [材质 (Material)](../threejs/material) - 学习如何定义物体表面属性
- [网格 (Mesh)](../threejs/mesh) - 学习如何将几何体和材质组合成可渲染的物体