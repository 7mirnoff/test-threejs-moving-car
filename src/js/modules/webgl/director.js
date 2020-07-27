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
  let angle = 0

  const direct = new THREE.Vector3(0, 0, 0)

  g.l.addLoop('moveCar', () => {
    carWrap.position.add(direct)
  })

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'ArrowUp') {
      // direct.x += 0.1
    }

    if (evt.key === 'ArrowDown') {
      // direct.x -= 0.1
    }

    if (evt.key === 'ArrowLeft') {
      // car.rotation.y += 0.1
      angle += 0.1

      direct.x += Math.sin(angle) * 0.1
      direct.z += Math.cos(angle) * 0.1
    }

    if (evt.key === 'ArrowRight') {
      // car.rotation.y -= 0.1
      angle -= 0.1
    }
  })
}
