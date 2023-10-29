import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import * as dat from "dat.gui"

// scene
const scene = new THREE.Scene()

// global
const canvas = document.querySelector("#app")
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const parameters = {
  color: 0x32b67a,
  intation: () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
  },
}
const gui = new dat.GUI({ closed: true, width: 260 })
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/** Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: parameters.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/** Camera
 */
const camera = new THREE.PerspectiveCamera(
  65,
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

// GUI
gui.add(mesh, "visible").name("显示物体")
gui.add(material, "wireframe").name("显示网格")
gui.add(axesHelper, "visible").name("显示坐标轴辅助线")
gui.add(parameters, "intation").name("旋转物体")
gui
  .addColor(parameters, "color")
  .name("color")
  .onChange(() => {
    material.color.set(parameters.color)
  })
gui.add(mesh.position, "x", -3, 3, 0.01).name("position-x")
gui.add(mesh.position, "y", -3, 3, 0.01).name("position-y")
gui.add(mesh.position, "z", -3, 3, 0.01).name("position-z")
// gui.add(mesh.position, "x").name("position-x").min(-3).max(-3).step(0.01)

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
