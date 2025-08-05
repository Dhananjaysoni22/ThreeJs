import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui'
import CANNON from 'cannon'
import nx from '../022_Physics/textures/nx.png'
import ny from '../022_Physics/textures/ny.png'
import nz from '../022_Physics/textures/nz.png'
import px from '../022_Physics/textures/px.png'
import py from '../022_Physics/textures/py.png'
import pz from '../022_Physics/textures/pz.png'
import hit from '../022_Physics/sound/hit.mp3'



// We have to create a scene first
const scene = new THREE.Scene();

const gui = new dat.GUI();
const debugObject = {}

debugObject.createSphere = () =>
    {
    createSphere(
        Math.random()*0.5,
        {
            x:(Math.random() - 0.5)*3,
            y:3,
            z:(Math.random() - 0.5)*3
        }
    )
}
gui.add(debugObject,'createSphere')

debugObject.createBox = () =>
    {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x:(Math.random() - 0.5)*3,
            y:3,
            z:(Math.random() - 0.5)*3
        }
    )
}
gui.add(debugObject,'createBox')

// TO remove everything from the scene

debugObject.reset=()=>{
    for(const object of objectsToUpdate){

        // TO Remove collide sound
        object.body.removeEventListener('collide',playHitSound)
        // To remove item from physics world    
        world.removeBody(object.body)
        // To remove item from threejs world
        scene.remove(object.mesh)
    }
}
gui.add(debugObject,'reset')
// Camera SetUp
 
    const sizes ={
        width: window.innerWidth,
        height:window.innerHeight
    }

    const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.1, 100);
    camera.position.set(- 3, 3, 3)
    // camera.position.y=-5
    scene.add(camera);

    // Renderer

    const canvas = document.querySelector('.webgl');
    const renderer = new THREE.WebGLRenderer({
        canvas:canvas
    });

    renderer.setSize(sizes.width,sizes.height)
    renderer.render(scene,camera);

    // TextureLoader
    const textureLoader = new THREE.TextureLoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    const environmentMapTexture = cubeTextureLoader.load([
        nx,
        ny,
        nz,
        px,
        py,
        pz
    ])
    // Sound
    const hitSound= new Audio(hit)
    const playHitSound = (collision) =>{
        const impactStrength = collision.contact.getImpactVelocityAlongNormal()
        if(impactStrength > 1.5)
        {
            hitSound.volume=Math.random()
            hitSound.currentTime=0
            hitSound.play()
        }
    }

    /*
        Here we Will make new Physics World
    */
   const world = new CANNON.World()
   world.broadphase = new CANNON.SAPBroadphase(world)
   world.allowSleep=true
   world.gravity.set(0,-9.82,0)

    // Material for physics world floor and sphere cause right now the sphere is hitting the floor and getting fixed on that floor if we give sphere plastic and floor concrete maybe it bounce
 
    /*
    const concreteMaterial = new CANNON.Material('concrete')
    const plasticMaterial = new CANNON.Material('plastic')

    const concretePlasticContactMaterial = new CANNON.ContactMaterial(
        concreteMaterial,
        plasticMaterial,
        {
            friction:0.1,
            restitution:0.7
        }
    )
    world.addContactMaterial(concretePlasticContactMaterial)
    */
    const defaultMaterial = new CANNON.Material('default')
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction:0.1,
            restitution:0.7
        }
    )

    // We can use default material for all over the scene
    world.addContactMaterial(defaultContactMaterial)
    world.defaultContactMaterial = defaultContactMaterial

//    // We will create same sphere in physic world now with same radius
//    const sphereShape = new CANNON.Sphere(0.5)
//    const sphereBody = new CANNON.Body({
//         mass:1,
//         position:new CANNON.Vec3(0,3,0),
//         shape:sphereShape,
//         // material:plasticMaterial
//    })
//    sphereBody.applyLocalForce(new CANNON.Vec3(150,0,0), new CANNON.Vec3(0,0,0))
//    world.addBody(sphereBody)

   //Floor

   const floorShape = new CANNON.Plane()
   const floorBody = new CANNON.Body()
   floorBody.mass=0
   floorBody.addShape(floorShape)
   floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1,0,0),
        Math.PI*0.5
   )
