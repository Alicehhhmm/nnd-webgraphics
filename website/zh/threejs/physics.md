# Three.js 进阶 - 物理引擎 (Physics)

## ⚡ 什么是物理引擎 (Physics Engine)？

物理引擎 (Physics Engine) 是模拟真实物理世界行为的系统，包括重力、碰撞、摩擦力、弹性等物理效果。在 Three.js 中集成物理引擎可以让 3D 场景中的物体表现得更真实。

## 🏗️ 常用物理引擎库

### Cannon.js
Cannon.js 是一个功能丰富的 3D 物理引擎，与 Three.js 集成良好。

### Ammo.js
基于 Bullet 物理库的 JavaScript 版本，功能强大但文件较大。

### Matter.js
主要用于 2D 物理模拟，但也可以用于简单的 3D 效果。

## 🚀 集成 Cannon.js

### 安装和引入

```bash
npm install cannon
# 或
npm install @cannon-js/client
```

```javascript
import * as THREE from 'three';
import * as CANNON from 'cannon';
```

### 基础物理世界设置

```javascript
// 创建物理世界
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // 设置重力 (m/s²)
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10; // 求解器迭代次数

// 创建地面物理体
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({ mass: 0 }); // 质量为 0 表示静止
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0), 
    -Math.PI / 2
); // 旋转平面使其朝上
world.addBody(groundBody);
```

## 🧱 物理形状与刚体

### 基础形状

```javascript
// 球体形状
const sphereShape = new CANNON.Sphere(1); // 半径为 1
const sphereBody = new CANNON.Body({
    mass: 5, // 质量
    position: new CANNON.Vec3(0, 10, 0) // 初始位置
});
sphereBody.addShape(sphereShape);
world.addBody(sphereBody);

// 盒子形状
const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)); // 1x1x1 的盒子
const boxBody = new CANNON.Body({
    mass: 10,
    position: new CANNON.Vec3(0, 15, 0)
});
boxBody.addShape(boxShape);
world.addBody(boxBody);

// 圆柱体形状
const cylinderShape = new CANNON.Cylinder(1, 1, 2, 16); // 上下底面半径，高度，分段数
const cylinderBody = new CANNON.Body({
    mass: 8,
    position: new CANNON.Vec3(2, 12, 0)
});
cylinderBody.addShape(cylinderShape);
world.addBody(cylinderBody);
```

### 物理材质

```javascript
// 创建物理材质
const groundMaterial = new CANNON.Material('groundMaterial');
const sphereMaterial = new CANNON.Material('sphereMaterial');

// 创建接触材质（定义两个材质接触时的物理行为）
const groundSphereContactMaterial = new CANNON.ContactMaterial(
    groundMaterial,
    sphereMaterial,
    {
        friction: 0.1,   // 摩擦系数
        restitution: 0.3 // 弹性系数 (0 = 完全不弹，1 = 完全弹性)
    }
);

// 将接触材质添加到世界
world.addContactMaterial(groundSphereContactMaterial);

// 将材质应用到物理体
groundBody.material = groundMaterial;
sphereBody.material = sphereMaterial;
```

## 🔄 同步 Three.js 和物理世界

### 创建视觉对象与物理体的链接

```javascript
// 创建 Three.js 可视化对象
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x00aaff });
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

// 同步函数：将物理体的位置和旋转同步到 Three.js 对象
function syncMeshWithPhysics(mesh, body) {
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
}

// 在动画循环中同步
function animate() {
    requestAnimationFrame(animate);
    
    // 更新物理世界 (1/60 秒的时间步长)
    world.step(1/60);
    
    // 同步所有对象
    syncMeshWithPhysics(sphereMesh, sphereBody);
    
    renderer.render(scene, camera);
}
```

### 批量同步

```javascript
// 创建对象数组来管理同步
const objects = [];

// 添加物理对象
function addPhysicalObject(shape, mass, position, mesh) {
    const body = new CANNON.Body({ mass: mass });
    body.addShape(shape);
    body.position.copy(position);
    world.addBody(body);
    
    objects.push({
        mesh: mesh,
        body: body
    });
    
    scene.add(mesh);
}

// 批量同步函数
function updatePhysics() {
    world.step(1/60);
    
    objects.forEach(obj => {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
    });
}
```

## 🎯 实际应用示例

### 落球模拟

```javascript
import * as THREE from 'three';
import * as CANNON from 'cannon';

// 场景设置
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88ccff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 物理世界
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// 光照
const ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// 地面
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = 0;
scene.add(groundMesh);

// 物理地面
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

// 创建掉落的球
const balls = [];
const ballRadius = 0.5;

function createBall() {
    // Three.js 网格
    const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(Math.random(), Math.random(), Math.random())
    });
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    
    // 物理体
    const ballShape = new CANNON.Sphere(ballRadius);
    const ballBody = new CANNON.Body({ 
        mass: 1,
        position: new CANNON.Vec3(
            (Math.random() - 0.5) * 10,
            10,
            (Math.random() - 0.5) * 10
        )
    });
    ballBody.addShape(ballShape);
    
    world.addBody(ballBody);
    
    balls.push({
        mesh: ballMesh,
        body: ballBody
    });
    
    scene.add(ballMesh);
}

// 点击创建球
window.addEventListener('click', createBall);

// 添加几个初始球
for (let i = 0; i < 5; i++) {
    setTimeout(createBall, i * 500);
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 更新物理
    world.step(1/60);
    
    // 同步所有球
    balls.forEach(ball => {
        ball.mesh.position.copy(ball.body.position);
        ball.mesh.quaternion.copy(ball.body.quaternion);
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

## ⚙️ 物理参数调优

### 性能优化

```javascript
// 优化物理世界的性能设置
world.broadphase = new CANNON.NaiveBroadphase(); // 或使用 CANNON.GridBroadphase 或 CANNON.SAPBroadphase
world.solver.iterations = 5; // 减少迭代次数提高性能（精度降低）
world.allowSleep = true; // 允许静止物体进入睡眠状态

