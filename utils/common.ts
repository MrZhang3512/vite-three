
import * as THREE from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/ObJLoader';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

interface LoaderType {
  // 构造签名
  new (): any
}
interface loadersType {
  OBJLoader: LoaderType
  FBXLoader: LoaderType
}

const loaders: loadersType = {
  OBJLoader,
  FBXLoader,
}
export function createScriptLoader(src: string) {
  const scriptDom = document.createElement('script');
  scriptDom.src = src;
  document.body.appendChild(scriptDom);
}

export function loaderPromise(loaderName: keyof loadersType, sourceUrl: string) {
  return new Promise((resolve, reject) => {
    new loaders[loaderName]().load(
      sourceUrl,
      (text: any) => {
        resolve(text)
      },
      '',
      (error: any) => {
        reject(error)
      }
      )
  })
}

export function loaderTexture(sourceUrl: string) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      sourceUrl,
      (text: THREE.Texture) => {
        resolve(text)
      },
      () => {},
      (error: any) => {
        reject(error)
      }
      )
  })
}