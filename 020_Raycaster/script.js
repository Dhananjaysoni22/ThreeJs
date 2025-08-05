import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as dat from 'dat.gui';


const gui = new dat.GUI();

//We Have to Create a Scene where all the things will be rendered
const scene = new THREE.Scene();

//Now lets setup camera

const sizes ={
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
camera.position.z=3;
scene.add(camera);

//Renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
});
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);

const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    new THREE.MeshBasicMaterial({color:"Red"})
)

object1.position.x=-2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    new THREE.MeshBasicMaterial({color:"Red"})
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    new THREE.MeshBasicMaterial({color:"Red"})
)

object3.position.x=2

scene.add(object1,object2,object3)

// RaycCaster

const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3,0,0);
// const rayDirection = new THREE.Vector3(10,0,0)
// rayDirection.normalize()
// raycaster.set(rayOrigin  , rayDirection)


// const intersect = raycaster.intersectObject(object2);
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1,object2,object3])
// console.log(intersects)


const controls = new OrbitControls(camera,renderer.domElement);

window.addEventListener('resize',()=>{

    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera aspect ratio as per screen change its size
    camera.aspect = sizes.width/sizes.height

    //as we change the aspect ratio we have update the projection too
    camera.updateProjectionMatrix()

    //now we have to render the changes to update the renderer component
    renderer.setSize(sizes.width,sizes.height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

//Mouse

const mouse = new THREE.Vector2()

window.addEventListener('mousemove',(event)=>{
    mouse.x= event.clientX / sizes.width * 2 - 1
    mouse.y= -(event.clientY / sizes.height) * 2 + 1
    // console.log(mouse)
})

window.addEventListener('click',(event)=>{
    if(currentIntersect.object===object1){
        console.log("Object 1 was clicked")
    }
    else if(currentIntersect.object===object2){
        console.log("Object 2 was clicked")
    }
    else if(currentIntersect.object===object3){
        console.log("Object 3 was clicked")
    }
})



const clock = new THREE.Clock()

let currentIntersect = null

const tick = () =>{

    const elapsedTime = clock.getElapsedTime()

    //To animate the objects
    object1.position.y= Math.sin(elapsedTime*0.3)*1.5
    object2.position.y= Math.sin(elapsedTime*0.8)*1.5
    object3.position.y= Math.sin(elapsedTime*1.4)*1.5



    //Cast a ray

    // const rayOrigin = new THREE.Vector3(-3,0,0);
    // const rayDirection = new THREE.Vector3(1,0,0);
    // rayDirection.normalize();
    // raycaster.set(rayOrigin,rayDirection);

    
    //cast a ray using mouse
    raycaster.setFromCamera(mouse,camera)

    const objectsToTest = [object1,object2,object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for(const object of objectsToTest){
        object.material.color.set("#ff0000")
    }
    for(const intersect of intersects){
        intersect.object.material.color.set("#0000ff")
    }

    if(intersects.length){
        if(currentIntersect === null){
            console.log("mouse enter")
        }
        currentIntersect = intersects[0];
    }
    else
    {
        if(currentIntersect){
            console.log("Mouse leave");
        }
        currentIntersect = null
    }


    // console.log(intersects)

    //For orbit controls
    controls.update()
    //Render Scenes
    renderer.render(scene,camera);
    //To render next frame
    requestAnimationFrame(tick)
}

tick();