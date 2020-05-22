import React from 'react'
import { shallow } from 'enzyme'
import { omit } from 'ramda'
import { FormattedMessage } from 'react-intl';
import jsf from 'json-schema-faker'
import {Alert} from "antd";

import SchemaTabs from '../src/components/SchemaTabs'
import BlockWithTab from '../src/components/BlockWithTab';
import JsonViewer from "../src/components/JsonViewer";

const operationWithExample = require('./fixtures/withExample/operation.json')
const oasWithExample = require('./fixtures/withExample/oas.json')
const maxStackOas = require('./fixtures/withExample/maxStackOas.json')
const maxStackOperation = require('./fixtures/withExample/maxStackOperation.json')

const OAS = {
  "x-explorer-enabled": true,
  "x-samples-enabled": true,
  "x-samples-languages": [
    "curl",
    "node",
    "javascript",
    "java"
  ],
  "x-proxy-enabled": true,
  "x-send-defaults": false,
  "openapi": "3.0.0",
  "info": {
    "version": "12bd7688957f960c9fb2819517eff4e3116ba51e",
    "title": "Test Development",
    "description": "Project to try & test feature of the platform"
  },
  "paths": {
    "/test": {
      "post": {
        "summary": "Add a new item to the testv1adapter collection",
        "tags": [
          "V1adapter"
        ],
        "requestBody": {
          "$ref": "#/components/requestBodies/foo"
        },
        "responses": {
          "200": {
            "description": "Default Response",
            "content": {
              "*/*": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": {
                      "type": "string",
                      "pattern": "^[a-fA-F\\d]{24}$",
                      "description": "Hexadecimal identifier of the document in the collection"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
  },
  "components": {
    "securitySchemes": {
      "APISecretHeader": {
        "type": "apiKey",
        "in": "header",
        "name": "secret",
        "_key": "APISecretHeader"
      }
    },
    "requestBodies": {
      "foo": {
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "lorem": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "bar": {
      "type": "string"
    }
  },
  "tags": [],
  "user": {
    "keys": [
      {
        "name": "project1",
        "apiKey": "123",
        "user": "user1",
        "pass": "pass1"
      },
      {
        "name": "project2",
        "apiKey": "456",
        "user": "user2",
        "pass": "pass2"
      }
    ]
  },
  "servers": [
    {
      "url": "http://localhost:9966"
    }
  ]
}
const OPERATION = {
  "summary": "Add a new item to the testv1adapter collection",
  "tags": [
    "V1adapter"
  ],
  "requestBody": {
    "$ref": "#/components/requestBodies/foo"
  },
  "responses": {
    "200": {
      "description": "Default Response",
      "content": {
        "*/*": {
          "schema": {
            "type": "object",
            "properties": {
              "_id": {
                "type": "string",
                "pattern": "^[a-fA-F\\d]{24}$",
                "description": "Hexadecimal identifier of the document in the collection"
              }
            }
          }
        }
      }
    }
  },
  "oas": OAS,
  "path": "/test",
  "method": "post"
}

jest.mock('json-schema-faker')

describe('SchemaTabs', () => {
  const props = {
    oas: OAS,
    operation: OPERATION
  }

  let element
  let block

  beforeEach(() => {
    jest.clearAllMocks()
    element = shallow(<SchemaTabs {...props} />)
    block = element.find(BlockWithTab)
  })

  test('renders a tab with 3 items', () => {
    expect(block).toHaveLength(1)
    const { items } = block.props()
    const exampleLabel = <FormattedMessage defaultMessage="Example" id="schemaTabs.label.example" />
    const requestLabel = <FormattedMessage defaultMessage="Request" id="schemaTabs.label.request" />
    const responseLabel = <FormattedMessage defaultMessage="Response" id="schemaTabs.label.response" />
    expect(items).toEqual([
      { value: 'example', label: exampleLabel },
      { value: 'request', label: requestLabel },
      { value: 'response', label: responseLabel }
    ])
  })

  test('set correct tab when one is clicked', () => {
    expect(element.find(BlockWithTab).prop('selected')).toEqual('example')
    element.find(BlockWithTab).simulate('click', 'response')
    expect(element.find(BlockWithTab).prop('selected')).toEqual('response')
  })

  describe('with example schema selected', () => {
    test('render jsonEditor', (done) => {
      element = shallow(<SchemaTabs oas={oasWithExample} operation={operationWithExample} />)
      const petType = 'Carlino'
      const petChildren = ['john', 'doo']
      setTimeout(() => {
        element.update()
        expect(element.find(JsonViewer).prop('schema')).toEqual({pet_type: petType, pet_children: petChildren})
        done()
      }, 0)
    })

    test('render generated example when operation.requestBody.example is not set', (done) => {
      const petId = 1234
      // eslint-disable-next-line no-underscore-dangle
      jsf._generateReturnValue(() => ({petId}))
      element = shallow(<SchemaTabs {...props} />)
      setTimeout(() => {
        element.update()
        expect(element.find(JsonViewer).prop('schema')).toEqual({petId})
        done()
      }, 0)
    })

    test('render missing schema message', () => {
      element = shallow(<SchemaTabs {...props} operation={{}} />)
      const formattedMessage = element.find(FormattedMessage)
      expect(formattedMessage.prop('id')).toEqual('schemaTabs.missing.example')
    })

    test('render errors alert', (done) => {
      // eslint-disable-next-line no-underscore-dangle
      jsf._generateReturnValue(() => {
        throw new Error('Maximum call stack size exceeded')
      })
      element = shallow(<SchemaTabs oas={maxStackOas} operation={maxStackOperation} />)
      setTimeout(() => {
        element.update()
        expect(element.find(Alert).prop('message')).toEqual('Maximum call stack size exceeded')
        done()
      }, 0)
    })
  })

  describe('with request schema selected', () => {
    test('render jsonEditor', (done) => {
      element = shallow(<SchemaTabs {...props} />)
      element.find(BlockWithTab).simulate('click', 'request')
      setTimeout(() => {
        element.update()
        expect(element.find(BlockWithTab).find(JsonViewer)).toHaveLength(1)
        done()
      }, 0)
    })

    test('render missing schema message if the request is missing', () => {
      element = shallow(<SchemaTabs {...props} operation={omit(['requestBody'], OPERATION)} />)
      element.find(BlockWithTab).simulate('click', 'request')
      const formattedMessage = element.find(FormattedMessage)
      expect(formattedMessage.prop('id')).toEqual('schemaTabs.missing.request')
    })
  })

  describe('with response schema selected', () => {
    test('renders jsonEditor', (done) => {
      element.find(BlockWithTab).simulate('click', 'response')
      setTimeout(() => {
        element.update()
        expect(element.find(BlockWithTab).find(JsonViewer)).toHaveLength(1)
        done()
      }, 0)
    })

    test('render missing schema message if the responses is missing', () => {
      element = shallow(<SchemaTabs {...props} operation={omit(['responses'], OPERATION)} />)
      element.find(BlockWithTab).simulate('click', 'response')
      const formattedMessage = element.find(FormattedMessage)
      expect(formattedMessage.prop('id')).toEqual('schemaTabs.missing.response')
    })
  })
})
