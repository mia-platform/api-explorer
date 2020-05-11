import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {injectIntl} from 'react-intl'
import {JSONEditor} from '@json-editor/json-editor'

import configureJsonEditor from './configureJsonEditor'

import './bootstrap4.css'
import './custom-bootstrap4.css'

class JsonForm extends Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.ref = null;
  }

  createEditor(element) {
    const {intl, onChange, schema, setFormSubmissionListener} = this.props
    if (this.editor === null) {
      const self = this
      configureJsonEditor(JSONEditor, intl, setFormSubmissionListener)
      self.editor = new JSONEditor(element, {
        schema,
        show_opt_in: false,
        prompt_before_delete: false,
        form_name_root:"",
        iconlib: 'fontawesome5',
        theme: 'antdTheme'
      });
      self.editor.on('change', () => onChange(self.editor.getValue()))
      
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
