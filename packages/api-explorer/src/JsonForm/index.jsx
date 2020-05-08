import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {injectIntl} from 'react-intl'

import getSchemaToRender from './getSchemaToRender'
import antdTheme from './antd-theme-json-editor'
import notCustomEditor from './not-custom-editor'
import anyOfEditor from './anyOf-custom-editor'
import it from '../../i18n/it.json'

import './bootstrap4.css'
import './custom-bootstrap4.css'

const JSONEditor = require('@json-editor/json-editor').JSONEditor;

function configureJSONEditor(intl, setFormSubmissionListener) {
  JSONEditor.defaults.languages.it = it
  JSONEditor.defaults.language = intl.locale
  JSONEditor.defaults.themes.antdTheme = antdTheme
  JSONEditor.defaults.editors.not = notCustomEditor(JSONEditor.defaults.editors.multiple)
  JSONEditor.defaults.editors.anyOf = anyOfEditor(intl, setFormSubmissionListener, JSONEditor.defaults.editors.multiple)

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

class JsonForm extends Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.ref = null;
  }

  createEditor(element) {
    const {intl, onChange, schema, setFormSubmissionListener} = this.props
    if (this.editor === null) {
      const schemaToRender = getSchemaToRender(schema)
      configureJSONEditor(intl, setFormSubmissionListener)
      this.editor = new JSONEditor(element, {
        schema: schemaToRender,
        show_opt_in: false,
        prompt_before_delete: false,
        form_name_root:"",
        iconlib: 'fontawesome5',
        theme: 'antdTheme'
      });
      this.editor.on('change', () => onChange(this.editor.getValue()))
    }
  }

  render() {
    const {onSubmit} = this.props
    return (
      <form
        ref={r => this.createEditor(r)}
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <button type="submit" style={{ display: "none" }} />
      </form>
    );
  }
}

JsonForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  setFormSubmissionListener: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}
export default injectIntl(JsonForm)
