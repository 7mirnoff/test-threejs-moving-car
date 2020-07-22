import Loader from './loader'
import Viewer from './viewer'
import Looper from './looper'

const GUM = class {
  constructor (vieverData, loaderData) {
    const that = this
    if (loaderData) {
      this.d = new Loader(loaderData)
    }
    this.v = new Viewer(vieverData)
    this.l = new Looper()
    this.l.addLoop('render', function () {
      that.v.update()
    })
  }
}

export default GUM
