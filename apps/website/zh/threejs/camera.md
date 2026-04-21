# Three.js 基础 - 相机 (Camera)

## 📷 什么是相机 (Camera)？

在 Three.js 中，相机 (Camera) 定义了玩家从什么角度观看场景。它就像现实世界中的摄像机或人眼，决定了场景的视角和视觉效果。

## 📐 相机类型

Three.js 提供了多种相机类型，主要用于不同场景：

### PerspectiveCamera（透视相机）

最常用的相机类型，模拟人眼的视觉效果，远处的物体看起来更小。

```javascript
const camera = new THREE.PerspectiveCamera(
    fov,      // 视野角度 (Field of View) - 垂直方向的视角范围
    aspect,   // 宽高比 (Aspect Ratio) - 渲染区域的宽高比
    near,     // 近裁剪面 - 离相机多近的物体会被裁剪掉
    far       // 远裁剪面 - 离相机多远的物体会被裁剪掉
);
```

**参数说明：**
- `fov`: 视野角度，通常设置为 50-60 度
- `aspect`: 宽高比，通常是 `window.innerWidth / window.innerHeight`
- `near`: 近裁剪面距离，如 `0.1`
- `far`: 远裁剪面距离，如 `1000`

**示例：**
```javascript
const camera = new THREE.PerspectiveCamera(
    75,                           // 视野角度
    window.innerWidth / window.innerHeight, // 宽高比
    0.1,                          // 近裁剪面
    1000                          // 远裁剪面
);
```

### OrthographicCamera（正交相机）

所有物体无论远近都保持相同的大小，常用于 2D 游戏或工程制图。

```javascript
const camera = new THREE.OrthographicCamera(
    left,   // 左边界
    right,  // 右边界
    top,    // 上边界
    bottom, // 下边界
    near,   // 近裁剪面
    far     // 远裁剪面
);
```

## 📍 相机定位

相机有位置、朝向和朝上的方向三个属性：

```javascript
// 设置相机位置
camera.position.set(0, 0, 5);

// 或者
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;

// 设置相机朝向的点（可选）
camera.lookAt(new THREE.Vector3(0, 0, 0));
```

## 📸 完整示例

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// 设置相机位置
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建几何体和材质
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 创建网格并添加到场景
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 渲染
function animate() {
    requestAnimationFrame(animate);
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // 渲染场景和相机
    renderer.render(scene, camera);
}

animate();
```

## 🚨 常见问题和注意事项

### 窗口大小变化

当浏览器窗口大小改变时，需要更新相机的宽高比：

```javascript
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
```

### 相机位置

- 如果相机太靠近物体 (z 值太小)，物体可能会被裁剪
- 如果相机离物体太远，物体可能会显得太小或者看不见

## 🔧 相机高级功能

### 相机控制器

Three.js examples 中提供了多种相机控制器：

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);

// 启用阻尼效果（更平滑的旋转）
controls.enableDamping = true;
controls.dampingFactor = 0.05;
```

## 🔜 下一步

学习完相机基础后，您可以继续了解：
- [渲染器 (Renderer)](../threejs/renderer) - 学习如何将场景渲染到屏幕上
- [几何体 (Geometry)](../threejs/geometry) - 学习如何创建 3D 形状
- [材质 (Material)](../threejs/material) - 学习如何定义物体表面属性