<template lang="pug">
.page
  header
    h1 git training with Antigravity.
    p 20251231 with webGPU

    ul
      li
        nuxt-link(to="/") HOME 

  article
    p WebGPUのお作法学習

  footer
    p.copyright © 2025 hrsk.

  canvas(ref="webglview").webglview


  
</template>


<script setup>
import * as TSL from 'three/tsl';
import * as THREE from 'three';
import { WebGPURenderer } from "three/webgpu"
import { texture, color, uv, vec2, vec3, vec4, float, uniform, Fn, time, mx_noise_float, sin, cos, positionLocal } from 'three/tsl';
import { MeshStandardNodeMaterial, MeshBasicNodeMaterial, PointsNodeMaterial, LineBasicNodeMaterial } from 'three/webgpu';

// import { 
//   mx_perlin_noise_float, 
//   mx_worley_noise_float, 
//   mx_fractal_noise_float 
// } from 'three/build/three.tsl.js';



const webglview = ref(null)

useHead(() => ({
  title: 'untitled',
  bodyAttrs: {
    class: 'static',
  }
} ));

onMounted( async () => {

  // 現在のバージョン (r182) で利用可能なノイズに関連する関数を全て表示
  // const noiseFunctions = Object.keys(TSL).filter(key => 
  //   key.toLowerCase().includes('noise') || 
  //   key.toLowerCase().includes('perlin') || 
  //   key.toLowerCase().includes('worley')
  // );
  // console.log('r182で利用可能なノイズ関数一覧:', noiseFunctions);
  ['interleavedGradientNoise', 'mx_cell_noise_float', 'mx_fractal_noise_float', 'mx_fractal_noise_vec2', 'mx_fractal_noise_vec3', 'mx_fractal_noise_vec4', 'mx_noise_float', 'mx_noise_vec3', 'mx_noise_vec4', 'mx_unifiednoise2d', 'mx_unifiednoise3d', 'mx_worley_noise_float', 'mx_worley_noise_vec2', 'mx_worley_noise_vec3', 'triNoise3D']

  let size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio
  }

  const renderer = new WebGPURenderer({
    canvas: webglview.value,
    antialias: true,
    preserveDrawingBuffer: true,
    forceWebGL: false
  });
  renderer.setClearColor( 0x181818 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  await renderer.init();

  // const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );  
  const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000 );
  camera.position.set( 0, 0, 100 );
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
  const uTime = uniform( 0 );

  // const myColorNode = vec4( uv().x, uv().y, _float, 1.0 );

  const myColorNode = Fn(()=>{

    //  mx_noise_float

    let n = mx_noise_float( uv().mul( 100.0 ).add( time.mul(100) ) );
    n = TSL.mx_fractal_noise_float( uv().mul( 1 ).add( time.mul(.1) ) );
    n = n.mul( 0.5 ).add( 0.5 );
    //return vec4( uv().x, uv().y, sin(time.mul(100)).mul(0.5).add(0.5), 1.0 );
    return vec4( n, n, n, 1.0 );

  })

  // マテリアルの色として設定
  material.colorNode = myColorNode();
  const geometry = new THREE.BoxGeometry( 50, 50, 50 );
  const mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );


  let _ldr = new THREE.TextureLoader().load('/ss.png', _texture=>{
    _texture.colorSpace = THREE.SRGBColorSpace; 
    let _scale = 0.25;
    let _w = _texture.source.data.width;
    let _h = _texture.source.data.height;
    let _geometry = new THREE.BoxGeometry( _w * _scale, _h * _scale, 1 );
    let _material = new THREE.MeshStandardMaterial({
      map: _texture,
      side: THREE.DoubleSide
    });

    const texNode = texture(_texture);
    const material = new MeshStandardNodeMaterial();
    material.colorNode = texNode.mul(color(0xffffff));
    material.transparent = true;
    let _mesh = new THREE.Mesh( _geometry, material );
    _mesh.position.z = -100;
    scene.add( _mesh ); 
  })
  
  const _geometry = new THREE.PlaneGeometry( 100, 100 );
  const _bm = new MeshBasicNodeMaterial();
  const myFloat = uniform( 1.0 );
  _bm.colorNode = color( 0xFF00FF ).mul( myFloat );
  const _mesh = new THREE.Mesh( _geometry, _bm );
  _mesh.position.z = -50;
  scene.add( _mesh ); 



  //  positionNode

    // 1. ノイズ計算を関数化する（複数回呼び出すため）
    const getNoiseHeight = ( pos ) => {
      let noise = TSL.mx_fractal_noise_float( pos.xz.mul(0.01).add(time.mul(0.5)) );
      return noise.mul(20);
    };

    const __positionNode = Fn(()=>{
      let pos = positionLocal.toVar();
      
      // 現在の高さ
      let h = getNoiseHeight(pos);
      pos.y.assign(h);

      const eps = 0.1;

      // 数学的な「偏微分（傾き）」を近似計算する
      // f(x + eps) - f(x)
      let h_dx = getNoiseHeight(pos.add(vec3(eps, 0, 0))).sub(h);
      let h_dz = getNoiseHeight(pos.add(vec3(0, 0, eps))).sub(h);

      // 導き出した公式: (-df/dx, 1, -df/dz) に eps のスケールを考慮
      // y成分（1.0にあたる部分）に eps を入れることで比率を合わせる
      let normal = vec3( h_dx.negate(), eps, h_dz.negate() ).normalize();

      // 「形」と「光」を物理的に一致させる法線
      positionMaterial.normalNode = normal;

      return pos;
    });

    const _planeGeometry = new THREE.PlaneGeometry( 100, 100, 100, 100 );
    _planeGeometry.rotateX( - Math.PI / 2 );
    const positionMaterial = new MeshStandardNodeMaterial({
      side: THREE.DoubleSide,
      flatShading: false // 滑らかな陰影にする場合
    });

    positionMaterial.colorNode = color( 0xFFFFFF ); 
    positionMaterial.positionNode = __positionNode(); 

    const _planeN = new THREE.Mesh( _planeGeometry, positionMaterial );
    _planeN.position.x = -150;
    _planeN.position.y = 0;
    _planeN.position.z = -50;
    _planeN.rotation.x = Math.PI / 8;
    _planeN.rotation.y = Math.PI / 8;
    scene.add( _planeN );

    const wgeo = new THREE.PlaneGeometry( 100, 100, 10, 10 );
    wgeo.rotateX( Math.PI / 2 );
    const wmat = new MeshBasicNodeMaterial({
      wireframe: true,
      transparent: true
    });
    wmat.colorNode = color( 0xFF0000 );
    wmat.positionNode = __positionNode();
    wmat.opacityNode = float(0.5);
    const wmesh = new THREE.Mesh( wgeo, wmat );
    wmesh.position.x = - 150;
    wmesh.position.y = 5;
    wmesh.position.z = - 50;
    wmesh.rotation.x = Math.PI / 8;
    wmesh.rotation.y = Math.PI / 8;
    scene.add( wmesh ); 

  
  //  frame
  {
    const _w = window.innerWidth;
    const _h = window.innerHeight;
    const _padding = 16;
    const _goem0 = new THREE.BufferGeometry();
    const _positions = new Float32Array([
      0 - _w/2, _padding - _h/2, 0,
      _w - _w/2, _padding - _h/2, 0,
      0 - _w/2, _h - _padding - _h/2, 0,
      _w - _w/2, _h - _padding - _h/2, 0,
      _padding - _w/2, 0 - _h/2, 0,
      _padding - _w/2, _h - _h/2, 0,
      _w - _w/2 - _padding, 0 - _h/2, 0,
      _w - _w/2 - _padding, _h - _h/2, 0

    ]);
    _goem0.setAttribute('position', new THREE.BufferAttribute(_positions, 3));
    const _bm0 = new LineBasicNodeMaterial();
    const myFloat0 = uniform( 1.0 );
    _bm0.transparent = true;
    _bm0.colorNode = color( 0xFFFFFF ).mul( myFloat0 );
    _bm0.opacityNode = 0.025;
    const _line = new THREE.LineSegments( _goem0, _bm0 );
    _line.position.z = 50;
    scene.add( _line );


    const _goem1 = new THREE.BufferGeometry();
    const _positions1 = new Float32Array([
      _padding - _w/2, _padding - _h/2, 0,
      _w - _padding - _w/2, _padding - _h/2, 0,
      _padding - _w/2, _h - _padding - _h/2, 0,
      _w - _padding - _w/2, _h - _padding - _h/2, 0,
    ]);
    _goem1.setAttribute('position', new THREE.BufferAttribute(_positions1, 3));
    const _bm1 = new PointsNodeMaterial();
    const myFloat1 = uniform( 1.0 );
    _bm1.transparent = true;
    _bm1.colorNode = color( 0xFFFFFF ).mul( myFloat1 );
    _bm1.opacityNode = 0.8;
    const _points = new THREE.Points( _goem1, _bm1 );
    _points.position.z = 50;
    scene.add( _points );
  }

  
  //  animation 
  renderer.setAnimationLoop(() => {

    _float.value = Math.sin( Date.now() / 1000 ) * 0.5 + 0.5;

    uTime.value = Date.now() / 1000;

    myFloat.value = Math.sin( Date.now() / 1000 ) * 0.5 + 0.5;




    mesh.rotation.x -= 0.01;
    mesh.rotation.y -= 0.01;
    renderer.render( scene, camera );
  });


  let resize = (width = window.innerWidth, height = window.innerHeight) => {
      size.width = width;
      size.height = height;
      size.pixelRatio = window.devicePixelRatio;

      if (camera.aspect) {
          camera.aspect = size.width / size.height;
      } else {
          camera.left = - size.width * 0.5;
          camera.right = size.width * 0.5;
          camera.bottom = - size.height * 0.5;
          camera.top = size.height * 0.5;
      }
      camera.updateProjectionMatrix();

      renderer.setSize(size.width, size.height);
      renderer.setPixelRatio(size.pixelRatio);
  }
  window.addEventListener('resize', ()=>{
    resize();
  });
  
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
});

</script>

<style lang="stylus" scoped></style>