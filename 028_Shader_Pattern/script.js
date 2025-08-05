import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import textVertexShader from './shaders/vertex.glsl?raw'
import textFragmentShader from './shaders/fragment.glsl?raw'

const gui = new dat.GUI();

const scene = new THREE.Scene();

// Camera Setup 

const sizes ={
    width:window.innerWidth,
    height:window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
camera.position.set(-3,3,3);
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})

renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera)

const geometry = new THREE.PlaneGeometry(1,1,32,32)

// MAterial
const material = new THREE.ShaderMaterial({
    vertexShader:textVertexShader,
    fragmentShader:textFragmentShader,
    side:THREE.DoubleSide
})

const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)

const controls = new OrbitControls(camera,renderer.domElement)

window.addEventListener('resize',()=>{

    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update aspect ratio
    camera.aspect = sizes.width/sizes.height

      
    //Update renderer to see what changes is made on the scene 
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

})

const clock = new THREE.Clock()

const tick=()=>{   

   const elapsedTime = clock.getElapsedTime()

   controls.update()
   renderer.render(scene,camera)
   requestAnimationFrame(tick)
}

tick()