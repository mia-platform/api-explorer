import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {injectIntl} from 'react-intl'

import getSchemaToRender from './getSchemaToRender'
import configureJsonEditor from './configureJsonEditor'

import './bootstrap4.css'
import './custom-bootstrap4.css'

const JSONEditor = require('@json-editor/json-editor').JSONEditor;

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
      configureJsonEditor(JSONEditor, intl, setFormSubmissionListener)
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
