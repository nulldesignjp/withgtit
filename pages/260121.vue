<template lang="pug">
.page
  header
    h1 nulldesign.jp.
    p Learning Records and Prototype Archives

    navigation

  .contents(ref="contents")
    h2 archives
      

  footer
    p.copyright © 2025 nulldesign.
    p.sns
      a(href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fhrsk.dev%2F&text=portfolip%20and%20archives.%0D%0A" target="_blank")
        img(src="/assets/img/icon_x.jpg" alt="x.com")
      
  canvas(ref="webglview").webglview

  .lineWrapper(ref="lineWrapper")

  //- iframe(src="/20180627/")


  
</template>


<script setup>
import * as THREE from 'three';
import StarPlatinum from '~/scripts/StarPlatinum';
import CaptureStream from '~/scripts/CaptureStream';
import gsap from 'gsap';

const world = ref(null)
const webglview = ref(null)
const lineWrapper = ref(null)
const contents = ref(null)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let _intervalKey = null;

let _upadte = ()=>{
  _intervalKey = requestAnimationFrame( _upadte );
}


//  dom frames
let _frameList = []
let _frameObject = {}
let _resize = ()=>
{
  const _padding = 16;
  const _w = window.innerWidth;
  const _h = window.innerHeight;
  const _header = document.querySelector('header');
  const _footer = document.querySelector('footer');
  const _r0 = _header.getBoundingClientRect();
  const _r1 = _footer.getBoundingClientRect();
  const _headBottom = _r0.bottom;
  const _footerTop = _r1.top;
  _frameObject['frameLeft'].style.left = _padding + 'px';
  _frameObject['frameRight'].style.left = _w - _padding + 'px';

  _frameObject['headTop'].style.left = '0px';
  _frameObject['headTop'].style.top = _padding + 'px';

  _frameObject['headBottom'].style.left = '0px';
  _frameObject['headBottom'].style.top = _headBottom + 'px';

  _frameObject['footerTop'].style.left = '0px';
  _frameObject['footerTop'].style.top = _footerTop + 'px';

  _frameObject['footerBottom'].style.left = '0px';
  _frameObject['footerBottom'].style.top = _h - _padding + 'px';

}


let _duration = 10000;
let _mouseKey;
let _activeCheck = ()=>
{
  const _header = document.querySelector('header')
  const _footer = document.querySelector('footer')
  _header?.classList.remove('hide');
  _footer?.classList.remove('hide');

  clearTimeout( _mouseKey );
  _mouseKey = setTimeout(()=>{
    _header?.classList.add('hide');
    _footer?.classList.add('hide');
  }, _duration)
}



useHead(() => ({
  title: 'untitled',
  // bodyAttrs: {
  //   class: 'static',
  // }
} ));

onMounted( async () => {

  //  imprettion
  if( true )
  {

    world.value = new StarPlatinum({
      canvas: webglview.value,
      isOrthographic: false,
      backgroundColor: 0xF0F0F0,
      // alpha: true,
    });

    world.value.renderer.setClearColor( 0xF0F0F0, 1 );
    // world.value.renderer.setClearAlpha( 0 );

    // Tone Mapping for Saturation Control
    world.value.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    world.value.renderer.toneMappingExposure = 1.00; // Adjust as needed (0.8 - 1.2 usually good)

    world.value.scene.fog = new THREE.Fog(0xF0F0F0, 100, 1000);

    world.value.camera.position.set( 0, 0, 350 );
    world.value.camera.far = 3000;

    world.value.focalLengthToFOV(35)
    world.value.camera.position.z = ~~world.value.pixelEqualMagnification();
    world.value.camera.updateProjectionMatrix();
    

    let _size = 180
    let _margin = 30
    for( var i = 0; i < 3; i++ )
    {
      for( var j = 0; j < 5; j++ )
      {
        let _geometry = new THREE.PlaneGeometry( _size, _size )
        let _material = new THREE.MeshBasicMaterial({
          color: 0xFF0000,
          side: THREE.DoubleSide,
        })
        let _mesh = new THREE.Mesh( _geometry, _material )
        _mesh.position.set( ( i - 1 ) * ( _size + _margin ), - ( j - 0 ) * ( _size + _margin ), 0 )
        world.value.scene.add( _mesh )


        let _dom = document.createElement('div')
        _dom.classList.add('cell')

        let _p = document.createElement('p')
        _p.textContent = `POST - ${i} ${j}`
        _dom.appendChild( _p )

        contents.value.appendChild( _dom )



      }
    }




    //  capture stream
    if( false )
    {
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

    }

    _upadte()


  }



    if( true )
    {

      const _padding = 16;

      const _w = window.innerWidth;
      const _h = window.innerHeight;

      const _header = document.querySelector('header');
      const _footer = document.querySelector('footer');

      const _r0 = _header.getBoundingClientRect();
      const _r1 = _footer.getBoundingClientRect();

      const _headBottom = _r0.bottom;
      const _footerTop = _r1.top;

      let _lineStyle = {
        background: 'rgba(0,0,0,0.4)',
        position: 'fixed'
      }

      let _leftLine = document.createElement('div')
      _leftLine.classList.add('line')
      Object.assign( _leftLine.style, _lineStyle );
      _leftLine.style.left = ( 0 + _padding ) + 'px'
      _leftLine.style.top = 0;
      _leftLine.style.width = '1px'
      _leftLine.style.height = '100dvh'
      lineWrapper.value.appendChild( _leftLine );
      _frameList.push( _leftLine ); 
      _frameObject['frameLeft'] = _leftLine;

      let _rightLine = document.createElement('div')
      _rightLine.classList.add('line')
      Object.assign( _rightLine.style, _lineStyle );
      _rightLine.style.left = ( _w - _padding ) + 'px'
      _rightLine.style.top = 0;
      _rightLine.style.width = '1px'
      _rightLine.style.height = '100dvh'
      lineWrapper.value.appendChild( _rightLine );
      _frameList.push( _rightLine ); 
      _frameObject['frameRight'] = _rightLine;

      let _topLine = document.createElement('div');
      _topLine.classList.add('line')
      Object.assign( _topLine.style, _lineStyle );
      _topLine.style.left = 0;
      _topLine.style.top = ( 0 + _padding ) + 'px'
      _topLine.style.width = '100vw'
      _topLine.style.height = '1px'
      lineWrapper.value.appendChild( _topLine );
      _frameList.push( _topLine ); 
      _frameObject['headTop'] = _topLine;

      let _topBottomLine = document.createElement('div');
      _topBottomLine.classList.add('line')
      Object.assign( _topBottomLine.style, _lineStyle );
      _topBottomLine.style.left = 0;
      _topBottomLine.style.top = ( _headBottom ) + 'px'
      _topBottomLine.style.width = '100vw'
      _topBottomLine.style.height = '1px'
      lineWrapper.value.appendChild( _topBottomLine );
      _frameList.push( _topBottomLine ); 
      _frameObject['headBottom'] = _topBottomLine;


      let _bottomLine = document.createElement('div');
      _bottomLine.classList.add('line')
      Object.assign( _bottomLine.style, _lineStyle );
      _bottomLine.style.left = 0;
      _bottomLine.style.top = ( _h - _padding ) + 'px'
      _bottomLine.style.width = '100vw'
      _bottomLine.style.height = '1px'
      lineWrapper.value.appendChild( _bottomLine );
      _frameList.push( _bottomLine );
      _frameObject['footerBottom'] = _bottomLine;


      let _bottomTopLine = document.createElement('div');
      _bottomTopLine.classList.add('line')
      Object.assign( _bottomTopLine.style, _lineStyle );
      _bottomTopLine.style.left = 0;
      _bottomTopLine.style.top = ( _footerTop ) + 'px'
      _bottomTopLine.style.width = '100vw'
      _bottomTopLine.style.height = '1px'
      lineWrapper.value.appendChild( _bottomTopLine );
      _frameList.push( _bottomTopLine );  
      _frameObject['footerTop'] = _bottomTopLine;


    }




    _activeCheck();
    window.addEventListener('mousemove',_activeCheck );
    window.addEventListener('touchmove',_activeCheck );
    window.addEventListener('resize', _resize )



    setInterval(()=>{
      world.value.camera.position.y = - window.scrollY
      world.value.focus.y = world.value.camera.position.y;
    }, 4)

    // let _scroll = (e)=>{
    //   world.value.camera.position.y = - window.scrollY
    //   world.value.focus.y = world.value.camera.position.y;
    // }

    // window.addEventListener('wheel', _scroll );

});

onUnmounted(() => {

  cancelAnimationFrame( _intervalKey );

  world.value.dispose();

  clearTimeout( _mouseKey );
  window.removeEventListener('resize', _activeCheck); 
  window.removeEventListener('mousemove', _activeCheck);
  window.removeEventListener('touchmove', _activeCheck);
  window.removeEventListener('resize', _resize)

  _frameList.forEach( (frame) => {
    frame.remove();
  } )
  _frameList = [];
  _frameObject = {};



});

</script>

<style lang="stylus" scoped>

header,
footer
  color #080808

header
  margin 16px
  padding 16px
  backdrop-filter: blur( 16px );

footer
  left 0
  backdrop-filter: blur( 16px );
  padding 0 16px
  width 100%;



.lineWrapper
  pointer-events none
  z-index 1000



header,
.lineWrapper
  opacity 1
  transition opacity 1.0s 0.0s ease 
  will-change opacity

  &.hide
    opacity 0
    pointer-events none


footer
  transition backdrop-filter 1.0s ease
  will-change backdrop-filter

  &.hide
    backdrop-filter: blur( 0px );

</style>  


<style lang="stylus">

.contents
  display grid
  grid-template-columns repeat( 3, 200px )
  gap 10px
  margin 0
  padding 0 32px
  width 100%
  color #080808
  place-content: center;
  place-items: center;

  h2
    margin-top 0
    line-height 1

  .cell
    padding 180px 10px 20px
    width 200px
    height 240px
    border 1px solid rgba(0,0,0,0.4)

    p
      margin-bottom 0
      font-size 12px

</style>

//Multiply