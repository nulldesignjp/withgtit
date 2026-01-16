<template lang="pug">
.page
  header
    h1 nulldesign.jp.
    p Learning Records and Prototype Archives

    navigation

  footer
    p.copyright © 2025 nulldesign.
    p.sns
      a(href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fhrsk.dev%2F&text=portfolip%20and%20archives.%0D%0A" target="_blank")
        img(src="/assets/img/icon_x.jpg" alt="x.com")
      
  canvas(ref="webglview").webglview

  //- iframe(src="/20180627/")


  
</template>


<script setup>
import * as THREE from 'three';
import StarPlatinum from '~/scripts/StarPlatinum';
import UnlimitedParticle from '~/scripts/UnlimitedParticle';
import CaptureStream from '~/scripts/CaptureStream';

const world = ref(null)
const webglview = ref(null)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const particles = []

let _intervalKey = null;

let _upadte = ()=>{
  _intervalKey = requestAnimationFrame( _upadte );
  particles.forEach( (particle) => {
    particle.particles.rotation.x -= 0.001
    particle.particles.rotation.y -= 0.00105
    particle.update(0.016);
  } ) 
}

useHead(() => ({
  title: 'untitled',
  bodyAttrs: {
    class: 'static',
  }
} ));

onMounted( async () => {

  world.value = new StarPlatinum({
    canvas: webglview.value,
    isOrthographic: false,
    // alpha: true,
  });

  world.value.renderer.setClearColor( 0x000000, 1 );
  // world.value.renderer.setClearAlpha( 0 );

  // Tone Mapping for Saturation Control
  world.value.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  world.value.renderer.toneMappingExposure = 1.00; // Adjust as needed (0.8 - 1.2 usually good)

  world.value.scene.fog = new THREE.Fog(0x000000, 100, 1000);


  world.value.camera.position.set( 0, 0, 350 );
  world.value.camera.far = 3000;

  // world.value.focalLengthToFOV(35)
  // world.value.camera.position.z = ~~world.value.pixelEqualMagnification();
  world.value.camera.updateProjectionMatrix();

  // Low count (Original)
  // for( var i = 0; i < 4; i++ )
  // {
  //   let _unlimitedParticle = new UnlimitedParticle(world.value, 256);
  //   particles.push( _unlimitedParticle )
  // }
  
  // High count (Refik Anadol Style) -- ~260,000 particles
  let _unlimitedParticle = new UnlimitedParticle(world.value, 512);
  particles.push( _unlimitedParticle )



  let _cs = new CaptureStream( webglview.value, 60 )

  let _flag = false;

  window.addEventListener('keydown', ()=>{
    _flag = !_flag;

    if( _flag )
      {
      _cs.rec()
    }
    else
    {
      _cs.stop()
    }
  })
  


  setTimeout(()=>{
    webglview.value.classList.add('active')
  },1000);





  //  frame
  let _frameObject = new THREE.Object3D()
  world.value.add( _frameObject );
  {
    const _padding = 16;

    const _w = window.innerWidth;
    const _h = window.innerHeight;

    const _header = document.querySelector('header');
    const _footer = document.querySelector('footer');

    const _r0 = _header.getBoundingClientRect();
    const _r1 = _footer.getBoundingClientRect();

    const _headBottom = _h/2 - _r0.bottom-1;
    const _footerTop = - ( _r1.top - _h/2 );

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
    _frameObject.add( _line );


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
    _frameObject.add( _points );


  }




  _upadte()

});

onUnmounted(() => {

  cancelAnimationFrame( _intervalKey );

  world.value.dispose();
  particles.forEach( (particle) => {
    particle.dispose();
  } )

});

</script>

<style lang="stylus" scoped>

header

  margin 16px 0
  padding 16px 32px

  backdrop-filter: blur( 16px );

footer
  left 0
  backdrop-filter: blur( 16px );
  padding 0 16px
  width 100%;

iframe
  position fixed
  top 0
  left 0
  border none
  width: 100%
  height 100vh
  z-index -2


.webglview
  opacity 0

  transition opacity 5.0s ease-in-out

  &.active
    opacity 1

</style>  