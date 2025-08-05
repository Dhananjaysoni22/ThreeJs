import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Colourtexture from './textures/Door_Wood_001_basecolor.jpg'
import RoughnessTexture from './textures/Door_Wood_001_roughness.jpg'
import MetalnessTexture from './textures/Door_Wood_001_metallic.jpg'
import AmbientOcclusionTexture from './textures/Door_Wood_001_ambientOcclusion.jpg'
import HeightTexture from './textures/Door_Wood_001_height.png'
import NormalTexture from './textures/Door_Wood_001_normal.jpg'
import AlphaTexture from './textures/Door_Wood_001_opacity.jpg'
import BAmbientOcclusionTexture from './textures/Brick_Wall_017_ambientOcclusion.jpg'
import BColourtexture from './textures/Brick_Wall_017_basecolor.jpg'
import BRoughnessTexture from './textures/Brick_Wall_017_roughness.jpg'
import BNormalTexture from './textures/Brick_Wall_017_normal.jpg'
import GAmbientOcclusionTexture from './textures/Grass_005_AmbientOcclusion.jpg'
import GColourtexture from './textures/Grass_005_BaseColor.jpg'
import GNormalTexture from './textures/Grass_005_Normal.jpg'
import GHeightTexture from './textures/Grass_005_Height.png'





// 1. We will Create a scene where all things will be rendered
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog('#262837',1,15)
scene.fog = fog

const textureLoader = new THREE.TextureLoader()
const doorColourtexture = textureLoader.load(Colourtexture);
const doorAlphatexture = textureLoader.load(AlphaTexture);
const doorAmbientOcclusionTexture = textureLoader.load(AmbientOcclusionTexture);
const doorHeightTexture = textureLoader.load(HeightTexture);
const doorMetalnessTexture = textureLoader.load(MetalnessTexture);
const doorRoughnessTexture = textureLoader.load(RoughnessTexture);
const doorNormalTexture = textureLoader.load(NormalTexture);
const brickRoughnessTexture = textureLoader.load(BRoughnessTexture);
const brickNormalTexture = textureLoader.load(BNormalTexture);
const brickColourtexture = textureLoader.load(BColourtexture);
const brickAmbientOcclusionTexture = textureLoader.load(BAmbientOcclusionTexture);
const grassColourTexture = textureLoader.load(GColourtexture);
const grassNormalTexture = textureLoader.load(GNormalTexture);
const grassHeightTexture = textureLoader.load(GHeightTexture);
const grassAmbientOcclusion = textureLoader.load(GAmbientOcclusionTexture)

const gui = new dat.GUI()

// 2. Camera

const sizes = {
    width : window.innerWidth,
    height : window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
camera.position.z = 10;
camera.position.y = 2;
camera.position.x = 2;
scene.add(camera);

// 3.Renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas : canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setClearColor('#262837')


//For light

const ambientLight =new THREE.AmbientLight('#b9d5ff',0.12)
gui.add(ambientLight,'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

//Directional Light

const moonLight= new THREE.DirectionalLight('#b9d5ff',0.12)
moonLight.position.set(4,5,-2)
gui.add(moonLight,'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position,'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position,'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position,'z').min(-5).max(5).step(0.001)
scene.add(moonLight)



// Now we will create a group for house 
const house = new THREE.Group()
scene.add(house);

// Door Light

const doorLight = new THREE.PointLight('#ff7d46',1,7)
doorLight.position.set(0,2.2,2.7)
house.add(doorLight)

const ghost1 = new THREE.PointLight('#ff00ff',2,3)
scene.add(ghost1)


const ghost2 = new THREE.PointLight('#00ffff',2,3)
scene.add(ghost2)


const ghost3 = new THREE.PointLight('#ffff00',2,3)
scene.add(ghost3)


const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map:brickColourtexture,
        normalMap:brickNormalTexture,
        roughnessMap:brickRoughnessTexture,
        aoMap:brickAmbientOcclusionTexture
    })  
)
walls.position.y=1.25;
house.add(walls);

//Roof

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({ color : '#b35f45'})
)

