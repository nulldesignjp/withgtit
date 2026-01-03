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

  const NUM = 3;
  const _size = 200;
  const _margin = 10;
  const _offsetX = Math.floor( NUM / 2) - (NUM+1)%2/2;
  const _offsetY = Math.floor( Math.floor( _f.length / NUM ) / 2 );

  _f.forEach( ( _item, i ) =>{
      let _x = i % NUM;
      let _y = - Math.floor( i / NUM );

      let _geom = new THREE.PlaneGeometry( _size, _size )
      let _mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        map: new THREE.TextureLoader().load('/assets/img/sample/'+_item)
      })
      let _mesh = new THREE.Mesh( _geom, _mat )
      _mesh.position.x = ( _x - _offsetX ) * ( _size + _margin );
      _mesh.position.y = ( _y - _offsetY ) * ( _size + _margin );
      _mesh.position.z = 0;
      contents.add( _mesh );  
  });

  const _w = window.innerWidth;
  const _h = window.innerHeight;
  const _lenY = Math.floor( _f.length / NUM ) + 1;
  let _positionsL = new Float32Array( _lenY * 3 * 4 + NUM * 3 * 4 );
  const _offsetLength = _lenY * 3 * 4;
  for( var i = 0; i < _lenY; i++ )
  {
    let _y = - i
    let __y = _y * (_size + _margin);

    _positionsL[ i * 12 + 0 ] = - _w/2;
    _positionsL[ i * 12 + 1 ] = __y - _size/2;
    _positionsL[ i * 12 + 2 ] = 0;
    _positionsL[ i * 12 + 3 ] = _w/2;
    _positionsL[ i * 12 + 4 ] = __y - _size/2;
    _positionsL[ i * 12 + 5 ] = 0;

    _positionsL[ i * 12 + 6 ] = - _w/2;
    _positionsL[ i * 12 + 7 ] = __y + _size/2;
    _positionsL[ i * 12 + 8 ] = 0;
    _positionsL[ i * 12 + 9 ] = _w/2;
    _positionsL[ i * 12 + 10 ] = __y + _size/2;
    _positionsL[ i * 12 + 11 ] = 0;
  }
  for( var i = 0; i < NUM; i++ )
  {
    let _x = i % NUM;
    _x = ( _x - _offsetX ) * ( _size + _margin );

    _positionsL[ i * 12 + 0 + _offsetLength ] = _x - _size/2;
    _positionsL[ i * 12 + 1 + _offsetLength ] = - _h/2 - _lenY * (_size + _margin);
    _positionsL[ i * 12 + 2 + _offsetLength ] = 0;
    _positionsL[ i * 12 + 3 + _offsetLength ] = _x - _size/2;
    _positionsL[ i * 12 + 4 + _offsetLength ] = _h/2;
    _positionsL[ i * 12 + 5 + _offsetLength ] = 0;

    _positionsL[ i * 12 + 6 + _offsetLength ] = _x + _size/2;
    _positionsL[ i * 12 + 7 + _offsetLength ] = - _h/2 - _lenY * (_size + _margin);;
    _positionsL[ i * 12 + 8 + _offsetLength ] = 0;
    _positionsL[ i * 12 + 9 + _offsetLength ] = _x + _size/2;
    _positionsL[ i * 12 + 10 + _offsetLength ] = _h/2;
    _positionsL[ i * 12 + 11 + _offsetLength ] = 0;
  }

  let _geomL = new THREE.BufferGeometry();
  _geomL.setAttribute('position', new THREE.BufferAttribute(_positionsL, 3));
  let _matL = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
  });

  _geomL.computeBoundingBox();
    
  let _lineL = new THREE.LineSegments( _geomL, _matL );
  _lineL.position.z = 50;
  contents.add( _lineL );

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

</style>  