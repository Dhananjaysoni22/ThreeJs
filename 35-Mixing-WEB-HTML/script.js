import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui';
import { gsap } from 'gsap';
import { element } from 'three/src/nodes/TSL.js';

let sceneReady = false;

const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // Wait a little
        window.setTimeout(() =>
        {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        }, 500)
        window.setTimeout(()=>{
            sceneReady=true
        },2000)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

/**
 * Base
 */
// Debug
const debugObject = {}


// Scene
const scene = new THREE.Scene()

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    './static/textures/environmentMaps/0/px.jpg',
    './static/textures/environmentMaps/0/nx.jpg',
    './static/textures/environmentMaps/0/py.jpg',
    './static/textures/environmentMaps/0/ny.jpg',
    './static/textures/environmentMaps/0/pz.jpg',
    './static/textures/environmentMaps/0/nz.jpg'
])

environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 2.5

/**
 * Models
 */
gltfLoader.load(
    './static/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2.5, 2.5, 2.5)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Points
*/
const raycaster = new THREE.Raycaster()
const points =[
    {
        position:new THREE.Vector3(1.55,0.3,-0.6),
        element:document.querySelector('.point-0')
    } ,
    {
        position:new THREE.Vector3(0.5,0.8,-1.6),
        element:document.querySelector('.point-1')
    },
     {
        position:new THREE.Vector3(1.6,-1.3,-0.7),
        element:document.querySelector('.point-2')
    }
]



/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

// Camera

const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)
camera.position.z=5;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
});
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.render(scene,camera);

//OrbitControl
const controls = new OrbitControls(camera,renderer.domElement);

// Now to add resize functionality
window.addEventListener('resize',()=>{
    // Update Sizess
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update camera aspect ratio
    camera.aspect = sizes.width/sizes.height

    //We have to update frame of the renderer
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(devicePixelRatio,2))
})

const tick = () =>{
    //for orbit controls
    controls.update();
    //Points will go with camera
    if(sceneReady){
        for(const point of points){
            const screenPosition = point.position.clone()
            screenPosition.project(camera);
    
            raycaster.setFromCamera(screenPosition,camera)
            const intersects = raycaster.intersectObjects(scene.children,true)
    
            if(intersects.length ==0){
                point.element.classList.add('visible')
            }else{
                const intersectionDistance = intersects[0].distance
                const pointDistance = point.position.distanceTo(camera.position)
                if( intersectionDistance < pointDistance){
                    point.element.classList.remove('visible')
                }else{
                point.element.classList.add('visible')
    
                }
            }
    
            const translateX = screenPosition.x*sizes.width*0.5
            const translateY = -screenPosition.y*sizes.height*0.5
    
            point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        }
    }

    //Render your scene
    renderer.render(scene,camera);
    //To render next frame
    window.requestAnimationFrame(tick);
}
tick()