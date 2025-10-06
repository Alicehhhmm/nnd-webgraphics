import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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
 * @ MeshBasicMaterial |基础网格材质属性
 * @ BufferGeometry|缓冲（矩阵顶点三元组）|x,y,z|x,y,z|
 * ----------------------------------------------------------------
 * wireframe |显示线框
 * ----------------------------------------------------------------
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const geometry = new THREE.BufferGeometry()
// const vertices = new Float32Array([
//   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
//   1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
// ])
// geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))

const count = 500
const positionsArray = new Float32Array(count * 3 * 3)
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random()
}
geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))

const material = new THREE.MeshBasicMaterial({
  color: 0x32b67a,
  wireframe: true,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/** Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000)
camera.position.set(1, 3, 3)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
canvas.appendChild(renderer.domElement)

/** Controls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/** Screen resize
 */
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/** Fullscreen resize
 */
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

/** initialization && Animations
 */
function animate() {
  // update controls
  controls.update()

  // update Renderer
  renderer.render(scene, camera)

  // update frame animation
  window.requestAnimationFrame(animate)
}

export default animate
