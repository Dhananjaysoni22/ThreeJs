import * as THREE from 'three';
import * as dat from 'dat.gui';
import gsap from 'gsap'
import gradient from '../021_Scroll_Based_Animation/texture/gradient.png'


// We have create a scene where all renders will be done
const scene = new THREE.Scene();



const gui = new dat.GUI()

const parameters = {
    materialColor : "#ffeded"
}

gui.addColor(parameters,'materialColor')
    .onChange(()=>{
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })
// Lets setup camera now

const sizes ={
    width : window.innerWidth,
    height : window.innerHeight
}

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(65,sizes.width/sizes.height)
camera.position.z=3;
cameraGroup.add(camera);

//Renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas:canvas,
    alpha:true
});
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);

let scrollY = window.scrollY
let currentSection =0

window.addEventListener('scroll',()=>{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY/sizes.height)

    if(newSection != currentSection){
        currentSection=newSection

        gsap.to(
            divMeshes[currentSection].rotation,
            {
                duration:1.5,
                ease:'power2.inOut',
                x: "+=6",
                y:"+=3"
            }
        )



    }

    console.log();


})

// Cursor

const cursor ={}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove',(event)=>{
    cursor.x = event.clientX/sizes.width -0.5
    cursor.y = event.clientY/sizes.height - 0.5
    // console.log(cursor.x,cursor.y)
})


const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load(gradient)
gradientTexture.magFilter = THREE.NearestFilter

//Creating meshes here to be rendered

// Using Single Material for all the Meshes

const material = new THREE.MeshToonMaterial({color:parameters.materialColor,gradientMap:gradientTexture})

//Meshes

const objectDistance = 4;

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,16,60),
    material
)

const cone = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material
)

torus.position.y= - objectDistance*0
cone.position.y= - objectDistance*1
torusKnot.position.y= - objectDistance*2

torus.position.x= 2
cone.position.x= 1
torusKnot.position.x= 2

scene.add(torus,cone,torusKnot)

const divMeshes = [torus,cone,torusKnot]

const particlesCount = 200
const positions = new Float32Array(particlesCount*3)

for(let i=0 ; i < particlesCount ;i++){
    positions[i * 3 + 0] = (Math.random()-0.5)*10
    positions[i * 3 + 1] = objectDistance *0.5 - Math.random()* objectDistance * divMeshes.length
    positions[i * 3 + 2] = (Math.random()-0.5)*10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))

const particlesMaterial = new THREE.PointsMaterial({
    color:parameters.materialColor,
    sizeAttenuation:true,
    size:0.03
})

const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add(particles)
// We have to add light cause this material works when there is light

const directionalLight = new THREE.DirectionalLight("#ffffff",1)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)

// To update the size of the screen as pre the resize

window.addEventListener('resize',()=>{
    
    //Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update camera aspect ratio
    camera.aspect = sizes.width/sizes.height;

    //We also need to update the projection
    camera.updateProjectionMatrix()

    //update renderer again to reflect changes
    renderer.setSize(sizes.width,sizes.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

});

const clock = new THREE.Clock()
let previousTime = 0

const tick =()=>{

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    // Animate Camera
    camera.position.y= -scrollY/sizes.height * objectDistance
    // console.log(camera.position.y)

    const parallaxX = cursor.x * 0.5
    const parallaxY = cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x)*5*deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y)*5*deltaTime


    // Rotations for Meshes
    for(let i = 0; i < divMeshes.length; i++) {
        if(i !== currentSection) {
            divMeshes[i].rotation.x += deltaTime * 0.1
            divMeshes[i].rotation.y += deltaTime * 0.12
        }
    }

    renderer.render(scene,camera);
    requestAnimationFrame(tick);
}

tick();