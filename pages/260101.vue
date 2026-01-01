<template lang="pug">
.page
  header
    h1 git training with Antigravity.
    p 20260101

    navigation

  //- article
  //-   p WebGPUのお作法学習を捨てた

  footer
    p.copyright © 2025 hrsk.
    p.sns
      a(href="https://x.com/hrsk")
        span Twitter
      
  canvas(ref="webglview").webglview


  
</template>


<script setup>
import * as THREE from 'three';
import TheWorld from '~/scripts/TheWorld';


const world = ref(null)
const webglview = ref(null)

useHead(() => ({
  title: 'untitled',
  bodyAttrs: {
    class: 'static',
  }
} ));

onMounted( async () => {

  world.value = new TheWorld({
    canvas: webglview.value,
    isOrthographic: true,
  });

  world.value.camera.position.set( 0, 0, 100 );


  const ambientLight = new THREE.AmbientLight( 0x404040, 1.0 );
  world.value.add( ambientLight );
  
  const dir = new THREE.DirectionalLight( 0xffffff, 1.0 );
  dir.position.set( 1, 1, 1 );
  world.value.add( dir ); 

  let _ldr = new THREE.TextureLoader().load('/ss.png', _texture=>{
    _texture.colorSpace = THREE.SRGBColorSpace; 
    let _scale = 0.4;
    let _w = _texture.source.data.width;
    let _h = _texture.source.data.height;
    let _geometry = new THREE.BoxGeometry( _w * _scale, _h * _scale, 1 );
    let _material = new THREE.MeshStandardMaterial({
      map: _texture,
      side: THREE.DoubleSide
    });

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      map: _texture
    });
    let _mesh = new THREE.Mesh( _geometry, material );
    _mesh.position.z = -100;
    world.value.add( _mesh ); 
  })



  let _ldr0 = new THREE.TextureLoader().load('/assets/img/hrsk.dev.png', _texture=>{
    _texture.colorSpace = THREE.SRGBColorSpace; 
    let _scale = 0.25;
    let _w = _texture.source.data.width * _scale;
    let _h = _texture.source.data.height * _scale;
    let _geometry = new THREE.BoxGeometry( _w, _h, 1 );
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      map: _texture
    });
    let _mesh = new THREE.Mesh( _geometry, material );
    _mesh.position.x = - window.innerWidth / 2 + 32 + _w * 0.5;
    _mesh.position.z = 0;
    world.value.add( _mesh ); 
  })

  let _ldr1 = new THREE.TextureLoader().load('/assets/img/txt_description.png', _texture=>{
    _texture.colorSpace = THREE.SRGBColorSpace; 
    let _scale = 0.5;
    let _w = _texture.source.data.width * _scale;
    let _h = _texture.source.data.height * _scale;
    let _geometry = new THREE.BoxGeometry( _w, _h, 1 );
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      map: _texture
    });
    let _mesh = new THREE.Mesh( _geometry, material );
    _mesh.position.x = - window.innerWidth / 2 + 32 + _w * 0.5;
    _mesh.position.y = -24; 
    _mesh.position.z = 0;
    world.value.add( _mesh ); 
  })

  

  
  //  frame
  {
    const _padding = 16;

    const _w = window.innerWidth;
    const _h = window.innerHeight;

    const _header = document.querySelector('header');
    const _footer = document.querySelector('footer');

    const _r0 = _header.getBoundingClientRect();
    const _r1 = _footer.getBoundingClientRect();


    const _headBottom = _h/2 - _r0.bottom;
    const _footerTop = - ( _r1.top - _h/2 );

    console.log( _r0, _r1  )

    const _goem0 = new THREE.BufferGeometry();
    const _positions = new Float32Array([
      0 - _w/2, _padding - _h/2, 0,
      _w - _w/2, _padding - _h/2, 0,
      0 - _w/2, _h - _padding - _h/2, 0,
      _w - _w/2, _h - _padding - _h/2, 0,

      0 - _w/2, _headBottom, 0,
      _w - _w/2, _headBottom, 0,
      0 - _w/2, _footerTop, 0,
      _w - _w/2, _footerTop, 0,

      _padding - _w/2, 0 - _h/2, 0,
      _padding - _w/2, _h - _h/2, 0,
      _w - _w/2 - _padding, 0 - _h/2, 0,
      _w - _w/2 - _padding, _h - _h/2, 0

    ]);
    _goem0.setAttribute('position', new THREE.BufferAttribute(_positions, 3));
    const _bm0 = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });

    const _line = new THREE.LineSegments( _goem0, _bm0 );
    _line.position.z = 50;
    world.value.add( _line );


    const _goem1 = new THREE.BufferGeometry();
    const _positions1 = new Float32Array([
      _padding - _w/2, _padding - _h/2, 0,
      _w - _padding - _w/2, _padding - _h/2, 0,
      _padding - _w/2, _h - _padding - _h/2, 0,
      _w - _padding - _w/2, _h - _padding - _h/2, 0,

      _padding - _w/2, _headBottom, 0,
      _w - _padding - _w/2, _headBottom, 0,
      _padding - _w/2, _footerTop, 0,
      _w - _padding - _w/2, _footerTop, 0,
    ]);
    _goem1.setAttribute('position', new THREE.BufferAttribute(_positions1, 3));
    const _bm1 = new THREE.PointsMaterial({
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const _points = new THREE.Points( _goem1, _bm1 );
    _points.position.z = 50;
    world.value.add( _points );
  }

});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
});

</script>

<style lang="stylus" scoped>

header
  position fixed
  top 17px
  left 17px

  padding: 16px;
  width calc( 100% - 34px );
  backdrop-filter: blur( 8px );


footer
  backdrop-filter: blur( 8px );
  width calc( 100% - 34px );


</style>  