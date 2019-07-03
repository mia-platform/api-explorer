import ContentWithTitle from '../src/components/ContentWithTitle'

const React = require('react');
const { shallow, mount } = require('enzyme');

const ResponseSchema = require('../src/ResponseSchema');
const Oas = require('../src/lib/Oas');
const petstore = require('./fixtures/petstore/oas.json');

const { Operation } = Oas;
const oas = new Oas(petstore);

const props = {
  operation: oas.operation('/pet/{petId}', 'get'),
  oas,
};

test('should display a header with a dropdown', () => {
  const responseSchema = mount(<ResponseSchema {...props} />);
  expect(responseSchema.find(ContentWithTitle).prop('title')).toBeUndefined()
  expect(responseSchema.find('Select').at(0).prop('options')).toEqual(['200', '400', '404']);
});

test('selectedStatus should change state of selectedStatus', () => {
  const responseSchema = shallow(<ResponseSchema {...props} />);

  expect(responseSchema.state('selectedStatus')).toBe('200');
  responseSchema.instance().selectedStatus('400');

  expect(responseSchema.state('selectedStatus')).toBe('400');
});

test('should work if there are no responses', () => {
  // Need to create a new operation without any responses
  const responseSchema = shallow(
    <ResponseSchema
      operation={
        new Operation(
          {},
          '/',
          'get',
          Object.assign({}, oas.operation('/pet/{petId}', 'get'), { responses: undefined }),
        )
      }
      oas={oas}
    />,
  );

  expect(responseSchema.html()).toBe(null);
});

test('should work if responses is an empty object', () => {
  const responseSchema = shallow(
    <ResponseSchema
      operation={
        new Operation(
          {},
          '/',
          'get',
          Object.assign({}, oas.operation('/pet/{petId}', 'get'), { responses: {} }),
        )
      }
      oas={oas}
    />,
  );

  expect(responseSchema.html()).toBe(null);
});

test('should contain ResponseSchemaBody element if $ref exist for "application/json"', () => {
  const responseSchema = shallow(<ResponseSchema {...props} />);
  const content = shallow(<div>{responseSchema.find('ContentWithTitle').prop('content')}</div>)
  expect(content.text()).toContain('ResponseSchemaBody')
});

test('should not contain ResponseSchemaBody element if $ref not exist', () => {
  const testProps = {
    operation: new Operation(
      {},
      '/',
      'get',
      Object.assign({}, oas.operation('/pet/{petId}', 'get'), { responses: {} }),
    ),
    oas,
  };
  const responseSchema = shallow(<ResponseSchema {...testProps} />);
  expect(responseSchema.find('ResponseSchemaBody').length).toBe(0);
});

test('should render schema from "application/json"', () => {
  const testProps = {
    operation: new Operation(
      {},
      '/',
      'get',
      Object.assign({}, oas.operation('/pet/findByTags', 'get'), {
        responses: {
          '200': {
            content: {
              'application/json': {
                description: 'successful operation',
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      }),
    ),
    oas,
  };

  const responseSchema = shallow(<ResponseSchema {...testProps} />);
  const content = shallow(<div>{responseSchema.find('ContentWithTitle').prop('content')}</div>)
  expect(content.find('ResponseSchemaBody').length).toBe(1);
});

test('should contain ResponseSchemaBody element if $ref exist for "application/xml"', () => {
  const testProps = {
    operation: new Operation(
      oas,
      '/',
      'get',
      Object.assign({}, oas.operation('/pet/{petId}', 'get'), {
        responses: {
          '200': {
            content: {
              'application/xml': {
                description: 'successful operation',
                schema: {
                  $ref: '#/components/schemas/Pet',
                },
              },
            },
          },
        },
      }),
    ),
    oas,
  };

  const responseSchema = shallow(<ResponseSchema {...testProps} />);
  const content = shallow(<div>{responseSchema.find('ContentWithTitle').prop('content')}</div>)
  expect(content.find('ResponseSchemaBody').length).toBe(1);
});

test('should allow $ref lookup at the responses object level', () => {
  const testOas = new Oas({
    components: {
      responses: {
        Response: {
          content: {
            'application/json': {
              schema: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    paths: {
      '/ref-responses': {
        get: {
          responses: {
            200: {
              $ref: '#/components/responses/Response',
            },
          },
        },
      },
    },
  });

  const responseSchema = shallow(
    <ResponseSchema
      {...props}
      oas={testOas}
      operation={testOas.operation('/ref-responses', 'get')}
    />,
  );
  const content = shallow(<div>{responseSchema.find('ContentWithTitle').prop('content')}</div>)
  expect(content.find('ResponseSchemaBody').length).toBe(1);
});

test('should change selectedStatus in component', () => {
  const responseSchema = shallow(<ResponseSchema {...props} />);

  const selectedStatus = responseSchema.state().selectedStatus;

  responseSchema.instance().changeHandler('404');
  const newSelectedStatus = responseSchema.state().selectedStatus;
  expect(selectedStatus).toEqual('200');
  expect(newSelectedStatus).toEqual('404');
});

test('should not break if schema property missing', () => {
  const testProps = {
    operation: new Operation(
      {},
      '/',
      'get',
      Object.assign({}, oas.operation('/pet/findByTags', 'get'), {
        responses: {
          '200': {
            content: {
              'application/xml': {
                description: 'successful operation',
              },
            },
          },
        },
      }),
    ),
    oas,
  };

  const responseSchema = shallow(<ResponseSchema {...testProps} />);
  expect(responseSchema.find('table').length).toBe(0);
});