roof.position.y = 3
roof.rotation.y=Math.PI /4
house.add(roof)

// For Door

const door= new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({
        map:doorColourtexture,
        transparent:true,
        alphaMap: doorAlphatexture,
        aoMap:doorAmbientOcclusionTexture,
        displacementMap:doorHeightTexture,
        displacementScale:0.1,
        normalMap:doorNormalTexture,
        metalnessMap:doorMetalnessTexture,
        roughnessMap:doorRoughnessTexture

    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
)
door.position.y=1
door.position.z=2+0.01
house.add(door)

// Add bushes

const bushGeometry = new THREE.SphereGeometry(1,16,16);
const bushMaterial = new THREE.MeshStandardMaterial({color:'#89c854'})

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial);
bush1.position.set(0.8,0.2,2.2);
bush1.scale.set(0.5,0.5,0.5);


const bush2 = new THREE.Mesh(bushGeometry,bushMaterial);
bush2.position.set(1.4,0.2,2.1);
bush2.scale.set(0.25,0.25,0.25);


const bush3 = new THREE.Mesh(bushGeometry,bushMaterial);
bush3.position.set(-0.8,0.1,2.2);
bush3.scale.set(0.4,0.4,0.4);

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial);
bush4.position.set(-1,0.05,2.6);
bush4.scale.set(0.15,0.15,0.15);

house.add(bush1,bush3,bush2,bush4);

// For the Graves

const graves= new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6,0.8,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color:'#b2b6b1'})

for(let i=0;i<50;i++){
    const angle = Math.random()*Math.PI*2
    const radius = 3+ Math.random()*6
    const x=Math.sin(angle)*radius
    const z=Math.cos(angle)*radius

    const grave= new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y=(Math.random()-0.5)*0.4
    grave.rotation.z=(Math.random()-0.5)*0.4
    grave.castShadow=true
    graves.add(grave)
}

// For the Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial({
        side:THREE.DoubleSide,
        map:grassColourTexture,
        displacementMap:grassHeightTexture,
        normalMap:grassNormalTexture,
        aoMap:grassAmbientOcclusion
    })
)
floor.rotation.x = -Math.PI *0.5
floor.position.y=0
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)
scene.add(floor);


moonLight.castShadow=true
doorLight.castShadow=true
ghost1.castShadow=true
ghost2.castShadow=true
ghost3.castShadow=true
walls.castShadow=true

floor.receiveShadow=true

// 4. Orbit Controls

const controls = new OrbitControls(camera, renderer.domElement);

//To add projection of the object and screen size get automatically changed and adjusted

window.addEventListener('resize',()=>{

    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera to have same screen aspect ratio as per the change in screen size
    camera.aspect= sizes.width/sizes.height 

    // As we change the camera aspect ratio we have to also update the projection

    camera.updateProjectionMatrix()

    //now we have to update render so that we can make changes in it 
    renderer.setSize(sizes.width , sizes.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

// Animation Loop (This makes changes update instantly)
//it is used to see the changes instantly on the canvas if we dont use this then the reflection will not occur on the canva

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //GHOSTS

    const ghostAngle = elapsedTime*0.5;
    ghost1.position.x=Math.cos(ghostAngle*4)
    ghost1.position.z=Math.sin(ghostAngle*4)
    ghost1.position.y=Math.sin(elapsedTime*4)

    const ghost2Angle = -elapsedTime*0.32;
    ghost2.position.x=Math.cos(ghost2Angle)*5
    ghost2.position.z=Math.sin(ghost2Angle)*5
    ghost2.position.y=Math.sin(elapsedTime*4)+ Math.sin(elapsedTime*2.5)

    const ghost3Angle = -elapsedTime*0.18;
    ghost3.position.x=Math.cos(ghost3Angle)*4
    ghost3.position.z=Math.sin(ghost3Angle)*4
    ghost3.position.y=Math.sin(elapsedTime*3)

    //for orbital controls
    controls.update();
    //Render your scene
    renderer.render(scene, camera);
    //To render next frame
    requestAnimationFrame(tick);
};

tick(); // Start the animation loop

