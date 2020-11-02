module.exports = (classReference) => class arrayCustomEditor extends classReference {

  postBuild() {
    super.postBuild()

    if (this.parent) {
      this.header.style.fontSize = '14px'
      this.header.style.fontWeight = '400'
      this.header.style.textTransform = 'unset'

      if (
        this.jsoneditor &&
        this.jsoneditor.schema &&
        Array.isArray(this.jsoneditor.schema.required) &&
        this.jsoneditor.schema.required.includes(this.key)
      ) {
        this.header.classList.add('required')
      }
    }
  }
}
