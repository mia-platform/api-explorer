import it from '../../i18n/it.json'

import antdTheme from "./antd-theme-json-editor";
import notCustomEditor from "./not-custom-editor";
import anyOfEditor from "./anyOf-custom-editor";
import objectsEditor from "./objects-editor";

function setDefaultCustomization (JSONEditor) {
  const editorsKeys = Object.keys(JSONEditor.defaults.editors)

  editorsKeys.forEach(key => {
    JSONEditor.defaults.editors[key] = class Customization extends JSONEditor.defaults.editors[key] {
      showEditJSON(){
        super.showEditJSON()
        // this.editjson_holder.style.display = 'none'
        this.editjson_holder.style.left = `${-this.editjson_holder.offsetWidth + this.editjson_control.offsetWidth + parseInt(this.editjson_control.style.marginRight, 10)}px`
      }
      postBuild() {
        super.postBuild()

        if (this.editjson_holder && this.editjson_textarea && this.editjson_copy && this.editjson_save && this.editjson_cancel) {
          this.editjson_inline_header = document.createElement('div')
          this.editjson_inline_header.style.display = 'flex'
          this.editjson_inline_header.style.justifyContent = 'space-between'
          this.editjson_inline_footer = document.createElement('div')
          this.editjson_inline_footer.style.display = 'flex'
          this.editjson_inline_footer.style.justifyContent = 'flex-end'
          this.editjson_textcontainer = document.createElement('h3')
          this.editjson_textcontainer.classList.add('card-title')
          this.editjson_textcontainer.style.height = '36px'
          this.editjson_textcontainer.style.padding = '0px'
          this.editjson_textcontainer.style.border = '0px'
          this.editjson_text = document.createElement('label')
          this.editjson_text.innerHTML = 'Edit JSON'
          this.editjson_text.style.verticalAlign = 'middle'
          this.editjson_text.style.display = 'inline-block'
          this.editjson_text.style.lineHeight = '32px'
          this.editjson_text.style.padding = '0px'
          this.editjson_text.style.textTransform = 'none'
          this.editjson_copy.classList.add('ant-btn-primary')
          this.editjson_copy.classList.add('ant-btn-background-ghost')
          this.editjson_copy.style.margin = '0 0 4px 4px'
          this.editjson_copy.innerHTML = 'Copy JSON'
          this.editjson_save.classList.add('ant-btn-primary')
          this.editjson_textarea.style.width = '450px'
          this.editjson_textarea.style.height = '250px'
          this.editjson_textarea.classList.add('bigger-resizer')
          this.editjson_holder.insertBefore(this.editjson_inline_header, this.editjson_textarea)
          this.editjson_inline_header.append(this.editjson_textcontainer)
          this.editjson_inline_header.append(this.editjson_copy)
          this.editjson_textcontainer.append(this.editjson_text)
          this.editjson_holder.append(this.editjson_inline_footer)
          this.editjson_inline_footer.append(this.editjson_cancel)
          this.editjson_inline_footer.append(this.editjson_save)
        }

        if (this.schema && this.schema.type && this.label) {
          this.label.innerHTML = `${this.label.innerHTML} <em style="opacity: 0.5">(${this.schema.type})</em>`
        }

        if (this.editjson_control) {
          this.editjson_control.classList.add('ant-btn-sm')
          this.editjson_control.style.margin = '0px 8px'
          this.editjson_control.style.borderRadius = '4px'
          this.editjson_control.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Pippo')
          })
        }

        if (this.addproperty_button) {
          this.addproperty_button.classList.add('ant-btn-sm')
          this.addproperty_button.style.margin = '0px 8px'
          this.addproperty_button.style.borderRadius = '4px'
        }

        if (this.collapse_control) {
          this.collapse_control.classList.add('ant-btn-sm')
        }

        if (this.toggle_button) {
          this.toggle_button.classList.add('ant-btn-sm')
        }

        if (this.container !== undefined && this.title !== undefined) {
          const classContainer = (key === 'upload' || key === 'base64') ? 'mia-container-upload-file-wrapper' : 'mia-container-wrapper'
          this.container.classList.add(classContainer)
        }
      }
    }
  });
}

module.exports = function configureJSONEditor(JSONEditor, intl, setFormSubmissionListener) {
  JSONEditor.defaults.languages.it = it
  JSONEditor.defaults.language = intl.locale

  JSONEditor.defaults.themes.antdTheme = antdTheme(JSONEditor)

  if (!JSONEditor.isCustomized) {
    setDefaultCustomization(JSONEditor)
    JSONEditor.defaults.editors.anyOf = anyOfEditor(intl, setFormSubmissionListener, JSONEditor.defaults.editors.multiple)
    JSONEditor.isCustomized = true
  }

  JSONEditor.defaults.editors.not = notCustomEditor(JSONEditor.defaults.editors.multiple)
  JSONEditor.defaults.editors.object = objectsEditor(JSONEditor.defaults.editors.object)

  // eslint-disable-next-line consistent-return
  JSONEditor.defaults.resolvers.unshift((scheme) => {
    // If the schema can be of any type
    if (
      (scheme.type === "string" &&
        scheme.media &&
        scheme.media.binaryEncoding === "base64") ||
      scheme.format === "binary"
    ) {
      return "base64";
    }
  });

  // eslint-disable-next-line consistent-return
  JSONEditor.defaults.resolvers.unshift((scheme) => {
    if (scheme.not && scheme.not.type) {
      return 'not'
    }
  })

  // eslint-disable-next-line consistent-return
  JSONEditor.defaults.resolvers.unshift((scheme) => {
    if (scheme.anyOf) {
      return 'anyOf'
    }
  })
}
