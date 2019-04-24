const React = require('react');
const PropTypes = require('prop-types');

const oauthHref = require('../lib/oauth-href');

import colors from '../colors'

const style={
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(50px, min-content))',
    alignItems: 'center',
    gridGap: 10,
    fontSize: 12
  }
}
function Oauth2({ apiKey, authInputRef, oauth, change, Input }) {
  if (!apiKey && oauth) {
    return (
      <section>
        <div className="text-center">
          <a className="btn btn-primary" href={oauthHref()} target="_self">
            Authenticate via OAuth2
          </a>
        </div>
      </section>
    );
  }

  return (
    <section>
      {
        // TODO
        //   if security.description
        //     != marked(security.description)
      }
      <div style={style.container}>
        <div>
          <label htmlFor="apiKey">Authorization</label>
        </div>
        <div style={{color: colors.authType}}>
          Bearer
        </div>
        <div>
          <Input
            inputRef={authInputRef}
            disabled={oauth}
            type="text"
            onChange={e => change(e.target.value)}
            name="apiKey"
            value={apiKey}
          />
        </div>
      </div>
    </section>
  );
}

Oauth2.propTypes = {
  apiKey: PropTypes.string,
  oauth: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  authInputRef: PropTypes.func,
  Input: PropTypes.func.isRequired,
};

Oauth2.defaultProps = {
  apiKey: undefined,
  authInputRef: () => {},
};

module.exports = Oauth2;
