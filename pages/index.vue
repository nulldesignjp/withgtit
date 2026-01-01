<template lang="pug">
.page
  header
    h1 git training with Antigravity.
    p 2025年年納

    ul
      li
        nuxt-link(to="/251231") 20251231 

  article

    p content
 

    p
      a(href="https://refikanadol.com/" target="_blank") https://refikanadol.com/
    p
      a(href="https://nft.refikanadol.com/" target="_blank") https://nft.refikanadol.com/

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
 
  world.value = new TheWorld({
    canvas: webglview.value,
    backgroundColor: 0x181818,
    isOrthographic: false, 
    isOrbitControls: true,
  });


  world.value.camera.position.set( 0, 0, 50 );
  world.value.camera.far = 1000;
  world.value.camera.lookAt(0,0,0);

  //  camera settting
  if( !world.value.props.isOrthographic )
  {
     // Adjust if needed, or leave defaults
  }


  
});

onUnmounted(() => {
  world.value.dispose();
});

</script>

<style lang="stylus" scoped></style>