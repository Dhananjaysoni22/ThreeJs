import Experience from "../Experience.js";
import * as THREE from 'three'

export default class Floor {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resource = this.experience.resource

        this.setGeometry()
        this.setTexture()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry(){
        this.geometry = new THREE.CircleGeometry(5,64)
    }
    setTexture(){
        this.textures = {}
        this.textures.color = this.resource.items.grassColorTexture
        this.textures.color.repeat.set(1.5,1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resource.items.grassNormalTexture
        this.textures.normal.repeat.set(1.5,1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping


    }
    setMaterial(){
        this.material = new THREE.MeshStandardMaterial({
            map:this.textures.color,
            normalMap:this.textures.normal
        })
    }
    setMesh(){
        this.mesh = new THREE.Mesh(this.geometry,this.material)
        this.mesh.rotation.x = -Math.PI*0.5
        this.mesh.receiveShadow=true
        this.scene.add(this.mesh)
    }


}