<template lang="pug">
.page
  header
    h1 git training with Antigravity.
    p 2025年年納

  article

    p content

  footer
    p.copyright © 2025 hrsk.

  canvas(ref="webglview").webglview


  
</template>


<script setup>

import TheWorld from '~/scripts/TheWorld';
import Wire from '~/scripts/Wire';

const webglview = ref(null)
const world = useState('world', () => null)



useHead(() => ({
  title: 'untitled',
  bodyAttrs: {
    class: 'static',
  }
} ));

onMounted( async () => {
  const canvas = webglview.value
  world.value = new TheWorld({
    canvas: canvas,
    backgroundColor: 0x181818,
    isOrthographic: true,
    isOrbitControls: true,
  });


  world.value.camera.position.set( 0, 0, 100 );
  world.value.camera.far = 200;

  //  camera settting
  if( !world.value.props.isOrthographic )
  {
    world.value.focalLengthToFOV(35);
    let dist = world.value.pixelEqualMagnification();
    world.value.camera.far = dist + 1000;
    world.value.camera.position.set( 0, 0, dist );
    world.value.camera.updateProjectionMatrix();
  }

  let _sp = Wire.Sphere( 100, 32, 0xFFFFFF );
  world.value.scene.add(_sp);

  const animate = ()=>{
    _sp.rotation.x -= 0.01;
    _sp.rotation.y -= 0.011;
  }

  world.value.renderer.setAnimationLoop( animate );

});

onUnmounted(() => {
  world.value.destroy();
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