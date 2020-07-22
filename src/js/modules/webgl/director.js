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

  const car = g.v.scene.children[1]
  let angle = 0

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'ArrowUp') {
      car.position.x += Math.sin(angle)
      car.position.z += Math.cos(angle)
    }

    if (evt.key === 'ArrowDown') {
      car.position.x -= Math.sin(angle)
      car.position.z -= Math.cos(angle)
    }

    if (evt.key === 'ArrowLeft') {
      car.rotation.y += 0.1
      angle += 0.1
    }

    if (evt.key === 'ArrowRight') {
      car.rotation.y -= 0.1
      angle -= 0.1
    }
  })
}
