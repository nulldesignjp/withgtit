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
import UnlimitedParticle2 from '~/scripts/UnlimitedParticle2';

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

  let _unlimitedParticle = new UnlimitedParticle2(world.value, 512);
  particles.push( _unlimitedParticle )


  setTimeout(()=>{
    webglview.value.classList.add('active')
  },1000);










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

  transition opacity 2.0s ease-in-out

  &.active
    opacity 1

</style>  