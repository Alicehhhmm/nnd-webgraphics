# Three.js 基础 - 动画 (Animation)

## 🎞️ 什么是动画 (Animation)？

在 Three.js 中，动画 (Animation) 是通过随时间改变对象的属性（如位置、旋转、缩放、颜色等）来创建动态效果的技术。动画是使 3D 场景更加生动和交互的关键组件。

## 🏗️ 基础动画循环

### 使用 requestAnimationFrame

最基础的动画实现方式：

```javascript
import * as THREE from 'three';

// 基础动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 更新动画
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // 渲染场景
    renderer.render(scene, camera);
}

animate();
```

### 组织动画代码

```javascript
// 将动画逻辑组织到对象中
const animationManager = {
    objects: [], // 要动画的对象列表
    
    add: function(object) {
        this.objects.push(object);
    },
    
    update: function(deltaTime) {
        this.objects.forEach(obj => {
            // 更新每个对象的动画
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
        });
    }
};

// 动画循环
let lastTime = 0;
function animate(time) {
    requestAnimationFrame(animate);
    
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;
    
    animationManager.update(deltaTime);
    
    renderer.render(scene, camera);
}

animate();
```

## ⚙️ 对象属性动画

### 旋转动画

```javascript
// 简单旋转
function rotateObject(object, speed) {
    object.rotation.x += speed.x;
    object.rotation.y += speed.y;
    object.rotation.z += speed.z;
}

// 使用时间基础的旋转（保持一致的速度）
function rotateObjectTimeBased(object, speed, deltaTime) {
    object.rotation.x += speed.x * deltaTime;
    object.rotation.y += speed.y * deltaTime;
    object.rotation.z += speed.z * deltaTime;
}

// 示例
const rotationSpeed = { x: 0.5, y: 1.0, z: 0.2 };
const deltaTime = 0.016; // 约 60fps
rotateObjectTimeBased(cube, rotationSpeed, deltaTime);
```

### 位置动画

```javascript
// 简单位移
cube.position.x += 0.01;

// 基于时间的位移
const moveSpeed = 2; // 单位/秒
cube.position.x += moveSpeed * deltaTime;

// 使用向量进行移动
const direction = new THREE.Vector3(1, 0, 0).normalize();
const velocity = direction.clone().multiplyScalar(moveSpeed);
cube.position.add(velocity.clone().multiplyScalar(deltaTime));
```

### 缩放动画

```javascript
// 统一缩放
const scaleSpeed = 0.5;
cube.scale.x += scaleSpeed * deltaTime;
cube.scale.y += scaleSpeed * deltaTime;
cube.scale.z += scaleSpeed * deltaTime;

// 限制缩放范围
cube.scale.clamp(new THREE.Vector3(0.5, 0.5, 0.5), new THREE.Vector3(2, 2, 2));
```

## 📈 高级动画技术

### 使用数学函数创建动画

```javascript
// 正弦波动画
function sineWaveAnimation(object, amplitude, frequency, time) {
    object.position.y = Math.sin(time * frequency) * amplitude;
}

// 圆周运动
function circularMotion(object, radius, speed, time) {
    object.position.x = Math.cos(time * speed) * radius;
    object.position.z = Math.sin(time * speed) * radius;
}

// 示例：多个物体的复杂动画
function complexAnimation() {
    const time = Date.now() * 0.001;
    
    // 物体 1：上下摆动
    objects[0].position.y = Math.sin(time) * 0.5;
    objects[0].rotation.z = Math.sin(time) * 0.2;
    
    // 物体 2：圆周运动
    objects[1].position.x = Math.cos(time * 0.7) * 2;
    objects[1].position.z = Math.sin(time * 0.7) * 2;
    
    // 物体 3：脉冲缩放
    const scale = 1 + Math.sin(time * 2) * 0.3;
    objects[2].scale.setScalar(scale);
}
```

### 插值动画

