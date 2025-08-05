import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import coffeeSmokeVertexShader from './src/shaders/coffeeSmoke/vertex.glsl?raw'
import coffeeSmokeFragmentShader from './src/shaders/coffeeSmoke/fragment.glsl?raw'



const gui = new dat.GUI()


const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

// 1. We will create a scene where all things will render
const scene = new THREE.Scene()

//Loader

const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
console.log(gltfLoader);

// 2. Camera

const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
}

const camera = new THREE.PerspectiveCamera(25,sizes.width/sizes.height,0.1,100)
camera.position.x = 8
camera.position.y = 10
camera.position.z = 12
scene.add(camera);

// 3. Renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene,camera)

// Here we can add further components


// 4. OrbitControl

const controls = new OrbitControls(camera,renderer.domElement);
controls.target.y = 3
controls.enableDamping = true

/**
 * Model
 */
gltfLoader.load(
    './static/bakedModel.glb',
    (gltf) =>
    {
        // gltf.scene.getObjectByName('baked').material.map.anisotropy = 8
        const bakedMesh = gltf.scene.getObjectByName('baked');
        if (bakedMesh && bakedMesh.material && bakedMesh.material.map) {
            bakedMesh.material.map.anisotropy = 8;
        }
        scene.add(gltf.scene)
    }
)

/**
 * Smoke
 */
    //Geometry
    const smokeGeometry = new THREE.PlaneGeometry(1,1,16,64)
    smokeGeometry.translate(0,0.5,0)
    smokeGeometry.scale(1.5,6,1.5)

    const perlinTexture = textureLoader.load('./static/perlin.png')
    perlinTexture.wrapS = THREE.RepeatWrapping
    perlinTexture.wrapT = THREE.RepeatWrapping


    //Material
    const smokeMaterial = new THREE.ShaderMaterial({
        vertexShader:coffeeSmokeVertexShader,
        fragmentShader:coffeeSmokeFragmentShader,
        uniforms:{
            uTime: new THREE.Uniform(0),
            uPerlinTexture: new THREE.Uniform(perlinTexture)
        },
        side:THREE.DoubleSide,
        transparent:true,
        // wireframe:true
        depthWrite:false
    })
    //Mesh
    const smoke =new THREE.Mesh(smokeGeometry,smokeMaterial)
    smoke.position.y=1.83
    scene.add(smoke)


// 5. To add projection of the object

window.addEventListener('resize',()=>{

    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera as we have to update camera to get the screen aspect ratio
    camera.aspect = sizes.width/sizes.height
    //now as we changes the camera aspect ratio but till now no changes has been shown on the screen to get changes on the screen we have to update the camera projection property to get the whole screen height and width
    camera.updateProjectionMatrix()
    //render is also be needed to update so that we can see the changes we are making are getting rendered
    renderer.setSize(sizes.width, sizes.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

// Animation Loop (This makes changes update instantly)
//it is used to see the changes instantly on the canvas if we dont use this then the reflection will not occur on the canva

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update Smoke
    smokeMaterial.uniforms.uTime.value=elapsedTime;

    //for orbital controls
    controls.update();
    //Render your scene
    renderer.render(scene, camera);
    //To render next frame
    requestAnimationFrame(tick);
};

tick(); // Start the animation loop