/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */


const antdTheme = (JSONEditor ) => class extends JSONEditor.defaults.themes.bootstrap4 {
  // ref: https://github.com/json-editor/json-editor/blob/master/src/themes/bootstrap4.js#L49
  getFormControl (label, input, description, infoText) {
    const labelText = label ? label.textContent : "";
    const descriptionText = description ? description.textContent : "";
    const group = document.createElement('div')

    group.classList.add('form-group')

    if (label && (input.type === 'checkbox' || input.type === 'radio')) {
      const check = document.createElement('div')

      if (this.options.custom_forms === false) {
        check.classList.add('form-check')
        input.classList.add('form-check-input')
        label.classList.add('form-check-label')
      } else {
        check.classList.add('custom-control')
        input.classList.add('custom-control-input')
        label.classList.add('custom-control-label')

        if (input.type === 'checkbox') {
          check.classList.add('custom-checkbox')
        } else {
          check.classList.add('custom-radio')
        }
      }

      const unique = label.innerText
      label.setAttribute('for', unique)
      input.setAttribute('id', unique)

      check.appendChild(input)
      check.appendChild(label)
      if (infoText) check.appendChild(infoText)

      group.appendChild(check)
    } else {
      if (label) {
        group.appendChild(label)

        if (infoText) group.appendChild(infoText)
      }

      group.appendChild(input)
    }

    // Input Text.
    if (!input.type || input.type === 'text') {
      input.classList.add('input-field', 'ant-input')
    }

    if (description && labelText !== descriptionText) {
      group.appendChild(description)
    }

    return group
  }

  getButton (text, icon, title) {
    const el = super.getButton(text, icon, title)
    el.classList.add('ant-btn', 'ant-btn-primary')
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
    el.style.zIndex = '10'
    el.style.display = 'none'
    el.style.fontSize = "14px"
    return el
  }

  getButtonHolder () {
    const el = super.getButtonHolder()
    el.style.display = 'inline-flex'
    return el
  }
}

module.exports = antdTheme
