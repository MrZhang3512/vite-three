import * as THREE from 'three'

import addStats from '../../utils/stats'
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
  // camera.up.x = 0;
  // camera.up.y = 1;
  // camera.up.z = 0;
  // camera.lookAt({
  //   x: 0,
  //   y: 0,
  //   z: 0,
  // }) 
}
let scene: THREE.Scene;
const initScene = () => {
  scene = new THREE.Scene();
}
// 创建物体
let cube: THREE.Mesh;
const initObject = () => {
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // 材质
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  cube = new THREE.Mesh( geometry, material );
  scene.add(cube);
}
// 循环渲染
const animation = () => {

  // 移动相机的位置
  // camera.position.x += 0.1;

  // 移动物体的位置
  // cube.position.x -= 0.01;

  cube.rotation.z -= 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animation)
}

const initModel = (): void => {
  addStats()
  initThree();
  initCamera();
  initScene();
  initObject();
  renderer.clear();
  animation();
}
export default initModel