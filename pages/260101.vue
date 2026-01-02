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

  let _ldr = new THREE.TextureLoader().load('/ss.png', _texture=>{
    _texture.colorSpace = THREE.SRGBColorSpace; 
    let _scale = 0.4;
    let _w = _texture.source.data.width;
    let _h = _texture.source.data.height;
    let _geometry = new THREE.BoxGeometry( _w * _scale, _h * _scale, 1 );
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      map: _texture
    });
    let _mesh = new THREE.Mesh( _geometry, material );
    _mesh.position.z = -100;
    // contents.add( _mesh ); 
  })

  let _ldr0 = new THREE.TextureLoader().load('/assets/img/nulldesign.jp.png', _texture=>{
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
    _mesh.position.z = 0;
    contents.add( _mesh ); 
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
    contents.add( _mesh ); 
  })

  let _f = [
    'thumb-0.jpg',
    'thumb-1.jpg',
    'thumb-2.jpg',
    'thumb-3.jpg',
    'thumb-4.jpg'
  ]

  _f.forEach( (_item,i) =>{

    let _ldr2 = new THREE.TextureLoader().load('/assets/img/sample/'+_item, _texture=>{
      _texture.colorSpace = THREE.SRGBColorSpace; 
      let _scale = 0.15;
      let _w = _texture.source.data.width * _scale;
      let _h = _texture.source.data.height * _scale;
      let _geometry = new THREE.BoxGeometry( _w, _h, 1 );
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        map: _texture
      });
      let _mesh = new THREE.Mesh( _geometry, material );

      _mesh.position.x = ( Math.random() - 0.5 ) * window.innerWidth * 0.75;
      _mesh.position.y = ( Math.random() - 0.5 ) * window.innerHeight * 0.75; 
      _mesh.position.z = i;
      _mesh.rotation.z = ( Math.random() - 0.5 ) * Math.PI * 2.0
      contents.add( _mesh ); 

      let _padding = 5;
      let _px = _w * 0.5 + _padding;
      let _py = _h * 0.5 + _padding;

      let _pgeom = new THREE.BufferGeometry();
      const _positions = new Float32Array([
        - _px, - _py, 0,
        _px, - _py, 0,
        - _px, _py, 0,
        _px, _py, 0,
      ]);
      _pgeom.setAttribute('position', new THREE.BufferAttribute(_positions, 3));
      const _bm0 = new THREE.PointsMaterial({
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const _particle = new THREE.Points( _pgeom, _bm0 );
      _mesh.add( _particle );

      _px = _w * 0.5 + _padding;
      _py = _h * 0.5 + _padding;
      _padding *= 2;
      let _pgeomL= new THREE.BufferGeometry();
      const _positionsL = new Float32Array([
        - _px - _padding, - _py, 0,
        _px + _padding, - _py, 0,
        - _px - _padding, _py, 0,
        _px + _padding, _py, 0,

        - _px, - _py - _padding, 0,
        - _px, _py + _padding, 0,
        _px, - _py - _padding, 0,
        _px, _py + _padding, 0,
      ]);
      _pgeomL.setAttribute('position', new THREE.BufferAttribute(_positionsL, 3));
      const _bm1 = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      const _line = new THREE.LineSegments( _pgeomL, _bm1 );
      _mesh.add( _line )



    })
  
  });
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
    _line.position.z = 50;
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
    _points.position.z = 50;
    _frameObject.add( _points );
  }

  // pseudo scroll
  let _scroll = 0;
  window.addEventListener('wheel', (e) => {
    _scroll += e.deltaY;
    _scroll = Math.max( 0, _scroll );
    _scroll = Math.min( window.innerHeight, _scroll );
    // world.value.camera.position.y = - _scroll;
    // world.value.focus.y = - _scroll;
    contents.position.y = _scroll;
  });

});

onUnmounted(() => {
  world.value.dispose();
});

</script>

<style lang="stylus" scoped>

header
  position fixed
  top 17px
  left 17px

  padding: 16px;
  width calc( 100% - 34px );
  backdrop-filter: blur( 16px );

footer
  backdrop-filter: blur( 16px );
  width calc( 100% - 34px );

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
  border-top 1px solid rgba(255,255,255,0.2)
  border-bottom 1px solid rgba(255,255,255,0.2)
  overflow hidden
  
  transition height 1.5s cubic-bezier(0.83, 0, 0.17, 1)

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

</style>  