import * as THREE from 'three'

let width: number = 0, height: number = 0;
let renderer: THREE.WebGLRenderer;

const initThree = (): void => {
  width = document.getElementById('canvas-frame')?.clientWidth || 0;
  height = document.getElementById('canvas-frame')?.clientHeight || 0;
  renderer = new THREE.WebGLRenderer({
    // 开启抗锯齿
    antialias: true,
  })
  renderer.setSize(width, height);
  document.getElementById('canvas-frame')?.appendChild(renderer.domElement);
  renderer.setClearColor(0xFFFFFF, 1);
}

let camera: THREE.PerspectiveCamera;
const initCamera = () => {
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 10;
  camera.up.x = 0;
  camera.up.y = 1;
  camera.up.z = 0;
  camera.lookAt(0, 0, 0)
  // camera.lookAt(new THREE.Vector3(0, 0, 0)),
}
let scene: THREE.Scene;
const initScene = () => {
  scene = new THREE.Scene();
}
let light: THREE.AmbientLight;
const initLight = () => {
  light = new THREE.AmbientLight(0x404040); // 白光 0x404040
  scene.add(light);
}
// 创建物体
let cube: THREE.Mesh
let material: THREE.MeshBasicMaterial;
const initObject = () => {
  // 平面几何缓冲体
  const geometry = new THREE.BufferGeometry;
  material = new THREE.MeshBasicMaterial({
    vertexColors: true,
     // 将几何体渲染为线框
    // wireframe: true,
    // color: 0xff0000
  })
  const color = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
  ])
  geometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
  const position = new Float32Array([
    0, 0, 0,
    5, 0, 0,
    0, 5, 0,
  ])
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  // 三角形路径
  const indexes = new Uint16Array([
    0, 1, 2
  ])
  geometry.index = new THREE.BufferAttribute(indexes, 1)
  cube = new THREE.Mesh(geometry, material)
  console.log(geometry)
  // 由geometry中的index来设置面，逆时针
  scene.add(cube)
}

// 初始化辅助线
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}


// 循环渲染
const animation = () => {
  renderer.clear();
  renderer.render(scene, camera);
  requestAnimationFrame(animation)
}

const initModel = (): void => {
  initThree();
  initCamera();
  initScene();
  initLight()
  initHelper()
  initObject();
  animation();
}
export default initModel