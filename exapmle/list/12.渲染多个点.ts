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
  camera.position.z = 1500;
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
let light: THREE.DirectionalLight;
const initLight = () => {
  // light = new THREE.AmbientLight(0xffff00); // 白光 0x404040
  light = new THREE.DirectionalLight(0x404040, 1);
  light.position.set(50, 50, 50)
  scene.add(light);
  // 模拟相机发出的光
  // camera.add(light)
}
// 创建物体
let mesh: any;
const initObject = () => {
  let points = 999000;
  let geometry = new THREE.BufferGeometry();

  let positions = new Float32Array(points * 3);
  let colors = new Float32Array(points * 3);
  
  // 正方形大小
  let n = 1000, n2 = n / 2;
  // 三角形大小
  let d = 12 , d2 = d / 2;


  for (let i = 0; i < points; i+=3) {
    let x = Math.random() * n - n2;
    let y = Math.random() * n - n2;
    let z = Math.random() * n - n2;
    positions[i] = x
    positions[i + 1] = y
    positions[i + 2] = z

    let cx = (x / n) + 0.5
    let cy = (y / n) + 0.5
    let cz = (z / n) + 0.5
    colors[i] = cx
    colors[i + 1] = cy
    colors[i + 2] = cz
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  console.log('geometry', geometry)
  let material = new THREE.PointsMaterial({
    // 是否使用顶点着色
    vertexColors: true,
    // 点大小
    size: 1,
  });
  mesh = new THREE.Points(geometry, material);
  scene.add(mesh);
}

// 初始化辅助线
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}


// 循环渲染
const animation = () => {
  mesh.rotation.y += 0.01
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