import generateFakeSchema from '../../lib/generateFakeSchema'

jest.unmock('json-schema-faker')

describe('generateFakeSchema', () => {
  const generateFakeSchemaTests = [
    {
      title: 'base examples use',
      schema: {
        type: 'object',
        examples: [{ foo: 'bar' }],
        properties: {
          foo: { type: 'string' }
        }
      },
      expectation: generatedFakeSchema => {
        expect(generatedFakeSchema).toEqual({foo: 'bar'})
      }
    },
    {
      title: 'using examples inside of properties should be return oneOf examples',
      schema: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            examples: ['bar2']
          }
        }
      },
      expectation: generatedFakeSchema => {
        expect(generatedFakeSchema).toEqual({foo: 'bar2'})
      }
    },
    {
      title: 'not supported from json-schema-faker - example key outside a properties',
      schema: {
        type: 'object',
        example: {foo: 'bar'},
        properties: {
          foo: {
            type: 'string',
          }
        }
      },
      expectation: generatedFakeSchema => {
        expect(generatedFakeSchema).not.toEqual({foo: 'bar'})
        expect(generatedFakeSchema).toEqual({foo: expect.any(String)})
      }
    },
    {
      title: 'not supported from json-schema-faker - example key inside a properties',
      schema: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            example: 'bar'
          }
        }
      },
      expectation: generatedFakeSchema => {
        expect(generatedFakeSchema).not.toEqual({foo: 'bar'})
        expect(generatedFakeSchema).toEqual({foo: expect.any(String)})
      }
    }
  ]

  generateFakeSchemaTests.forEach((schemaTest) => {
    const {title, schema, expectation} = schemaTest
    test(title, () => {
      const result = generateFakeSchema(schema)
      expectation(result)
    })
  })
})
