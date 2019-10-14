import React, {Component} from 'react'
import PropTypes from 'prop-types'
import JSONEditor from '@json-editor/json-editor'

import getSchemaToRender from './getSchemaToRender'
import antdTheme from './antd-theme-json-editor'

import './bootstrap4.css'
import './custom-bootstrap4.css'



export default class JsonForm extends Component {
    constructor(props) {
      super(props);
      this.editor = null;
      this.ref = null;
    }
  
    createEditor(element) {
      const {onChange, schema} = this.props
      if (this.editor === null) {
        const schemaToRender = getSchemaToRender(schema)
        JSONEditor.defaults.themes.antdTheme = antdTheme

        // eslint-disable-next-line consistent-return
        JSONEditor.defaults.resolvers.unshift((scheme) => {
          console.log(scheme);
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
        this.editor = new JSONEditor(element, {
          schema: schemaToRender,
          show_opt_in: true,
          prompt_before_delete: false,
          form_name_root:"",
          theme: "antdTheme"
        });
        this.editor.on('change', () => onChange(this.editor.getValue()))
      }
    }
  
    render() {
      const {onSubmit} = this.props
      return (
        <form
          ref={r => {
            this.createEditor(r);
          }}
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
    schema: PropTypes.object.isRequired
  }