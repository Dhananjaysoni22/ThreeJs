import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// We will create a scene to render things on

const scene = new THREE.Scene();

//Debug

const gui = new dat.GUI()

// Now we will setup camera

const sizes ={
    width : window.innerWidth,
    height : window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
camera.position.z=5;
scene.add(camera)

// Renderer

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
});
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);

/* 
     Here we will make a galaxy generate function
*/

const parameters ={}
parameters.count =10000;
parameters.size=0.01;
parameters.radius =5;
parameters.branches =3;
parameters.spin=1
parameters.randomness=0.2
parameters.randomnessPower = 3
parameters.insideColor ='#ff6030'
parameters.outsideColor ='#1b3984'

/*
    We have to make changes now before we are using const geometry or const points or conts material but now we have to make changes in theem so we have to write them before the function and remove const and denote with let
*/

    let geometry=null;
    let material=null;
    let points = null;


const generateGalaxy = () =>{

    if(points !==null){
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }


    /*
        Geometry 
    */


     geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count*3)
    const colors = new Float32Array(parameters.count*3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)



    for(let i=0;i<parameters.count;i++){
        const i3= i*3;

        //Position

        const radius = Math.random() * parameters.radius
        const spinAngle = radius*parameters.spin
        const branchAngle = (i% parameters.branches)/parameters.branches*Math.PI*2

        const randomX = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random()<0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random()<0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random()<0.5 ? 1 : -1)


        positions[i3  ]= Math.cos(branchAngle+spinAngle)*radius + randomX
        positions[i3 +1]= 0 + randomY
        positions[i3 +2]= Math.sin(branchAngle+spinAngle)*radius + randomZ
        
        //Color 

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside,radius/parameters.radius)

        colors[i3  ]=mixedColor.r
        colors[i3+1]=mixedColor.g
        colors[i3+2]=mixedColor.b

    }
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions,3)
    )

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors,3)
    )

    /**
     Material we will use will be point material to get points randomly
     */

      material = new THREE.PointsMaterial({
        size:parameters.size,
        sizeAttenuation:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending,
        vertexColors:true
     })

     /*
        Points to be added with the geometry and the material we made
     */
    
      points = new THREE.Points(geometry,material);
     scene.add(points)

}

generateGalaxy();


/*
    Here we will add all gui tweaks we are writing here cause we have intialized generateGalaxy above this so we have to write all the tweaks below that only to get the render changes 
*/


gui.add(parameters,'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'branches').min(3).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters,'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters,'outsideColor').onFinishChange(generateGalaxy)



// //Cube

// const cubeGeometry = new THREE.BoxGeometry(1,1,1)
// const cubeMaterial = new THREE.MeshBasicMaterial({
//     color:"yellow"
// })
// const cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
// scene.add(cube)



// OrbitControls

const controls = new OrbitControls(camera, renderer.domElement);

// we have to add projection to change screen size automatically

window.addEventListener('resize',()=>{
    
    //update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update camera aspect as per the change in the screen size
    camera.aspect = sizes.width/sizes.height

    //as we change the aspect ratio we have to update the projection too
    camera.updateProjectionMatrix()

    //we have to update render so that we can make changes visible
    renderer.setSize(sizes.width,sizes.height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

})


const tick = () =>{

    //For orbit controls
    controls.update()
    //Render Scenes
    renderer.render(scene,camera);
    //To render next frame
    requestAnimationFrame(tick)
}

tick();