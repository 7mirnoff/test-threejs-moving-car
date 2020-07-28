import GUM from './gum/gum'
import SRCS from './srcs'
import * as THREE from 'three'
import * as CANNON from 'cannon'

window.onload = function () {
  Director.init()
}

const Director = {
  init: function () {
    function hideSimplePreloader () {
      document.querySelector('#simple_preloader').style.display = 'none'
    }

    function changeSimpleProgress (p) {
      document.querySelector('#simple_progress_bar').style.width = Math.round(p * 100) + '%'
    }

    this.g = new GUM({
      container: document.querySelector('#webgl_container')
    }, {
      srcs: SRCS.preloader,
      loadCb: () => {
        hideSimplePreloader()

        sceneInit()
        console.log(this)
      },
      progressCb: changeSimpleProgress
    })
  }
}

const sceneInit = () => {
  const g = Director.g
  for (const o of g.d.res.scenes['preloader_scene'].children) {
    g.v.scene.add(o.clone())
  }

  const gridHelper = new THREE.GridHelper(100, 100, 0x0000ff, 0x808080)
  g.v.scene.add(gridHelper)

  const geometry = new THREE.BoxGeometry( 2, 2, 2 );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  g.v.scene.add( cube )

  g.v.camera.position.set(20, 20, 20)
  g.v.controls.update()

  const light = new THREE.HemisphereLight(0xCCCCCC, 0x666666, 1)
  g.v.scene.add(light)

  const car = g.v.scene.children[1]

  const direct = new THREE.Vector3(0, 0, 0)
  let angle = 0
  let angleTarget = 0
  let speed = 0
  let speedTarget = 0

  const moveCar = () => {
    speed = g.l.lerp(speed, speedTarget, 0.02)
    angle = g.l.lerp(angle, angleTarget, 0.04)

    direct.x = Math.sin(angle)
    direct.z = Math.cos(angle)
    direct.normalize()
    direct.multiplyScalar(speed)
    // carWrap.position.add(direct)
    body.position.vadd(new CANNON.Vec3(direct.x, direct.y, direct.z), body.position)
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angle)
    // car.rotation.y = angle
  }

  g.l.addLoop('moveCar', () => {
    moveCar()
  })

  const pressed = new Set()

  window.addEventListener('keydown', (evt) => {
    pressed.add(evt.key)
  })

  window.addEventListener('keyup', (evt) => {
    pressed.delete(evt.code)
  })

  g.l.addLoop('setCarTarget', () => {
    if (pressed.has('ArrowUp')) {
      speedTarget = 0.4
    } else if (pressed.has('ArrowDown')) {
      speedTarget = -0.2
    } else {
      speedTarget = 0
    }

    if (pressed.has('ArrowLeft')) {
      angleTarget += 0.03 * speed / 0.2
    }

    if (pressed.has('ArrowRight')) {
      angleTarget -= 0.03 * speed / 0.2
    }
  })

  const world = new CANNON.World()
  world.gravity.set(0, -9, 0)
  world.broadphase = new CANNON.NaiveBroadphase()
  world.solver.iterations = 10

  // ground plane
  const groundMaterial = new CANNON.Material()
  const groundShape = new CANNON.Plane()
  const groundBody = new CANNON.Body({
    mass: 0,
    material: groundMaterial
  })

  groundBody.addShape(groundShape)
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  groundBody.position.set(0, 0, 0);
  world.add(groundBody)
  const shape = new CANNON.Box(new CANNON.Vec3(car.children[5].scale.x / 2, car.children[5].scale.y / 2, car.children[5].scale.z / 2))
  const body = new CANNON.Body({
    mass: 400,
    position: new CANNON.Vec3(1, 10, 1)
  })
  body.addShape(shape)
  world.addBody(body)

  const shape2 = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
  const body2 = new CANNON.Body({
    mass: 1000,
    position: new CANNON.Vec3(0, 1, 0)
  })
  body2.addShape(shape2)
  world.addBody(body2)

  const timeStep = 1 / 60

  g.l.addLoop('phis', () => {
    // Step the physics world
    world.step(timeStep)

    // Copy coordinates from Cannon.js to Three.js
    car.position.copy(body.position)
    car.quaternion.copy(body.quaternion)

    cube.position.copy(body2.position)
    cube.quaternion.copy(body2.quaternion)

  })
}