//    floorBody.material = concreteMaterial
   world.addBody(floorBody)


    // Meshes
    // const sphere = new THREE.Mesh(
    //     new THREE.SphereGeometry(0.5,32,32),
    //     new THREE.MeshStandardMaterial({
    //         envMap:environmentMapTexture, 
    //         metalness: 0.3,
    //         roughness: 0.4,
    //         envMapIntensity: 0.5

    //     })
    // )
    // sphere.castShadow = true
    // sphere.position.y = 0.5
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(5,5,2,2),
        new THREE.MeshStandardMaterial({
            side:THREE.DoubleSide,
            color: '#777777',
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture,
            envMapIntensity: 0.5
        })
    )
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    scene.add(floor)

    /**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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

    window.addEventListener('resize',()=>{

        //update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        //Update camera aspect
        camera.aspect = sizes.width/sizes.height;

        // We have to update projection to see the results
        camera.updateProjectionMatrix()

        //Update renderer to see the changes in the size of the screen
        renderer.setSize(sizes.width,sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    })

    /*
    WE will Create both the THREEJS and Physic world components in one function now
    */

    const objectsToUpdate =[]

    const sphereGeometry = new THREE.SphereGeometry(1,20,20)
    const sphereMaterial = new THREE.MeshStandardMaterial({
        metalness:0.3,
        roughness:0.4,
        envMap:environmentMapTexture
    })

    const createSphere = (radius,position)=>{
        //THREEJS Mesh
        const mesh = new THREE.Mesh(
           sphereGeometry,sphereMaterial
        )
        mesh.scale.set(radius,radius,radius)
        mesh.castShadow=true
        mesh.position.copy(position)
        scene.add(mesh)

        // Physics World
        const shape = new CANNON.Sphere(radius)
        const body = new CANNON.Body({
            mass:1,
            position: new CANNON.Vec3(0,3,0),
            shape,
            material:defaultMaterial
        })
        body.position.copy(position)
        body.addEventListener('collide',playHitSound)
        world.addBody(body)

        // Save in objects to update

        objectsToUpdate.push({
            mesh:mesh,
            body:body
        })


    }

    createSphere(0.5,{x:0,y:3,z:0})

    // Box mesh
    const boxGeometry = new THREE.BoxGeometry(1,1,1)
    const boxMaterial = new THREE.MeshStandardMaterial({
        roughness:0.4,
        metalness:0.3,
        envMap:environmentMapTexture
    })

    // Now lets create same for box
    const createBox =(width,height,depth,position)=>{

    const mesh = new THREE.Mesh(boxGeometry,boxMaterial) 
    mesh.castShadow=true
    mesh.scale.set(width,height,depth)
    mesh.position.copy(position)
    scene.add(mesh);

    //For Physics World
    const shape = new CANNON.Box(new CANNON.Vec3(width*0.5,height*0.5,depth*0.5))
    const body = new CANNON.Body({
        mass:1,
        position: new CANNON.Vec3(0,3,0),
        shape,
        material:defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide',playHitSound)
    world.addBody(body)

    objectsToUpdate.push({
        mesh:mesh,
        body:body
    })

    }
    createBox(0.5, 0.5, 0.5, {x:0, y:3, z:0});    /*
        To Animate properly by calculating time
    */


   const clock = new THREE.Clock()
   let oldElapsedTime = 0

    const tick = () =>{

        const elapsedTime = clock.getElapsedTime()
        const deltaTime = elapsedTime - oldElapsedTime
        oldElapsedTime = elapsedTime


        // To update physics world

        // sphereBody.applyForce(new CANNON.Vec3(-0.5,0,0),sphereBody.position)

        world.step( 1/60 , deltaTime , 3 )
        // console.log(sphereBody.position.y)
        for(const object of objectsToUpdate){
            object.mesh.position.copy(object.body.position)
            object.mesh.quaternion.copy(object.body.quaternion)
        }
        // We have to update threejs sphere position now to get the reflected changes

        // sphere.position.copy(sphereBody.position)

        /* 
         OLD METHOD TO HAVE SAME POSITION
         sphere.position.x=sphereBody.position.x
         sphere.position.y=sphereBody.position.y
         sphere.position.z=sphereBody.position.z
        
        */
        


        controls.update()
        renderer.render(scene,camera)
        requestAnimationFrame(tick)
    }

    tick()

