# Three.js 基础 - 纹理 (Texture)

## 🖼️ 什么是纹理 (Texture)？

纹理 (Texture) 是应用于 3D 对象表面的图像，用于增加物体的视觉细节和真实感。纹理可以是颜色贴图、法线贴图、凹凸贴图等，使简单的几何体看起来更丰富和真实。

## 🏗️ 加载纹理

### TextureLoader

最常用的纹理加载方式：

```javascript
import * as THREE from 'three';

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader();

// 加载纹理
const texture = textureLoader.load('path/to/texture.jpg');

// 将纹理应用到材质
const material = new THREE.MeshStandardMaterial({
    map: texture
});
```

### 同时加载多张纹理

```javascript
// 为不同用途加载不同的纹理
const textureLoader = new THREE.TextureLoader();

const colorTexture = textureLoader.load('path/to/color.jpg');
const normalTexture = textureLoader.load('path/to/normal.jpg');
const roughnessTexture = textureLoader.load('path/to/roughness.jpg');
const metalnessTexture = textureLoader.load('path/to/metalness.jpg');

const material = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    metalnessMap: metalnessTexture
});
```

## ⚙️ 纹理属性

### 重复和偏移

```javascript
const texture = textureLoader.load('path/to/tileable-texture.jpg');

// 设置纹理重复
texture.wrapS = THREE.RepeatWrapping;  // S 方向（水平）
texture.wrapT = THREE.RepeatWrapping;  // T 方向（垂直）

// 设置重复次数
texture.repeat.set(4, 4);  // 水平重复 4 次，垂直重复 4 次

// 设置偏移
texture.offset.set(0.5, 0.5);  // 偏移纹理
```

### 纹理过滤

```javascript
// 放大和缩小过滤
texture.magFilter = THREE.LinearFilter;    // 放大时使用的过滤方式
texture.minFilter = THREE.LinearMipmapLinearFilter;  // 缩小时使用的过滤方式

// 纹理映射类型
// WrapS 和 WrapT 的选项：
// THREE.ClampToEdgeWrapping - 边缘拉伸
// THREE.RepeatWrapping - 重复
// THREE.MirroredRepeatWrapping - 镜像重复
```

### 旋转和中心点

```javascript
// 旋转纹理（弧度）
texture.rotation = Math.PI / 4;  // 旋转 45 度

// 设置旋转中心点（默认为 (0.5, 0.5) - 中心）
texture.center.set(0.5, 0.5);
```

## 🧩 纹理类型

### 颜色贴图 (Color Map)

最基本的颜色纹理：

```javascript
const colorTexture = textureLoader.load('path/to/diffuse-map.jpg');
const material = new THREE.MeshStandardMaterial({
    map: colorTexture
});
```

### 法线贴图 (Normal Map)

用于模拟表面细节：

```javascript
const normalTexture = textureLoader.load('path/to/normal-map.jpg');
const material = new THREE.MeshStandardMaterial({
    normalMap: normalTexture
});
```

### 凹凸贴图 (Bump Map)

模拟表面高度变化：

```javascript
const bumpTexture = textureLoader.load('path/to/bump-map.jpg');
const material = new THREE.MeshStandardMaterial({
    bumpMap: bumpTexture,
    bumpScale: 0.05  // 凹凸强度
});
```

### 位移贴图 (Displacement Map)

实际改变几何体顶点位置：

```javascript
const displacementTexture = textureLoader.load('path/to/displacement-map.jpg');
const material = new THREE.MeshStandardMaterial({
    displacementMap: displacementTexture,
    displacementScale: 0.1,  // 位移强度
    displacementBias: 0      // 位移偏移
});

// 注意：使用位移贴图时，可能需要细分几何体以获得更多顶点
const geometry = new THREE.PlaneGeometry(10, 10, 128, 128); // 更多分段
```

### 粗糙度和金属度贴图

PBR 材质的物理属性贴图：

```javascript
const roughnessTexture = textureLoader.load('path/to/roughness-map.jpg');
const metalnessTexture = textureLoader.load('path/to/metalness-map.jpg');

const material = new THREE.MeshStandardMaterial({
    roughnessMap: roughnessTexture,
    metalnessMap: metalnessTexture
});
```

## 🔁 异步纹理加载

### 使用 Promise

```javascript
const textureLoader = new THREE.TextureLoader();

// 使用 Promise 处理纹理加载
textureLoader.loadAsync('path/to/texture.jpg')
    .then(texture => {
        // 纹理加载完成后执行
        const material = new THREE.MeshStandardMaterial({
            map: texture
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    })
    .catch(error => {
        console.error('纹理加载失败:', error);
    });
```

