import GUM from './gum/gum'
import SRCS from './srcs'
import * as THREE from 'three'

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

  g.v.camera.position.set(20, 20, 20)
  g.v.controls.update()

  const light = new THREE.HemisphereLight(0xCCCCCC, 0x666666, 1)
  g.v.scene.add(light)

  const carWrap = g.v.scene.children[2]
  const car = carWrap.children[0]

  const direct = new THREE.Vector3(0, 0, 0)
  let angle = 45 * Math.PI / 2
  let speed = 0

  const moveCar = () => {
    direct.x = Math.sin(angle)
    direct.z = Math.cos(angle)
    direct.normalize()
    direct.multiplyScalar(speed)
    carWrap.position.add(direct)
    car.rotation.y = angle
  }

  g.l.addLoop('moveCar', () => {
    moveCar()
  })

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'ArrowUp') {
      speed += 0.1
    }

    if (evt.key === 'ArrowDown') {
      speed -= 0.1
    }

    if (evt.key === 'ArrowLeft') {
      angle += 0.1
    }

    if (evt.key === 'ArrowRight') {
      angle -= 0.1
    }
  })
}
