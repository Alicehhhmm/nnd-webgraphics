import * as THREE from "three"
import * as dat from "dat.gui"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js"

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
}
const gui = new dat.GUI({ closed: true, width: 260 })
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/** Camera
 */
const camera = new THREE.PerspectiveCamera(85, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 2)
scene.add(camera)

/**
 * Lights
 * 不同光照对环境的作用
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.5
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

// Point light
const pointLight = new THREE.PointLight(0xff9000, 3, 6, 3)
pointLight.position.set(0, 0, 1)
scene.add(pointLight)

// Rect area light
// 灯光颜色| 0x4e00ff | 0xfff000 | 0xffffff | 0x0ff00f | 0xfff
const rectAreaLight = new THREE.RectAreaLight(0xfff000, 3, 2, 2)
rectAreaLight.position.set(-2, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

// Spot light
const spotLight = new THREE.SpotLight(0x78ff00, 1, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 3, 2)
scene.add(spotLight)

spotLight.target.position.x = -0.75
scene.add(spotLight.target)

const light = new THREE.PointLight(0xffffff, 0.5)
light.position.set(2, 3, 4)
scene.add(light)

/** Light Helpers
 * */
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)
window.requestAnimationFrame(() => {
  spotLightHelper.update()
})

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaLightHelper)

// window.requestAnimationFrame(() => {
//   rectAreaLightHelper.position.copy(rectAreaLight.position)
//   rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
//   rectAreaLightHelper.update()
// })

/** Objects
 * @param { Mesh } 粗糙材质
 * @param
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), material)
sphere.position.x = -1.5

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.76, 0.76), material)

// const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.2, 32, 64), material)
const torus = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1, 64), material)
torus.position.x = 1.5

const plane = new THREE.Mesh(new THREE.CircleGeometry(10, 50), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.set(0, -0.6, 0)

scene.add(sphere, cube, torus, plane)

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

gui.add(axesHelper, "visible").name("显示坐标轴辅助线").setValue(false)
gui.add(material, "wireframe").name("显示网格")
gui.add(ambientLight, "intensity").name("环境光").min(0.5).max(1).step(0.05)
// 创建控制光源辅助线显示隐藏的函数
function addHelperControl(gui, helper, name) {
  gui
    .add({ [`${name}辅助线`]: true }, `${name}辅助线`)
    .onChange(value => {
      if (value) {
        scene.add(helper)
      } else {
        scene.remove(helper)
      }
    })
    .setValue(false)
}

// 创建控制光源显示隐藏的函数
function addLightControl(gui, light, name, helper) {
  const folder = gui.addFolder(name)
  const visible = { visible: light.visible !== undefined ? light.visible : true }
  folder
    .add(visible, "visible")
    .name("显示/隐藏")
    .onChange(value => {
      if (light.visible !== undefined) {
        light.visible = value
      } else {
        value ? scene.add(light) : scene.remove(light)
      }
    })
    .setValue(name === "Ambient light" || name === "Light")

  if (helper) {
    addHelperControl(folder, helper, name)
  }
}

// 使用函数创建控制光源的选项
addLightControl(gui, ambientLight, "Ambient light")
addLightControl(gui, light, "Light")
addLightControl(gui, directionalLight, "Directional light", directionalLightHelper)
addLightControl(gui, hemisphereLight, "Hemisphere light", hemisphereLightHelper)
addLightControl(gui, pointLight, "Point light", pointLightHelper)
addLightControl(gui, rectAreaLight, "Rect area light", rectAreaLightHelper)
addLightControl(gui, spotLight, "Spot light", spotLightHelper)

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
