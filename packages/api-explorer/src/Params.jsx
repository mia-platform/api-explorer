import React, {Component} from 'react'
import PropTypes from 'prop-types'

import './params.css'
import ContentWithTitle from './components/ContentWithTitle'
import JsonForm from './JsonForm'

const Oas = require('./lib/Oas');

const { Operation } = Oas;
const parametersToJsonSchema = require('./lib/parameters-to-json-schema');


export default class Params extends Component{
  
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