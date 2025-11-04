# Three.js 基础 - 加载器 (Loader)

## 📦 什么是加载器 (Loader)？

在 Three.js 中，加载器 (Loader) 用于从外部文件加载各种资源，如 3D 模型、纹理、音频、视频等。加载器是连接外部资源和 Three.js 场景的重要桥梁，使您能够使用预先创建的复杂模型和资源。

## 🏗️ 基础加载概念

### 加载器类型

Three.js 提供了多种专门的加载器：

- `TextureLoader` - 纹理图像加载
- `GLTFLoader` - GLTF/GLB 3D 模型格式
- `OBJLoader` - OBJ 3D 模型格式
- `FBXLoader` - FBX 3D 模型格式
- `PLYLoader` - PLY 3D 模型格式
- `AudioLoader` - 音频文件加载

## 🖼️ 纹理加载器 (TextureLoader)

### 基础用法

```javascript
import * as THREE from 'three';

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader();

// 加载纹理
const texture = textureLoader.load(
    'path/to/texture.jpg',
    // 加载成功回调（可选）
    (loadedTexture) => {
        console.log('纹理加载成功');
    },
    // 加载进度回调（可选）
    (progress) => {
        console.log('加载进度:', (progress.loaded / progress.total) * 100 + '%');
    },
    // 加载失败回调（可选）
    (error) => {
        console.error('纹理加载失败:', error);
    }
);

// 应用纹理到材质
const material = new THREE.MeshStandardMaterial({ map: texture });
```

### 高级纹理加载

```javascript
// 加载多种类型的纹理
const textureLoader = new THREE.TextureLoader();

// 颜色贴图
const colorTexture = textureLoader.load('path/to/diffuse.jpg');

// 法线贴图
const normalTexture = textureLoader.load('path/to/normal.jpg');

// 粗糙度贴图
const roughnessTexture = textureLoader.load('path/to/roughness.jpg');

// 金属度贴图
const metalnessTexture = textureLoader.load('path/to/metalness.jpg');

// 创建带多纹理的材质
const material = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    metalnessMap: metalnessTexture
});
```

## 🏗️ 3D 模型加载器

### GLTF/GLB 加载器

GLTF (GL Transmission Format) 是 WebGL、OpenGL ES 和 OpenGL 的 3D 场景和对象的标准格式。

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 创建 GLTF 加载器
const loader = new GLTFLoader();

// 加载 GLTF 模型
loader.load(
    'path/to/model.gltf',  // 模型路径
    
    // 加载成功回调
    (gltf) => {
        console.log('GLTF 模型加载成功:', gltf);
        
        // 将模型添加到场景
        scene.add(gltf.scene);
        
        // 访问模型中的特定对象
        const model = gltf.scene;
        const animations = gltf.animations;
        
        // 如果有动画，可以设置动画混合器
        if (animations && animations.length) {
            const mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(animations[0]);
            action.play();
        }
    },
    
    // 加载进度回调
    (progress) => {
        console.log('模型加载进度:', (progress.loaded / progress.total) * 100 + '%');
    },
    
    // 加载失败回调
    (error) => {
        console.error('GLTF 模型加载失败:', error);
    }
);
```

### OBJ/MTL 加载器

```javascript
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

// 首先加载材质
const mtlLoader = new MTLLoader();
mtlLoader.load('path/to/materials.mtl', 
    // 材质加载成功
    (materials) => {
        // 应用材质到 OBJ 加载器
        materials.preload();
        
        // 创建 OBJ 加载器
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        
        // 加载 OBJ 模型
        objLoader.load(
            'path/to/model.obj',
            (object) => {
                // 模型加载成功
                scene.add(object);
            },
            (progress) => {
                console.log('OBJ 加载进度:', (progress.loaded / progress.total) * 100 + '%');
            },
            (error) => {
                console.error('OBJ 模型加载失败:', error);
            }
        );
    },
    // MTL 加载进度
    (progress) => {
        console.log('材质加载进度:', (progress.loaded / progress.total) * 100 + '%');
    },
    // MTL 加载失败
    (error) => {
        console.error('MTL 材质加载失败:', error);
    }
);
```

### FBX 加载器

```javascript
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const fbxLoader = new FBXLoader();

