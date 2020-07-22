import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const Viewer = class {
  constructor (data) {
    var that = this
    this.container = data.container

    this.scene = new THREE.Scene()
    this.antialias = data.antialias ? data.antialias : false
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.antialias
    })
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.container.appendChild(this.renderer.domElement)

    this.setSize()
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000)

    this.scene.add(this.camera)
    this.camera.position.z = 5

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    window.addEventListener('resize', function () {
      that.onResize()
    })
  }

  setSize () {
    this.width = this.container.offsetWidth | window.innerWidth
    this.height = this.container.offsetHeight | window.innerHeight
    this.renderer.setSize(this.width, this.height)
  }

  onResize () {
    this.setSize()
    if (this.camera.type === 'PerspectiveCamera') {
      this.camera.aspect = this.width / this.height
    } else if (this.camera.type === 'OrthographicCamera') {
      this.camera.left = this.width / -2
      this.camera.right = this.width / 2
      this.camera.top = this.height / 2
      this.camera.bottom = this.height / -2
    }
    this.camera.updateProjectionMatrix()
  }

  update () {
    this.renderer.render(this.scene, this.camera)
  }
}

export default Viewer
