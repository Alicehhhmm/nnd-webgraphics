# Three.js 基础 - 网格 (Mesh)

## 🧩 什么是网格 (Mesh)？

在 Three.js 中，网格 (Mesh) 是几何体 (Geometry) 和材质 (Material) 的组合，是可以在场景中放置和渲染的 3D 对象。网格是 Three.js 中最基本的可渲染对象。

## 🏗️ 创建网格

网格由几何体和材质组合而成：

```javascript
import * as THREE from 'three';

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 创建网格
const mesh = new THREE.Mesh(geometry, material);

// 将网格添加到场景中
scene.add(mesh);
```

## 📍 网格变换属性

网格对象具有基本的变换属性：

### 位置 (Position)

```javascript
// 设置网格位置
mesh.position.x = 5;
mesh.position.y = 3;
mesh.position.z = 0;

// 或使用 set 方法
mesh.position.set(5, 3, 0);

// 或直接操作 position 向量
mesh.position = new THREE.Vector3(5, 3, 0);
```

### 旋转 (Rotation)

```javascript
// 设置旋转（以弧度为单位）
mesh.rotation.x = Math.PI / 4; // 45度
mesh.rotation.y = Math.PI / 2; // 90度
mesh.rotation.z = 0;

// 或使用 Euler 角
mesh.rotation.set(Math.PI / 4, Math.PI / 2, 0);

// 使用四元数进行旋转（更高级，避免万向锁）
mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
```

### 缩放 (Scale)

```javascript
// 设置缩放
mesh.scale.x = 2;
mesh.scale.y = 0.5;
mesh.scale.z = 1;

// 或使用 set 方法
mesh.scale.set(2, 0.5, 1);

// 统一缩放
mesh.scale.setScalar(1.5); // 所有轴都缩放 1.5 倍
```

## 🧭 网格方法

### 设置朝向

```javascript
// 让网格朝向一个点
const target = new THREE.Vector3(10, 0, 0);
mesh.lookAt(target);

// 或朝向世界坐标中的点
mesh.lookAt(10, 0, 0);
```

### 世界坐标变换

```javascript
// 获取世界坐标位置
const worldPosition = new THREE.Vector3();
mesh.getWorldPosition(worldPosition);
console.log(worldPosition);

// 获取世界旋转
const worldRotation = new THREE.Euler();
mesh.getWorldRotation(worldRotation);

// 获取世界缩放
const worldScale = new THREE.Vector3();
mesh.getWorldScale(worldScale);
```

## 🎨 与材质和几何体交互

### 更换材质

```javascript
// 更换为新材质
const newMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff0000,
    roughness: 0.5,
    metalness: 0.5
});
mesh.material = newMaterial;

// 处理多材质情况
const multiMaterial = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
];
mesh.material = multiMaterial;
```

### 更换几何体

```javascript
// 更换为新几何体
const newGeometry = new THREE.SphereGeometry(1, 16, 16);
mesh.geometry.dispose(); // 释放旧几何体内存
mesh.geometry = newGeometry;
```

### 访问几何体数据

```javascript
// 访问网格的几何体
const geometry = mesh.geometry;

// 访问顶点数据
const positionAttribute = geometry.getAttribute('position');
console.log('顶点数量:', positionAttribute.count);

// 访问材质
const material = mesh.material;
console.log('材质颜色:', material.color);
```

## 🚀 网格高级功能

### 边界框和边界球

```javascript
// 计算边界框
const boundingBox = new THREE.Box3().setFromObject(mesh);
console.log('边界框:', boundingBox);

// 计算边界球
const boundingSphere = new THREE.Sphere();
mesh.geometry.computeBoundingSphere();
const radius = mesh.geometry.boundingSphere.radius;
```

### 碰撞检测准备

```javascript
// 预先计算边界信息以提高碰撞检测性能
mesh.geometry.computeBoundingBox();
mesh.geometry.computeBoundingSphere();
```

### 网格克隆

```javascript
// 克隆网格（几何体和材质都会被克隆）
const clonedMesh = mesh.clone();

// 克隆时共享几何体和材质
const sharedMesh = new THREE.Mesh(mesh.geometry, mesh.material);
```

## ⚡ 性能优化

### 更新标志

当手动修改几何体时，需要设置更新标志：

```javascript
// 修改几何体顶点后
const positionAttribute = mesh.geometry.getAttribute('position');
// 修改顶点数据...
positionAttribute.needsUpdate = true;

// 标记几何体需要更新边界信息
mesh.geometry.computeBoundingBox();
mesh.geometry.computeBoundingSphere();
```

### 可见性和渲染

```javascript
// 控制网格是否渲染
mesh.visible = false; // 网格不再渲染

// 设置渲染顺序
mesh.renderOrder = 1; // 数值大的后渲染

// 检查网格是否在相机视锥体内
// Three.js 会自动进行视锥剔除
```

## 📸 完整示例

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 5);
camera.lookAt(0, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 创建具有不同几何体和材质的网格
const objects = [];

// 红色立方体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff0000,
    roughness: 0.5,
    metalness: 0.5
});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.set(-2, 0.5, 0);
boxMesh.castShadow = true;
objects.push(boxMesh);
scene.add(boxMesh);

// 绿色球体
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00,
    roughness: 0.2,
    metalness: 0.8
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(0, 0.7, 0);
sphereMesh.castShadow = true;
objects.push(sphereMesh);
scene.add(sphereMesh);

// 蓝色圆锥
const coneGeometry = new THREE.ConeGeometry(0.6, 1.2, 8);
const coneMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0000ff,
    roughness: 0.9,
    metalness: 0.1
});
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.position.set(2, 0.6, 0);
coneMesh.castShadow = true;
objects.push(coneMesh);
scene.add(coneMesh);

// 创建地面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xdddddd,
    roughness: 0.8,
    metalness: 0.2
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2; // 旋转使平面朝上
planeMesh.position.y = -0.5;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    
    // 动态变换网格
    const time = Date.now() * 0.001;
    
    objects.forEach((mesh, index) => {
        // 每个对象有不同的旋转行为
        switch(index) {
            case 0: // 立方体
                mesh.rotation.x = time;
                mesh.rotation.y = time;
                break;
            case 1: // 球体
                mesh.rotation.y = time * 0.5;
                break;
            case 2: // 圆锥
                mesh.rotation.z = time * 0.7;
                break;
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

## 🚨 常见问题

### 内存管理

```javascript
// 删除网格时，记得释放几何体和材质内存
function removeMesh(mesh) {
    scene.remove(mesh);
    
    // 释放几何体内存
    mesh.geometry.dispose();
    
    // 释放材质内存
    if(Array.isArray(mesh.material)) {
        mesh.material.forEach(material => material.dispose());
    } else {
        mesh.material.dispose();
    }
}
```

### 材质共享

```javascript
// 多个网格可以共享同一材质以节省内存
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const mesh1 = new THREE.Mesh(geometry1, sharedMaterial);
const mesh2 = new THREE.Mesh(geometry2, sharedMaterial);
// 修改 sharedMaterial 会影响两个网格
```

## 🔜 下一步

学习完网格基础后，您可以继续了解：
- [光源 (Light)](../threejs/light) - 学习如何使用不同类型的光源照亮场景
- [纹理 (Texture)](../threejs/texture) - 学习如何为物体添加纹理贴图
- [动画 (Animation)](../threejs/animation) - 学习如何为网格制作动画