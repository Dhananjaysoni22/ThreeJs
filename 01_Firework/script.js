import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import fireworkVertexShader from "./src/shaders/firework/vertex.glsl?raw"
import fireworkFragmentShader from "./src/shaders/firework/fragment.glsl?raw"
import gsap from 'gsap';
import { Sky } from 'three/addons/objects/Sky.js';

const gui = new dat.GUI();
// 1. We will create a scene where all things will render
const scene = new THREE.Scene()

// Loader
const textureLoader = new THREE.TextureLoader()

// 2. Cameras

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}
sizes.resolution = new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5;
scene.add(camera);

// 3. Renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.render(scene, camera)

// Here we can add further components


// 4. OrbitControl

const controls = new OrbitControls(camera, renderer.domElement);

// 5. To add projection of the object

window.addEventListener('resize', () => {

    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
    sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera as we have to update camera to get the screen aspect ratio
    camera.aspect = sizes.width / sizes.height
    //now as we changes the camera aspect ratio but till now no changes has been shown on the screen to get changes on the screen we have to update the camera projection property to get the whole screen height and width
    camera.updateProjectionMatrix()
    //render is also be needed to update so that we can see the changes we are making are getting rendered
    renderer.setSize(sizes.width, sizes.height);

    renderer.setPixelRatio(sizes.pixelRatio)

})

const textures = [
    textureLoader.load('./src/particles/1.png'),
    textureLoader.load('./src/particles/2.png'),
    textureLoader.load('./src/particles/3.png'),
    textureLoader.load('./src/particles/4.png'),
    textureLoader.load('./src/particles/5.png'),
    textureLoader.load('./src/particles/6.png'),
    textureLoader.load('./src/particles/7.png'),
    textureLoader.load('./src/particles/8.png'),
]

const createFirework = (count, position, size, textures, radius,color) => {
    //Geometry
    const positionArray = new Float32Array(count * 3)

    const sizesArray = new Float32Array(count)
    const timeMultipliersArray = new Float32Array(count)

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        const spherical = new THREE.Spherical(
            radius * (0.75 + Math.random() * 0.25),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2
        )
        const position = new THREE.Vector3()
        position.setFromSpherical(spherical)

        positionArray[i3] = position.x
        positionArray[i3 + 1] = position.y
        positionArray[i3 + 2] = position.z

        sizesArray[i] = Math.random()
        timeMultipliersArray[i] = 1+Math.random()
    }
    //Geometry
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3))
    geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))
    geometry.setAttribute('aTimeMultiplier', new THREE.Float32BufferAttribute(timeMultipliersArray, 1))
    //Material
    textures.flipY = false;
    const material = new THREE.ShaderMaterial({
        vertexShader: fireworkVertexShader,
        fragmentShader: fireworkFragmentShader,
        uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution),
            uTexture: new THREE.Uniform(textures),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0)
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    //Points
    const firework = new THREE.Points(geometry, material)
    firework.position.copy(position)
    scene.add(firework)

    //Destroy
    const destroy = () =>{
        scene.remove(firework)
        geometry.dispose()
        material.dispose()
    }


    //Animate
    gsap.to(
        material.uniforms.uProgress,
        {value:1,duration:3,ease:'linear',onComplete:destroy}
    )

}

// createFirework(
//     100,                // Count
//     new THREE.Vector3(), //Position
//     0.5,                   // Size
//     textures[7],        //Texture
//     5,              //Radius
//     new THREE.Color('#8affff'), //Color
// );

const createRandomFirework = () =>{
    const count = Math.round(400+Math.random()*1000)
    const position = new THREE.Vector3(
        (Math.random()-0.5)*2,
        Math.random(),
        (Math.random()-0.5)*2
    )
    const size = 0.1 + Math.random()*0.1
    const texture = textures[Math.floor(Math.random()*textures.length)]
    const radius = 0.5+Math.random()
    const color = new THREE.Color()
    color.setHSL(Math.random(),1,0.7)

    createFirework(count,position,size,texture,radius,color)
}

createRandomFirework()

window.addEventListener('click',createRandomFirework)

/**
 * SKy
 */

// Add Sky
const sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );

const sun = new THREE.Vector3();

/// GUI

const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity;
    uniforms[ 'rayleigh' ].value = effectController.rayleigh;
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
    const theta = THREE.MathUtils.degToRad( effectController.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( sun );

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render( scene, camera );

}


gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'elevation', -3, 10, 0.01 ).onChange( guiChanged );
gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

guiChanged();





// window.addEventListener('click',()=>{
//     createFirework(
//         100,                // Count
//         new THREE.Vector3(), //Position
//         0.5,                   // Size
//         textures[7],        //Texture
//         5,              //Radius
//         new THREE.Color('#8affff'), //Color
//     );
// })

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