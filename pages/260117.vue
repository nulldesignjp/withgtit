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

  .lineWrapper(ref="lineWrapper")

  //- iframe(src="/20180627/")


  
</template>


<script setup>
import * as THREE from 'three';
import StarPlatinum from '~/scripts/StarPlatinum';
import UnlimitedParticle from '~/scripts/UnlimitedParticle';
import CaptureStream from '~/scripts/CaptureStream';
import gsap from 'gsap';

const world = ref(null)
const webglview = ref(null)
const lineWrapper = ref(null)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const particles = []

let timeScale = 1.0;
let _intervalKey = null;

let _upadte = ()=>{
  _intervalKey = requestAnimationFrame( _upadte );
  particles.forEach( (particle) => {
    particle.particles.rotation.x -= 0.001 * ( 0.125 + timeScale * 0.875 );
    particle.particles.rotation.y -= 0.00105 * ( 0.125 + timeScale * 0.875 );
    particle.update( 0.016 * timeScale );
  } ) 
}

useHead(() => ({
  title: 'untitled',
  bodyAttrs: {
    class: 'static',
  }
} ));

onMounted( async () => {

  //  imprettion
  if( true )
  {
    

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
    
    // High count (Refik Anadol Style) -- ~260,000 particles
    let _unlimitedParticle = new UnlimitedParticle(world.value, 512);
    particles.push( _unlimitedParticle )


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
      


    setTimeout(()=>{
      webglview.value.classList.add('active')
    },1000);
    _upadte()


    let _param = {
      timeScale: 1.0,
      flg: true
    }
    window.addEventListener('click', ()=>{
      _param.flg = !_param.flg;
      const _targetScale = _param.flg?1.0:0.0;

      gsap.to( _param, { 
        timeScale: _targetScale, 
        duration: 3.0,
        onUpdate: ()=>{
          timeScale = _param.timeScale;
          _unlimitedParticle.velocityVariable.material.uniforms.timeScale.value = _param.timeScale;
        }
      } )

    })
  }



    //  dom frames
    let _frameList = []
    let _frameObject = {}
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
        backgroundColor: 'rgba(255,255,255,0.1)',
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
      _topLine.style.width = '100dvw'
      _topLine.style.height = '1px'
      lineWrapper.value.appendChild( _topLine );
      _frameList.push( _topLine ); 
      _frameObject['headTop'] = _topLine;

      let _topBottomLine = document.createElement('div');
      _topBottomLine.classList.add('line')
      Object.assign( _topBottomLine.style, _lineStyle );
      _topBottomLine.style.left = 0;
      _topBottomLine.style.top = ( _headBottom ) + 'px'
      _topBottomLine.style.width = '100dvw'
      _topBottomLine.style.height = '1px'
      lineWrapper.value.appendChild( _topBottomLine );
      _frameList.push( _topBottomLine ); 
      _frameObject['headBottom'] = _topBottomLine;


      let _bottomLine = document.createElement('div');
      _bottomLine.classList.add('line')
      Object.assign( _bottomLine.style, _lineStyle );
      _bottomLine.style.left = 0;
      _bottomLine.style.top = ( _h - _padding ) + 'px'
      _bottomLine.style.width = '100dvw'
      _bottomLine.style.height = '1px'
      lineWrapper.value.appendChild( _bottomLine );
      _frameList.push( _bottomLine );
      _frameObject['footerBottom'] = _bottomLine;


      let _bottomTopLine = document.createElement('div');
      _bottomTopLine.classList.add('line')
      Object.assign( _bottomTopLine.style, _lineStyle );
      _bottomTopLine.style.left = 0;
      _bottomTopLine.style.top = ( _footerTop ) + 'px'
      _bottomTopLine.style.width = '100dvw'
      _bottomTopLine.style.height = '1px'
      lineWrapper.value.appendChild( _bottomTopLine );
      _frameList.push( _bottomTopLine );  
      _frameObject['footerTop'] = _bottomTopLine;


    }


    window.addEventListener('resize', () => {
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

    })



    let _duration = 10000;
    let _mouseKey;
    let _activeCheck = ()=>
    {
      const _header = document.querySelector('header')
      const _footer = document.querySelector('footer')
      const _lineWrapper = document.querySelector('.lineWrapper')
      _header.classList.remove('hide');
       _footer.classList.remove('hide');
      _lineWrapper.classList.remove('hide');

      clearTimeout( _mouseKey );
      _mouseKey = setTimeout(()=>{
        _header.classList.add('hide');
         _footer.classList.add('hide');
        _lineWrapper.classList.add('hide');
      }, _duration)
    }
    _activeCheck();
    window.addEventListener('mousemove',()=>{
      _activeCheck()
    });



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

  margin 16px
  padding 16px
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

.lineWrapper
  pointer-events none
  mix-blend-mode screen
  zIndex 1000



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

//Multiply