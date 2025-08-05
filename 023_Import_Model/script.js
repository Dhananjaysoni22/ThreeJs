import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Lets create scene where everything will be rendered
const scene = new THREE.Scene();

const gui = new dat.GUI();

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
console.log(gltfLoader);

/**
 * Models
 */

    let mixer = null

gltfLoader.load(
    './models/Fox/glTF/Fox.gltf',
    (gltf)=>{
        // const children = [...gltf.scene.children]

        // for(const child of children){
        //     scene.add(child)
        // }

        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[1])

        action.play()

        gltf.scene.scale.set(0.025,0.025,0.025)
        scene.add(gltf.scene)
    },
)




// Setup camera

const sizes = {
    width : window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(-3,3,3)
scene.add(camera)

// Renderer 
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})

renderer.setSize(sizes.width,sizes.height)
renderer.render(scene,camera)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10,10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
        side:THREE.DoubleSide
    })
)
floor.receiveShadow = true
floor.rotation.x =  Math.PI * 0.5
scene.add(floor)


const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


const controls = new OrbitControls(camera,renderer.domElement);

    // SETUP Render platform

 window.addEventListener('resize',()=>{

    // To update sizes
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight

    // To Update camera aspects
    camera.aspect = sizes.width/sizes.height

    // We have to update projection to check the rendering things
    camera.updateProjectionMatrix()
    
    //Update renderer to see what changes is made on the scene 
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

 })

 // This function is required to check all the on going changes get reflected as per all frames

const clock = new THREE.Clock()
let previousTime =0

 const tick=()=>{   

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer !==null){
        mixer.update(deltaTime)
    }

    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
 }

 tick()