import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

export default class UnlimitedParticles {

    static computeShaderPosition = `#define delta 1.0 / 60.0
void main(){
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;
    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz;

    pos += vel * delta;

    gl_FragColor = vec4( pos, 1.0 );
    }`

    static computeShaderVelocity = `//  速度情報
#include <common>

//  #define randomX
//  #define randomY
//  #define randomZ

//const float PI = 3.14159265;

uniform float time;

vec2 random2(vec2 st){
       vec2 _st = vec2( dot(st,vec2(127.1,311.7)),
                      dot(st,vec2(269.5,183.3)));
       return -1.0 + 2.0 * fract( sin(_st) * 43758.5453123 );
   }

float perlinNoise(vec2 st)
{
    vec2 p = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);

    vec2 v00 = random2( p + vec2(0,0) );
    vec2 v10 = random2( p + vec2(1,0) );
    vec2 v01 = random2( p + vec2(0,1) );
    vec2 v11 = random2( p + vec2(1,1) );

    return mix( mix( dot( v00, f - vec2(0,0) ), dot( v10, f - vec2(1,0) ), u.x ),
                 mix( dot( v01, f - vec2(0,1) ), dot( v11, f - vec2(1,1) ), u.x ),
                 u.y ) + 0.5;
}

float fBm (vec2 st)
{
    float f = 0.0;
    vec2 q = st;

    f += 0.5000 * perlinNoise( q ); q = q*2.01;
    f += 0.2500 * perlinNoise( q ); q = q*2.02;
    f += 0.1250 * perlinNoise( q ); q = q*2.03;
    f += 0.0625 * perlinNoise( q ); q = q*2.01;

    return f;
}

void main(){
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    //float idParticle = uv.y * resolution.x + uv.x;
    vec4 tmpPos = texture2D( texturePosition, uv );
    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz;

    float _timeScale = 0.1;
    float _fieldScale = 0.005;
    float _power = 16.0;

    vel.x = vel.x + ( fBm( tmpPos.yz * _fieldScale + vec2( time * _timeScale, randomX ) ) - 0.5 ) * _power;
    vel.y = vel.y + ( fBm( tmpPos.zx * _fieldScale + vec2( time * _timeScale, randomY ) ) - 0.5 ) * _power;
    vel.z = vel.z + ( fBm( tmpPos.xy * _fieldScale + vec2( time * _timeScale, randomZ ) ) - 0.5 ) * _power;

    float _min = 16.0;
    float _max = 32.0;
    for( float i = 0.0; i < resolution.x; i ++ ){
        for( float j = 0.0; j < resolution.y; j ++ ){
            vec2 _uv = vec2( i, j ) / ( resolution.xy - vec2(1.0,1.0) );

            vec4 _tmpPos = texture2D( texturePosition, _uv );
            vec3 dir = _tmpPos.xyz - tmpPos.xyz;
            float dist = length( dir );

            if (dist < 0.01) continue;

            if( dist < _max )
            {
                if( dist < _min )
                {
                    vel -= dir * ( _min - dist ) / _min * 0.05;
                } else {
                    vel -= dir * ( _max - dist ) / _max * 0.0005;
                }
            }
        }
    }

    //  grav
    vel = vel - tmpPos.xyz * 0.015;
    vel *= 0.98;


    gl_FragColor = vec4( vel, 1.0 );
    }`

    static boxVertexShader = `#include <common>
uniform float time;
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

varying vec3 vNormal;
varying vec2 vUv;

//const float PI = 3.14159265;

mat2 rotate2d(float _angle){
    return mat2(
        cos(_angle),-sin(_angle),
        sin(_angle),cos(_angle));
}

mat4 rotateX3d( float e ){
    return mat4(
        1,  0,    0,  0,
        0,  cos(e),   -sin(e),   0,
        0,  sin(e),   cos(e),    0,
        0,  0,    0,  1
    );
}

mat4 rotateY3d( float e ){
    return mat4(
        cos(e),  0,    sin(e),  0,
        0,  1,   0,   0,
        -sin(e),  0,   cos(e),    0,
        0,  0,    0,  1
    );
}

mat4 rotateZ3d( float e ){
    return mat4(
        cos(e),  -sin(e),    0,  0,
        sin(e),  cos(e),   0,   0,
        0,  0,  1,    0,
        0,  0,    0,  1
    );
}

mat4 rotate3D( vec3 _r ){
    return rotateX3d( _r.x ) * rotateY3d( _r.y ) * rotateZ3d( _r.z );
}

mat4 translate3d( vec3 _t ){
    return mat4(
            1,0,0,_t.x,
            0,1,0,_t.y,
            0,0,1,_t.z,
            0,0,0,1
        );
}

mat4 scale3d( vec3 _s ){
    return mat4(
            _s.x,0,0,0,
            0,_s.y,0,0,
            0,0,_s.z,0,
            0,0,0,1
        );
}

mat4 translate4D( vec3 _t, vec3 _r, vec3 _s ){
    return translate3d( _t ) * rotate3D( _r ) * scale3d( _s );
}


float atan2(in float y, in float x)
{
    return x == 0.0 ? sign(y)*3.141592653589793/2.0 : atan(y, x);
}

void main()
{
    vUv = uv;

    vec4 posTemp = texture2D( texturePosition, uv );
    vec3 pos = posTemp.xyz;

    vec4 velTemp = texture2D( textureVelocity, uv );
    vec3 vel = velTemp.xyz;
    vec3 velocity = normalize( vel );

    velocity.z *= -1.;
    float xz = length( velocity.xz );
    float xyz = 1.;
    float x = sqrt( 1. - velocity.y * velocity.y );

    float cosry = velocity.x / xz;
    float sinry = velocity.z / xz;

    float cosrz = x / xyz;
    float sinrz = velocity.y / xyz;

    mat3 maty =  mat3(
        cosry, 0, -sinry,
        0    , 1, 0     ,
        sinry, 0, cosry

    );

    mat3 matz =  mat3(
        cosrz , sinrz, 0,
        -sinrz, cosrz, 0,
        0     , 0    , 1
    );

    //vec3 _localPos = maty * matz * ( position * vec3( length(vel) * 0.01,1.0,1.0));
    vec3 _localPos = maty * matz * position;
    vNormal = maty * matz * normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( _localPos + pos, 1.0 );
    }`

