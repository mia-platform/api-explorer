/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const baseCustomEditor = require('./get-custom-editor')

module.exports = () => baseCustomEditor('multiple').extend({
  build() {
    const self = this

    const switcher = buildSwitcher(self)

    const response = this._super()
    self.switcher.replaceWith(switcher)

    this.errorMessageHtmlNode = document.createElement('p')
    this.errorMessageHtmlNode.innerText = 'The selected schemas are not compatible!'
    this.errorMessageHtmlNode.style.color = 'red'
    this.errorMessageHtmlNode.style['font-weight'] = 'bold'
    this.errorMessageHtmlNode.style.display = 'none'
    this.container.appendChild(this.errorMessageHtmlNode)

    return response
  },
  updateEditor(selectedValues) {
    const joinedValues = selectedValues.join('_')
    const mergedEditorIndex = editorIndexesMap.get(joinedValues)
    if (mergedEditorIndex) {
      this.switchEditor(mergedEditorIndex);
      return
    }
    const schemasIndexes = selectedValues.map(value => this.display_text.indexOf(value))
    const schemas = this.types.filter((_, index) => schemasIndexes.includes(index))
    const mergedSchemas = mergeSchemas(schemas)
    if (!mergedSchemas) {
      return
    }
    const index = this.types.length
    editorIndexesMap.set(joinedValues, index)
    this.types.push(mergedSchemas)
    this.editors.push(false)
    this.switchEditor(index)
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
    self.editor_holder.style.display = 'none'
    self.errorMessageHtmlNode.style.display = 'block'
    return undefined
  }
  const merger = mergersMap[schemasType]
  const mergedSchemas = merger
    ? merger(schemas, schemasType)
    : mergersMap.default(schemas, schemasType)
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
    return { ...propsAccumulator, ...currentSchema.properties }
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

const buildSwitcher = self => {
  const switcher = self.theme.getSwitcher(self.display_text)
  switcher.multiple = true
  switcher.addEventListener('change', e => {
    e.preventDefault();
    e.stopPropagation();
    const selectedValues = Array.from(e.currentTarget.selectedOptions).map(selectedValue => selectedValue.value)
    if (selectedValues.length === 1) {
      self.errorMessageHtmlNode.style.display = 'none'
      self.editor_holder.style.display = 'block'
      self.switchEditor(self.display_text.indexOf(selectedValues[0]));
    } else {
      self.updateEditor(selectedValues)
    }
    self.onChange(true);
  });
  return switcher
}