// 物理体睡眠阈值设置
sphereBody.sleepSpeedLimit = 0.1;  // 速度低于此值时开始考虑睡眠
sphereBody.sleepTimeLimit = 1;     // 持续低于速度阈值的时间后进入睡眠
```

### 碰撞处理

```javascript
// 添加碰撞事件监听
sphereBody.addEventListener('collide', (e) => {
    console.log('球发生了碰撞!', e.contact);
    
    // 可以在这里触发音效、粒子效果或其他游戏逻辑
    const impactForce = e.contact.getImpactVelocityAlongNormal();
    
    if (impactForce > 5) {
        // 碰撞强度大，添加特殊效果
        createImpactEffect(e.contact);
    }
});
```

## 🔧 高级物理概念

### 约束（Constraints）

```javascript
// 距离约束 - 将两个物体保持固定距离
const constraint = new CANNON.DistanceConstraint(
    body1,    // 第一个物理体
    body2,    // 第二个物理体
    distance  // 固定距离
);
world.addConstraint(constraint);

// 球窝关节 - 类似人体关节
const hinge = new CANNON.HingeConstraint(
    body1,
    body2,
    {
        pivotA: new CANNON.Vec3(0, 0, 0), // 第一个物体上的连接点
        pivotB: new CANNON.Vec3(0, 0, 0), // 第二个物体上的连接点
        axisA: new CANNON.Vec3(0, 1, 0),  // 第一个物体上的轴
        axisB: new CANNON.Vec3(0, 1, 0)   // 第二个物体上的轴
    }
);
world.addConstraint(hinge);
```

### 运动控制

```javascript
// 应用力和扭矩
sphereBody.applyForce(
    new CANNON.Vec3(0, 50, 0),       // 力的大小和方向
    new CANNON.Vec3(0, 0, 0)         // 力的作用点（相对于物体中心）
);

// 应加速度（重写当前速度）
sphereBody.velocity.set(0, 0, 0);           // 设置速度
sphereBody.angularVelocity.set(1, 0, 0);    // 设置角速度

// 移除物理体
world.removeBody(sphereBody);
```

## 📸 完整示例

```javascript
import * as THREE from 'three';
import * as CANNON from 'cannon';

// 场景初始化
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88ccff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 物理世界初始化
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;
world.allowSleep = true;

// 光照
const ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 创建地面
const groundGeometry = new THREE.PlaneGeometry(40, 40);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = 0;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// 物理地面
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

// 物理材质
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.3
    }
);
world.addContactMaterial(defaultContactMaterial);

// 物理对象容器
const objects = [];

// 创建多个形状的函数
function addBox(x, y, z) {
    // Three.js 几何体
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        metalness: 0.2,
        roughness: 0.7
    });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    
    // 物理体
    const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    const boxBody = new CANNON.Body({ 
        mass: 5,
        position: new CANNON.Vec3(x, y, z)
    });
    boxBody.addShape(boxShape);
    boxBody.material = defaultMaterial;
    world.addBody(boxBody);
    
    objects.push({ mesh: boxMesh, body: boxBody });
    scene.add(boxMesh);
}

function addSphere(x, y, z) {
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        metalness: 0.5,
        roughness: 0.3
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    
    const sphereShape = new CANNON.Sphere(1);
    const sphereBody = new CANNON.Body({ 
        mass: 3,
        position: new CANNON.Vec3(x, y, z)
    });
    sphereBody.addShape(sphereShape);
    sphereBody.material = defaultMaterial;
    world.addBody(sphereBody);
    
    objects.push({ mesh: sphereMesh, body: sphereBody });
    scene.add(sphereMesh);
}

// 添加一些初始物体
addBox(-5, 10, 0);
addSphere(0, 15, 0);
addBox(5, 20, 0);
addSphere(-2, 25, 2);
addBox(2, 30, -2);

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 更新物理世界
    world.step(1/60);
    
    // 同步所有物体
    objects.forEach(obj => {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
    });
    
    renderer.render(scene, camera);
}

// 点击添加物体
window.addEventListener('click', (event) => {
    const x = (event.clientX / window.innerWidth) * 20 - 10;
    const z = (event.clientY / window.innerHeight) * 20 - 10;
    
    // 随机选择形状
    if (Math.random() > 0.5) {
        addSphere(x, 30, z);
    } else {
        addBox(x, 30, z);
    }
});

// 处理窗口大小变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
```

## 🔜 下一步

学习完物理引擎后，您可以继续了解：
- [后期处理 (Post-processing)](../threejs/post-processing) - 学习如何添加视觉效果
- [性能优化 (Performance Optimization)](../threejs/performance-optimization) - 学习如何优化应用性能