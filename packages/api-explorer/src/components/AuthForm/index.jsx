import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Divider} from 'antd'
import debounce from 'lodash.debounce'
import pick from 'lodash.pick'
import {omit} from 'ramda'

const SecurityInput = require('../../SecurityInput')

const styles = {
  container: {
    display: 'grid',
    gridTemplateRows: 'repeat(auto-fit, minmax(50px, 1fr))'
  },
  inputsContainer: {
    paddingTop: 10
  },
  schemeName: {
    fontSize: 16
  }
}

function omitOrMerge (current, value, key) {
  if (!value) {
    return omit([key], current)
  }

  return {
    ...current,
    [key]: value
  }
}

function getSecuritySections(securityTypes, config, onChange, onSubmit, schemeName) {
  const {authInputRef, oauth, auth} = config
  return (
    <form onSubmit={onSubmit}>
      <div>
        {
          Object.keys(securityTypes).map((type, index) => {
            const securities = securityTypes[type];
            return (
              <div key={`security-${type + index}`} >
                <div style={{padding: '15px 17px'}}>
                  <section>
                    {
                      securities.map(security => (
                        <SecurityInput
                          {...{ auth, onChange, authInputRef, oauth }}
                          key={security._key}
                          scheme={security}
                          schemeName={schemeName}
                        />
                      ))
                    }
                  </section>
                </div>
              </div>
          )})
        }
      </div>
    </form>
    )
}

class AuthForm extends Component {
  constructor (props) {
    super(props)
    this.onChangeDebounced = debounce(this.onChange, 200)
    this.state = {auth: {}}
  }

  onChange (value, schemeName) {
    const {onChange} = this.props
    const mergeAuths = omitOrMerge(this.state.auth, value, schemeName)
    this.setState({
      auth: mergeAuths
    })
    onChange(mergeAuths)
  }

  onChangeWithMerge (value, schemeName, keyName) {
    const {auth} = this.state
    const dataBySchemeName = auth[schemeName] || {}
    const dataMerged = omitOrMerge(dataBySchemeName, value, keyName)
    this.onChangeDebounced(Object.keys(dataMerged).length > 0 ? dataMerged : null, schemeName)
  }

  render () {
    const {securitySchemes, onSubmit, onChange, auth, oauth, authInputRef} = this.props
    const schemeKeys = Object.keys(securitySchemes)

    return (
      <div style={styles.container}>
        {
            schemeKeys.map((schemeName, index) => {
              return (
                <div key={`field-${schemeName}`}>
                  <span style={styles.schemeName}>{schemeName}</span>
                  <div style={styles.inputsContainer}>
                    {getSecuritySections(
                      pick(securitySchemes, schemeName),
                      { authInputRef, oauth, auth },
                      onChange, 
                      e => {
                        e.preventDefault();
                        onSubmit();
                      },
                      schemeName
                      )}
                  </div>
                  {index < schemeKeys.length - 1 ? <Divider /> : null}
                </div>
              )
            })
          }
      </div>
    )
  }
}
AuthForm.propTypes = {
  authInputRef: PropTypes.func,
  oauth: PropTypes.bool.isRequired,
  auth: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  securitySchemes: PropTypes.object
}
AuthForm.defaultProps = {
  authInputRef: () => {},
  auth: {},
  securitySchemes: {}
}
module.exports = AuthForm;
