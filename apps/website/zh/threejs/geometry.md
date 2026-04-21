# Three.js 基础 - 几何体 (Geometry)

## 🔺 什么是几何体 (Geometry)？

在 Three.js 中，几何体 (Geometry) 定义了 3D 对象的形状和结构。它包含了构成 3D 对象的顶点、面和纹理坐标等信息。

## 🧱 基础几何体类型

Three.js 提供了多种预定义的基础几何体：

### BoxGeometry（立方体）

```javascript
// 创建立方体几何体
const geometry = new THREE.BoxGeometry(
    width,    // 宽度
    height,   // 高度
    depth,    // 深度
    widthSegments,   // 宽度方向的段数
    heightSegments,  // 高度方向的段数
    depthSegments    // 深度方向的段数
);

// 示例：创建一个 2x2x2 的立方体
const geometry = new THREE.BoxGeometry(2, 2, 2);
```

### SphereGeometry（球体）

```javascript
// 创建球体几何体
const geometry = new THREE.SphereGeometry(
    radius,         // 半径
    widthSegments,  // 经度方向分段数
    heightSegments, // 纬度方向分段数
    phiStart,       // 水平起始角度
    phiLength,      // 水平角度长度
    thetaStart,     // 垂直起始角度
    thetaLength     // 垂直角度长度
);

// 示例：创建一个半径为 1 的球体
const geometry = new THREE.SphereGeometry(1, 32, 32);
```

### PlaneGeometry（平面）

```javascript
// 创建平面几何体
const geometry = new THREE.PlaneGeometry(
    width,          // 宽度
    height,         // 高度
    widthSegments,  // 宽度方向分段数
    heightSegments  // 高度方向分段数
);

// 示例：创建一个 10x10 的平面
const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
```

### CircleGeometry（圆形）

```javascript
// 创建圆形几何体
const geometry = new THREE.CircleGeometry(
    radius,      // 半径
    segments,    // 分段数
    thetaStart,  // 起始角度
    thetaLength  // 角度长度
);

// 示例：创建一个完整的圆形
const geometry = new THREE.CircleGeometry(5, 32);
```

### CylinderGeometry（圆柱体）

```javascript
// 创建圆柱体几何体
const geometry = new THREE.CylinderGeometry(
    radiusTop,      // 顶部半径
    radiusBottom,   // 底部半径
    height,         // 高度
    radialSegments, // 径向分段数
    heightSegments, // 高度分段数
    openEnded,      // 是否开放端面
    thetaStart,     // 起始角度
    thetaLength     // 角度长度
);

// 示例：创建一个标准圆柱体
const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
```

## 🛠️ 几何体操作

### 访问顶点数据

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 访问顶点位置
const positionAttribute = geometry.getAttribute('position');
console.log('顶点数量:', positionAttribute.count);

// 修改顶点位置
for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);
    
    // 修改顶点位置
    positionAttribute.setXYZ(i, x * 1.1, y * 1.1, z * 1.1);
}

// 标记属性需要更新
positionAttribute.needsUpdate = true;
```

### 合并几何体

```javascript
// 创建两个几何体
const box1 = new THREE.BoxGeometry(1, 1, 1);
const box2 = new THREE.BoxGeometry(1, 1, 1);

// 将第二个几何体的位置偏移
box2.translate(2, 0, 0);

// 合并几何体
const mergedGeometry = new THREE.BufferGeometry();
mergedGeometry.index = box1.index; // 复制索引
mergedGeometry.attributes = box1.attributes; // 复制属性

// 或使用 BufferGeometryUtils 进行合并
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
const mergedGeometry = mergeBufferGeometries([box1, box2]);
```

## 🧪 动态几何体修改

```javascript
// 创建一个可修改的几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 在动画循环中修改几何体
function animate() {
    requestAnimationFrame(animate);
    
    // 让立方体变形
    const positionAttribute = geometry.getAttribute('position');
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);
        
        // 应用波浪变形
        const offset = Math.sin(time + x * 0.5) * 0.1;
        positionAttribute.setXYZ(i, x + offset, y + offset, z + offset);
    }
    
    positionAttribute.needsUpdate = true;
    
    renderer.render(scene, camera);
}
```

## 🎨 完整示例

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建各种几何体
const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.7, 16, 16),
    new THREE.ConeGeometry(0.7, 1.4, 8),
    new THREE.CylinderGeometry(0.6, 0.6, 1, 16),
    new THREE.TorusGeometry(0.6, 0.2, 16, 32),
    new THREE.DodecahedronGeometry(0.7, 0)
];

const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
];

// 在场景中放置各种几何体
geometries.forEach((geometry, index) => {
    const material = materials[index];
    const mesh = new THREE.Mesh(geometry, material);
    
    // 排列几何体
    const x = (index % 3 - 1) * 2.5;
    const z = Math.floor(index / 3) * -2.5;
    mesh.position.set(x, 0, z);
    
    scene.add(mesh);
});

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    
    // 旋转所有几何体
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
        }
    });
    
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

## 🚨 性能考虑

### 使用 InstancedBufferGeometry

当需要渲染大量相似对象时，使用实例化几何体可以提高性能：

```javascript
// 创建实例化几何体以高效渲染多个相同形状
const geometry = new THREE.InstancedBufferGeometry();
geometry.index = originalGeometry.index;
geometry.attributes = originalGeometry.attributes;

// 创建实例化网格
const instancedMesh = new THREE.InstancedMesh(geometry, material, instanceCount);
```

### 几何体共享

多个网格可以共享同一个几何体以节省内存：

```javascript
const sharedGeometry = new THREE.BoxGeometry(1, 1, 1);

const mesh1 = new THREE.Mesh(sharedGeometry, material1);
const mesh2 = new THREE.Mesh(sharedGeometry, material2);
// mesh1 和 mesh2 共享同一个几何体，节省内存
```

## 🔜 下一步

学习完几何体基础后，您可以继续了解：
- [材质 (Material)](../threejs/material) - 学习如何定义物体表面属性
- [网格 (Mesh)](../threejs/mesh) - 学习如何将几何体和材质组合成可渲染的物体
- [纹理 (Texture)](../threejs/texture) - 学习如何为物体添加纹理贴图