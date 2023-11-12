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
}
const gui = new dat.GUI({ closed: true, width: 260 })
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/** Camera
 */
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 1, 1000)
camera.position.set(1, 3, 3)
scene.add(camera)

// 添加环境光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// 添加平行光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0, 1, 0)
scene.add(directionalLight)

/** Textures
 * LoadingManager|处理并跟踪已加载和待处理的数据
 * TextureLoader|纹理加载器，内部使用ImageLoader来加载文件
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => console.log("loadingManager: loading started")
loadingManager.onLoaded = () => console.log("loadingManager: loading finished")
loadingManager.onProgress = () => console.log("loadingManager:loading progressing")
loadingManager.onError = () => console.log("loadingManager: loading error")

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load("/public/assets/textures/base11-texture/door/color.jpg")
colorTexture.generateMipmaps = false //多级纹理映射
colorTexture.minFilter = THREE.NearestFilter
colorTexture.minFilter = THREE.NearestFilter

// 其他材质贴图
const alphaTexture = textureLoader.load("/public/assets/textures/base11-texture/door/alpha.jpg")
const ambientOcclusionTexture = textureLoader.load("/public/assets/textures/base11-texture/door/ambientOcclusion.jpg")
const heightTexture = textureLoader.load("/public/assets/textures/base11-texture/door/height.jpg")
const metalnessTexture = textureLoader.load("/public/assets/textures/base11-texture/door/metalness.jpg")

/** Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  color: parameters.color,
  map: colorTexture,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const geometry2 = new THREE.BoxGeometry(1, 1, 1)
const mesh2 = new THREE.Mesh(geometry2, material)
mesh2.position.set(1.5, 0, 0)
scene.add(mesh2)

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

/** keyboard
 *
 */
window.addEventListener("keydown", event => {
  // 获取按下的按键字符值
  var key = event.key

  // 打印按下的按键字符值
  var code = event.code
  console.log(event)

  // 判断按键是否为左侧数字按键
  if (code.startsWith("Digit") && parseInt(code.charAt(5)) <= 9) {
    mesh2.rotation.set(Math.PI * 0.25, 0, 0)
    console.log("左侧数字按键", key)
    // 左侧数字按键通常具有以下编码：
    // 左侧 0 到 9： Digit0 到 Digit9
    // 左侧小键盘 0 到 9： Numpad0 到 Numpad9
  }

  // 判断按键是否为右侧数字按键
  if (code.startsWith("Numpad") && parseInt(code.charAt(6)) <= 9) {
    console.log("右侧数字按键")
    // 右侧数字按键通常具有以下编码：
    // 右侧 0 到 9： Numpad0 到 Numpad9
  }
})

// GUI
gui.add(mesh, "visible").name("显示物体")
gui.add(material, "wireframe").name("显示网格")
gui.add(axesHelper, "visible").name("显示坐标轴辅助线")
gui
  .addColor(parameters, "color")
  .name("color")
  .onChange(() => {
    material.color.set(parameters.color)
  })
gui.add(mesh.position, "x", -3, 3, 0.01).name("position-x")
gui.add(mesh.position, "y", -3, 3, 0.01).name("position-y")
gui.add(mesh.position, "z").name("position-z").min(-3).max(3).step(0.01)

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
