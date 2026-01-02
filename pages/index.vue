<template lang="pug">
.page
  header
    h1 git training with Antigravity.
    p 2025年年納

    navigation

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
 
});

onUnmounted(() => {
});

</script>

<style lang="stylus" scoped></style>