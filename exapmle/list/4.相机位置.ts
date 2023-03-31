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
  fov: 45,
}
let camera: THREE.PerspectiveCamera |  THREE.OrthographicCamera;
const initCamera = () => {
  // camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
  // 正交相机
  camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 10, 1000);
  
  // 正交相机和透视相机都有该属性
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 130;
  
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
// 创建物体
let cube: THREE.Mesh;
const initObject = () => {
  const geometry = new THREE.BoxGeometry( 100, 100, 100 );
  // 材质
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  cube = new THREE.Mesh( geometry, material );
  cube.position.x = 3
  scene.add(cube);
}

// 初始化辅助线
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}

// 循环渲染
let lookAtX = -10
const animation = () => {
  // lookAtX+=0.01
  // camera.lookAt(lookAtX, 0, 0)
  // 变化相机视角
  // camera.fov = params.fov;
  // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用
  // camera.updateProjectionMatrix();
  renderer.clear();
  renderer.render(scene, camera);
  requestAnimationFrame(animation)
}
const creatUI = () => {
  const gui = new dat.GUI();
  gui.add(params, 'fov', 0, 180).name('视角大小')
}
const initModel = (): void => {
  initThree();
  initCamera();
  initScene();
  initHelper()
  initObject();
  animation();
  creatUI()
}
export default initModel