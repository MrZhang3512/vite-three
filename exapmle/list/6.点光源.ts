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
  distance: 0,
} 
let camera: THREE.PerspectiveCamera;
const initCamera = () => {
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
  camera.position.x = 0;
  camera.position.y = 0;
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
let light: THREE.PointLight;
const initLight = () => {
  light = new THREE.PointLight(0x0000ff, 1, 100);
  scene.add(light);
}
// 创建物体
let cube: THREE.Mesh, cube1: THREE.Mesh, cube2: THREE.Mesh;
const initObject = () => {
  const geometry = new THREE.BoxGeometry(5, 3, 2);;
      // 材质
      const material = new THREE.MeshLambertMaterial( {color: 0x00ffff} );
      cube = new THREE.Mesh( geometry, material );
      cube.rotation.y = -1;
      cube.position.set(0, 0, 0);
      scene.add(cube);

      const geometry1 = new THREE.BoxGeometry(5, 3, 2);;
      // 材质
      const material1 = new THREE.MeshLambertMaterial( {color: 0x00ffff} );
      cube1 = new THREE.Mesh( geometry1, material1 );
      cube1.rotation.y = -1;
      cube1.position.set(0, 7, 0);
      scene.add(cube1);

      const geometry2 = new THREE.BoxGeometry(3, 2, 2);;
      // 材质
      const material2 = new THREE.MeshLambertMaterial( {color: 0x00ffff} );
      cube2 = new THREE.Mesh( geometry2, material2 );
      cube2.rotation.y = -1;
      cube2.position.set(-4, 3, 0);
      scene.add(cube2);
}

// 初始化辅助线
let helper: THREE.PointLightHelper;
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
  // 光线辅助对象
  helper = new THREE.PointLightHelper(light, 20 );
  scene.add(helper);
}


// 循环渲染
const animation = () => {
  // 改变光的位置
  light.position.set(params.x, params.y, params.z)
  // 改变光的强度
  light.intensity = params.intensity
  light.distance = params.distance
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
  gui.add(params, 'distance', 0, 1000).name('光源到光照强度为0的位置')

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