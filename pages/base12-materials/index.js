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

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const light = new THREE.PointLight(0xffffff, 0.5)
light.position.set(2, 3, 4)
scene.add(light)

/** Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const doorColorTexture = textureLoader.load("/assets/textures/base12-materials/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/assets/textures/base12-materials/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("/assets/textures/base12-materials/door/ambientOcclusion.jpg")
const doorHeightTexture = textureLoader.load("/assets/textures/base12-materials/door/height.jpg")
const doorNormalTexture = textureLoader.load("/assets/textures/base12-materials/door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("/assets/textures/base12-materials/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("/assets/textures/base12-materials/door/roughness.jpg")
const matcapTexture = textureLoader.load("/assets/textures/base12-materials/matcaps/1.png")
const gradientTexture = textureLoader.load("/assets/textures/base12-materials/gradients/5.jpg")
const environmentMapTexture = cubeTextureLoader.load(["/assets/textures/base12-materials/environmentMaps/0/px.jpg", "/assets/textures/base12-materials/environmentMaps/0/nx.jpg", "/assets/textures/base12-materials/environmentMaps/0/py.jpg", "/assets/textures/base12-materials/environmentMaps/0/ny.jpg", "/assets/textures/base12-materials/environmentMaps/0/pz.jpg", "/assets/textures/base12-materials/environmentMaps/0/nz.jpg"])

/** Objects
 * 问:如何将多种材质添加到（渲染在）同一个物体上
 * 答：使用Mesh方式
 * @param { Mesh } 通过网格的形式（类似底座），将物体与所需要的材质添加到其中（多个物体共用一个材质类型）
 */
// (1)基础网格材质
// const material = new THREE.MeshBasicMaterial({
//   // color: parameters.color,
//   map: doorColorTexture,
//   // alphaMap: doorAlphaTexture,
//   // wireframe: true,
//   // transparent: true,
//   // opacity: 0.5,
//   // side: THREE.DoubleSide,
//   // flatShading: true,
// })

// (2)法线网格材质
// const material = new THREE.MeshNormalMaterial({
//   // bumpMap: doorColorTexture,
//   // bumpScale: 0.1,
//   // wireframe: true,
//   // flatShading: true,
// })

// (3)捕捉网格材质（捕捉材质颜色与明暗纹理）
// const material = new THREE.MeshMatcapMaterial({
//   matcap: matcapTexture,
//   // color: parameters.color,
//   // flatShading: true,
// })

// (4)深度网格材质(近白远黑)
// const material = new THREE.MeshDepthMaterial()

// (5) 非光泽网格材质（木头）
// const material = new THREE.MeshLambertMaterial()

// (6) 光泽网格材质（加工后的家具-涂漆木材）
// const material = new THREE.MeshPhongMaterial({
//   shininess: 100,
//   specular: new THREE.Color(0x1188ff),
// })

// (7) 卡通网格材质（高亮、高保和、材质柔和）
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// const material = new THREE.MeshToonMaterial({
//   generateMipmaps: false,
//   gradientMap: gradientTexture,
// })

// (8) 标准网格材质(颗粒感、光泽感、粗糙度)
// const material = new THREE.MeshStandardMaterial({
//   metalness: 0,
//   roughness: 1,
//   map: doorColorTexture,
//   aoMap: doorAmbientOcclusionTexture,
//   aoMapIntensity: 1,
//   displacementMap: doorHeightTexture,
//   displacementScale: 0.05,
//   metalnessMap: doorMetalnessTexture,
//   roughnessMap: doorRoughnessTexture,
//   normalMap: doorNormalTexture,
//   // transparent: true,
//   alphaMap: doorAlphaTexture,
// })
// material.normalScale.set(0.5, 0.5) // normal模型材质调节
// gui.add(material, "metalness").min(0).max(1).step(0.0001)
// gui.add(material, "roughness").min(0).max(1).step(0.0001)
// gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001)
// gui.add(material, "displacementScale").min(0).max(1).step(0.0001)

// (9) 阴影网格材质()
// const material = new THREE.MeshPhysicalMaterial({
//   metalness: 0,
//   roughness: 1,
//   map: doorColorTexture,
//   aoMap: doorAmbientOcclusionTexture,
//   aoMapIntensity: 1,
//   displacementMap: doorHeightTexture,
//   displacementScale: 0.05,
//   metalnessMap: doorMetalnessTexture,
//   roughnessMap: doorRoughnessTexture,
//   normalMap: doorNormalTexture,
//   transparent: true,
//   alphaMap: doorAlphaTexture,
//   clearcoat: 1,
//   clearcoatRoughness: 0,
// })
// material.normalScale.set(0.5, 0.5) // normal模型材质调节
// gui.add(material, "metalness").min(0).max(1).step(0.0001)
// gui.add(material, "roughness").min(0).max(1).step(0.0001)

// （10）环境贴图材质
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.8
material.roughness = 0.1
gui.add(material, "metalness").min(0).max(1).step(0.0001)
gui.add(material, "roughness").min(0).max(1).step(0.0001)
material.envMap = environmentMapTexture

const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), material)
sphere.position.x = -2.5
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.2, 16, 32), material)
torus.position.x = 2.5
torus.geometry.setAttribute("uv2", new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
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
// gui.add(material, "wireframe").name("显示网格")
gui.add(material, "transparent").name("transparent")
gui.add(material, "opacity").name("opacity").min(0).max(1).step(0.05).setValue(1)
gui.add(ambientLight, "intensity").name("环境光").min(1).max(3).step(0.05)
gui
  .addColor(parameters, "color")
  .name("color")
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
