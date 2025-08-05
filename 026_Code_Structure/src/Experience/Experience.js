import * as THREE from 'three'
import Sizes from "./utils/Sizes.js"
import Time from "./utils/Time.js"
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './world/World.js'
import Resource from './utils/Resource.js'
import sources from './sources.js'
import Debug from './utils/Debug.js'

let instance = null


export default class Experience
{
    constructor(canvas)
    {

        if(instance)
        {
            return instance
        }
        instance = this

        // Global Access
        window.experience = this

        // Options
        this.canvas = canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resource = new Resource(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()



        // Size resize event
        this.sizes.on('resize',()=>{
            this.resize()
        })  

        // Time Tick Event
        this.time.on('tick',()=>{
            this.update()
        })


    }
    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        // console.log('Here starts the great experience')
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        //Traverse the whole scene
        this.scene.traverse((child)=>{
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                for(const key in child.material)
                {
                    const value = child.material[key]

                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }

}