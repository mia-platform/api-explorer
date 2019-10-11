import React, {Component} from 'react'
import './params.css'
import ContentWithTitle from './components/ContentWithTitle'
import JSONEditor from '@json-editor/json-editor'
import get from 'lodash.get'

import './bootstrap4.css'
import './custom-bootstrap4.css'

const PropTypes = require('prop-types');
const Form = require('react-jsonschema-form').default;
const UpDownWidget = require('react-jsonschema-form/lib/components/widgets/UpDownWidget').default;
const TextWidget = require('react-jsonschema-form/lib/components/widgets/TextWidget').default;
const DateTimeWidget = require('react-jsonschema-form/lib/components/widgets/DateTimeWidget')
  .default;

const DescriptionField = require('./form-components/DescriptionField');
const createBaseInput = require('./form-components/BaseInput');
const createSelectWidget = require('./form-components/SelectWidget');
const createArrayField = require('./form-components/ArrayField');
const createSchemaField = require('./form-components/SchemaField');
const createTextareaWidget = require('./form-components/TextareaWidget');
const createFileWidget = require('./form-components/FileWidget');
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
      console.log(schema, 'converted to ', schemaToRender)
      this.editor = new JSONEditor(element, {
        schema: schemaToRender,
        show_opt_in: true,
        prompt_before_delete: false,
        form_name_root:"",
        theme: "bootstrap4"
      });
      this.editor.on('change', () => onChange(this.editor.getValue()))
    }
  }

  render() {
    return (
      <div
        ref={r => {
          this.createEditor(r);
        }}
      />
    );
  }
}
// eslint-disable-next-line react/no-multi-comp
class Params extends Component{
  
  renderParam(schema) {
    const {
      formData,
      onChange,
      onSubmit,
      BaseInput,
      SelectWidget,
      ArrayField,
      SchemaField,
      TextareaWidget,
      FileWidget,
    } = this.props

    console.log("LINKED", schema.schema)
    return(
      <JsonForm schema={schema.schema} onChange={values => onChange({ schema, formData: { [schema.type]: values } })} />
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
  onSubmit: PropTypes.func.isRequired,
  BaseInput: PropTypes.func.isRequired,
  SelectWidget: PropTypes.func.isRequired,
  ArrayField: PropTypes.func.isRequired,
  SchemaField: PropTypes.func.isRequired,
  TextareaWidget: PropTypes.func.isRequired,
  FileWidget: PropTypes.func.isRequired,
};

function createParams(oas) {
  const BaseInput = createBaseInput(oas);
  const SelectWidget = createSelectWidget(oas);
  const ArrayField = createArrayField(oas);
  const SchemaField = createSchemaField();
  const TextareaWidget = createTextareaWidget(oas);
  const FileWidget = createFileWidget(oas);

  return props => {
    return (
      <Params
        {...props}
        BaseInput={BaseInput}
        SelectWidget={SelectWidget}
        ArrayField={ArrayField}
        SchemaField={SchemaField}
        TextareaWidget={TextareaWidget}
        FileWidget={FileWidget}
      />
    );
  };
}

module.exports = createParams;
