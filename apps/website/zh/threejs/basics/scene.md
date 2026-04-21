# Three.js 基础 - 场景 (Scene)

## 🏞️ 什么是场景 (Scene)？

在 Three.js 中，场景 (Scene) 是一个容器对象，用于存放和组织 3D 对象，如几何体、光源、相机等。场景是所有 3D 元素的根容器。

## 🏗️ 创建场景

最基础的场景创建非常简单：

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
```

## 📦 场景的功能

场景对象提供了多种功能：

### 添加对象

```javascript
// 添加物体到场景
scene.add(object);

// 例如添加一个立方体
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

### 移除对象

```javascript
// 从场景中移除物体
scene.remove(object);
```

### 查找对象

```javascript
// 通过遍历场景中的对象
scene.children.forEach(child => {
  // 处理子对象
});
```

## 🎛️ 场景属性

场景对象有一些重要的属性：

### 背景设置

```javascript
// 设置背景色
scene.background = new THREE.Color(0xaaaaaa);

// 或者使用背景贴图
const texture = new THREE.TextureLoader().load('path/to/texture.jpg');
scene.background = texture;
```

### 环境贴图

```javascript
// 设置环境贴图（用于物理渲染）
scene.environment = texture;
```

## 🌍 完整示例

以下是一个包含场景的简单 Three.js 应用示例：

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}

animate();
```

## 🎨 场景最佳实践

### 组织场景结构

对于复杂的场景，建议使用 Group 或 Object3D 来组织对象：

```javascript
// 使用 Group 组织相关对象
const carGroup = new THREE.Group();
carGroup.add(wheel1);
carGroup.add(wheel2);
carGroup.add(body);
scene.add(carGroup);

// 移动整个汽车
carGroup.position.x += 1;
```

### 性能考虑

- 合理组织场景层级，避免过深的嵌套
- 及时移除不再需要的对象
- 使用实例化 (InstancedMesh) 渲染大量相似对象

## 🔜 下一步

学习完场景基础后，您可以继续了解：
- [相机 (Camera)](../threejs/camera) - 学习如何"观察"场景
- [渲染器 (Renderer)](../threejs/renderer) - 学习如何渲染场景
- [几何体 (Geometry)](../threejs/geometry) - 学习如何创建 3D 形状

场景是 Three.js 的基础，理解它的概念和用法对于构建 3D 应用至关重要。