import PathUrl from '../src/PathUrl';

const React = require('react');
const { shallow } = require('enzyme');
const Oas = require('../src/lib/Oas');

const { splitPath } = PathUrl;

const { Operation } = Oas;
const petstore = require('./fixtures/petstore/oas');

const oas = new Oas(petstore);

const props = {
  oas,
  operation: oas.operation('/pet/{petId}', 'get'),
  dirty: false,
  loading: false,
  onChange: () => {},
  toggleAuth: () => {},
  onSubmit: () => {},
  oauth: false,
  apiKey: '',
};

describe('fallbackUrl', () => {
  test('should display the oas path', () => {
    const pathUrl = shallow(<PathUrl {...props} />);

    expect(pathUrl.findWhere((node) => {
      return node.type() === 'span' && node.text() === oas.servers[0].url;
    }).length).toBe(1);
  });

  test('should display the oas path even if there is a fallback path', () => {
    const fallback = 'http://thisis.the-fallback.com/'
    const pathUrl = shallow(<PathUrl {...props} fallbackUrl={fallback} />);

    expect(pathUrl.findWhere((node) => {
      return node.type() === 'span' && node.text() === oas.servers[0].url;
    }).length).toBe(1);
  });

  it('should display fallback if oas path is empty', () => {
    const overwrittenProps = Object.assign({}, props, {oas: new Oas()})
    const fallback = 'http://thisis.the-fallback.com/'
    const pathUrl = shallow(<PathUrl {...overwrittenProps} fallbackUrl={fallback} />);

    expect(pathUrl.findWhere((node) => {
      return node.type() === 'span' && node.text() === fallback;
    }).length).toBe(1);
  })
})

describe('loading prop', () => {
  test('should disable submit button when loading', () => {
    expect(shallow(<PathUrl {...props} loading />).find('Button[disabled=true]').length).toBe(1);

    expect(
      shallow(<PathUrl {...props} loading={false} />).find('Button[disabled=false]').length,
    ).toBe(1);
  });
});

test('button click should call onSubmit', () => {
  let called = false;
  function onSubmit() {
    called = true;
  }

  shallow(
    <PathUrl
      {...props}
      operation={new Operation({}, '/path', 'get', { operationId: '123' })}
      onSubmit={onSubmit}
    />,
  )
    .find('Button')
    .simulate('click');

  expect(called).toBe(true);
});

describe('splitPath()', () => {
  test('should work for multiple path params', () => {
    expect(splitPath('/{a}/{b}/c').length).toBe(5);
    expect(splitPath('/v1/flight/{FlightID}/sitezonetargeting/{SiteZoneTargetingID}').length).toBe(
      4,
    );
  });
});
