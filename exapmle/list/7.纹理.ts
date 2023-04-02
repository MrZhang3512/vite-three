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
  repeat: 1,
  wrap: 1,
  offsetX: 0,
  offsetY: 0,
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
let light: THREE.PointLight;
const initLight = () => {
  light = new THREE.PointLight(0x0000ff, 1, 100);
  scene.add(light);
}
// 创建物体
let cube: THREE.Mesh
let texture: THREE.Texture;
let material: THREE.MeshBasicMaterial;
const initObject = () => {
  const geometry = new THREE.BoxGeometry(8, 5, 5);;
  // 加载纹理
  const load = new THREE.TextureLoader().load(
    '../../assets/img/img1.jpg',
    (text) => {
      // 图片加载完成
      texture = text
      material = new THREE.MeshBasicMaterial( { map: texture} );
      cube = new THREE.Mesh( geometry, material );
      cube.rotateX(0.5)
      cube.rotateY(0.5)
      cube.position.x = 1
      scene.add(cube);
    }
  )
}

// 初始化辅助线
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}


// 循环渲染
const animation = () => {
  // 纹理重复
  if (texture) {
    texture.repeat.x = params.repeat
    texture.repeat.y = params.repeat
    texture.offset.x = params.offsetX
    texture.offset.y = params.offsetY
    texture.wrapS = params.wrap
    texture.wrapT = params.wrap
    // 纹理的属性改变后需要跟新
    texture.needsUpdate = true;
  }
  renderer.clear();
  renderer.render(scene, camera);
  requestAnimationFrame(animation)
}
const creatUI = () => {
  const gui = new dat.GUI();
  gui.add(params, 'repeat', 1, 10).name('纹理的重复')
  gui.add(params, 'wrap', 1000, 1002).name('回环').step(1)
  gui.add(params, 'offsetX', -300, 300).name('X轴的偏移量')
  gui.add(params, 'offsetY', 0, 1).name('Y轴的偏移量')
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