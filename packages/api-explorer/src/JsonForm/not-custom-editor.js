const baseCustomEditor = require('./get-custom-editor')

module.exports = () => baseCustomEditor('multiple').extend({
  preBuild() {
    this.schema.disallow = [this.schema.not.type]
    delete this.schema.not
    // eslint-disable-next-line no-underscore-dangle
    return this._super()
  }
})