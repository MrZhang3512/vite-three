import * as THREE from 'three'
import * as OrbitControls from 'three/addons/controls/OrbitControls.js';
import cloth from '../privite-mesh/cloth';
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
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 20000);
  camera.position.set(2, 2, 3)
  camera.up.x = 0;
  camera.up.y = 1;
  camera.up.z = 0;
  camera.lookAt(0, 0, 0)
  controls = new OrbitControlsModel.OrbitControls( camera, renderer.domElement );
  controls.update();
}
let scene: THREE.Scene;
const initScene = () => {
  scene = new THREE.Scene();
}
const initLight = () => {
  let light1 = new THREE.PointLight(0xffffff)
  light1.position.set(0.1, 4.0, 4.0)
  scene.add(light1)
  let light2 = new THREE.PointLight(0xffffff)
  light2.position.set(0.1, 4.0, -4.0)
  scene.add(light2)
}

// 创建物体
let gemotry: THREE.BufferGeometry
let c = new cloth(50, 50);
const initObject = () => {
  
  gemotry = new THREE.BufferGeometry()
  // gemotry.dynamic = true
  const p = c.particles.map(item => item.position.toArray()).toString().split(',').map(i => Number(i))
  const position = new Float32Array([...p])
  gemotry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  let colors = []
  for (let x = 0; x < c.w; x++) {
    for (let y = 0; y < c.h; y++) {
      if ( x % 2 > 0) {
        colors[x * c.w + y] = [1, 0, 0]
      } else {
        colors[x * c.w + y] = [0.6, 0, 0]
      }
      
    }
  }
  gemotry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([...colors.toString().split(',').map(i => Number(i))]), 3))

  // 计算面
  let indexs = []
  for (let x = 0; x < c.w - 1; x++) {
    for (let y = 0; y < c.h - 1; y++) {
      indexs.push([x * c.w + y, c.w * (x + 1) + y , x * c.w + y + 1]);
      indexs.push([c.w * (x + 1) + y, c.w * (x + 1) + y + 1 , x * c.w + y + 1]);
    }
  }
  gemotry.index = new THREE.BufferAttribute(new Uint16Array([...indexs.toString().split(',').map(i => Number(i))]), 1)
  console.log(gemotry)
  let material = new THREE.MeshLambertMaterial({
    wireframe: false,
    vertexColors: true,
    side: THREE.DoubleSide
  })
  let mesh = new THREE.Mesh(gemotry, material)
  // 阴影相关
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
}
let shapeGeometry: THREE.ShapeGeometry
let shapeMesh: THREE.Mesh
const initShap = () => {
  shapeGeometry = new THREE.SphereGeometry( 0.2, 32, 32 );
  const meterial = new THREE.MeshPhongMaterial({
    color: '0xffff00'
  })
  shapeMesh = new THREE.Mesh(shapeGeometry, meterial)
  shapeMesh.position.set(0.6, 0.6, 0)
  shapeMesh.castShadow = true
  shapeMesh.receiveShadow = true
  scene.add(shapeMesh)
}
const update = () => {
  gemotry.computeVertexNormals()
  shapeMesh.position.setZ(Math.sin(Date.now() / 1000))
  // 设置风力
  // let forceVector = new THREE.Vector3(0, -0.2, 0);

  // c.windForce(new THREE.Vector3())

  for (let i = 0; i < c.particles.length; i++) {
    let difference = new THREE.Vector3(0, 0, 0);
    // 两个向量相减 算出之间的距离
    difference.subVectors(c.particles[i].position, shapeMesh.position)

    let moveDiffer = new THREE.Vector3(0, 0, 0)
    // 球体与布料相交
    if (difference.length() < 0.2) {
      c.particles[i].movable = true;
      difference.normalize().multiplyScalar(0.2)
      // 设置布料的点为球的位置加上 距离
      c.particles[i].position.copy(shapeMesh.position).add(difference)
    } 
    if (c.particles[i].movable && difference.length() >= 0.2) {
      difference.normalize().multiplyScalar(0.2)
      c.particles[i].position.sub(difference)
      let movePostion = moveDiffer.subVectors(c.particles[i].position, c.particles[i].positionPrev)
      if (movePostion.length() < 0.2) {
        c.particles[i].movable = false
      }
    }
  }
  // 重新渲染点
  const p = c.particles.map(item => item.position.toArray()).toString().split(',').map(i => Number(i))
  const position = new Float32Array([...p])
  gemotry.setAttribute('position', new THREE.BufferAttribute(position, 3))
}
// 循环渲染
const animation = () => {
  update()
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
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}
const initModel = (): void => {
  initThree();
  initCamera();
  initScene();
  initLight()
  initObject();
  initShap();
  animation();
  initHelper()
  window.addEventListener('resize', onWindowResize)
}
export default initModel