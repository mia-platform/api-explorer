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

  it('snapshot', async () => {
    const element = await mountJsonForm(props)
    expect(element.getDOMNode()).toMatchSnapshot()
  })

  it('when form submits, calls onSubmit prop', async () => {
    const element = await mountJsonForm(props)
    const mockEvent = { preventDefault: jest.fn() }
    element.find('form').prop('onSubmit')(mockEvent)
    expect(props.onSubmit).toHaveBeenCalledTimes(1)
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('on parsing error, shows error', async () => {
    const element = await mountJsonForm({
      ...props,
      schema: {'$ref': '#/foo'}
    })
    expect(element.getDOMNode()).toMatchSnapshot()
  })

  it('converts schema correctly', async () => {
    const schemaWithRef =  {
      definitions: {
        address: {
          type: "object",
          properties: {
            street_address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" }
          },
          required: ["street_address", "city", "state"]
        }
      },
      $ref: "#/definitions/address"
    };
    const element = await mountJsonForm({...props, schema: schemaWithRef})
    expect(element.find('JsonForm').state().jsonSchema).toEqual({
      definitions: {
        address: {
          type: "object",
          properties: {
            street_address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" }
          },
          required: ["street_address", "city", "state"]
        }
      },
      type: "object",
          properties: {
            street_address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" }
          },
          required: ["street_address", "city", "state"]
    })
  })

  it('converts schema correctly with nested ref', async () => {
    const element = await mountJsonForm({...props, schema: SCHEMA_WITH_REF_ROOT_AND_NESTED})
    expect(element.find('JsonForm').state().jsonSchema).toEqual(EXPECTED_WITH_REF_ROOT_AND_NESTED)
  })
})

function mountJsonForm (props) {
  return new Promise((resolve) => {
    const element = mountWithIntl(<JsonForm {...props} />)
    setTimeout(() => {
      element.update()
      resolve(element)
    }, 0)
  })
}

const SCHEMA_WITH_REF_ROOT_AND_NESTED = {
  "components": {
    "securitySchemes": {
      "petstore_auth": {
        "type": "oauth2",
        "flows": {
          "implicit": {
            "authorizationUrl": "http://petstore.swagger.io/oauth/dialog",
            "scopes": {
              "write:pets": "modify pets in your account",
              "read:pets": "read your pets"
            }
          }
        },
        "_key": "petstore_auth"
      },
      "api_key": {
        "type": "apiKey",
        "name": "api_key",
        "in": "header"
      }
    },
    "schemas": {
      "Order": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "petId": {
            "type": "integer",
            "format": "int64"
          },
          "quantity": {
            "type": "integer",
            "format": "int32"
          },
          "shipDate": {
            "type": "string",
            "format": "date-time"
          },
          "status": {
            "type": "string",
            "description": "Order Status",
            "enum": [
              "placed",
              "approved",
              "delivered"
            ]
          },
          "complete": {
            "type": "boolean",
            "default": false
          }
        },
        "xml": {
          "name": "Order"
        }
      },
      "Category": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        },
        "xml": {
          "name": "Category"
        }
      },
      "User": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "username": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "userStatus": {
            "type": "integer",
            "format": "int32",
            "description": "User Status"
          }
        },
        "xml": {
          "name": "User"
        }
      },
      "Tag": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        },
        "xml": {
          "name": "Tag"
        }
      },
      "Pet": {
        "type": "object",
        "required": [
          "name",
          "photoUrls"
        ],
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "category": {
            "$ref": "#/components/schemas/Category"
          },
          "name": {
            "type": "string",
            "example": "doggie"
          },
          "photoUrls": {
            "type": "array",
            "xml": {
              "name": "photoUrl",
              "wrapped": true
            },
            "items": {
              "type": "string"
            }
          },
          "tags": {
            "type": "array",
            "xml": {
              "name": "tag",
              "wrapped": true
            },
            "items": {
              "$ref": "#/components/schemas/Tag"
            }
          },
          "status": {
            "type": "string",
            "description": "pet status in the store",
            "enum": [
              "available",
              "pending",
              "sold"
            ]
          }
        },
        "xml": {
          "name": "Pet"
        }
      },
      "ApiResponse": {
        "type": "object",
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "type": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  },
  "$ref": "#/components/schemas/Pet"
}


const EXPECTED_WITH_REF_ROOT_AND_NESTED = {
  "components": {
    "securitySchemes": {
      "petstore_auth": {
        "type": "oauth2",
        "flows": {
          "implicit": {
            "authorizationUrl": "http://petstore.swagger.io/oauth/dialog",
            "scopes": {
              "write:pets": "modify pets in your account",
              "read:pets": "read your pets"
            }
          }
        },
        "_key": "petstore_auth"
      },
      "api_key": {
        "type": "apiKey",
        "name": "api_key",
        "in": "header"
      }
    },
    "schemas": {
      "Order": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "petId": {
            "type": "integer",
            "format": "int64"
          },
          "quantity": {
            "type": "integer",
            "format": "int32"
          },
          "shipDate": {
            "type": "string",
            "format": "date-time"
          },
          "status": {
            "type": "string",
            "description": "Order Status",
            "enum": [
              "placed",
              "approved",
              "delivered"
            ]
          },
          "complete": {
            "type": "boolean",
            "default": false
          }
        },
        "xml": {
          "name": "Order"
        }
      },
      "Category": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        },
        "xml": {
          "name": "Category"
        }
      },
      "User": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "username": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "userStatus": {
            "type": "integer",
            "format": "int32",
            "description": "User Status"
          }
        },
        "xml": {
          "name": "User"
        }
      },
      "Tag": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        },
        "xml": {
          "name": "Tag"
        }
      },
      "Pet": {
        "type": "object",
        "required": [
          "name",
          "photoUrls"
        ],
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "category": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "format": "int64"
              },
              "name": {
                "type": "string"
              }
            },
            "xml": {
              "name": "Category"
            }
          },
          "name": {
            "type": "string",
            "example": "doggie"
          },
          "photoUrls": {
            "type": "array",
            "xml": {
              "name": "photoUrl",
              "wrapped": true
            },
            "items": {
              "type": "string"
            }
          },
          "tags": {
            "type": "array",
            "xml": {
              "name": "tag",
              "wrapped": true
            },
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "integer",
                  "format": "int64"
                },
                "name": {
                  "type": "string"
                }
              },
              "xml": {
                "name": "Tag"
              }
            }
          },
          "status": {
            "type": "string",
            "description": "pet status in the store",
            "enum": [
              "available",
              "pending",
              "sold"
            ]
          }
        },
        "xml": {
          "name": "Pet"
        }
      },
      "ApiResponse": {
        "type": "object",
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "type": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  },
  "type": "object",
  "required": [
    "name",
    "photoUrls"
  ],
  "properties": {
    "id": {
      "type": "integer",
      "format": "int64"
    },
    "category": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64"
        },
        "name": {
          "type": "string"
        }
      },
      "xml": {
        "name": "Category"
      }
    },
    "name": {
      "type": "string",
      "example": "doggie"
    },
    "photoUrls": {
      "type": "array",
      "xml": {
        "name": "photoUrl",
        "wrapped": true
      },
      "items": {
        "type": "string"
      }
    },
    "tags": {
      "type": "array",
      "xml": {
        "name": "tag",
        "wrapped": true
      },
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        },
        "xml": {
          "name": "Tag"
        }
      }
    },
    "status": {
      "type": "string",
      "description": "pet status in the store",
      "enum": [
        "available",
        "pending",
        "sold"
      ]
    }
  },
  "xml": {
    "name": "Pet"
  }
}