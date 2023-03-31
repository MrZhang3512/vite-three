import * as THREE from 'three'
import * as dat from 'dat.gui';

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
let params = {
  x: 0,
  y: 0,
  z: 0,
  intensity: 1,
} 
let camera: THREE.PerspectiveCamera |  THREE.OrthographicCamera;
const initCamera = () => {
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
  camera.position.x = -100;
  camera.position.y = 0;
  camera.position.z = 100;
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
let light: THREE.AmbientLight | THREE.DirectionalLight;
const initLight = () => {
  // 环境光 设置位置没有意义
  // light = new THREE.AmbientLight(0x404040); // 白光 0x404040)
  // 平行光
  light = new THREE.DirectionalLight(0xffb200, 1);
  // light.position.set(-200, 100, 100)
  scene.add(light);
}
// 创建物体
let cube: THREE.Mesh;
const initObject = () => {
  const geometry = new THREE.BoxGeometry( 10, 20, 10 );
  // 材质
  const material = new THREE.MeshLambertMaterial( {color: "#E91C1C"} );
  cube = new THREE.Mesh( geometry, material );
  cube.position.x = 10
  scene.add(cube);
}

// 初始化辅助线
let helper: THREE.DirectionalLightHelper;
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
  // 光线辅助对象
  helper = new THREE.DirectionalLightHelper( light as THREE.DirectionalLight, 20 );
  scene.add(helper);
}


// 循环渲染
const animation = () => {
  // 改变光的位置
  light.position.set(params.x, params.y, params.z)
  // 改变光的强度
  light.intensity = params.intensity
  renderer.clear();
  helper.update()
  renderer.render(scene, camera);
  requestAnimationFrame(animation)
}
const creatUI = () => {
  const gui = new dat.GUI();
  gui.add(params, 'x', -300, 300).name('光的位置x轴')
  gui.add(params, 'y', -300, 300).name('光的位置y轴')
  gui.add(params, 'z', -300, 300).name('光的位置z轴')
  gui.add(params, 'intensity', 0, 1).name('光的强度')
}
const initModel = (): void => {
  initThree();
  initCamera();
  initScene();
  initLight()
  initHelper()
  initObject();
  animation();
  creatUI()
}
export default initModel