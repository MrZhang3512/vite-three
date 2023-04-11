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
  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2000, 20000, 2000)
  scene.add(light);
  // 模拟相机发出的光
  // camera.add(light)
}
// 创建物体
let mesh: any;
const initObject = () => {
  let triangle = 160000;
  let geometry = new THREE.BufferGeometry();

  let positions = new Float32Array(triangle * 3 * 3);
  // 每个顶点一个法线 也可以一个面一个法线 确定光照
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

  for (let i = 0; i < positions.length; i += 9) {
    // -500 - 500
    let x = Math.random() * n - n2;
    let y = Math.random() * n - n2;
    let z = Math.random() * n - n2;
    // 三角形的点 在 6- -6之间
    let ax = x + Math.random() * d - d2
    let ay = y + Math.random() * d - d2
    let az = z + Math.random() * d - d2

    let bx = x + Math.random() * d - d2
    let by = y + Math.random() * d - d2
    let bz = z + Math.random() * d - d2

    let cx = x + Math.random() * d - d2
    let cy = y + Math.random() * d - d2
    let cz = z + Math.random() * d - d2

    positions[i] = ax;
    positions[i + 1] = ay;
    positions[i + 2] = az;
    
    positions[i + 3] = bx;
    positions[i + 4] = by;
    positions[i + 5] = bz;

    positions[i + 6] = cx;
    positions[i + 7] = cy;
    positions[i + 8] = cz;

    pA.set(ax, ay, az);
    pB.set(bx, by, bz);
    pC.set(cx, cy, cz);

    // 向量减法
    cb.subVectors(pC, pB);
    ab.subVectors(pA, pB);

    // 求正交向量
    cb.cross(ab);

    // 将该向量转换为单位向量
    cb.normalize();

    var nx = cb.x;
    var ny = cb.y;
    var nz = cb.z;
    // 三个点的法线
    normals[i] = nx;
    normals[i + 1] = ny;
    normals[i + 2] = nz;
    
    normals[i + 3] = nx;
    normals[i + 4] = ny;
    normals[i + 5] = nz;

    normals[i + 6] = nx;
    normals[i + 7] = ny;
    normals[i + 8] = nz;
    // 颜色
    //  0 - 1
    let vx = ( x  / n ) + 0.5;
    let vy = ( y  / n ) + 0.5;
    let vz = ( z  / n ) + 0.5;
    color.setRGB(vx, vy, vz);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
    
    colors[i + 3] = color.r;
    colors[i + 4] = color.g;
    colors[i + 5] = color.b;

    colors[i + 6] = color.r;
    colors[i + 7] = color.g;
    colors[i + 8] = color.b;
    // 方式2
    // colors[i] = vx;
    // colors[i + 1] = vy;
    // colors[i + 2] = vz;
    
    // colors[i + 3] = vx;
    // colors[i + 4] = vy;
    // colors[i + 5] = vz;

    // colors[i + 6] = vx;
    // colors[i + 7] = vy;
    // colors[i + 8] = vz;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  // 计算当前几何体的的边界球形，不会影响渲染效果，计算一次 之后可以用来检测碰撞
  geometry.computeBoundingSphere();

  console.log('geometry', geometry)
  let material = new THREE.MeshPhongMaterial({
    // color: 0xaaaaaa,
    // 材质的高光颜色。默认值为0x111111（深灰色）的颜色Color
    specular: 0xffffff,
    // 高亮的程度，越高的值越闪亮。默认值为 30。
    shininess: 250,
    side: THREE.DoubleSide,
    // 是否使用顶点着色
    vertexColors: true,
  });
  mesh = new THREE.Mesh(geometry, material);
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