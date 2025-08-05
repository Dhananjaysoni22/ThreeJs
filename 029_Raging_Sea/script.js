import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import waterVertexShader from './shaders/water/vertex.glsl?raw'
import waterFragmentShader from './shaders/water/fragment.glsl?raw'


const gui = new dat.GUI();
const debugObject = {}

const scene = new THREE.Scene();

// Camera Setup

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
camera.position.set(-2,3,3)
scene.add(camera);

// Renderer Setup 

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})

renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene,camera);

const waterGeometry = new THREE.PlaneGeometry(2,2,512,512)

// Colour

debugObject.depthColor = "#186691"
debugObject.surfaceColor = "#9bd8ff"


const waterMaterial = new THREE.ShaderMaterial({
    // wireframe:true,
    vertexShader:waterVertexShader,
    fragmentShader:waterFragmentShader,
    uniforms:{
        // Time is used for animation
        uTime:{value : 0},

        // These all for giving wave effect
        uBigWavesElevation: {value : 0.2},
        uBigWavesFrequency: {value : new THREE.Vector2(4,1.5)},
        uBigWavesSpeed: {value:0.75},

        uSmallWavesElevation:{value:0.15},
        uSmallWavesFrequency:{value:3.0},
        uSmallWavesSpeed:{value:0.2},
        uSmallWavesIterations:{value:4.0},

        // To give Color to wave
        uDepthColor:{value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor:{value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value:0.08},
        uColorMultiplier:{value :5}
    }
})

gui.add(waterMaterial.uniforms.uBigWavesElevation,'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value,'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value,'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed,'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

gui.add(waterMaterial.uniforms.uSmallWavesSpeed,'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallWavesElevation,'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency,'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesIterations,'value').min(0).max(5).step(1).name('uSmallWavesIterations')

gui.addColor(debugObject,'depthColor')
            .onChange(()=>{waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)})
            .name('depthColor')
gui.addColor(debugObject,'surfaceColor')
            .onChange(()=>{waterMaterial.uniforms.uSurfaceColor.value.set(debugObjectsurfaceColor)})
            .name('surfaceColor')
gui.add(waterMaterial.uniforms.uColorOffset,'value').min(0).max(1).step(0.001).name('uColorOffSet')
gui.add(waterMaterial.uniforms.uColorMultiplier,'value').min(0).max(10).step(0.001).name('uColorMultiplier')




const water = new THREE.Mesh(waterGeometry,waterMaterial);
water.rotation.x=-Math.PI*0.5
scene.add(water)

const controls = new OrbitControls(camera,renderer.domElement)

window.addEventListener('resize',()=>{

    // Update Sizes
    sizes.width = window.innerWidth,
    sizes.height = window.innerHeight

    // Update camera aspect
    camera.aspect = sizes.width/sizes.height

    camera.updateProjectionMatrix()
    

    // Update the renderer again 
    renderer.setSize(sizes.width,sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

})

const clock = new THREE.Clock();

const tick = () =>{

    const elapsedTime = clock.getElapsedTime()

    // Water
    waterMaterial.uniforms.uTime.value = elapsedTime;

    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
}

tick()