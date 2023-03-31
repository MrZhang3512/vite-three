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
  camera.position.z = 500;
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
// 初始化灯光
let light: THREE.DirectionalLight;
const initLight = () => {
  // 方向光
  light = new THREE.DirectionalLight(0xff0000, 1);
  light.position.set(100, 100, 200);
  // 光线辅助对象
  const helper = new THREE.DirectionalLightHelper( light, 30 );
  scene.add(helper);
  // 加一个世界坐标系 
  const axesHelper: THREE.AxesHelper = new THREE.AxesHelper(1000);
  scene.add( axesHelper );
  console.log(axesHelper)
  scene.add(light);
}
// 创建物体
const initObject = () => {
  let geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
  const material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({
    // 是否使用顶点着色 默认为false
    vertexColors: true,
    // 线的颜色 如果vertexColors为true 无效
    color: 0x0000ff,
    // 由于OpenGL Core Profile与 大多数平台上WebGL渲染器的限制，无论如何设置该值，线宽始终为1。
    linewidth: 1,
    // 一下会被webgl渲染器忽略
    // 两端的样式可选值为 'butt', 'round' 和 'square'。默认值为 'round'
    linecap: 'butt',
    // 定义线连接节点的样式。可选值为 'round', 'bevel' 和 'miter'。
    linejoin: 'miter'
  });
  // 第一种方式
  // const pointsArray: THREE.Vector3[] = new Array()
  // const p1 = new THREE.Vector3(-100, 0, 0)
  // const p2 = new THREE.Vector3(100, 0, 0)
  // const p3 = new THREE.Vector3(0, -100, 0)
  // const p4 = new THREE.Vector3(100, 200, 0)
  // pointsArray.push(p1)
  // pointsArray.push(p2)
  // pointsArray.push(p3)
  // pointsArray.push(p4)
  // geometry.setFromPoints(pointsArray)


  // 老版本
  // geometry.vertices.push(p1)
  // geometry.vertices.push(p2)

  // 老版本
  // const color1 = new THREE.Color(0x444444)
  // const color2 = new THREE.Color(0xff0000)
  // geometry.colors.push(color1, color2)
  
  // 第二种方式
  const point = new Float32Array([
    -100, 0, 0,
    100, 0, 0,
    0, -100, 0, 
    100, 200, 0
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute( point, 3 ));
  console.log(geometry)
  // 设置颜色
  const colors = new Float32Array([
    1.0, 0.0, 1.0,
    0.0, 1.0, 1.0,
    0.0, 1.0,  0.0,
    0.0, 0.5, 0.1
  ]);
  geometry.setAttribute('color', new THREE.BufferAttribute( colors, 3 ));

  // 点的链接方式
  // const line = new THREE.Line( geometry, material);
  // const line = new THREE.LineSegments( geometry, material);
  const line = new THREE.LineLoop( geometry, material);

  scene?.add( line )
}

const initModel = (): void => {
  initThree();
  initCamera();
  initScene();
  initLight();
  initObject();
  renderer.clear();
  renderer.render(scene, camera);
}
export default initModel