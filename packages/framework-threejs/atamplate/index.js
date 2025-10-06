import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const {
  Scene,
  Camera,
  Mesh,
  AxesHelper,
  BoxGeometry,
  BufferGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  WebGL1Renderer,
} = THREE

/**
 * @description 全局自定义属性
 * @param {canvas}|渲染画布
 * @param {sizes}|浏览器可视宽高
 */
const canvas = document.querySelector('#app')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * @description [核心1]
 * @param {Scene} |场景
 */
const scene = new Scene({ color: 0x444444 })

/**
 * @description [核心2]
 * @param {Camera} |摄像机
 * @param {CubeCamera} |立方相机
 * @param {ArrayCamera} |摄像机阵列（VR）
 * @param {StereoCamera} |双透视摄像机（3D影像/视差屏障）
 * @param {PerspectiveCamera} |透视摄像机（3D人眼）
 * @param {OrthographicCamera} |正交摄像机（2D大小不变）
 */
const camera = new PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(2, 2, 3)
scene.add(camera)

/**
 * @description 辅助工具
 * @param {AxesHelper} |坐标轴
 * @param {AxesHelper} |仪表栏目
 */
const axesHelper = new AxesHelper(4)
scene.add(axesHelper)

/**
 * @description 物体
 * @param {BoxGeometry} |正方体
 * @param {BufferGeometry} |缓冲正方体（提高渲染性能）
 * @param {MeshBasicMaterial} |基础网格材质
 */
const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshBasicMaterial({ color: 0xffc600, opacity: 1 })
const mesh = new Mesh(geometry, material)
scene.add(mesh)

/**
 * @description [核心3]
 * @param {WebGLRenderer} |渲染器
 * @param {antialias:false}|平滑度
 * @method setPixelRatio |设备像素
 */
const renderer = new WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
canvas.appendChild(renderer.domElement)

/**
 * @description [交互]
 * @param {controls}|鼠标控制器
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false

/**
 * @description [性能]
 * @param {requestAnimationFrame} |帧动画
 */
function animate() {
  requestAnimationFrame(animate)
  // update objects

  // required if controls.enableDamping or controls.autoRotate are set to true
  // controls.update()
  renderer.render(scene, camera)
}

/**
 * @description [响应监听]
 * @param |画布自适应浏览器
 */
window.addEventListener(
  'resize',
  function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  false,
)

export default animate