```javascript
// 线性插值 (Lerp)
function lerpAnimation(current, target, factor) {
    return current + (target - current) * factor;
}

// 向量插值
const startPosition = new THREE.Vector3(0, 0, 0);
const endPosition = new THREE.Vector3(5, 0, 5);
const tempPosition = new THREE.Vector3();

// 平滑移动到目标位置
const lerpFactor = 0.05; // 插值因子，控制平滑度
tempPosition.lerpVectors(startPosition, endPosition, lerpFactor);
cube.position.copy(tempPosition);

// 四元数插值（用于平滑旋转）
const startRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
const endRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0));
const currentRotation = new THREE.Quaternion();

// 平滑旋转
currentRotation.slerpQuaternions(startRotation, endRotation, lerpFactor);
cube.quaternion.copy(currentRotation);
```

## 🎨 使用 Three.js 内置动画系统

### AnimationMixer

Three.js 提供了强大的内置动画系统：

```javascript
// 创建动画混合器
const mixer = new THREE.AnimationMixer(scene);

// 假设我们有一个带骨骼动画的模型
const model = scene.getObjectByName('character');
const modelMixer = new THREE.AnimationMixer(model);

// 播放动画
let action;
if (animations && animations.length > 0) {
    action = modelMixer.clipAction(animations[0]);
    action.play();
}

// 在动画循环中更新混合器
function animate(time) {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta(); // 使用 Three.js 时钟
    
    // 更新所有混合器
    if (mixer) mixer.update(delta);
    if (modelMixer) modelMixer.update(delta);
    
    renderer.render(scene, camera);
}
```

### 创建关键帧动画

```javascript
// 创建关键帧动画轨道
const positionTrack = new THREE.VectorKeyframeTrack(
    'cube.position',  // 属性路径
    [0, 1, 2],        // 时间数组（秒）
    [0, 0, 0, 5, 0, 0, 0, 0, 0] // 值数组 [x1, y1, z1, x2, y2, z2, ...]
);

// 创建颜色动画轨道
const colorTrack = new THREE.ColorKeyframeTrack(
    'cube.material.color',
    [0, 2],
    [1, 0, 0, 0, 1, 0] // 从红色到绿色
);

// 创建动画剪辑
const clip = new THREE.AnimationClip('moveAndColor', 2, [positionTrack, colorTrack]);

// 创建动画动作
const mixer = new THREE.AnimationMixer(cube);
const action = mixer.clipAction(clip);
action.play();

// 在动画循环中更新
function animate(time) {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    mixer.update(delta);
    
    renderer.render(scene, camera);
}
```

## 🖱️ 交互式动画

### 响应用户输入

```javascript
// 鼠标交互动画
const onMouseMove = (event) => {
    // 计算鼠标位置在场景中的对应位置
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // 选择被鼠标悬停的物体
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
        // 高亮悬停的物体
        if (hoveredObject !== intersects[0].object) {
            if (hoveredObject) hoveredObject.scale.set(1, 1, 1); // 恢复原大小
            hoveredObject = intersects[0].object;
            hoveredObject.scale.set(1.2, 1.2, 1.2); // 放大
        }
    } else {
        if (hoveredObject) {
            hoveredObject.scale.set(1, 1, 1); // 恢复原大小
            hoveredObject = null;
        }
    }
};

window.addEventListener('mousemove', onMouseMove);
```

### 点击动画

```javascript
const onClick = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        // 切换旋转状态
        if (!object.userData.isRotating) {
            object.userData.isRotating = true;
            object.userData.rotationSpeed = new THREE.Vector3(0.1, 0.2, 0.05);
        } else {
            object.userData.isRotating = false;
        }
    }
};

window.addEventListener('click', onClick);

// 在动画循环中处理点击动画
function animate() {
    requestAnimationFrame(animate);
    
    // 更新所有带旋转状态的物体
    scene.traverse(object => {
        if (object.userData && object.userData.isRotating) {
            object.rotation.x += object.userData.rotationSpeed.x;
            object.rotation.y += object.userData.rotationSpeed.y;
            object.rotation.z += object.userData.rotationSpeed.z;
        }
    });
    
    renderer.render(scene, camera);
}
```

