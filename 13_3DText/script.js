import * as THREE from 'three';
import { FontLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import texture from './texture.png'
// 1. WE Will create a scene where all things will render
const scene = new THREE.Scene();

//2. Camera

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z=5;
scene.add(camera);

// 3. Renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);

//Box geometry

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({color:"blue"});
// const cube = new THREE.Mesh(geometry,material)
// scene.add(cube);

// 3d Text
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load(texture)   


const fontLoader = new FontLoader()

fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", // Load font from URL or public folder
    (font)=>{
        const textGeometry = new TextGeometry(
            'Dhananjay',{
                font:font,
                size:0.5,
                height:0.1,
                depth:0.5,
                curveSegments:12,
                bevelEnabled:true,
                bevelThickness:0.03,
                bevelSize:0.02,
                bevelOffset:0,
                bevelSegments:5
            }
        )
        const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const text = new THREE.Mesh(textGeometry,textMaterial)
        scene.add(text);
        
        const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45)
        const donutMaterial = new THREE.MeshMatcapMaterial({matcap:matcapTexture}) 

        for(let i=0;i<200;i++){
           
            const donut = new THREE.Mesh(donutGeometry,donutMaterial)

            donut.position.x=(Math.random()-0.5)*10
            donut.position.y=(Math.random()-0.5)*10
            donut.position.z=(Math.random()-0.5)*10

            donut.rotation.x=Math.random()*Math.PI
            donut.rotation.y=Math.random()*Math.PI

            const scale = Math.random()
            donut.scale.set(scale,scale,scale)

            scene.add(donut)
        }


    }
)




//4 Orbitcontrol

const controls = new OrbitControls(camera, renderer.domElement);

// 5 to add projection of the object
window.addEventListener('resize', () => {

    //Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera we have to update camera too to get the screen aspect ratio
    camera.aspect = sizes.width / sizes.height
    //now as we changes the camera aspect ratio but till now no changes has been shown on the screen to get changes on the screen we have to update the camera projection property to get the whole screen height and width
    camera.updateProjectionMatrix()
    //render is also be needed to update so that we can see the changes we are making are getting rendered
    renderer.setSize(sizes.width, sizes.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


})




// Animation Loop (This makes changes update instantly)
//it is used to see the changes instantly on the canvas if we dont use this then the reflection will not occur on the canva
const tick = () => {
    //for orbital controls
    controls.update();
    //Render your scene
    renderer.render(scene, camera);
    //To render next frame
    requestAnimationFrame(tick);
};

tick(); // Start the animation loop


