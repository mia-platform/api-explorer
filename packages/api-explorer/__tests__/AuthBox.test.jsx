import React from 'react';
import { shallowWithIntl, mountWithIntl } from 'enzyme-react-intl';

import AuthBox from '../src/AuthBox';
import AuthForm from '../src/components/AuthForm'

const Oas = require('../src/lib/Oas.js');
const multipleSecurities = require('./fixtures/multiple-securities/oas');

const oas = new Oas(multipleSecurities);

const props = {
  operation: oas.operation('/or-security', 'post'),
  onChange: () => {},
  onSubmit: () => {},
  toggle: () => {},
  open: false,
  oauth: false,
  auth: {},
};

test('should not display if no auth', () => {
  expect(mountWithIntl(<AuthBox {...props} operation={oas.operation('/no-auth', 'post')} />).html()).toBe(
    null,
  );
});

test('should display a single heading for single auth type', () => {
  // This object is retrieved from OAS library while running in prod.
  const securityTypes = {
    "Header Auth":[{"type":"auth","flows":{"implicit":{"authorizationUrl":"http://petstore.swagger.io/oauth/dialog","scopes":{"write:pets":"modify pets in your account","read:pets":"read your pets"}}},"_key":"petstore_auth"}],  
  }
  const security = [{"Header Auth": []}]
  const authBox = mountWithIntl(<AuthBox {...props} securityTypes={securityTypes} security={security} />);
  const popoverContent = shallowWithIntl(<div>{authBox.find('Popover').prop('content')}</div>)

  expect(popoverContent.find(AuthForm)).toHaveLength(1);
});


test.skip('should display a dropdown for when multiple oauths are present', () => {
  const authBox = shallowWithIntl(<AuthBox {...props} path="/multiple-oauths" />);

  expect(authBox.find('select option').length).toBe(2);
  expect(authBox.find('select option').map(option => option.text())).toEqual([
    'oauth',
    'oauthDiff',
  ]);
});

test.skip('should not display authentication warning if authData is passed', () => {
  const authBox = mountWithIntl(<AuthBox {...props} operation={oas.operation('/single-auth', 'post')} />);

  authBox.setProps({ needsAuth: false });

  expect(authBox.props().open).toBe(false);
});

test.skip('should hide authbox if open=false', () => {
  const authBox = mountWithIntl(<AuthBox {...props} operation={oas.operation('/single-auth', 'post')} />);

  authBox.setProps({ needsAuth: true });
  authBox.setProps({ needsAuth: false });

  expect(authBox.props().open).toBe(false);
});
