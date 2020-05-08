import React from 'react'
import { IntlProvider } from 'react-intl'
import { mountWithIntl } from 'enzyme-react-intl'
import renderer from 'react-test-renderer'

import JsonForm from '../../src/JsonForm'

const JSONEditor = require('@json-editor/json-editor').JSONEditor
jest.mock('../../src/JsonForm/configureJsonEditor', () => console.log('mockedJE'))
jest.mock('@json-editor/json-editor', () => ({
  __esModule: true, // this property makes it work
  default: 'mockedDefaultExport',
  JSONEditor: jest.fn(),
}))

function createNodeMock(element) {
  if (element.type === 'form') {
    return {
      thisIs: 'my-form'
    };
  }
  return null;
}

const createComponentWithIntl = (children, props = {locale: 'en'}, options) => {
  return renderer.create(<IntlProvider {...props}>{children}</IntlProvider>, options);
};

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
  }

  it('renders json-editor', () => {
    const element = mountWithIntl(<JsonForm {...props} />)

    expect(element).toMatchSnapshot()
    expect(JSONEditor).toHaveBeenCalledWith(
      {
        thisIs: 'my-form'
      }, {
        schema: {
          ...props.schema,
          title: " "
        },
        show_opt_in: true,
        prompt_before_delete: false,
        form_name_root: "",
        theme: "antdTheme"
      }
    )
  })

  it('when form submits, calls onSubmit prop', () => {
    const element = mountWithIntl(<JsonForm {...props} />)
    const mockEvent = { preventDefault: jest.fn() }
    element.find('form').prop('onSubmit')(mockEvent)
    expect(props.onSubmit).toHaveBeenCalledTimes(1)
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it.skip('extend all json-editor editors', () => {
    mountWithIntl(<JsonForm {...props} />)
    expect(
      extendMock.mock.calls.map(call => Object.keys(call[0]))
    ).toEqual([
      ['setContainer', 'build'], // foo
      ['setContainer', 'build'], // multiple
      ['setContainer', 'build'], // array - get-custom-editor
      ['addControls', 'refreshValue'], // array-custom-editor
      ['setContainer', 'build'], // object - get-custom-editor
      ['build'], // object-custom-editor
      ['setContainer', 'build'], // not - get-custom-editor
      ['preBuild'], // not-custom-editor
      ['setContainer', 'build'], // anyOf - get-custom-editor
      ['build', 'buildSwitcher', 'updateEditor', 'addErrorMessageHtmlNode',
        'showErrorMessage', 'hideErrorMessage', 'insertNewEditor', 'hideEditor'] // anyOf-custom-editor
    ])
  })
})
