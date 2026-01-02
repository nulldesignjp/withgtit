/*
	engine.js
*/

window.onload = function () {

	//	prop
	var _unlimitedParticles = []

	//	FadeIn
	let _siteBody = document.getElementById('siteBody');
	_siteBody.classList.add('open');

	var _world = new world('webglView');
	_world.camera.position.set(0, 0, 350);

	_world.controls.autoRotate = false;
	_world.controls.autoRotateSpeed = 0.1;
	_world.controls.enableZoom = false;

	_world.controls.enabled = true;
	generateEffects();

	const NUM = 8;

	for (var i = 0; i < NUM; i++) {
		let _u = new UnlimitedParticles(_world, 64);
		_unlimitedParticles.push(_u);
	};
	loop(0);




	// setInterval(() => {
	// 	_unlimitedParticles.forEach((u) => {
	// 		u.particleUniforms.planeColor.value.r = Math.random();
	// 		u.particleUniforms.planeColor.value.g = Math.random();
	// 		u.particleUniforms.planeColor.value.b = Math.random();
	// 	});
	// }, 6000);



	/*
		functions
	*/
	function loop(_stepTime) {
		window.requestAnimationFrame(loop);
		//	clone
		_unlimitedParticles.forEach((u) => {
			u.update(_stepTime * 0.001);
		});
	}

	function generateEffects() {
		var _effect = new THREE.ShaderPass(THREE.VignetteShader);
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.intensity.value = 1.0;
		_effect.uniforms.distance.value = 4.0;
		_world.addPass(_effect);

		var _effect = new THREE.ShaderPass(THREE.NoiseShader);
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.time.value = 0;
		_world.addPass(_effect);

		var _effect = new THREE.ShaderPass(THREE.MonoShader);
		_effect.enabled = true;
		_effect.renderToScreen = false;
		// _world.addPass(_effect);

		var _effect = new THREE.ShaderPass(THREE.RGBNoiseShader);
		_effect.enabled = true;
		_effect.renderToScreen = false;
		// _world.addPass(_effect);


	}
}


class UnlimitedParticles {
	constructor(_world, width = 64) {

		this.world = _world;

		this.WIDTH = width;
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
		//	GPU
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
			vertexShader: document.getElementById('boxVertexShader').textContent,
			fragmentShader: document.getElementById('boxFragmentShader').textContent,
			transparent: true,
			//wireframe: true,
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
		this.velocityVariable = this.gpuCompute.addVariable('textureVelocity', document.getElementById('computeShaderVelocity').textContent, dtVelocity);
		this.positionVariable = this.gpuCompute.addVariable('texturePosition', document.getElementById('computeShaderPosition').textContent, dtPosition);

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
			velArray[k + 0] = THREE.Math.randFloatSpread(4);
			velArray[k + 1] = THREE.Math.randFloatSpread(4);
			velArray[k + 2] = THREE.Math.randFloatSpread(4);
			velArray[k + 3] = 0;
		}
	}

	generateGeometry() {
		var _box = new THREE.BoxBufferGeometry(2, 8, 0.1);
		//	var _box = new THREE.ConeBufferGeometry( 3, 6, 3 );

		_box.rotateZ(- Math.PI * 0.5);

		var _geometry = new THREE.BufferGeometry();
		var _position = new Float32Array(this.PARTICLES * _box.attributes.position.count * _box.attributes.position.itemSize);
		var _normal = new Float32Array(this.PARTICLES * _box.attributes.normal.count * _box.attributes.normal.itemSize);
		var _uvs = new Float32Array(this.PARTICLES * _box.attributes.uv.count * _box.attributes.uv.itemSize);
		var _index = new Uint16Array(this.PARTICLES * _box.index.count * _box.index.itemSize);

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
			for (i = 0; i < this.WIDTH; i++) {
				for (var k = 0; k < _box.attributes.position.count; k++) {
					_uvs[_idw++] = i / (this.WIDTH - 1);
					_uvs[_idw++] = j / (this.WIDTH - 1);
				}
			}
		}

		_geometry.addAttribute('position', new THREE.BufferAttribute(_position, _box.attributes.position.itemSize));
		_geometry.addAttribute('normal', new THREE.BufferAttribute(_normal, _box.attributes.normal.itemSize));
		_geometry.addAttribute('uv', new THREE.BufferAttribute(_uvs, _box.attributes.uv.itemSize));
		_geometry.setIndex(new THREE.BufferAttribute(_index, 1));

		return _geometry;
	}
}