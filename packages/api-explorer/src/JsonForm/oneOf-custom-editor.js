/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const baseCustomEditor = require('./get-custom-editor')

module.exports = () => baseCustomEditor('multiple').extend({
  build() {
    this.keep_values = false
    const response = this._super()
    return response
  }
})
