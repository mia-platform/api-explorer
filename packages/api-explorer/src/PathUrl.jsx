import {Button, Tag} from 'antd'

import colors from './colors'

const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const AuthBox = require('./AuthBox');
const Oas = require('./lib/Oas');

const { Operation } = Oas;

const extensions = require('@readme/oas-extensions');

function splitPath(path) {
  return path
    .split(/({.+?})/)
    .filter(Boolean)
    .map(part => {
      return { type: part.match(/[{}]/) ? 'variable' : 'text', value: part.replace(/[{}]/g, '') };
    });
}

function renderButtonTry(loading, onSubmit){
  /* <button
                className={classNames('api-try-it-out', { active: dirty })}
                type="submit"
                disabled={loading}
                onClick={onSubmit}
              > */
  return(
    
    <Button 
      disabled={loading}
      onClick={onSubmit}
      type={'primary'}
    >
      {!loading && (
        <span className="try-it-now-btn">
          <span className="fa fa-compass" />&nbsp;
          <span>Try It</span>
        </span>
      )}

      {loading && <i className="fa fa-circle-o-notch fa-spin" />}
    </Button>
  )
}
function renderOperationMethod(operation){
  return(
    <Tag color={colors[operation.method]}>{operation.method}</Tag>
  )
  // return(
  //   <span 
  //     style={style} 
  //     className={`pg-type-big pg-type type-${operation.method}`}
  //   >{operation.method}</span>
  // )
}
function renderUrl(oas, operation){
  return(
    oas.servers &&
      oas.servers.length > 0 && (
        <span className="definition-url">
          <span className="url">{oas.url()}</span>
          {splitPath(operation.path).map(part => (
            <span key={part.value} className={`api-${part.type}`}>
              {part.value}
            </span>
          ))}
        </span>)
  )
}
function PathUrl({
  oas,
  operation,
  authInputRef,
  loading,
  dirty,
  onChange,
  showAuthBox,
  needsAuth,
  toggleAuth,
  onSubmit,
  oauth,
  auth,
  onReset,
  showReset
}) {
  const containerStyle = {
    background: '#f0f2f4',
    padding: '8px 18px',
    borderRadius: 10
  }
  return (
    <div className="api-definition-parent">
      <div className="api-definition" style={containerStyle}>
        {/* <div className="api-definition-container"> */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
  
          <div>
            {renderOperationMethod(operation)}

            {renderUrl(oas, operation)}
          </div>
          
          {oas[extensions.EXPLORER_ENABLED] && (
            <div className="api-definition-actions">
              <AuthBox
                securityTypes={operation.prepareSecurity()}
                onChange={onChange}
                onSubmit={onSubmit}
                open={showAuthBox}
                needsAuth={needsAuth}
                toggle={toggleAuth}
                authInputRef={authInputRef}
                oauth={oauth}
                auth={auth}
                onReset={onReset}
                showReset={false} // ToDo: showReset={showReset} after merge of AC-801 (new GUI for AuthBox)
              />

              {renderButtonTry(loading, onSubmit)}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

PathUrl.propTypes = {
  oas: PropTypes.instanceOf(Oas).isRequired,
  operation: PropTypes.instanceOf(Operation).isRequired,
  authInputRef: PropTypes.func,
  dirty: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  toggleAuth: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  showAuthBox: PropTypes.bool,
  needsAuth: PropTypes.bool,
  oauth: PropTypes.bool.isRequired,
  auth: PropTypes.shape({}),
  showReset: PropTypes.bool
};

PathUrl.defaultProps = {
  showAuthBox: false,
  needsAuth: false,
  authInputRef: () => {},
  auth: {},
  showReset: true
};
module.exports = PathUrl;
module.exports.splitPath = splitPath;