### 加载多张纹理

```javascript
// 同时加载多张纹理
Promise.all([
    textureLoader.loadAsync('path/to/color.jpg'),
    textureLoader.loadAsync('path/to/normal.jpg'),
    textureLoader.loadAsync('path/to/roughness.jpg')
])
.then(textures => {
    const [colorMap, normalMap, roughnessMap] = textures;
    
    const material = new THREE.MeshStandardMaterial({
        map: colorMap,
        normalMap: normalMap,
        roughnessMap: roughnessMap
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
});
```

## 🔄 动态纹理更新

### 更新纹理图像

```javascript
// 创建一个 canvas 纹理以实现动态更新
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const context = canvas.getContext('2d');

// 创建纹理
const dynamicTexture = new THREE.CanvasTexture(canvas);

// 在动画循环中更新纹理
function animate() {
    requestAnimationFrame(animate);
    
    // 更新 canvas 内容
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制动态内容（例如：旋转的图案）
    const time = Date.now() * 0.001;
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(time);
    context.fillStyle = '#ff0000';
    context.fillRect(-20, -20, 40, 40);
    context.restore();
    
    // 标记纹理需要更新
    dynamicTexture.needsUpdate = true;
    
    renderer.render(scene, camera);
}
```

### 视频纹理

```javascript
// 创建视频纹理
const video = document.createElement('video');
video.src = 'path/to/video.mp4';
video.loop = true;
video.muted = true; // 避免音频问题

// 创建视频纹理
const videoTexture = new THREE.VideoTexture(video);

// 播放视频
video.play();

const material = new THREE.MeshStandardMaterial({
    map: videoTexture
});

// 在动画循环中，视频会自动更新
```

## 🚨 纹理性能考虑

### 纹理尺寸优化

```javascript
// 使用 2 的幂次尺寸以获得最佳性能
// 256x256, 512x512, 1024x1024, 2048x2048 等
const texture = textureLoader.load('path/to/texture.jpg');

// 如果纹理不是 2 的幂次，Three.js 会自动调整（可能导致质量损失）
```

### 纹理压缩

```javascript
// 在生产环境中使用压缩纹理
// DDS, PVR, KTX 等格式
// 或使用多种格式以适应不同设备
```

### 内存管理

```javascript
// 使用完毕后释放纹理内存
function cleanupTexture(texture) {
    texture.dispose();
}
```

### 纹理加载管理

```javascript
// 使用管理器跟踪加载进度
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log('开始加载');
};
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`加载进度: ${itemsLoaded}/${itemsTotal}`);
};
loadingManager.onLoad = () => {
    console.log('所有资源加载完成');
};

const textureLoader = new THREE.TextureLoader(loadingManager);
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
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader();

// 加载多种类型的纹理
Promise.all([
    textureLoader.loadAsync('https://threejs.org/examples/textures/hardwood2_diffuse.jpg'),
    textureLoader.loadAsync('https://threejs.org/examples/textures/hardwood2_normal.jpg'),
    textureLoader.loadAsync('https://threejs.org/examples/textures/hardwood2_roughness.jpg')
])
.then(textures => {
    const [colorMap, normalMap, roughnessMap] = textures;
    
    // 设置纹理属性
    colorMap.wrapS = THREE.RepeatWrapping;
    colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.repeat.set(4, 4);
    
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(4, 4);
    
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(4, 4);
    
    // 创建带纹理的材质
    const material = new THREE.MeshStandardMaterial({
        map: colorMap,
        normalMap: normalMap,
        roughnessMap: roughnessMap,
        roughness: 0.5,
        metalness: 0.1
    });
    
    // 创建几何体和网格
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    
    // 创建一个平面来展示纹理的重复效果
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: colorMap,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true;
    scene.add(plane);
    
    // 渲染循环
    function animate() {
        requestAnimationFrame(animate);
        
        // 旋转立方体展示纹理
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
})
.catch(error => {
    console.error('纹理加载失败:', error);
    
    // 加载失败时的回退方案
    const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const mesh = new THREE.Mesh(geometry, fallbackMaterial);
    mesh.castShadow = true;
    scene.add(mesh);
    
    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    
    animate();
});

// 处理窗口大小变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
```

## 🔜 下一步

学习完纹理基础后，您可以继续了解：
- [阴影 (Shadow)](../threejs/shadow) - 学习如何优化和配置阴影效果
- [动画 (Animation)](../threejs/animation) - 学习如何为场景制作动画
- [加载器 (Loader)](../threejs/loader) - 学习如何加载外部模型和资源