fbxLoader.load(
    'path/to/model.fbx',
    (object) => {
        // 加载成功
        scene.add(object);
        
        // FBX 模型通常包含动画
        const mixer = new THREE.AnimationMixer(object);
        const action = mixer.clipAction(object.animations[0]);
        action.play();
    },
    (progress) => {
        // 加载进度
        console.log('FBX 加载进度:', (progress.loaded / progress.total) * 100 + '%');
    },
    (error) => {
        // 加载失败
        console.error('FBX 模型加载失败:', error);
    }
);
```

## 🔄 异步加载方法

### 使用 Promise

```javascript
// 使用 Promise 处理加载
const textureLoader = new THREE.TextureLoader();

textureLoader.loadAsync('path/to/texture.jpg')
    .then(texture => {
        console.log('纹理加载成功');
        const material = new THREE.MeshStandardMaterial({ map: texture });
        // 继续处理...
    })
    .catch(error => {
        console.error('纹理加载失败:', error);
    });

// GLTF 加载器的 Promise 版本
const loader = new GLTFLoader();
loader.loadAsync('path/to/model.gltf')
    .then(gltf => {
        console.log('模型加载成功');
        scene.add(gltf.scene);
    })
    .catch(error => {
        console.error('模型加载失败:', error);
    });
```

### 同时加载多个资源

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

// 同时加载多个资源
Promise.all([
    textureLoader.loadAsync('path/to/texture1.jpg'),
    textureLoader.loadAsync('path/to/texture2.jpg'),
    gltfLoader.loadAsync('path/to/model.gltf'),
    fetch('path/to/data.json').then(r => r.json()) // 其他资源
])
.then(resources => {
    const [texture1, texture2, gltfModel, jsonData] = resources;
    
    // 所有资源加载完成，可以开始构建场景
    console.log('所有资源加载完成');
    
    // 应用纹理到材质
    const material1 = new THREE.MeshStandardMaterial({ map: texture1 });
    const material2 = new THREE.MeshStandardMaterial({ map: texture2 });
    
    // 添加模型到场景
    scene.add(gltfModel.scene);
    
    // 使用其他数据
    console.log('配置数据:', jsonData);
})
.catch(error => {
    console.error('资源加载失败:', error);
});
```

## 📊 加载管理器 (LoadingManager)

加载管理器可以跟踪所有加载操作并提供统一的回调：

```javascript
// 创建加载管理器
const loadingManager = new THREE.LoadingManager();

// 设置回调
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log('开始加载:', url);
    console.log(`已加载 ${itemsLoaded}/${itemsTotal}`);
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`加载进度 ${url}: ${itemsLoaded}/${itemsTotal}`);
    // 更新进度条 UI
    updateProgressBar(itemsLoaded / itemsTotal);
};

loadingManager.onLoad = () => {
    console.log('所有资源加载完成！');
    // 隐藏加载界面，开始场景
    hideLoadingScreen();
    startScene();
};

loadingManager.onError = (url) => {
    console.error('加载错误:', url);
};

// 将管理器传递给加载器
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);

// 使用这些加载器加载资源
const texture = textureLoader.load('path/to/texture.jpg');
const model = gltfLoader.load('path/to/model.gltf');
```

## ⚙️ 加载器配置

### 纹理加载器配置

```javascript
const textureLoader = new THREE.TextureLoader();

// 设置跨域策略（如果需要）
textureLoader.setCrossOrigin('anonymous');

// 设置纹理路径前缀
textureLoader.setPath('assets/textures/');

// 加载纹理
const texture = textureLoader.load('diffuse.jpg'); // 实际加载 assets/textures/diffuse.jpg
```

### GLTF 加载器配置

```javascript
const loader = new GLTFLoader();

// 设置 DRACO 压缩解码器路径（用于压缩模型）
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('path/to/draco/'); // DRACO 解码器文件位置
loader.setDRACOLoader(dracoLoader);

// 加载压缩模型
loader.load('compressed-model.glb', (gltf) => {
    scene.add(gltf.scene);
});
```

## 🚨 加载错误处理

