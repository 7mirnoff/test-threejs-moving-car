import * as THREE from 'three'

const Loader = class {
  constructor (data) {
    this.res = {
      textures: {},
      scenes: {}
    }
    this.srcs = [] // {path:"",name:"",type:"scene|texture",pMaterial:{s:"",o:"",m:"",t:""}}scene/objectName/material/type
    this.setLoadCallBack(data.loadCb)
    this.setProgressCallBack(data.progressCb)
    this.loadData(data.srcs)
  }

  loadData (srcs) {
    if (!srcs) return
    this.srcs = Object.assign(this.srcs, srcs)
    for (const s of srcs) this.loadOne(s)
  }

  setProgressCallBack (cb) {
    if (!cb) return
    this.progressCallBack = cb
  }

  setLoadCallBack (cb) {
    if (!cb) return
    this.loadCallBack = cb
  }

  checkProgress () {
    let count = 0
    for (const r in this.res) {
      for (const d in this.res[r]) count++
    }
    this.progressCallBack(count / Object.keys(this.srcs).length)
    if (Object.keys(this.srcs).length === count) {
      for (const n in this.res.textures) {
        const t = this.res.textures[n]
        if (t.pMaterial) {
          if (t.pMaterial.m === 0) this.res.scenes[t.pMaterial.s].getObjectByName(t.pMaterial.o).material[t.pMaterial.t] = t
          else this.res.scenes[t.pMaterial.s].getOjectByName(t.pMaterial.o).material[t.pMaterial.m][t.pMaterial.t] = t
        }
      }
      this.loadCallBack()
    }
  }

  progressCallBack (p) {
    console.log(parseInt(p * 100) + '%')
  }

  loadCallBack () {
    console.log('Загрузка завершена!')
  }

  loadOne (d) {
    var that = this
    if (d.type === 'scene') {
      new THREE.ObjectLoader().load(d.path, function (scene) {
        that.res.scenes[d.name] = scene
        that.checkProgress()
      })
    } else if (d.type === 'texture') {
      new THREE.TextureLoader().load(d.path, function (texture) {
        that.res.textures[d.name] = texture
        if (d.pMaterial) that.res.textures[d.name].pMaterial = d.pMaterial
        that.checkProgress()
      })
    }
  }
}

export default Loader
