# Three.js 基础 - 材质 (Material)

## 🎨 什么是材质 (Material)？

在 Three.js 中，材质 (Material) 定义了物体表面的外观属性，包括颜色、纹理、光泽度、透明度等。材质决定了光线如何与物体表面交互，从而影响最终的视觉效果。

## 🧱 材质类型

### 基础材质 (Basic Material)

基础材质不受光照影响，主要用于调试或简单图形：

```javascript
// MeshBasicMaterial - 基础网格材质
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,         // 颜色
    wireframe: false,        // 是否显示线框
    transparent: false,      // 是否透明
    opacity: 1.0,           // 透明度 (当 transparent: true 时生效)
    visible: true           // 是否可见
});

// 示例
const material = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    wireframe: true 
});
```

### 漫射材质 (Diffuse Material)

受光照影响的材质，常用于哑光表面：

```javascript
// MeshLambertMaterial - 漫射材质
const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,        // 漫射颜色
    emissive: 0x000000,     // 自发光颜色
    transparent: false,     // 透明度
    opacity: 1.0,
    wireframe: false
});
```

### Phong 材质

更高级的光照材质，可以产生镜面高光：

```javascript
// MeshPhongMaterial - Phong 材质
const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,        // 漫射颜色
    specular: 0x111111,     // 镜面反射颜色
    shininess: 30,          // 高光锐利程度
    emissive: 0x000000,     // 自发光
    transparent: false,
    opacity: 1.0
});
```

### 物理材质 (Physical Material)

基于物理的渲染 (PBR)，提供更真实的效果：

```javascript
// MeshStandardMaterial - 标准材质 (PBR)
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,        // 基础颜色
    roughness: 0.5,         // 粗糙度 (0.0 - 1.0)
    metalness: 0.5,         // 金属度 (0.0 - 1.0)
    emissive: 0x000000,     // 自发光颜色
    transparent: false,
    opacity: 1.0,
    wireframe: false
});

// MeshPhysicalMaterial - 物理材质 (更高级的 PBR)
const physicalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.5,
    clearcoat: 0.0,         // 清漆强度
    clearcoatRoughness: 0.0, // 清漆粗糙度
    sheen: 0.0,             // 绒面效果
    transmission: 0.0,      // 透射率 (模拟玻璃)
    thickness: 0.0,         // 厚度 (配合透射使用)
    attenuationDistance: 1, // 衰减距离
    attenuationColor: 0x000000 // 衰减颜色
});
```

## 🎨 材质属性

### 颜色属性

```javascript
const material = new THREE.MeshStandardMaterial();

// 设置颜色
material.color = new THREE.Color(0xff0000); // 红色
material.color.setHex(0x00ff00);            // 绿色
material.color.setRGB(0, 0, 1);             // 蓝色

// 自发光颜色
material.emissive = new THREE.Color(0x333333);
```

### 透明度

```javascript
const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    transparent: true,  // 必须设为 true 才能实现透明
    opacity: 0.5        // 透明度 (0.0 - 1.0)
});
```

## 🖼️ 纹理贴图

材质可以使用纹理贴图来增加细节：

```javascript
// 加载纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('path/to/texture.jpg');

// 将纹理应用到材质
const material = new THREE.MeshStandardMaterial({
    map: texture,                // 颜色贴图
    roughnessMap: roughnessTexture,  // 粗糙度贴图
    metalnessMap: metalnessTexture,  // 金属度贴图
    normalMap: normalTexture,        // 法线贴图
    bumpMap: bumpTexture,            // 凹凸贴图
    displacementMap: displacementTexture, // 位移贴图
    aoMap: aoTexture,                 // 环境光遮蔽贴图
    emissiveMap: emissiveTexture      // 自发光贴图
});
```

### 重复纹理

```javascript
const texture = textureLoader.load('path/to/tileable-texture.jpg');

// 设置纹理重复
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4); // 水平和垂直方向重复 4 次

const material = new THREE.MeshStandardMaterial({
    map: texture
});
```

## ⚙️ 材质高级设置

### 双面渲染

```javascript
const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide  // 渲染双面 (背面也可见)
    // 其他选项: THREE.FrontSide, THREE.BackSide
});
```

### 背面剔除

```javascript
const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    side: THREE.FrontSide,  // 默认值，只渲染正面
    // 不渲染背面可以提高性能
});
```

### 线框模式

```javascript
const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    wireframe: true  // 以线框形式渲染
});
```

## 🚀 动态材质属性

材质属性可以在运行时动态修改：

```javascript
const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0.5,
    metalness: 0.5
});

// 在动画循环中修改材质属性
function animate() {
    requestAnimationFrame(animate);
    
    // 动态改变材质属性
    const time = Date.now() * 0.001;
    material.emissive.setHSL(Math.sin(time) * 0.1 + 0.1, 1, 0.25);
    material.roughness = (Math.sin(time * 0.5) + 1) * 0.5;
    
    renderer.render(scene, camera);
}
```

## 📸 完整示例

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // 启用阴影
document.body.appendChild(renderer.domElement);

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 创建不同材质的立方体
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
    new THREE.MeshPhongMaterial({ 
        color: 0x0000ff, 
        shininess: 100 
    }),
    new THREE.MeshStandardMaterial({ 
        color: 0xffff00, 
        roughness: 0.1, 
        metalness: 0.9 
    }),
    new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        roughness: 0.9, 
        metalness: 0.1 
    }),
    new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x003300 
    })
];

const geometry = new THREE.BoxGeometry(1, 1, 1);

materials.forEach((material, index) => {
    const mesh = new THREE.Mesh(geometry, material);
    
    // 在空间中排列立方体
    const x = (index % 3 - 1) * 2.5;
    const z = Math.floor(index / 3) * -2.5;
    mesh.position.set(x, 0, z);
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    scene.add(mesh);
});

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    
    // 旋转所有立方体
    scene.children
        .filter(child => child instanceof THREE.Mesh)
        .forEach(mesh => {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
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

### 材质实例共享

多个对象可以共享同一个材质实例：

```javascript
// 创建一个材质实例
const sharedMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff0000 
});

// 多个网格共享同一个材质
const mesh1 = new THREE.Mesh(geometry1, sharedMaterial);
const mesh2 = new THREE.Mesh(geometry2, sharedMaterial);
const mesh3 = new THREE.Mesh(geometry3, sharedMaterial);
// 这样可以减少内存使用和渲染调用
```

### 材质更新优化

```javascript
// 当材质属性频繁变化时，设置 needsUpdate
material.needsUpdate = true;

// 对于动态纹理，设置适当的过滤方式
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
```

## 🔜 下一步

学习完材质基础后，您可以继续了解：
- [网格 (Mesh)](../threejs/mesh) - 学习如何将几何体和材质组合成可渲染的物体
- [光源 (Light)](../threejs/light) - 学习如何使用不同类型的光源照亮场景
- [纹理 (Texture)](../threejs/texture) - 学习如何为物体添加纹理贴图