    static boxFragmentShader = `uniform float time;

uniform vec3 planeColor;
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;


varying vec3 vNormal;
varying vec2 vUv;

uniform sampler2D textureVelocity;

void main()
{
    //gl_FragColor = vec4(uv,0.5+0.5*sin(time),1.0);

    //vec2 uv = gl_FragCoord.xy / resolution.xy;
    //gl_FragColor = vec4(uv,0.5+0.5*sin(time),1.0);

    vec4 viewLightPosition = viewMatrix * vec4( lightPosition, 0.0 );
    vec3 N = normalize( vNormal );
    vec3 L = normalize( viewLightPosition.xyz );
    float dotNL = dot( N, L );

    vec4 velTemp = texture2D( textureVelocity, vUv )/100.0;
    
    velTemp.rgb = vec3(0.1);



    vec3 diffuse = (planeColor + velTemp.xyz) * lightColor * max( dotNL, 0.0 );
    vec3 ambient = planeColor * ambientColor;


    gl_FragColor = vec4( planeColor, 1.0);
    gl_FragColor *= vec4( diffuse + ambient, 1.0 );
    

    //  FOG
    #ifdef USE_FOG
        #ifdef USE_LOGDEPTHBUF_EXT
            float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
            float depth = gl_FragCoord.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    #endif
    }`

    constructor(_world, _width) {
        this.world = _world;

        this.WIDTH = _width;
        this.PARTICLES = this.WIDTH * this.WIDTH;
        this.velocityVariable;
        this.velocityUniforms;
        this.positionVariable;
        this.positionUniforms;
        this.particleUniforms;

        this.init();
        this.initGPU();

    }

    init() {
        this.particleUniforms = {
            time: { value: 0 },
            texturePosition: { value: null },
            textureVelocity: { value: null },
            backbuffer: { value: null },

            // 'planeColor': { type: "c", value: new THREE.Color(0.8, 0.8, 0.8) },
            'planeColor': { type: "c", value: new THREE.Color(Math.random() * 0.1 + 0.1, Math.random() * 0.3 + 0.3, Math.random() * 0.3 + 0.6) },
            'lightPosition': { type: "v3", value: this.world.directional.position },
            'lightColor': { type: "c", value: this.world.directional.color },
            'ambientColor': { type: "c", value: this.world.ambient.color },
            'fogColor': { type: "c", value: this.world.scene.fog.color },
            'fogNear': { type: "f", value: this.world.scene.fog.near },
            'fogFar': { type: "f", value: this.world.scene.fog.far },
        }

        var _geometry = this.generateGeometry();
        var _material = new THREE.ShaderMaterial({
            uniforms: this.particleUniforms,
            vertexShader: UnlimitedParticles.boxVertexShader,
            fragmentShader: UnlimitedParticles.boxFragmentShader,
            transparent: true,
            //wireframe: true,
            side: THREE.DoubleSide,
            fog: true,

        });
        this.particles = new THREE.Mesh(_geometry, _material);
        this.world.add(this.particles);

        //	custom
        // this.particles.castShadow = true;
        // this.particles.receiveShadow = true;
        // this.world.renderer.shadowMapEnabled = true;
        // this.world.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.world.directional.castShadow = true;
        // this.world.directional.shadow.mapSize.width = 1024;
        // this.world.directional.shadow.mapSize.height = 1024;
        // this.world.directional.shadow.camera.near = 0.5;
        // this.world.directional.shadow.camera.far = 1600;
        // this.world.directional.shadow.camera.top = 500;
        // this.world.directional.shadow.camera.bottom = -500;
        // this.world.directional.shadow.camera.left = -500;
        // this.world.directional.shadow.camera.right = 500;
    }

