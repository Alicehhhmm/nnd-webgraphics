import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// scene
const scene = new THREE.Scene()

// global
const canvas = document.querySelector('#app')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const parameters = {
  color: 0x32b67a,
}
const gui = new dat.GUI({ closed: true, width: 260 })
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/** Camera
 */
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 1, 1000)
camera.position.set(1, 3, 3)
scene.add(camera)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const light = new THREE.PointLight(0xffffff, 0.5)
light.position.set(2, 3, 4)
scene.add(light)

/** Objects
 * @param { Mesh }
 */
const material = new THREE.MeshStandardMaterial()
const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), material)
sphere.position.x = -2.5
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.2, 16, 32), material)
torus.position.x = 2.5
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
scene.add(sphere, plane, torus)

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

// GUI
gui.add(axesHelper, 'visible').name('显示坐标轴辅助线').setValue(false)
// gui.add(material, "wireframe").name("显示网格")
gui.add(material, 'transparent').name('transparent')
gui.add(material, 'opacity').name('opacity').min(0).max(1).step(0.05).setValue(1)
gui.add(ambientLight, 'intensity').name('环境光').min(1).max(3).step(0.05)
gui
  .addColor(parameters, 'color')
  .name('color')
  .onChange(() => {
    material.color.set(parameters.color)
  })

/** initialization && Animations
 */
function animate() {
  // update Object

  // update controls
  controls.update()

  // update Renderer
  renderer.render(scene, camera)

  // update frame animation
  window.requestAnimationFrame(animate)
}

export default animate
