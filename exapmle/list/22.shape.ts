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
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 300;
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
  light = new THREE.AmbientLight(0xffff00); // 白光 0x404040
  scene.add(light);
} 
let group: THREE.Group;
const createShape = (
  shape: THREE.Shape,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  s: number
): THREE.Line => {
  const geometry = new THREE.ShapeGeometry(shape, 4);
  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff,
  });
  const mesh = new THREE.Line( geometry, material )
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(s, s, s);
  console.log(mesh)
  return mesh;
}
// 创建物体
const initObject = () => {
  group = new THREE.Group()

  const shape = new THREE.Shape()
  // 移动到这个点
  shape.moveTo(100, 0)

  // 二次曲线
  shape.quadraticCurveTo(0, 100, -100, 0)

  group.add(createShape(shape, 0, 0, 0, 0, 0, 0, 1))
  scene.add(group)


}

// 循环渲染
const animation = () => {

  renderer.clear();
  renderer.render(scene, camera);
  requestAnimationFrame(animation)
}
// 监听窗口变化 
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
}
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}
const initModel = (): void => {
  initThree();
  initCamera();
  initScene();
  initLight()
  initObject();
  animation();
  initHelper()
  window.addEventListener('resize', onWindowResize)
}
export default initModel