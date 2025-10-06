import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'

// scene
const scene = new THREE.Scene()

// global
const canvas = document.querySelector('#app')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/** Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x32b67a })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 3, 3) //x,y,z
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
canvas.appendChild(renderer.domElement)

// Control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false

// Clock
const clock = new THREE.Clock()

/** initialization && Animations
 * @ 帧动画（一帧刷新60次，1000ms/60 ~16.67ms）
 * @ 将物体的旋转、位移属性添加到帧动画，并通过数学相关线性函数改变物体位置
 * @ lookAt |相机跟随（瞪眼盯着物体移动）
 */
function animate() {
  const elapsedTime = clock.getElapsedTime()

  // update object animations
  mesh.position.x = Math.sin(elapsedTime)
  // mesh.position.y = Math.cos(elapsedTime)
  // mesh.position.z = Math.cos(elapsedTime)
  // camera.lookAt(mesh.position)

  // use GSAP
  // gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

  // update Renderer
  renderer.render(scene, camera)

  // update frame animation
  window.requestAnimationFrame(animate)
}

export default animate
