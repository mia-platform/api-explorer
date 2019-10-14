import React from 'react'
import {mount} from 'enzyme'
import JSONEditor from '@json-editor/json-editor'
import renderer from 'react-test-renderer'

import JsonForm from '../../src/JsonForm'

jest.mock('@json-editor/json-editor')

function createNodeMock(element) {
    if (element.type === 'form') {
      return {
        thisIs: 'my-form'
      };
    }
    return null;
  }
describe('JSONForm ', () => {
    const props = {
        schema: {
            type: 'object',
            properties: {
                petId: {
                    type: 'integer',
                    description: 'ID of pet to return',
                    format: 'int64'
                }
            },
            required: ['petId']
        },
        onChange: jest.fn(),
        onSubmit: jest.fn()
    }
    it('renders json-editor', () => {
        renderer.create(
          <JsonForm {...props} />, {createNodeMock})

        expect(JSONEditor).toHaveBeenCalledWith({
            thisIs: 'my-form'
          }, {
            schema: {
                ...props.schema,
                title: " "
            },
            show_opt_in: true,
            prompt_before_delete: false,
            form_name_root:"",
            theme: "antdTheme"
        })
    })
    it('when form submits, calls onSubmit prop', () => {
        const element = mount(<JsonForm {...props} />)
        const mockEvent = {preventDefault: jest.fn()}
        element.find('form').prop('onSubmit')(mockEvent)
        expect(props.onSubmit).toHaveBeenCalledTimes(1)
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
    })
})