## ⚡ 性能优化

### 动画性能考虑

```javascript
// 避免在动画循环中创建新对象
// ❌ 错误做法
function animate() {
    const tempVector = new THREE.Vector3(); // 每帧创建新对象
    tempVector.copy(cube.position);
    // ...
}

// ✅ 正确做法
const tempVector = new THREE.Vector3(); // 在循环外创建
const targetPosition = new THREE.Vector3(5, 0, 0);

function animate() {
    tempVector.lerpVectors(cube.position, targetPosition, 0.05);
    cube.position.copy(tempVector);
}
```

### 控制动画帧率

```javascript
// 限制动画帧率以节省 CPU
let lastFrameTime = 0;
const targetFrameTime = 1000 / 30; // 30 FPS

function animate(currentTime) {
    if (currentTime - lastFrameTime >= targetFrameTime) {
        lastFrameTime = currentTime;
        
        // 执行动画更新
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    
    requestAnimationFrame(animate);
}
```

### 使用对象池

```javascript
// 对于大量相似的动画对象，使用对象池
class AnimationObjectPool {
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
```

## 📸 完整示例

```javascript
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 8, 8);
camera.lookAt(0, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// 光源设置
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// 创建多个几何体用于动画演示
const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.7, 16, 16),
    new THREE.ConeGeometry(0.6, 1.2, 8),
    new THREE.TorusGeometry(0.8, 0.3, 16, 100)
];

const materials = [
    new THREE.MeshStandardMaterial({ color: 0x00aaff, roughness: 0.3, metalness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5, metalness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.8, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0xff00ff, roughness: 0.2, metalness: 0.9 })
];

const objects = [];
geometries.forEach((geometry, index) => {
    const material = materials[index];
    const mesh = new THREE.Mesh(geometry, material);
    
    // 设置初始位置
    const radius = 4;
    const angle = (index / geometries.length) * Math.PI * 2;
    mesh.position.x = Math.cos(angle) * radius;
    mesh.position.z = Math.sin(angle) * radius;
    mesh.position.y = 0.5;
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // 添加动画数据
    mesh.userData = {
        originalY: mesh.position.y,
        rotationSpeed: new THREE.Vector3(
            Math.random() * 0.02,
            Math.random() * 0.02,
            Math.random() * 0.02
        ),
        orbitRadius: radius,
        orbitAngle: angle,
        orbitSpeed: 0.2 + Math.random() * 0.3
    };
    
    scene.add(mesh);
    objects.push(mesh);
});

// 地面
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

// 时钟用于计算 delta time
const clock = new THREE.Clock();

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    
    // 更新所有物体的动画
    objects.forEach((mesh, index) => {
        const data = mesh.userData;
        
        // 旋转动画
        mesh.rotation.x += data.rotationSpeed.x;
        mesh.rotation.y += data.rotationSpeed.y;
        mesh.rotation.z += data.rotationSpeed.z;
        
        // 轨道运动
        data.orbitAngle += data.orbitSpeed * delta;
        mesh.position.x = Math.cos(data.orbitAngle) * data.orbitRadius;
        mesh.position.z = Math.sin(data.orbitAngle) * data.orbitRadius;
        
        // 垂直波动
        mesh.position.y = data.originalY + Math.sin(time * 2 + index) * 0.3;
        
        // 脉冲缩放
        const scale = 1 + Math.sin(time * 3 + index) * 0.1;
        mesh.scale.setScalar(scale);
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

## 🔜 下一步

学习完动画基础后，您可以继续了解：
- [加载器 (Loader)](../threejs/loader) - 学习如何加载外部模型和资源
- [粒子系统 (Particle System)](../threejs/particle-system) - 学习如何创建粒子效果
- [物理引擎 (Physics)](../threejs/physics) - 学习如何添加物理效果