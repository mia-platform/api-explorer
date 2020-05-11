import React from 'react'
import { mountWithIntl } from 'enzyme-react-intl'

import JsonForm from '../../src/JsonForm'

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
    onSubmit: jest.fn(),
    setFormSubmissionListener: jest.fn(),
    title: 'The Title'
  }

  it('snapshot', () => {
    const element = mountWithIntl(<JsonForm {...props} />)
    expect(element.getDOMNode()).toMatchSnapshot()
  })

  it('when form submits, calls onSubmit prop', () => {
    const element = mountWithIntl(<JsonForm {...props} />)
    const mockEvent = { preventDefault: jest.fn() }
    element.find('form').prop('onSubmit')(mockEvent)
    expect(props.onSubmit).toHaveBeenCalledTimes(1)
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
  })
})
