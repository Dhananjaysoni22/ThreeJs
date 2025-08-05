import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui';

const gui = new dat.GUI();
const debugObject = {}

const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()



// Create a scene first

const scene = new THREE.Scene();

// To update all materials

const updateAllMaterial = () =>{
    scene.traverse((child)=> 
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity 
        }
    })
}




const environmentMap = cubeTextureLoader.load([
    // px means positive x and nx means negative x and position of all images matter there px nx the py ny then pz nz
    './environmentMaps/0/px.png',
    './environmentMaps/0/nx.png',
    './environmentMaps/0/py.png',
    './environmentMaps/0/ny.png',
    './environmentMaps/0/pz.png',
    './environmentMaps/0/nz.png',
])
environmentMap.colorSpace = THREE.SRGBColorSpace;
scene.background = environmentMap
// to apply on every material
// scene.environment = environmentMap

debugObject.envMapIntensity = 5
gui.add(debugObject,'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterial)



gltfLoader.load(
    './models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf)=>{
        gltf.scene.scale.set(10,10,10)
        gltf.scene.position.set(0,-4,0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation,'y')
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.001)
        .name('rotation')

        updateAllMaterial()
    }
)


// Setup Camera

const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
camera.position.z=5;
scene.add(camera)

// Renderer

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas:canvas,
    antialias:true
})
renderer.setSize(sizes.width,sizes.height)
renderer.render(scene,camera);
renderer.physicallyCorrectLights = true
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type = THREE.PCFShadowMap
// renderer.toneMappingExposure = 3

gui.add(renderer,'toneMapping',{
    No: THREE.NoToneMapping,
    Linear : THREE.LinearToneMapping,
    Reinhard : THREE.ReinhardToneMapping,
    Cineon : THREE.CineonToneMapping,
    ASCESFilmic : THREE.ACESFilmicToneMapping,
})

gui.add(renderer,'toneMappingExposure').min(0).max(10).step(0.001)

// Lets create sphere here

    const sphereGeometry = new THREE.SphereGeometry(2,32,32)
    const sphereMaterial = new THREE.MeshStandardMaterial({color:"white"})
    const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
    // scene.add(sphere)

// Light

const directionalLight = new THREE.DirectionalLight('#ffffff',3)
directionalLight.position.set(0.25,3,-2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024,1024)
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

gui.add(directionalLight,'intensity').min(0).max(10).step(0.001).name('LightIntensity')
gui.add(directionalLight.position,'x').min(-5).max(5).step(0.001).name('Light X')
gui.add(directionalLight.position,'y').min(-5).max(5).step(0.001).name('Light Y')
gui.add(directionalLight.position,'z').min(-5).max(5).step(0.001).name('Light Z')


// Orbit Controls

const controls = new OrbitControls(camera, renderer.domElement);

// Function for resize of the window screen

window.addEventListener('resize',()=>{

    //Update Sizes
    sizes.width=window.innerWidth
    sizes.height = window.innerHeight

    // Update camera aspect ratio as per the screen changes
    camera.aspect = sizes.width/sizes.height

    // We also need to update the projection of the scene
    camera.updateProjectionMatrix()

    // We have update render so that we can make changes visible
    renderer.setSize(sizes.width,sizes.height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

})

const tick = () =>{
    // For orbit controls
    controls.update()
    //Render scenes
    renderer.render(scene,camera)
    //to render next frame
    requestAnimationFrame(tick)

}

tick()