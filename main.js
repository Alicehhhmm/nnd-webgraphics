// import "./public/style/style.css";
// import { example } from "./pages/index";
// // 渲染画布
// document.querySelector("#app").innerHTML = `${example}`;
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { guis } from "./confige/config-Guis";
const {
  AxesHelper,
  BoxGeometry,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} = THREE;

// 渲染画布
const canvas = document.querySelector("#app");

/**
 * @description function|[public]自定义公共方法
 * @method chooseFromHash |选择哈希渲染值
 */
function chooseFromHash(mesh) {
  const selectedGeometry = window.location.hash.substring(1) || "BoxGeometry";

  if (guis[selectedGeometry] !== undefined) {
    guis[selectedGeometry](mesh);
  }
}

/**
 * @description scene|[核心1]场景
 * @description camera|[核心2]相机
 */
const scene = new Scene({ color: 0x444444 });
const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

/**
 * @description render|[核心3]渲染
 * @param {antialias:false}|平滑度
 * @method setPixelRatio |设备像素
 * @method setSize |渲染尺寸
 */
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
canvas.appendChild(renderer.domElement);

/**
 * @description controls|[public]鼠标控制器
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;

/**
 * @description Axes|[public]坐标轴
 * @param add
 * @param name
 */
const axesHelper = new AxesHelper(4);
scene.add(axesHelper);

/**
 * @description [public]|灯光渲染
 * @type PointLight|点光源
 */
const lights = [];
lights[0] = new PointLight(0xffffff, 1, 0);
lights[1] = new PointLight(0xffffff, 1, 0);
lights[2] = new PointLight(0xffffff, 1, 0);

lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

/**
 * @descript Group|[geometry]几何体打组
 * @method Mesh |网格模式
 * @param lineMaterial |线条材料
 * @param MeshPhongMaterial |镜面高光反射模型（冯氏透明算法）|镜面高光反射光泽表面的材质
 */
const group = new Group();
const geometry = new BufferGeometry(2, 2, 2);
geometry.setAttribute("position", new Float32BufferAttribute([], 3));

const lineMaterial = new LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.5,
});
const meshMaterial = new MeshPhongMaterial({
  color: 0x156289,
  emissive: 0x072534,
  side: DoubleSide,
  flatShading: true,
});

group.add(new LineSegments(geometry, lineMaterial));
group.add(new Mesh(geometry, meshMaterial));

// cube
const cubeGeometry = new BoxGeometry(1, 1, 1);

// const cube = new LineSegments(cubeGeometry, lineMaterial);
const cube = new Mesh(cubeGeometry, meshMaterial);

scene.add(cube);

group.add(new LineSegments(cubeGeometry, lineMaterial));
group.add(new Mesh(cubeGeometry, meshMaterial));
camera.position.set(2, 2, 3);

// 打组物体加入场景
chooseFromHash(group);
scene.add(group);

// 动画
function animate() {
  requestAnimationFrame(animate);

  // update objects
  cube.rotation.x -= 0.005;
  cube.rotation.z -= 0.005;
  group.rotation.x += 0.0005;
  group.rotation.y += 0.0005;

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  renderer.render(scene, camera);
}

// 画布自适应浏览器大小
window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

animate();
