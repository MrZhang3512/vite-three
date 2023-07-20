import * as THREE from 'three'


// 布料类
class cloth {
  w: number = 50;
  h: number = 50;
  // 每一个点的数组
  particles = new Array(this.w * this.h)
  // 约束力
  constraints = []
  constructor(w: number, h: number) {
    this.w = w
    this.h = h;
    this.particles = new Array(this.w * this.h)
    this.createParticles()
    this.setParticlesIsMove(false)
  }
  // 创建一个粒子数组，根据布料的长宽
  createParticles() {
    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++) {
        this.particles[y * this.w + x] = new particle(new THREE.Vector3(x / this.w, y / this.h, 0))
      }
    }
  }
  setParticlesIsMove(isMove: boolean) {
    for (let i = 0; i < this.w; i++) {
      this.getParticle(i, this.h - 1).movable = isMove
    }
  }
  // 获取单个粒子
  getParticle(x: number, y: number) {
    return this.particles[y * this.w + x]
  }
  // 添加风力
  addForce(v: THREE.Vector3) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].addForce(v);
    }
  }
  // 
}

// 粒子类
class particle {
  // 是否移动
  movable: boolean;
  // 位置
  position: THREE.Vector3;
  // 前 位置
  positionPrev: THREE.Vector3;
  // 粒子的重量
  mass: number;
  // 粒子移动的方向
  acc: THREE.Vector3;
  constructor(v: THREE.Vector3) {
    this.movable = false; 
    this.position = v;
    this.positionPrev = v;
    this.mass = 1;
    this.acc = new THREE.Vector3(0, 0, 0)
  }
  addForce(v: THREE.Vector3) {

  }
  
}


export default cloth