import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import textVertexShader from './shaders/test/vertex.glsl?raw'
import textFragmentShader from './shaders/test/fragment.glsl?raw'
import flag from './textures/flag-french.jpg'
import * as dat from 'dat.gui';

const gui = new dat.GUI();



const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load(flag)



// Setup Camera

const sizes = {
    width : window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(-3,3,3)
scene.add(camera)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})

renderer.setSize(sizes.width,sizes.height)
renderer.render(scene,camera)

const geometry = new THREE.PlaneGeometry(1,1,23,23)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for(let i=0;i<count;i++){
    randoms[i]=Math.random()
}

geometry.setAttribute('aRandom',new THREE.BufferAttribute(randoms,1))
console.log(geometry)


const material = new THREE.RawShaderMaterial({
    vertexShader:textVertexShader,
    fragmentShader:textFragmentShader,
    uniforms:{
        uFrequency:{value: new THREE.Vector2(10,5)},
        uTime :{value:0},
        uColor:{value: new THREE.Color('orange')},
        uTexture:{value:flagTexture}
    }
})

gui.add(material.uniforms.uFrequency.value,'x').min(0).max(20).step(0.001).name('frequencyX')
gui.add(material.uniforms.uFrequency.value,'y').min(0).max(20).step(0.001).name('frequencyY')

const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)

const controls = new OrbitControls(camera,renderer.domElement)

// Setup for renderer and sizes updation

window.addEventListener('resize',()=>{

    // To Update Sizes
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight

    // TO Update Camera aspect Ratio
    camera.aspect = sizes.width/sizes.height

    // We have to update projection to check the rendering of things
    camera.updateProjectionMatrix()

      
    //Update renderer to see what changes is made on the scene 
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

})

 // This function is required to check all the on going changes get reflected as per all frames

 const clock = new THREE.Clock()

 const tick=()=>{   

    const elapsedTime = clock.getElapsedTime()

    //To update Time
    material.uniforms.uTime.value = elapsedTime

    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
 }

 tick()