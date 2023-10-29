import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

// scene
const scene = new THREE.Scene()

// global
const canvas = document.querySelector("#app")
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

/** Camera
 */
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  1000
)
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
 * @ setPixelRatio|设置像素比
 * @ updateProjectionMatrix|投影矩阵
 */
window.addEventListener("resize", () => {
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
 * @ dblclick|双击屏幕进入全屏
 * @ 不同浏览器的兼容
 * ----------------------------------------------------------------
 * document.fullscreenElement |标准的全屏模式属性 （Chrome、Firefox、Edge ）
 * document.exitFullscreen |标准的全屏模式退出方法
 * document.webkitFullscreenElement | WebKit 内核的浏览器的全屏模式属性
 * document.webkitExitFullscreen | WebKit 内核的浏览（例如 Safari）全屏模式退出
 * -----------------------------------------------------------------
 */
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement

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
