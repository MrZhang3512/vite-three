import * as THREE from 'three'

export default function BoxHelper(mesh: THREE.Mesh){
  let BoxHelperMesh: THREE.Line;
  const positionArrt = mesh.geometry.attributes.position as THREE.BufferAttribute
  const position = positionArrt.array;
  let maxX = 0, maxY = 0, maxZ = 0, minX = 0, minY = 0, minZ = 0;
  for (let i = 0; i < position.length; i+=3) {
    let x = position[i]
    let y = position[i + 1]
    let z = position[i + 2]
    x > maxX && (maxX = x);
    x < minX && (minX = x);

    y > maxY && (maxY = y);
    y < minY && (minY = y);

    z > maxZ && (maxZ = z);
    z < minZ && (minZ = z);
  }
  const geometry = new THREE.BufferGeometry();
  const array = new Float32Array(8 * 3);
  /*
    5____4
  1/___0/|
  | 6__|_7
  2/___3/
    0: max.x, max.y, max.z
  1: min.x, max.y, max.z
  2: min.x, min.y, max.z
  3: max.x, min.y, max.z
  4: max.x, max.y, min.z
  5: min.x, max.y, min.z
  6: min.x, min.y, min.z
  7: max.x, min.y, min.z
  */
  array[0] = maxX;
  array[1] = maxY;
  array[2] = maxZ;
  array[3] = minX;
  array[4] = maxY;
  array[5] = maxZ;
  array[6] = minX;
  array[7] = minY;
  array[8] = maxZ;
  array[9] = maxX;
  array[10] = minY;
  array[11] = maxZ;
  array[12] = maxX;
  array[13] = maxY;
  array[14] = minZ;
  array[15] = minX;
  array[16] = maxY;
  array[17] = minZ;
  array[18] = minX;
  array[19] = minY;
  array[20] = minZ;
  array[21] = maxX;
  array[22] = minY;
  array[23] = minZ;
  // const indices = new Uint16Array([0, 1, 2, 0, 2, 3, 0, 3, 4, 3, 7, 4, 1, 0, 5, 0, 4, 5, 6, 2, 1,
  //   6, 1, 5,
  //   2, 3, 6,
  //   3, 7, 6,
  //   6, 4, 5,
  //   6, 7, 4
  // ]);
  const indices = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2,
    6, 3, 7]);
  geometry.setAttribute('position', new THREE.BufferAttribute(array, 3))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  const material = new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 1,
	linecap: 'round', //ignored by WebGLRenderer
	linejoin:  'round'
  })
  BoxHelperMesh = new THREE.Line(geometry, material) 
  
  BoxHelperMesh.position.x = mesh.position.x 
  BoxHelperMesh.position.y = mesh.position.y
  BoxHelperMesh.position.z = mesh.position.z 
  return BoxHelperMesh
}