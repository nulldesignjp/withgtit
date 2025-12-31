<template lang="pug">
.page
  header
    h1 git training with Antigravity.
    p 20251231 with webGPU

  article
    p https://nft.refikanadol.com/

  footer
    p.copyright © 2025 hrsk.

  canvas(ref="webglview").webglview


  
</template>


<script setup>

import * as THREE from 'three';
import { WebGPURenderer } from "three/webgpu"
import { texture } from 'three/tsl';



import { color, uv, vec4, float, uniform, Fn } from 'three/tsl';
import { MeshStandardNodeMaterial } from 'three/webgpu';
import { MeshBasicNodeMaterial } from 'three/webgpu'; 

const webglview = ref(null)


useHead(() => ({
  title: 'untitled',
  bodyAttrs: {
    class: 'static',
  }
} ));

onMounted( async () => {


  const renderer = new WebGPURenderer({
    canvas: webglview.value,
    antialias: true,
    preserveDrawingBuffer: true
  });
  renderer.setClearColor( 0x181818 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  await renderer.init();

  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );  
  camera.position.set( 0, 0, 10 );
  camera.lookAt( 0, 0, 0 );

  const scene = new THREE.Scene();


  const ambientLight = new THREE.AmbientLight( 0x404040, 1.0 );
  scene.add( ambientLight );

  const directionalLight = new THREE.DirectionalLight( 0xffffff );
  scene.add( directionalLight );
  
  const dir = new THREE.DirectionalLight( 0xffffff, 1.0 );
  dir.position.set( 1, 1, 1 );
  scene.add( dir ); 

 
  // TSLでマテリアルを作成
  const material = new MeshStandardNodeMaterial();

  // UVのX値を赤、Y値を緑にするシンプルな色定義

  const _float = uniform(1.0);

  // const myColorNode = vec4( uv().x, uv().y, _float, 1.0 );

  const myColorNode = Fn(()=>{
    return vec4( uv().x, uv().y, _float, 1.0 );
  })()

  // マテリアルの色として設定
  material.colorNode = myColorNode;

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const mesh = new THREE.Mesh( geometry, material );

  scene.add( mesh );


  let _ldr = new THREE.TextureLoader().load('/ss.png', _texture=>{
    _texture.colorSpace = THREE.SRGBColorSpace; 
    let _scale = 0.01;
    let _w = _texture.source.data.width;
    let _h = _texture.source.data.height;
    let _geometry = new THREE.BoxGeometry( _w * _scale, _h * _scale, 1 );
    let _material = new THREE.MeshStandardMaterial({
      map: _texture,
      side: THREE.DoubleSide
    });
    // let _mesh = new THREE.Mesh( _geometry, _material );
    // _mesh.position.z = -10;
    // scene.add( _mesh ); 

    const texNode = texture(_texture);
    const material = new MeshStandardNodeMaterial();
    material.colorNode = texNode.mul(color(0xffffff));
    let _mesh = new THREE.Mesh( _geometry, material );
    _mesh.position.z = -10;
    scene.add( _mesh ); 
  })

  const _geometry = new THREE.PlaneGeometry( 2, 2 );
  const _bm = new MeshBasicNodeMaterial();
  const myFloat = uniform( 1.0 );
  _bm.colorNode = color( 0xFF00FF ).mul( myFloat );
  const _mesh = new THREE.Mesh( _geometry, _bm );
  _mesh.position.z = -5;
  scene.add( _mesh ); 



  renderer.setAnimationLoop(() => {

    _float.value = Math.sin( Date.now() / 1000 ) * 0.5 + 0.5;

    myFloat.value = Math.sin( Date.now() / 1000 ) * 0.5 + 0.5;

    mesh.rotation.x -= 0.01;
    mesh.rotation.y -= 0.01;
    renderer.render( scene, camera );
  });
  
});

onUnmounted(() => {
});

</script>

<style lang="stylus" scoped>

header,
article,
footer
  margin 0
  padding 0
  display flex
  flex-direction column
  gap 1em 

header

  h1
    margin 0
    line-height 1
    font-size 1em

  p
    margin 0
    line-height 1
    font-size 1em

footer

  .copyright
    position fixed
    left 16px
    bottom 16px
    margin 0
    line-height 1
    font-size xx-small
    opacity: 0.25

.webglview
  width 100vw
  height 100vh
  position fixed
  top 0
  left 0
  z-index -1

</style>