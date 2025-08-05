import Experience from "../Experience.js";
import Environment from "./Environment.js";
import * as THREE from "three"
import Floor from "./Floor.js";
import Fox from "./Fox.js";

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resource = this.experience.resource
        // console.log(this.resource)

        // Wait for resources
        this.resource.on('ready', () => {
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        }) 

    }
    update()
    {
        if(this.fox)
            this.fox.update()
    }
}