    initGPU() {
        //	
        this.gpuCompute = new GPUComputationRenderer(this.WIDTH, this.WIDTH, this.world.renderer);

        //	演算領域の確保
        var dtPosition = this.gpuCompute.createTexture();
        var dtVelocity = this.gpuCompute.createTexture();

        this.initDataField(dtPosition, dtVelocity);

        //	shaderプログラムのアタッチ
        this.velocityVariable = this.gpuCompute.addVariable('textureVelocity', UnlimitedParticles.computeShaderVelocity, dtVelocity);
        this.positionVariable = this.gpuCompute.addVariable('texturePosition', UnlimitedParticles.computeShaderPosition, dtPosition);

        //	おまじない
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);

        this.positionUniforms = this.positionVariable.material.uniforms;
        this.velocityUniforms = this.velocityVariable.material.uniforms;

        this.positionUniforms.time = { value: 0.0 };
        this.velocityUniforms.time = { value: 0.0 };

        this.velocityVariable.material.defines.randomX = Math.random() * 100.0;
        this.velocityVariable.material.defines.randomY = Math.random() * 100.0;
        this.velocityVariable.material.defines.randomZ = Math.random() * 100.0;

        var error = this.gpuCompute.init();
        if (error !== null) {
            console.error(error);
        }
    }

    update(_stepTime = 0.016) {
        this.gpuCompute.compute();
        this.velocityUniforms.time.value = _stepTime;
        this.particles.material.uniforms.texturePosition.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
        this.particles.material.uniforms.textureVelocity.value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
    }

    initDataField(texturePosition, textureVelocity) {
        //	データを一度取り出す
        var posArray = texturePosition.image.data;
        var velArray = textureVelocity.image.data;

        //	パーティクルの初期位置と、初期速度をランダムに設定
        for (var k = 0, kl = posArray.length; k < kl; k += 4) {
            var rad = Math.random() * Math.PI * 2.0;
            var rad2 = Math.random() * Math.PI * 2.0;
            var r = Math.random() * 50;
            var x = Math.cos(rad) * Math.cos(rad2) * r;
            var y = Math.cos(rad) * Math.sin(rad2) * r;
            var z = Math.sin(rad) * r;

            // var x = THREE.Math.randFloatSpread( 50 );
            // var y = THREE.Math.randFloatSpread( 50 );
            // var z = THREE.Math.randFloatSpread( 50 );

            //	position
            posArray[k + 0] = x;
            posArray[k + 1] = y;
            posArray[k + 2] = z;
            posArray[k + 3] = 0;

            //	velocity
            // velArray[k + 0] = THREE.Math.randFloatSpread(4);
            // velArray[k + 1] = THREE.Math.randFloatSpread(4);
            // velArray[k + 2] = THREE.Math.randFloatSpread(4);
            velArray[k + 0] = (Math.random() - 0.5) * 8
            velArray[k + 1] = (Math.random() - 0.5) * 8
            velArray[k + 2] = (Math.random() - 0.5) * 8
            velArray[k + 3] = 0;
        }
    }

    generateGeometry() {
        var _box = new THREE.BoxGeometry(2, 8, 1);
        // var _box = new THREE.PlaneGeometry(2, 8);

        _box.rotateZ(- Math.PI * 0.5);

        console.log(_box.attributes)

        var _geometry = new THREE.BufferGeometry();
        var _position = new Float32Array(this.PARTICLES * _box.attributes.position.count * _box.attributes.position.itemSize);
        var _normal = new Float32Array(this.PARTICLES * _box.attributes.normal.count * _box.attributes.normal.itemSize);
        var _uvs = new Float32Array(this.PARTICLES * _box.attributes.uv.count * _box.attributes.uv.itemSize);
        var _index = new Uint32Array(this.PARTICLES * _box.index.count * _box.index.itemSize);

        var _idx = 0;
        var _idy = 0;
        var _idz = 0;
        var _idw = 0;
        var _ida = 0;

        //	position and normal
        for (var i = 0; i < this.PARTICLES; i++) {
            //	position
            for (var j = 0; j < _box.attributes.position.count * _box.attributes.position.itemSize; j++) {
                _position[_idx++] = _box.attributes.position.array[j];
                _normal[_idz++] = _box.attributes.normal.array[j];
            }
        }

        //	index
        for (var i = 0; i < this.PARTICLES; i++) {
            for (var j = 0; j < _box.index.count * _box.index.itemSize; j++) {
                _index[_ida++] = _box.index.array[j] + _box.attributes.position.count * i;
            }
        }

        var _idw = 0;
        for (var j = 0; j < this.WIDTH; j++) {
            for (var i = 0; i < this.WIDTH; i++) {
                for (var k = 0; k < _box.attributes.position.count; k++) {
                    _uvs[_idw++] = i / (this.WIDTH - 1);
                    _uvs[_idw++] = j / (this.WIDTH - 1);
                }
            }
        }

        _geometry.setAttribute('position', new THREE.BufferAttribute(_position, _box.attributes.position.itemSize));
        _geometry.setAttribute('normal', new THREE.BufferAttribute(_normal, _box.attributes.normal.itemSize));
        _geometry.setAttribute('uv', new THREE.BufferAttribute(_uvs, _box.attributes.uv.itemSize));
        _geometry.setIndex(new THREE.BufferAttribute(_index, 1));

        return _geometry;
    }
}