### 基础错误处理

```javascript
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// 加载纹理时的错误处理
const texture = textureLoader.load(
    'path/to/texture.jpg',
    (tex) => {
        console.log('纹理加载成功');
    },
    undefined, // 进度回调
    (error) => {
        console.error('纹理加载失败:', error);
        // 提供默认纹理
        material.map = getDefaultTexture();
    }
);

// 加载模型时的错误处理
loader.load(
    'path/to/model.gltf',
    (gltf) => {
        scene.add(gltf.scene);
    },
    undefined, // 进度回调
    (error) => {
        console.error('模型加载失败:', error);
        // 创建默认几何体作为回退
        const defaultGeometry = new THREE.BoxGeometry();
        const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const defaultMesh = new THREE.Mesh(defaultGeometry, defaultMaterial);
        scene.add(defaultMesh);
    }
);
```

### 重试机制

```javascript
function loadTextureWithRetry(url, maxRetries = 3) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        function attemptLoad() {
            attempts++;
            const texture = textureLoader.load(
                url,
                resolve, // 成功回调
                undefined, // 进度回调
                (error) => {
                    if (attempts < maxRetries) {
                        console.warn(`纹理加载失败，第 ${attempts} 次重试...`);
                        setTimeout(attemptLoad, 1000); // 1秒后重试
                    } else {
                        reject(error);
                    }
                }
            );
        }
        
        attemptLoad();
    });
}

// 使用重试机制加载纹理
loadTextureWithRetry('path/to/texture.jpg')
    .then(texture => {
        console.log('纹理加载成功');
        // 使用纹理...
    })
    .catch(error => {
        console.error('纹理加载失败，已达到最大重试次数:', error);
    });
```

## 📱 移动端优化

```javascript
// 根据设备性能调整加载策略
function getOptimalLoaderOptions() {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        return {
            useCompressedTextures: true,
            preferSimplifiedModels: true,
            lowerLOD: true
        };
    }
    
    return {
        useCompressedTextures: false,
        preferSimplifiedModels: false,
        lowerLOD: false
    };
}

const options = getOptimalLoaderOptions();

// 使用适当的模型版本
const modelPath = options.preferSimplifiedModels ? 
    'path/to/model-lowpoly.gltf' : 
    'path/to/model-full.gltf';

loader.load(modelPath, (gltf) => {
    scene.add(gltf.scene);
});
```

## 📸 完整示例

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; // 更真实的光照
renderer.toneMappingExposure = 1;
document.body.appendChild(renderer.domElement);

// 创建加载管理器
const loadingManager = new THREE.LoadingManager();

// 加载进度跟踪
let progress = 0;
const totalToLoad = 4; // 预期加载的资源数量

loadingManager.onProgress = (url, loaded, total) => {
    progress = (loaded / total) * 100;
    console.log(`加载进度: ${Math.round(progress)}%`);
};

loadingManager.onLoad = () => {
    console.log('所有资源加载完成！');
    startMainLoop();
};

// 创建各种加载器
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);

// 加载 HDR 环境贴图
const hdrLoader = new RGBELoader(loadingManager);
hdrLoader.load('https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});

// 加载纹理
const colorTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
const normalTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_normal.jpg');
const roughnessTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_roughness.jpg');

// 设置纹理属性
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;
colorTexture.repeat.set(4, 4);

// 加载 3D 模型
gltfLoader.load(
    'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.y = 1;
        scene.add(model);
        
        // 为模型添加阴影
        model.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
);

// 添加基础光照
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// 创建地面
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    map: colorTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    metalness: 0
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(plane);

// 动画循环
let mixer = null;
let clock = new THREE.Clock();

function startMainLoop() {
    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        // 更新动画（如果存在）
        if (mixer) {
            mixer.update(delta);
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// 处理窗口大小变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
```

## 🔜 下一步

学习完加载器基础后，您可以继续了解：
- [粒子系统 (Particle System)](../threejs/particle-system) - 学习如何创建粒子效果
- [物理引擎 (Physics)](../threejs/physics) - 学习如何添加物理效果
- [后期处理 (Post-processing)](../threejs/post-processing) - 学习如何添加视觉效果