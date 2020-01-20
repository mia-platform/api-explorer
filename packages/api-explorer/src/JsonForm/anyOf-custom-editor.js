/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const baseCustomEditor = require('./get-custom-editor')
const Choices = require('choices.js')
require('choices.js/public/assets/styles/choices.min.css')

module.exports = () => baseCustomEditor('multiple').extend({
  build() {
    const response = this._super()
    const { switcher, switcherDiv }= this.buildSwitcher()
    this.switcher.replaceWith(switcherDiv)
    this.addErrorMessageHtmlNode()
    switcher.dispatchEvent(new Event('change'))
    return response
  },
  buildSwitcher() {
    const self = this
    const switcher = this.theme.getSwitcher(this.display_text)
    switcher.multiple = true
    switcher.selectedIndex = '-1'
    
    const switcherDiv = document.createElement('div')
    const switcherLabel = document.createElement('label')
    switcherLabel.style.fontWeight = 'bold'
    switcherLabel.innerText = 'Select the schemas:'
    switcherDiv.appendChild(switcherLabel)
    switcherDiv.appendChild(switcher)
    const choices = new Choices(switcher, {
      placeholder: true,
      placeholderValue: 'Select the schema',
      removeItemButton: true,
      duplicateItemsAllowed: false,
      classNames: {
        listItems: 'multiple-select-choices-list choices__list--multiple',
        item: 'multiple-select-item choices__item'
      }
    })

    switcher.addEventListener('change', e => {
      e.preventDefault();
      e.stopPropagation();
      const selectedValues = Array.from(e.currentTarget.selectedOptions).map(selectedValue => selectedValue.value)
      if (selectedValues.length === 0) {
        self.showErrorMessage('empty-selection')
      } else if (selectedValues.length === 1) {
        self.hideErrorMessage()
        self.switchEditor(self.display_text.indexOf(selectedValues[0]))
      } else {
        self.updateEditor(selectedValues)
      }
      self.onChange(true)
      choices.hideDropdown()
    });

    return { switcher, switcherDiv }
  },
  updateEditor(selectedValues) {
    const joinedValues = selectedValues.join('_')
    const mergedEditorIndex = editorIndexesMap.get(joinedValues)
    if (mergedEditorIndex) {
      this.hideErrorMessage()
      this.switchEditor(mergedEditorIndex);
      return
    }
    const schemasIndexes = selectedValues.map(value => this.display_text.indexOf(value))
    const schemas = this.types.filter((_, index) => schemasIndexes.includes(index))
    const mergedSchemas = mergeSchemas(schemas, self)
    if (!mergedSchemas) {
      this.showErrorMessage('not-compatible')
      return
    }
    this.hideErrorMessage()
    const index = this.types.length
    this.insertNewEditor(index, joinedValues, mergedSchemas)
    this.switchEditor(index)
  },
  addErrorMessageHtmlNode() {
    this.errorMessageHtmlNode = document.createElement('p')
    this.errorMessageHtmlNode.style.color = 'red'
    this.errorMessageHtmlNode.style.fontWeight = 'bold'
    this.errorMessageHtmlNode.style.display = 'none'
    this.errorMessageHtmlNode.style.marginTop = '10px'
    this.container.appendChild(this.errorMessageHtmlNode)
  },
  showErrorMessage(type) {
    let text = 'unkown error'
    if(type === 'not-compatible')
      text = 'The selected schemas are not compatible!'
    if (type === 'empty-selection')
      text = 'Select at least 1 schema'
    this.errorMessageHtmlNode.innerText = text
    this.editor_holder.style.display = 'none'
    this.errorMessageHtmlNode.style.display = 'block'
  },
  hideErrorMessage() {
    this.editor_holder.style.display = 'block'
    this.errorMessageHtmlNode.style.display = 'none'
  },
  insertNewEditor(index, joinedValues, mergedSchemas) {
    editorIndexesMap.set(joinedValues, index)
    this.types.push(mergedSchemas)
    this.editors.push(false)
  }
})

const editorIndexesMap = new Map()

const mergeSchemas = (schemas) => {
  const schemasType = schemas.reduce((type, currentSchema) => {
    if (type === 'any') {
      return currentSchema.type
    }
    return currentSchema.type === type
      ? type
      : undefined
  }, 'any')
  if (!schemasType) {
    return undefined
  }
  const merger = mergersMap[schemasType]
  let mergedSchemas
  try {
    mergedSchemas = merger
    ? merger(schemas, schemasType)
    : mergersMap.default(schemas, schemasType)
  } catch(error) {
    mergedSchemas = undefined
  }
  return mergedSchemas
}

const mergeArrays = schemas => {
  const schemasItems = schemas.map(schema => schema.items)
  const mergedItems = mergeSchemas(schemasItems)
  if (!mergedItems) {
    return undefined
  }
  return { type: 'array', items: mergedItems }
}
const mergeObjects = schemas => {
  const mergedProperties = schemas.reduce((propsAccumulator, currentSchema) => {
    const { properties } = currentSchema
    Object.keys(properties).forEach(currentProperty => {
      if (!propsAccumulator[currentProperty]) {
        propsAccumulator[currentProperty] = properties[currentProperty]
        return
      }
      propsAccumulator[currentProperty] = mergeSchemas([propsAccumulator[currentProperty], properties[currentProperty]])
      if (!propsAccumulator[currentProperty]) {
        throw Error('errore')
      }
    })
    return propsAccumulator
  }, {})

  return {
    type: 'object',
    properties: mergedProperties,
  }
}

const mergersMap = {
  array: mergeArrays,
  object: mergeObjects,
  default: (_, schemasType) => { return { type: schemasType } }
}
