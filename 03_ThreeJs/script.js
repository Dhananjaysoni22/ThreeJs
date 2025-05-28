import * as THREE from './three.module.min.js';
import * as dat from './dat.gui'
// import './style.css'
// import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/controls/OrbitControls.js';

// console.log(dat);

//Cursor
//to find out the position of the mouse cursor on 
// window.addEventListener('mousemove',(event)=>{
//     console.log(event.clientX);
// })
// console.log(OrbitControls);

// Scene
const scene = new THREE.Scene() 

// Red Cube
// const geometry = new THREE.BoxGeometry(1, 1, 1,2,2,2);

const positionsArray = new Float32Array([
    0,0,0,
    0,1,0,
    1,0,0
])

const positionsAttribute = new THREE.BufferAttribute(positionsArray,3);
const geometry = new THREE.BufferGeometry()

geometry.setAttribute('position',positionsAttribute);




const material = new THREE.MeshBasicMaterial({ color: "yellow", wireframe:true }); // Corrected "colour" to "color"
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

//To update the view size so that it can take the full screen aspect ratio
window.addEventListener('resize',()=>{

    //Update sizes
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight

    //update camera we have to update camera too to get the screen aspect ratio
    camera.aspect= sizes.width/sizes.height
    //now as we changes the camera aspect ratio but till now no changes has been shown on the screen to get changes on the screen we have to update the camera projection property to get the whole screen height and width
    camera.updateProjectionMatrix()
//render is also be needed to update so that we can see the changes we are making are getting rendered
    renderer.setSize(sizes.width, sizes.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))


})


//this eventlistener is used to get fullscreen mode when we double click on the screen and if condition is given to check if the screen is already in full screen or not 
window.addEventListener('dblclick',()=>{
    if(!document.fullscreenElement){
        canvas.requestFullscreen()
    }else{
        document.exitFullscreen()
    }
})



// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3; // Position the camera so the cube is visible
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//Clock

const clock = new THREE.Clock()


//Animation

const tick = () =>{

    //Clock
    const elapsedTime = clock.getElapsedTime()
    

    // mesh.rotation.y =elapsedTime;

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick)
}

tick()