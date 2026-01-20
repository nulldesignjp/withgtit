<template lang="pug">
.page
  header(ref="headerRef")
    h1 nulldesign.jp.
    p Learning Records and Prototype Archives

    navigation

  footer(ref="footerRef")
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
import UnlimitedParticles from '~/scripts/UnlimitedParticles';

const world = ref(null)
const webglview = ref(null)
const headerRef = ref(null)
const footerRef = ref(null)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const particles = []

let _intervalKey = null;

let _update = ()=>{
  _intervalKey = requestAnimationFrame( _update );
  particles.forEach( (particle) => {
    particle.particles.rotation.x -= 0.0001
    particle.particles.rotation.y -= 0.0001
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

  world.value.scene.fog = new THREE.Fog(0x000000, 100, 1000);


  world.value.camera.position.set( 0, 0, 350 );
  world.value.camera.far = 3000;

  // world.value.focalLengthToFOV(35)
  // world.value.camera.position.z = ~~world.value.pixelEqualMagnification();
  world.value.camera.updateProjectionMatrix();

  const ambientLight = new THREE.AmbientLight( 0x666666, 1.0 );
  world.value.add( ambientLight );
  
  const dir = new THREE.DirectionalLight( 0xffffff, 1.0 );
  dir.position.set( 1, 1, 1 );
  world.value.add( dir ); 

  world.value.directional = dir;
  world.value.ambient = ambientLight;

  for( var i = 0; i < 8; i++ )
  {
    let _unlimitedParticles = new UnlimitedParticles(world.value, 64);
    particles.push( _unlimitedParticles )
  }
  // let _unlimitedParticles = new UnlimitedParticles(world.value, 256);
  // particles.push( _unlimitedParticles )






  //  frame
  let _frameObject = new THREE.Object3D()
  world.value.add( _frameObject );
  const _updateFrame = () => {
    // Clean up old children
    while(_frameObject.children.length > 0){ 
      const child = _frameObject.children[0];
      _frameObject.remove(child);
      if(child.geometry) child.geometry.dispose();
      if(child.material) child.material.dispose();
    }

    const _padding = 16;
    const _w = window.innerWidth;
    const _h = window.innerHeight;

    const _header = headerRef.value;
    const _footer = footerRef.value;

    if(!_header || !_footer) return;

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

  _updateFrame();
  window.addEventListener('resize', _updateFrame);

  // Expose for cleanup
  world.value._cleanupFrame = () => {
    window.removeEventListener('resize', _updateFrame);
  }




  _update()

});

onUnmounted(() => {

  cancelAnimationFrame( _intervalKey );

  if (world.value && world.value._cleanupFrame) {
    world.value._cleanupFrame();
  }

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



</style>  