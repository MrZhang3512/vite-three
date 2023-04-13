import * as THREE from 'three'
import { loaderPromise } from '../../utils/common'

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
  camera.position.x = 10;
  camera.position.y = 20;
  camera.position.z = 30;
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
  // light = new THREE.DirectionalLight(0x404040, 1);
  // light.position.set(550, 550, 550)
  scene.add(light);
}
// 创建物体
let mesh: any;
let gruop: any;
const initObject = async () => {
  mesh = await loaderPromise('OBJLoader', '../../assets/model/中心点位偏移模型.obj')
  console.log(mesh)

  // 一个正方体
  const geometry: THREE.BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  // 材质
  const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube:  THREE.Mesh = new THREE.Mesh( geometry, material );
  scene.add(cube)

  // 定义一个组
  gruop = new THREE.Group()
  gruop.add(mesh)
  // 用来计算包围盒的3D对象
  let box3 = new THREE.Box3().setFromObject(mesh)
  // 计算出中心点
  box3.getCenter(mesh.position)
  // 设置positon为反方向(将mesh移动到中心)
  mesh.position.multiplyScalar(-1)

  // 加一个中心点的坐标系
  const axesHelper = new THREE.AxesHelper( 60 );
  box3.getCenter(axesHelper.position)
  // 将整个组移动到原来的位置
  box3.getCenter(gruop.position)
  scene.add( axesHelper );
  scene.add(gruop)

  console.log(2, mesh, axesHelper)

  
}
// 初始化辅助线
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}
// 循环渲染
const animation = () => {
  gruop && gruop.rotateY(0.01)
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
const initModel = (): void => {
  initThree();
  initCamera();
  initScene();
  initLight()
  initHelper()
  initObject();
  animation();
  window.addEventListener('resize', onWindowResize)
}
export default initModel