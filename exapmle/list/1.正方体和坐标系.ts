import * as THREE from 'three'
// 场景
const initModel = () => {
  const scene: THREE.Scene = new THREE.Scene();
  // 透视相机
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  // 渲染器
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    // 开启抗锯齿 
    antialias: true,
  });
  // 设置渲染尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setClearColor('#FFFFFF')
  // 将渲染的东西加到dom中
  document.getElementById('canvas-frame')?.appendChild(renderer.domElement);
  // 定义一个几何体
  const geometry: THREE.BoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );

  // 材质
  const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube:  THREE.Mesh = new THREE.Mesh( geometry, material );

  // 移动mesh
  // cube.position.x = 4
  // cube.translateX(4)
  // scene.add(cube);
  camera.position.z = 10;
  camera.position.x = 4;
  camera.position.y = 4;
  // 加一个世界坐标系 
  const axesHelperAll: THREE.AxesHelper = new THREE.AxesHelper(15);
  scene.add( axesHelperAll );

  // 为物体添加一个坐标系
  const axesHelper: THREE.AxesHelper = new THREE.AxesHelper(5);
  const objectTotal = new THREE.Object3D();
  objectTotal.add(cube);
  objectTotal.add(axesHelper);
  objectTotal.position.x = 4
  scene.add(objectTotal)

  function render(): void {
    requestAnimationFrame(render);
    // cube.rotation.y += 0.01;
    objectTotal.rotation.y += 0.01;
    // axesHelper.rotation.y += 0.01;
    // 这个值表示： 一圈为 2PI 为6.28
    // cube.rotation.x += 0.1; 
    renderer.render(scene, camera);
  }
  render()
}
export default initModel