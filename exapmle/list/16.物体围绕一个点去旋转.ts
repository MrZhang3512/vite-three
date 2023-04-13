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
  camera.position.y = 10;
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
  // 模拟相机发出的光
  // camera.add(light)
}
// 创建物体
let group: THREE.Group;
let mesh;
const initObject = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const indexs = geometry.getIndex()?.array as any[]
  const colors = new Float32Array(8 * 3 * 3);
  // const colors = new Float32Array(geometry.attributes.position.array.length);

  for (let i = 0; i < indexs?.length; i += 3) {
    let cx = Math.random();
    let cy = Math.random();
    let cz = Math.random();

    // 三个点 组成面
    // indexs[i]
    // indexs[i+1]
    // indexs[i+2]

    // 第一个点
    colors[indexs[i] * 3] = cx;
    colors[indexs[i] * 3 + 1] = cy;
    colors[indexs[i] * 3 + 2] = cz;
    // 第二个点
    colors[indexs[i + 1] * 3] = cx;
    colors[indexs[i + 1] * 3 + 1] = cy;
    colors[indexs[i + 1] * 3 + 2] = cz;
    // 第三个点
    colors[indexs[i + 2] * 3] = cx;
    colors[indexs[i + 2] * 3 + 1] = cy;
    colors[indexs[i + 2] * 3 + 2] = cz;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.MeshBasicMaterial( { 
    vertexColors: true
  } );
  mesh = new THREE.Mesh(geometry, material);

  console.log('mesh', mesh)
  // 创建一个组
  group = new THREE.Group();
  group.add(mesh);
  mesh.position.x = - 3;
  mesh.position.z = - 1;
  // 为这个物体添加一个坐标系
  const axesHelper = new THREE.AxesHelper( 100 )
  axesHelper.position.copy(mesh.position)
  group.add(axesHelper)

  scene.add(group)
}
const initGrid = () => {
  const gridHelper = new THREE.GridHelper( 20, 100 );
  scene.add( gridHelper );
}
// 初始化辅助线
// const initHelper = () => {
//   // 加一个世界坐标系
//   const axesHelper = new THREE.AxesHelper( 1000 );
//   scene.add( axesHelper );
// }
// 循环渲染
const animation = () => {
  group.rotateY (0.01)
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
  // initHelper()
  initGrid()
  initObject();
  animation();
  window.addEventListener('resize', onWindowResize)
}
export default initModel