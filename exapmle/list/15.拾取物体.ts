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
const initObject = async() => {
  const cubes = 100;
  for (let i = 0; i < cubes; i++) {
    const gemotry = new THREE.BoxGeometry(Math.random() * 2, Math.random() * 2, Math.random() * 2)
    const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff})
    const mesh = new THREE.Mesh(gemotry, material);
    mesh.position.x = Math.random() * 20 - 10;
    mesh.position.y = Math.random() * 20 - 10;
    mesh.position.z = Math.random() * 20 - 10;

    mesh.rotation.x = Math.random() * Math.PI * 2;
    mesh.rotation.y = Math.random() * Math.PI * 2;
    mesh.rotation.z = Math.random() * Math.PI * 2;
    scene.add(mesh);
  }
}

// 初始化辅助线
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}
let raycaster: THREE.Raycaster;
let pointer: THREE.Vector2;
const initRaycaster = () => {
  // 光线追踪累 用于物体拾取
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  function onPointerMove( event: { clientX: number; clientY: number; } ) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }
  window.addEventListener( 'pointermove', onPointerMove );
}
// 循环渲染
let theta = 0, radius = 30, o: any;
const animation = () => {
  theta += 0.1;
  // 围绕一个球旋转 degToRad将度转化为弧度
  // degrees * (PI / 180)
  //  一圈是2PI
  // （ 2*PI/360 * 角度）
  // camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta))
  // camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta))
  // camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta))
  // camera.lookAt(0, 0, 0)
  // camera.updateProjectionMatrix();

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera( pointer, camera );

  // 计算物体和射线的焦点(那些东西和该射线相交)
  const intersects = raycaster.intersectObjects( scene.children ) as any[];
  if (intersects.length > 0) {
    if (o !== intersects[0].object) {
      o && o.material.color.set(o.oldColor);
      o = intersects[0].object
      // 不能直接取color对象，因为后面会改变这个对象，所以一直拿到红色，
      console.log(' o.oldColor',  o.oldColor)
      o.oldColor = intersects[0].object.material.color.getHex();
    
      o.material.color.set( 0xff0000 )
    } 
  } else {
    o && console.log(o.oldColor)
    o && o.material.color.set(o.oldColor);
    o = null
  }

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
  initObject();
  initRaycaster();
  animation();
  window.addEventListener('resize', onWindowResize)
}
export default initModel