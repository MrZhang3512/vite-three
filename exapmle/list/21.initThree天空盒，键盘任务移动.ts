import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as OrbitControls from 'three/addons/controls/OrbitControls.js';
let OrbitControlsModel = OrbitControls as any

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
let controls: any;

const initCamera = () => {
  camera = new THREE.PerspectiveCamera(65, width / height, 1, 10000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 30;
  camera.up.x = 0;
  camera.up.y = 1;
  camera.up.z = 0;
  camera.lookAt(0, 0, 0)
  // camera.lookAt(new THREE.Vector3(0, 0, 0)),
  controls = new OrbitControlsModel.OrbitControls( camera, renderer.domElement );
  controls.update();
}
let scene: THREE.Scene;
const initScene = () => {
  scene = new THREE.Scene();
}
let light1: THREE.AmbientLight;
let light2: THREE.PointLight;
let light3: THREE.SpotLight;
let light4: THREE.DirectionalLight;
const initLight = () => {
  // 自然光
  light1 = new THREE.AmbientLight(0x555555); // 白光 0x404040
  scene.add(light1)

  light2 = new THREE.PointLight(0xff6600, 1, 50);
  scene.add(light2)

  light3 = new THREE.SpotLight(0xaaaaaa, 2, 0, Math.PI / 4, 1);
  light3.position.set(0, 0, -1);
  // 设置阴影为false
  light3.castShadow = false;
  scene.add(light3)

  light4 = new THREE.DirectionalLight(0xaaaaaa, 4);
  light4.position.set(0, 0, -1)
  light4.castShadow = true;
  // 设置阴影
  scene.add(light4);

}
// 加载天空盒
const initSkyBoy = () => {
  const imgList = [
    '../../assets/img/skyBox/skyBox6/posx.jpg',
    '../../assets/img/skyBox/skyBox6/negx.jpg',
    '../../assets/img/skyBox/skyBox6/posy.jpg',
    '../../assets/img/skyBox/skyBox6/negy.jpg',
    '../../assets/img/skyBox/skyBox6/posz.jpg',
    '../../assets/img/skyBox/skyBox6/negz.jpg',
  ]
  let loader = new THREE.TextureLoader()
  let skyGeometry = new THREE.BoxGeometry(5000, 5000, 5000)
  const materialList: THREE.MeshBasicMaterial[] = [];
  imgList.forEach(item => {
    materialList.push(new THREE.MeshBasicMaterial({
      map: loader.load(item),
      side: THREE.BackSide,
    }))
  })
  let mesh = new THREE.Mesh(skyGeometry, materialList)
  scene.add(mesh)
}
// 创建物体

let material: THREE.MeshLambertMaterial;
let mesh: any;
const initObject = () => {
  const load = new FBXLoader().load(
    '../../assets/model/bear.fbx',
    (text: any) => {
      mesh = text;
      console.log(mesh)
      // // side 单边绘制（前面和后面） 双边绘制
      material = new THREE.MeshLambertMaterial({ color: '#EEE7E7', side: THREE.BackSide})
      // // 该文件返回的是一个mesh组 需要更改他的材质
      for (let i in mesh.children) {
        // mesh.children[i].material.side = THREE.DoubleSide;
        mesh.children[i].material = material;
      }
      mesh.castShadow = true
      mesh.scale.x = mesh.scale.z = mesh.scale.y = 0.2 
      mesh.position.y = 0
      scene.add(mesh)
    }
  )
}
// 监听键盘事件
const initKey = () => {
  window.addEventListener('keydown', onKeyDownHandler)
}
// 鼠标按下事件
const onKeyDownHandler = (event: KeyboardEvent) => {
  event.preventDefault();
  console.log(event.key, mesh.position)
  switch(event.key) {
    case 'ArrowDown':
      mesh.position.y -= 1;
      camera.lookAt(mesh.position.x, mesh.position.y, mesh.position.z)
      break;
    case 'ArrowUp':
      mesh.position.y += 1;
      camera.lookAt(mesh.position.x, mesh.position.y, mesh.position.z)
      break;
    case 'ArrowLeft':
      mesh.position.x -= 2;
      camera.lookAt(mesh.position.x, mesh.position.y, mesh.position.z)
      break;
    case 'ArrowRight':
      mesh.position.x += 2;
      camera.lookAt(mesh.position.x, mesh.position.y, mesh.position.z)
      break;
  }
}

// 循环渲染
const animation = () => {
  // mesh && (mesh.rotation.y += 0.01)
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
  initObject();
  initSkyBoy()
  animation();
  window.addEventListener('resize', onWindowResize)
  initKey()
}
export default initModel