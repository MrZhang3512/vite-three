import * as THREE from 'three'
import * as OrbitControls from 'three/addons/controls/OrbitControls.js';
import { loaderPromise } from '../../utils/common'
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
  camera = new THREE.PerspectiveCamera(6, width / height, 1, 10000);
  camera.position.x = 0;
  camera.position.y = 10;
  camera.position.z = 400;
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
let light: THREE.AmbientLight;
const initLight = () => {
  light = new THREE.AmbientLight(0xffff00); // 白光 0x404040
  // light = new THREE.DirectionalLight(0x404040, 1);
  // light.position.set(550, 550, 550)
  scene.add(light);
}
// 创建物体
let mesh: any;
const initObject = async () => {
  // 加载模型
  mesh = await loaderPromise('OBJLoader', '../../assets/model/carved_wooden_elephant_4k.obj')
  // for (let i = 0; i < mesh.children.length; i++) {
  //   // mesh.children[i].material.wireframe = true
  //   const pointObjMaterial = new THREE.PointsMaterial({
  //     color: 0x00ff00,
  //     size: 1,
  //   })
  //   const pointObjMesh = new THREE.Points(mesh.children[i].geometry, pointObjMaterial)
  //   mesh.children[i] = pointObjMesh
  // }

  // 粒子系统
  // 一个平面
  const plane = new THREE.PlaneGeometry(2000, 2000, 800, 800)
  const pointMaterial = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 1,
  })
  const pointMesh = new THREE.Points(plane, pointMaterial)
  pointMesh.position.y = 0
  pointMesh.rotateX(-Math.PI / 2)
  scene.add(pointMesh)

  // console.log(mesh.children[0].geometry)
  createMesh(mesh.children[0].geometry, scene , false, 0x0000ff, 90, 0, 0)
  createMesh(mesh.children[0].geometry, scene , false, 0x00ff00, 70, -10, 0)
  // scene.add(mesh)
}
const clonemeshs: { mesh: THREE.Points, speed: number}[] = []
const meshes: any[] = []
const createMesh = (
    geometry: THREE.BufferGeometry,
    scene: THREE.Scene,
    dynamic: boolean = false,
    color = 0x0000ff,
    scale: number = 1,
    x: number = 0,
    y: number = 0
  ) => {
  // 获取顶点位置
  const positionArrt = geometry.attributes.position as THREE.BufferAttribute
  // positionArrt.clone()
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', positionArrt.clone())
  g.setAttribute('initposition', positionArrt.clone())
  // 模型上到下或者小到上（静态物体 动态物体） 生成point
  let pointmesh: THREE.Points;
  if (dynamic) {
    pointmesh = new THREE.Points(g, new THREE.PointsMaterial({
      color,
      size: 1,
    }))
  } else {
    pointmesh = new THREE.Points(g, new THREE.PointsMaterial({
      color,
      size: 1,
    }))
  }
  pointmesh.position.x = x
  pointmesh.position.y = y
  pointmesh.scale.x = pointmesh.scale.z = pointmesh.scale.y =scale 
  clonemeshs.push({
    mesh: pointmesh,
    speed: 0.5 + Math.random()
  })
  meshes.push( {
    mesh: pointmesh,
    verticesDown: 0,
    verticesUp: 0,
    direction: 0,
    speed: 15,
    delay: Math.floor( 200 + 200 * Math.random() ),
    start: Math.floor( 100 + 200 * Math.random() ),
  } );
  scene.add(pointmesh)
  // console.log(pointmesh)
  // 初始化的参数,方向

  // 将所有对象管理起来
}
// 初始化辅助线
const initHelper = () => {
  // 加一个世界坐标系
  const axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}
// 循环渲染
let delta;
let clock = new THREE.Clock()
const animation = () => {
  controls.update();
  // 计算每一帧的时间 每帧 delta最大为2s
  delta = clock.getDelta();
  delta = delta < 2 ? delta : 2;
  scene.rotateY(0.02 * delta)
  
  // 根据动态或者静态模型调整 每个模型的顶点位置
  for ( let j = 0; j < meshes.length; j ++ ) {
    const data = meshes[ j ];
		const positions = data.mesh.geometry.attributes.position;
		const initialPositions = data.mesh.geometry.attributes.initposition;
    const count = positions.count;

    if ( data.start > 0 ) {
      data.start -= 1;
    } else {
      if ( data.direction === 0 ) {
        // 向下移动
        data.direction = - 1;
      }
    }
    for ( let i = 0; i < count; i ++ ) {

      const px = positions.getX( i );
      const py = positions.getY( i );
      const pz = positions.getZ( i );

      // falling down
      if ( data.direction < 0 ) {

        if ( py > 0 ) {
          // 如果这个点在上面，随机移动
          positions.setXYZ(
            i,
            px + 1.5 * ( 0.50 - Math.random() ) * data.speed * delta * 0.02,
            // 向下移动的概率大
            py + 3.0 * ( 0.25 - Math.random() ) * data.speed * delta * 0.02,
            pz + 1.5 * ( 0.50 - Math.random() ) * data.speed * delta * 0.02
          );

        } else {
          // 移动到最下面的点加一
          data.verticesDown += 1;
        }
      }

      // rising up
      if ( data.direction > 0 ) {
        const ix = initialPositions.getX( i );
        const iy = initialPositions.getY( i );
        const iz = initialPositions.getZ( i );

        const dx = Math.abs( px - ix );
        const dy = Math.abs( py - iy );
        const dz = Math.abs( pz - iz );
          // console.log('d', dx, dy, dz)
        const d = dx + dy + dx;
        if ( d > 1) {
          // console.log('d', d)
          positions.setXYZ(
            i,
            px - ( px - ix ) / dx * data.speed * delta * ( 0.85 - Math.random() ) * 0.02,
            py - ( py - iy ) / dy * data.speed * delta * ( 1 + Math.random() ) * 0.02,
            pz - ( pz - iz ) / dz * data.speed * delta * ( 0.85 - Math.random() ) * 0.02
          );

        } else {

          data.verticesUp += 1;

        }

      }
      if ( data.verticesDown >= count ) {
        if ( data.delay <= 0 ) {
          data.direction = 1;
          data.speed = 5;
          data.verticesDown = 0;
          data.delay = 10;
        } else {
          data.delay -= 1;
        }
      }
      if ( data.verticesUp >= count ) {

        if ( data.delay <= 0 ) {

          data.direction = - 1;
          data.speed = 15;
          data.verticesUp = 0;
          data.delay = 120;
        } else {
          data.delay -= 1;

        }

      }

      positions.needsUpdate = true;

    }
  }



  mesh && mesh.rotateY(0.01)
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
  animation();
  window.addEventListener('resize', onWindowResize)
}
export default initModel