import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import star from '../018_Particles/textures/star_09.png'


// 1. We will create a scene where all things will be rendered
const scene = new THREE.Scene();

// 2. Camera

const sizes = {
    width: window.innerWidth,
    height : window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.z=5;
scene.add(camera);

// 3. Renderer

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);
 
//texture

const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load(star)

// We will make new particles geometry

const particlesGeometry = new THREE.BufferGeometry();
const count = 50000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count *3)

for(let i=0 ; i < count *3 ; i++){
    positions[i]=(Math.random()-0.5)*10
    colors[i]=Math.random()
}

particlesGeometry.setAttribute(
    'position', // Correct attribute name
    new THREE.Float32BufferAttribute(positions, 3) // Correct function
);

particlesGeometry.setAttribute(
    'color', // Correct attribute name
    new THREE.Float32BufferAttribute(colors, 3) // Correct function
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size:0.02,
    transparent:true,
    sizeAttenuation:true,
    alphaMap:particleTexture,
    depthWrite:false,
    blending: THREE.AdditiveBlending,
    vertexColors:true,
    // color:"yellow"
})

// Points

const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add(particles)


// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

// 4. Orbitcontrol

const controls = new OrbitControls(camera, renderer.domElement);

// 5. We have to add projection and to changes screen size automatically

window.addEventListener('resize',()=>{
        
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera to have same screen aspect ratio as per the change in the screen size
    camera.aspect = sizes.width/sizes.height

    //as we change the aspect ratio we have to update the projection also
    camera.updateProjectionMatrix()

    //now we have to update render so that we can make changes in it 
    renderer.setSize(sizes.width , sizes.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

const tick = () =>{
    //for orbit controls
    controls.update();
    //Render Scenes
    renderer.render(scene,camera);
    //To render next frame
    requestAnimationFrame(tick)
}

tick();