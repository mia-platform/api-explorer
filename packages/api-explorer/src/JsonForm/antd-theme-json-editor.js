/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */


const antdTheme = (JSONEditor) => class extends JSONEditor.defaults.themes.bootstrap4 {
  // ref: https://github.com/json-editor/json-editor/blob/master/src/themes/bootstrap4.js#L49
  getFormControl (label, input, description, infoText) {
    const labelText = label ? label.textContent : "";
    const descriptionText = description ? description.textContent : "";

    const group = super.getFormControl (label, input, description, infoText)

    if (description && labelText === descriptionText) {
      description.style.display = 'none'
    }

    return group
  }

  getButton (text, icon, title) {
    const el = super.getButton(text, icon, title)
    el.classList.add('ant-btn')
    el.classList.remove('btn')
    el.classList.remove('btn-secondary')
    el.classList.remove('btn-sm')
    return el
  }

  // method inherited from abstractTheme
  getModal () {
    const el = super.getModal()
    el.style.background = "#fff"
    el.style.borderRadius = '4px'
    el.style.border = "none"
    el.style.marginTop = "5px"
    el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
    el.style.padding = '5px'
    el.style.position = 'absolute'
    el.style.zIndex = '9999'
    el.style.display = 'none'
    el.style.fontSize = "14px"
    return el
  }

  getButtonHolder () {
    const el = super.getButtonHolder()
    el.style.display = 'inline-flex'
    return el
  }

  addInputError (input, text) {
    const el = super.addInputError(input, text)
    el.style.background = 'white'
    el.errmsg.style.gridColumn = '1 / -1'
    el.errmsg.style.padding = '8px'
    el.errmsg.style.margin = '8px 0 0'
    el.errmsg.classList.add('alert', 'alert-danger')
    el.errmsg.setAttribute('role', 'alert')
    return el
  }
}

module.exports = antdTheme
