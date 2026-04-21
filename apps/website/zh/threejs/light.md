# Three.js 基础 - 光源 (Light)

## 💡 什么是光源 (Light)？

在 Three.js 中，光源 (Light) 用于照亮场景中的物体，使它们不再是简单的颜色块，而是具有立体感和真实感的 3D 对象。不同的光源类型会产生不同的照明效果。

## 💡 光源类型

### AmbientLight（环境光）

环境光会照亮场景中的所有物体，且光照强度均匀，不产生阴影。

```javascript
// 创建环境光
const ambientLight = new THREE.AmbientLight(
    color,    // 颜色
    intensity // 强度 (默认为 1)
);

// 示例
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);
```

### DirectionalLight（方向光）

方向光模拟太阳光或远处的光源，光线平行照射，可以产生阴影。

```javascript
// 创建方向光
const directionalLight = new THREE.DirectionalLight(
    color,     // 光颜色
    intensity  // 光强度
);

// 设置位置
directionalLight.position.set(5, 10, 7);

// 启用阴影
directionalLight.castShadow = true;

scene.add(directionalLight);
```

#### 方向光阴影配置

```javascript
// 阴影映射配置
directionalLight.shadow.mapSize.width = 1024;   // 阴影贴图宽度
directionalLight.shadow.mapSize.height = 1024;  // 阴影贴图高度
directionalLight.shadow.camera.near = 0.5;      // 近平面
directionalLight.shadow.camera.far = 50;        // 远平面
directionalLight.shadow.camera.left = -10;      // 正交相机左边界
directionalLight.shadow.camera.right = 10;      // 正交相机右边界
directionalLight.shadow.camera.top = 10;        // 正交相机上边界
directionalLight.shadow.camera.bottom = -10;    // 正交相机下边界
```

### PointLight（点光源）

点光源从一个点向所有方向发射光线，光强度随距离衰减，可以产生阴影。

```javascript
// 创建点光源
const pointLight = new THREE.PointLight(
    color,          // 颜色
    intensity,      // 强度
    distance,       // 最大影响距离 (0 = 无限远)
    decay           // 衰减率 (默认为 1)
);

// 设置位置
pointLight.position.set(10, 10, 10);

// 启用阴影
pointLight.castShadow = true;

scene.add(pointLight);
```

### SpotLight（聚光灯）

聚光灯像手电筒一样，从特定位置向特定方向发射锥形光线，可以产生阴影。

```javascript
// 创建聚光灯
const spotLight = new THREE.SpotLight(
    color,          // 颜色
    intensity,      // 强度
    distance,       // 最大影响距离
    angle,          // 光线锥角度 (弧度)
    penumbra,       // 半影衰减 (0-1)
    decay           // 衰减率
);

// 设置位置和方向
spotLight.position.set(5, 10, 7);
spotLight.target.position.set(0, 0, 0); // 设置照射目标

// 启用阴影
spotLight.castShadow = true;

scene.add(spotLight);
```

### HemisphereLight（半球光）

半球光模拟环境光，从天空到地面渐变过渡，常用于模拟自然环境照明。

```javascript
// 创建半球光
const hemisphereLight = new THREE.HemisphereLight(
    skyColor,       // 天空颜色
    groundColor,    // 地面颜色
    intensity       // 强度
);

// 示例：模拟晴朗天空
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
scene.add(hemisphereLight);
```

## ⚙️ 光源通用属性

### 光强度

```javascript
// 设置光强度
light.intensity = 1.5;  // 默认值通常为 1
```

### 光颜色

```javascript
// 设置光颜色
light.color = new THREE.Color(0xff0000); // 红色光
light.color.setHex(0x00ff00);            // 绿色光
```

### 可见性

```javascript
// 控制光源是否有效
light.visible = false;
```

## 🎚️ 光源高级配置

### 阴影配置

```javascript
// 所有可以产生阴影的光源都有以下配置
const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;

// 阴影贴图质量
light.shadow.mapSize.width = 2048;  // 更高分辨率的阴影
light.shadow.mapSize.height = 2048;

// 阴影模糊
light.shadow.radius = 4;  // 仅在使用某些阴影算法时有效
```

### 距离衰减（对 PointLight 和 SpotLight）

```javascript
// 在 R163+ 版本中
light.decay = 2;        // 物理上正确的衰减
light.distance = 200;   // 最大影响距离

// 在早期版本中，需要手动调整强度以模拟衰减
```

## 📸 完整示例

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // 启用阴影映射
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 柔和阴影
document.body.appendChild(renderer.domElement);

// 创建包含不同光源的场景

// 1. 环境光 - 提供基础照明
const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
scene.add(ambientLight);

// 2. 方向光 - 主要光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;

// 配置方向光阴影
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

scene.add(directionalLight);

// 3. 点光源 - 创建局部照明效果
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(10, 10, 10);
pointLight.castShadow = true;
scene.add(pointLight);

// 4. 聚光灯 - 手电筒效果
const spotLight = new THREE.SpotLight(0x00ff00, 1, 100, Math.PI / 6, 0.5, 1);
spotLight.position.set(-10, 15, 10);
spotLight.castShadow = true;
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight);
scene.add(spotLight.target); // 必须将目标添加到场景中

// 5. 半球光 - 模拟天空光
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
scene.add(hemisphereLight);

// 创建带阴影的物体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x00aaff,
    roughness: 0.3,
    metalness: 0.7
});

const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5;
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// 创建地面以接收阴影
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    roughness: 0.9,
    metalness: 0.1
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(plane);

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    
    // 动态改变点光源位置
    const time = Date.now() * 0.001;
    pointLight.position.x = Math.sin(time) * 10;
    pointLight.position.z = Math.cos(time) * 10;
    
    // 动态改变聚光灯目标
    spotLight.target.position.x = Math.sin(time * 0.5) * 3;
    spotLight.target.position.z = Math.cos(time * 0.5) * 3;
    
    cube.rotation.x = time;
    cube.rotation.y = time;
    
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

## 🚨 光源性能考虑

### 光源数量

- 场景中的光源数量会影响性能
- 尽量减少不必要的光源
- 合并多个光源的效果（如果可能）

### 阴影性能

```javascript
// 优化阴影性能
light.shadow.mapSize.width = 512;   // 使用较小的阴影贴图尺寸
light.shadow.mapSize.height = 512;  // 降低质量但提高性能

// 仅对可见物体投射阴影
mesh.castShadow = false; // 不投射阴影的物体
mesh.receiveShadow = false; // 不接受阴影的表面
```

## 🔧 光源辅助对象

在开发过程中，可以使用光源辅助对象来可视化光源：

```javascript
import { DirectionalLightHelper, PointLightHelper, SpotLightHelper } from 'three/examples/jsm/helpers/LightHelpers.js';

// 方向光辅助对象
const directionalLightHelper = new DirectionalLightHelper(directionalLight, 1);
scene.add(directionalLightHelper);

// 点光源辅助对象
const pointLightHelper = new PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);

// 聚光灯辅助对象
const spotLightHelper = new SpotLightHelper(spotLight);
scene.add(spotLightHelper);
```

## 🔜 下一步

学习完光源基础后，您可以继续了解：
- [纹理 (Texture)](../threejs/texture) - 学习如何为物体添加纹理贴图
- [阴影 (Shadow)](../threejs/shadow) - 学习如何优化和配置阴影效果
- [动画 (Animation)](../threejs/animation) - 学习如何为场景制作动画