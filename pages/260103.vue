<template lang="pug">
.page
  header
    h1 nulldesign.jp.
    p Learning Records and Prototype Archives

    navigation


  article.kv
    .inner
      p Power By nulldesign.jp.
      span &nbsp;

  footer
    p.copyright © 2025 nulldesign.
    p.sns
      a(href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fhrsk.dev%2F&text=portfolip%20and%20archives.%0D%0A" target="_blank")
        img(src="/assets/img/icon_x.jpg" alt="x.com")
      
  canvas(ref="webglview").webglview

  iframe(src="/20180627/")

  .frame


  
</template>


<script setup>
import * as THREE from 'three';
import TheWorld from '~/scripts/TheWorld';

const world = ref(null)
const webglview = ref(null)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

useHead(() => ({
  title: 'untitled',
  bodyAttrs: {
    class: 'static',
  }
} ));

onMounted( async () => {


  setTimeout(()=>{
    let _kv = document.querySelector('article.kv')

    _kv.classList.add('open')

    let _p = document.querySelector('article.kv p')
    _p.classList.add('active')

    setTimeout(()=>{
      _kv.classList.add('close')
    },3500)


  },2000)

  world.value = new TheWorld({
    canvas: webglview.value,
    isOrthographic: true,
    alpha: true,
  });

  world.value.renderer.setClearColor( 0x000000, 0 );
  world.value.renderer.setClearAlpha( 0 );

  world.value.camera.position.set( 0, 0, 100 );

  const ambientLight = new THREE.AmbientLight( 0x404040, 1.0 );
  world.value.add( ambientLight );
  
  const dir = new THREE.DirectionalLight( 0xffffff, 1.0 );
  dir.position.set( 1, 1, 1 );
  world.value.add( dir ); 

  const contents = new THREE.Object3D();
  world.value.add( contents );

  // let _ldr0 = new THREE.TextureLoader().load('/assets/img/nulldesign.jp.png', _texture=>{
  //   _texture.colorSpace = THREE.SRGBColorSpace; 
  //   let _scale = 0.5;
  //   let _w = _texture.source.data.width * _scale;
  //   let _h = _texture.source.data.height * _scale;
  //   let _geometry = new THREE.BoxGeometry( _w, _h, 1 );
  //   const material = new THREE.MeshBasicMaterial({
  //     color: 0xffffff,
  //     transparent: true,
  //     map: _texture
  //   });
  //   let _mesh = new THREE.Mesh( _geometry, material );
  //   _mesh.position.x = - window.innerWidth / 2 + 32 + _w * 0.5;
  //   _mesh.position.z = 0;
  //   contents.add( _mesh ); 
  // })

  // let _ldr1 = new THREE.TextureLoader().load('/assets/img/txt_description.png', _texture=>{
  //   _texture.colorSpace = THREE.SRGBColorSpace; 
  //   let _scale = 0.5;
  //   let _w = _texture.source.data.width * _scale;
  //   let _h = _texture.source.data.height * _scale;
  //   let _geometry = new THREE.BoxGeometry( _w, _h, 1 );
  //   const material = new THREE.MeshBasicMaterial({
  //     color: 0xffffff,
  //     transparent: true,
  //     map: _texture
  //   });
  //   let _mesh = new THREE.Mesh( _geometry, material );
  //   _mesh.position.x = - window.innerWidth / 2 + 32 + _w * 0.5;
  //   _mesh.position.y = -24; 
  //   _mesh.position.z = 0;
  //   contents.add( _mesh ); 
  // })

});

onUnmounted(() => {
  world.value.dispose();
});

</script>

<style lang="stylus" scoped>

.frame
  position fixed
  top 0
  left 0
  margin 0 16px
  width calc( 100% - 32px )
  height 100vh
  border-left 1px solid rgba(255,255,255,0.1)
  border-right 1px solid rgba(255,255,255,0.1)
  z-index 1
  pointer-events none

header

  margin 16px 0
  padding 16px 32px

  backdrop-filter: blur( 16px );
  border-top 1px solid rgba(255,255,255,0.1)
  border-bottom 1px solid rgba(255,255,255,0.1)

footer
  left 0
  backdrop-filter: blur( 16px );
  padding 0 16px
  width 100%;
  border-top 1px solid rgba(255,255,255,0.1)
  border-bottom 1px solid rgba(255,255,255,0.1)

iframe
  position fixed
  top 0
  left 0
  border none
  width: 100%
  height 100vh
  z-index -2


article.kv
  position fixed
  top 50%
  left 0
  width 100%
  height 0
  transform: translateY(-50%);
  border-top 1px solid rgba(255,255,255,0.0)
  border-bottom 1px solid rgba(255,255,255,0.0)
  overflow hidden
  
  transition height 1.5s cubic-bezier(0.83, 0, 0.17, 1), border-top 0.5s cubic-bezier(0.83, 0, 0.17, 1), border-bottom 0.5s cubic-bezier(0.83, 0, 0.17, 1)

  .inner
    margin 0 auto
    width calc( 100% - 2px )
    height 100%
    backdrop-filter: blur( 16px );
    display flex
    justify-content center
    align-items center

    p
      margin 0
      padding 0
      line-height 1
      font-size 2em
      color #fff
      font-family "EB Garamond", serif;
      letter-spacing 0.5em
      opacity 0

      transition letter-spacing 2.0s cubic-bezier(0.83, 0, 0.17, 1), opacity 2.0s cubic-bezier(0.83, 0, 0.17, 1)

      &.active
        letter-spacing 0.125em
        opacity 1 

  &.open
    height 25vh
    border-top 1px solid rgba(255,255,255,0.1)
    border-bottom 1px solid rgba(255,255,255,0.1)

  &.close
    height 0
    border-top 1px solid rgba(255,255,255,0.0)
    border-bottom 1px solid rgba(255,255,255,0.0)
    border-top 2.5s cubic-bezier(0.83, 0, 0.17, 1), border-bottom 2.5s cubic-bezier(0.83, 0, 0.17, 1)



</style>  