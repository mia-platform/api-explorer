import React, {Component} from 'react'
import JSONEditor from '@json-editor/json-editor'
import get from 'lodash.get'

import './params.css'
import ContentWithTitle from './components/ContentWithTitle'
import antdTheme from './antd-theme-json-editor'
import PropTypes from 'prop-types'

import './bootstrap4.css'
import './custom-bootstrap4.css'

const Oas = require('./lib/Oas');

const { Operation } = Oas;
const parametersToJsonSchema = require('./lib/parameters-to-json-schema');

function getSchemaToRender(schema){
  const withoutTitle = {...schema, title: " "}
  const ref = withoutTitle.$ref
  if(!ref) {
    return withoutTitle
  }
  // e.g.:    "#/components/schemas/Pet" -> ".components.schemas.Pet"
  const componentsPath = ref.slice(1, ref.length).replace(/\//g, '.')
  const foundReference = get(schema, `definitions${componentsPath}`)
  if(!foundReference) {
    return withoutTitle
  }
  return {
    ...withoutTitle,
    '$ref': undefined,
    ...foundReference
  }
}
class JsonForm extends Component {
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
// eslint-disable-next-line react/no-multi-comp
class Params extends Component{
  
  renderParam(schema) {
    const {
      onChange,
      onSubmit,
    } = this.props

    return(
      <JsonForm 
        schema={schema.schema} 
        onChange={values => onChange({ schema, formData: { [schema.type]: values } })} 
        onSubmit={() => onSubmit()}
      />
    )
    // return (
    //   <Form
    //     key={`${schema.type}-form`}
    //     id={"form-params"}
    //     idPrefix={'form-id'}
    //     schema={schema.schema}
    //     style={{margin: 0}}
    //     widgets={{
    //       int64: UpDownWidget,
    //       int32: UpDownWidget,
    //       double: UpDownWidget,
    //       float: UpDownWidget,
    //       binary: FileWidget,
    //       byte: TextWidget,
    //       string: TextWidget,
    //       uuid: TextWidget,
    //       duration: TextWidget,
    //       dateTime: DateTimeWidget,
    //       integer: UpDownWidget,
    //       json: TextareaWidget,
    //       BaseInput,
    //       SelectWidget,
    //     }}
    //     onSubmit={onSubmit}
    //     formData={formData[schema.type]}
    //     onChange={form => onChange({ schema, formData: { [schema.type]: form.formData } })}
    //     fields={{
    //       DescriptionField,
    //       ArrayField,
    //       SchemaField,
    //     }}
    //   >
    //     <button type="submit" style={{ display: 'none' }} />
    //   </Form>
    // )
  }

  render() {
    const {oas, operation} = this.props
    const jsonSchema = parametersToJsonSchema(operation, oas);
    return (
      jsonSchema &&
      jsonSchema.map((schema) => {
        return (<ContentWithTitle
          key={schema.label+schema.schema.ref}
          title={schema.label}
          content={this.renderParam(schema)}
          showDivider={false}
          theme={'dark'}
          showBorder={false}
          titleUpperCase
        />)
      })
    )
  }
}

Params.propTypes = {
  oas: PropTypes.instanceOf(Oas).isRequired,
  operation: PropTypes.instanceOf(Operation).isRequired,
  formData: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

function createParams() {
  return props => {
    return (
      <Params
        {...props}
      />
    );
  };
}

module.exports = createParams;
