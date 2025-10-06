import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DragControls } from 'three/addons/controls/DragControls.js'
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { FlyControls } from 'three/addons/controls/FlyControls.js'
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'

// scene
const scene = new THREE.Scene()

// global
const canvas = document.querySelector('#app')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const cursor = { x: 0, y: 0 }
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Mouse cursor
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

/** Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x32b67a })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/** Camera
 * @description [核心2]
 * @param {Camera} |摄像机
 * @param {CubeCamera} |立方相机
 * @param {ArrayCamera} |摄像机阵列（VR）
 * @param {StereoCamera} |双透视摄像机（3D影像/视差屏障）
 * @param {PerspectiveCamera} |透视摄像机（3D人眼）
 * @param {OrthographicCamera} |正交摄像机（2D大小不变）
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000)
camera.position.set(1, 3, 3) //x,y,z
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
canvas.appendChild(renderer.domElement)

/** Controls
 * @ FlyControls |飞行控制器
 * @ DragControls |拖放控制器
 * @ OrbitControls |轨道控制器
 * @ TransformControls |变换控制器
 * @ TrackballControls |轨迹球控制器
 * @ FirstPersonControls |第一人称控制器
 * @ PointerLockControls |指针锁定控制器
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Clock
const clock = new THREE.Clock()

/** initialization && Animations
 * @ 将鼠标坐标点赋给相机的位移坐标，达到鼠标控制相机移动的效果（视觉上感觉是在移动物体本身）
 */
function animate() {
  const elapsedTime = clock.getElapsedTime()

  // update object animations
  // mesh.rotation.y = elapsedTime

  // update camera
  // camera.position.x = cursor.x * 2
  // camera.position.y = cursor.y * 2
  // camera.lookAt(new THREE.Vector3())
  // camera.lookAt(mesh.position)

  // update controls
  controls.update()

  // update Renderer
  renderer.render(scene, camera)

  // update frame animation
  window.requestAnimationFrame(animate)
}

export default animate
