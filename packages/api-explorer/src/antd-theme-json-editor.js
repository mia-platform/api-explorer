/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const JSONEditor = require('@json-editor/json-editor')

const antdTheme = JSONEditor.AbstractTheme.extend({
  /* Theme config options that allows changing various aspects of the output */
  options: {
    'disable_theme_rules': false
  },
  /* Custom stylesheet rules. format: "selector" : "CSS rules" */
  rules: {
    'div[data-schemaid="root"]:after': 'position:relative;color:red;margin:10px 0;font-weight:600;display:block;width:100%;text-align:center;content:"This is an old JSON-Editor 1.x Theme and might not display elements correctly when used with the 2.x version"',
  },
  getSelectInput (options, multiple) {
    const el = this._super(options)
    el.classList.add('form-control')
    // el.style.width = 'auto';
    return el
  },
  setGridColumnSize (el, size, offset) {
    el.classList.add(`col-md-${  size}`)
    if (offset) {
      el.classList.add(`offset-md-${  offset}`)
    }
  },
  afterInputReady (input) {
    if (input.controlgroup) return
    input.controlgroup = this.closest(input, '.form-group')
    if (this.closest(input, '.compact')) {
      input.controlgroup.style.marginBottom = 0
    }

    // TODO: use bootstrap slider
  },
  getTextareaInput () {
    const el = document.createElement('textarea')
    el.classList.add('form-control')
    return el
  },
  getRangeInput (min, max, step) {
    // TODO: use better slider
    return this._super(min, max, step)
  },
  getFormInputField (type) {
    const el = this._super(type)
    if (type !== 'checkbox' && type !== 'radio') {
      el.classList.add('form-control')
    }
    return el
  },
  getFormControl (label, input, description) {
    const labelText = label ? label.textContent : "";
    const descriptionText = description ? description.textContent : "";
    const group = document.createElement('div')

    if (label && (input.type === 'checkbox' || input.type === 'radio')) {
      group.classList.add('form-check')
      label.classList.add('form-check-label')
      input.classList.add('form-check-input')
      // label.appendChild(input);
      label.insertBefore(input, label.firstChild)
      group.appendChild(label)
    } else {
      group.classList.add('form-group')
      if (label) {
        label.classList.add('form-control-label')
        group.appendChild(label)
      }
      group.appendChild(input)
    }

    if (description && labelText !== descriptionText) group.appendChild(description)

    return group
  },
  getIndentedPanel () {
    const el = document.createElement('div')
    el.classList.add('card', 'card-body', 'bg-light')
    return el
  },
  getFormInputDescription (text) {
    const el = document.createElement('p')
    el.classList.add('form-text')
    if (window.DOMPurify) el.innerHTML = window.DOMPurify.sanitize(text)
    else el.textContent = this.cleanText(text)
    return el
  },
  getHeaderButtonHolder () {
    const el = this.getButtonHolder()
    el.style.marginLeft = '10px'
    return el
  },
  getButtonHolder () {
    const el = document.createElement('div')
    el.classList.add('btn-group')
    return el
  },
  getButton (text, icon, title) {
    const el = this._super(text, icon, title)
    el.classList.add('ant-btn', 'ant-btn-primary')
    return el
  },
  getTable () {
    const el = document.createElement('table')
    el.classList.add('table-bordered', 'table-sm')
    el.style.width = 'auto'
    el.style.maxWidth = 'none'
    return el
  },

  addInputError (input, text) {
    if (!input.controlgroup) return
    input.controlgroup.classList.add('has-danger')
    input.classList.add('is-invalid')
    if (!input.errmsg) {
      input.errmsg = document.createElement('p')
      input.errmsg.classList.add('form-text', 'invalid-feedback')
      input.controlgroup.appendChild(input.errmsg)
    } else {
      input.errmsg.style.display = ''
    }

    input.errmsg.textContent = text
  },
  getModal () {
    const el = document.createElement('div')
    el.style.background = "#fff"
    el.style.borderRadius = '4px'
    el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
    el.style.padding = '5px'
    el.style.position = 'absolute'
    el.style.zIndex = '10'
    el.style.display = 'none'
    el.style.fontSize = "14px"
    return el
  },
  removeInputError (input) {
    if (!input.errmsg) return
    input.errmsg.style.display = 'none'
    input.classList.remove('is-invalid')
    input.controlgroup.classList.remove('has-danger')
  },
  getTabHolder (propertyName) {
    const el = document.createElement('div')
    const pName = (typeof propertyName === 'undefined') ? '' : propertyName
    el.innerHTML = `<div class='col-md-2' id='${  pName  }'><ul class='nav flex-column nav-pills'></ul></div><div class='tab-content col-md-10' id='${  pName  }'></div>`
    el.classList.add('row')
    return el
  },
  addTab (holder, tab) {
    holder.children[0].children[0].appendChild(tab)
  },
  getTopTabHolder (propertyName) {
    const pName = (typeof propertyName === 'undefined') ? '' : propertyName
    const el = document.createElement('div')
    el.innerHTML = `<ul class='nav nav-tabs' id='${  pName  }'></ul><div class='card-body tab-content' id='${  pName  }'></div>`
    return el
  },
  getTab (text, tabId) {
    const liel = document.createElement('li')
    liel.classList.add('nav-item')
    const ael = document.createElement('a')
    ael.classList.add('nav-link')
    ael.setAttribute('style', 'padding:10px;')
    ael.setAttribute('href', `#${  tabId}`)
    ael.setAttribute('data-toggle', 'tab')
    ael.appendChild(text)
    liel.appendChild(ael)
    return liel
  },
  getTopTab (text, tabId) {
    const el = document.createElement('li')
    el.classList.add('nav-item')
    const a = document.createElement('a')
    a.classList.add('nav-link')
    a.setAttribute('href', `#${  tabId}`)
    a.setAttribute('data-toggle', 'tab')
    a.appendChild(text)
    el.appendChild(a)
    return el
  },
  getTabContent () {
    const el = document.createElement('div')
    el.classList.add('tab-pane')
    el.setAttribute('role', 'tabpanel')
    return el
  },
  getTopTabContent () {
    const el = document.createElement('div')
    el.classList.add('tab-pane')
    el.setAttribute('role', 'tabpanel')
    return el
  },
  markTabActive (row) {
    row.tab.firstChild.classList.add('active')

    if (typeof row.rowPane !== 'undefined') {
      row.rowPane.classList.add('active')
    } else {
      row.container.classList.add('active')
    }
  },
  markTabInactive (row) {
    row.tab.firstChild.classList.remove('active')

    if (typeof row.rowPane !== 'undefined') {
      row.rowPane.classList.remove('active')
    } else {
      row.container.classList.remove('active')
    }
  },
  getProgressBar () {
    const min = 0
    const max = 100
    const start = 0

    const container = document.createElement('div')
    container.classList.add('progress')

    const bar = document.createElement('div')
    bar.classList.add('progress-bar')
    bar.setAttribute('role', 'progressbar')
    bar.setAttribute('aria-valuenow', start)
    bar.setAttribute('aria-valuemin', min)
    bar.setAttribute('aria-valuenax', max)
    bar.innerHTML = `${start  }%`
    container.appendChild(bar)

    return container
  },
  updateProgressBar (progressBar, progress) {
    if (!progressBar) return

    const bar = progressBar.firstChild
    const percentage = `${progress  }%`
    bar.setAttribute('aria-valuenow', progress)
    bar.style.width = percentage
    bar.innerHTML = percentage
  },
  updateProgressBarUnknown (progressBar) {
    if (!progressBar) return

    const bar = progressBar.firstChild
    progressBar.classList.add('progress', 'progress-striped', 'active')
    bar.removeAttribute('aria-valuenow')
    bar.style.width = '100%'
    bar.innerHTML = ''
  },
  getInputGroup (input, buttons) {
    if (!input) return

    const inputGroupContainer = document.createElement('div')
    inputGroupContainer.classList.add('input-group')
    inputGroupContainer.appendChild(input)

    const inputGroup = document.createElement('div')
    inputGroup.classList.add('input-group-prepend')
    inputGroupContainer.appendChild(inputGroup)

    for (let i = 0; i < buttons.length; i++) {
      inputGroup.appendChild(buttons[i])
    }

    return inputGroupContainer
  }
})

module.exports = antdTheme