import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {injectIntl} from 'react-intl'
import {JSONEditor} from '@json-editor/json-editor'
import {Spin, Alert} from 'antd'

import configureJsonEditor from './configureJsonEditor'
import resolveReference from './resolveReference'

import './bootstrap4.css'
import './custom-bootstrap4.css'

class JsonForm extends Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.ref = null;

    this.state = {
      error: null,
      jsonSchema: null
    }
    this.unmounted = false
  }

  componentDidMount() {
    const {schema} = this.props
    resolveReference(schema)
      .then(convertedSchema => {
        if (!this.unmounted) {
          return this.setState({
            jsonSchema: convertedSchema
          })
        }
        return null
      }).catch(err => {
        if (err && !this.unmounted) {
          return this.setState({error: err.message})
        }
        return null
      })
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  createEditor(element, jsonSchema) {
    const {intl, onChange, setFormSubmissionListener, title} = this.props
    if (this.editor === null) {
      configureJsonEditor(JSONEditor, intl, setFormSubmissionListener)
      this.editor = new JSONEditor(element, {
        schema: {
          ...jsonSchema,
          title
        },
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
    const {error, jsonSchema} = this.state
    if (error) {
      return (
        <Alert
          message={error}
          type={error}
          showIcon
        />
      )
    }
    if (jsonSchema) {
      return (
        <form
          ref={r => this.createEditor(r, jsonSchema)}
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <button type="submit" style={{ display: "none" }} />
        </form>
      );
    }
    return <Spin />
  }
}

JsonForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  setFormSubmissionListener: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
}
export default injectIntl(JsonForm)
