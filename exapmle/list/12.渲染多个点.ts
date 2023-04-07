import * as THREE from 'three'

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

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
let material: THREE.MeshLambertMaterial;
let mesh: any;
const initObject = () => {
  let triangle = 160000;
  let geometry = new THREE.BufferGeometry();

  let positions = new Float32Array(triangle * 3 * 3);
  // 每个顶点一个法线 也可以一个面一个法线
  let normals = new Float32Array(triangle * 3 * 3)
  // 每个顶点一个颜色
  let colors = new Float32Array(triangle * 3 * 3)

  let color = new THREE.Color()
  // 正方形大小
  let n = 1000, n2 = n / 2;
  // 三角形大小
  let d = 12 , d2 = d / 2;

  let pA = new THREE.Vector3();
  let pB = new THREE.Vector3();
  let pC = new THREE.Vector3();

  let cb = new THREE.Vector3();
  let ab = new THREE.Vector3();

 
  // geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  // geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  // geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  // // 计算当前几何体的的边界球形
  // geometry.computeBoundingSphere();
  // console.log('geometry', geometry)
  // let material = new THREE.MeshPhongMaterial({
  //   // color: 0xaaaaaa,
  //   // 材质的高光颜色。默认值为0x111111（深灰色）的颜色Color
  //   specular: 0xffffff,
  //   // 高亮的程度，越高的值越闪亮。默认值为 30。
  //   shininess: 250,
  //   side: THREE.DoubleSide,
  //   // 是否使用顶点着色
  //   vertexColors: true,
  // });
  // mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);
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

const initModel = (): void => {
  initThree();
  initCamera();
  initScene();
  initLight()
  initHelper()
  initObject();
  animation();
}
export default initModel