import * as THREE from 'three'

import { loaderPromise, loaderTexture } from '../../utils/common'
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
  camera = new THREE.PerspectiveCamera(10, width / height, 1, 10000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 300;
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
  light.position.set(550, 550, 550)
  scene.add(light);
  // 模拟相机发出的光
  // camera.add(light)
}
// 创建物体
let mesh: any, texture1: THREE.Texture, texture2: THREE.Texture;
const initObject = async() => {
  // 加载fbx模型
  mesh = await loaderPromise('FBXLoader', '../../assets/model/bear.fbx')
  console.log(mesh)
  // 该文件返回的是一个mesh组 需要更改他的材质 mesh.traverse 遍历
  // for (let i in mesh.children) {
  //   mesh.children[i].material.side = THREE.FrontSide;
  // }
  texture1 = await loaderTexture('../../assets/img/img1.jpg') as THREE.Texture
  texture2 = await loaderTexture('../../assets/img/WechatIMG125.jpeg') as THREE.Texture
  // texture.wrapS = THREE.RepeatWrapping
  // texture.wrapS = THREE.RepeatWrapping
  // texture.repeat.x = 10
  // texture.repeat.y = 10
  // texture.needsUpdate = true;
  console.log('texture', texture1, texture2)
  mesh.traverse((child: any) => {
    let i = 0;
    if (child instanceof THREE.Mesh) {
      if (i % 2 === 0) {
          mesh.children[i].material = new THREE.MeshBasicMaterial( { map: texture2 } )
        } else {
          mesh.children[i].material = new THREE.MeshBasicMaterial( { map: texture1 } )
        }
        i++;
    }
  })

  // for (let i in mesh.children) {
  //   if (+i % 2 === 0) {
  //     mesh.children[i].material.map = texture1
  //     console.log(mesh.children[i])
  //   } else {
  //     mesh.children[i].material.map = texture2
  //   }
    
  // }
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
  mesh && (mesh.rotation.y += 0.01)
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