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
 * @ Position
 * @ Scale
 * @ Rotation
 * @ 通过控制物体位置、旋转、缩放来改变物体
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x32b67a })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 0, 0) //x,y,z
mesh.scale.set(1, 1, 1)
mesh.rotation.set(0, 0, 0) // (π): Math.PI
scene.add(mesh)

/** Group Object
 * @ Mesh 将多个材质与渲染通过网格组合，便于多个物体复用
 * @ Group 将多个物体组合的在一起，便于控制整体的变换
 */
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
)
cube1.position.set(0, 0, 1)
group.add(cube1)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffff00 }),
)
cube2.position.set(0, 1, 0)
group.add(cube2)

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
)
cube3.position.set(1, 0, 0)
group.add(cube3)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 1, 3) //x,y,z
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
// renderer.render(scene, camera)
canvas.appendChild(renderer.domElement)

// Control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false

// initialization
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

export default animate
