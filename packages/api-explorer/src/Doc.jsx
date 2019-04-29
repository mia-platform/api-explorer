import React, {Fragment} from 'react'

import PropTypes from 'prop-types'
import {Icon} from 'antd'
import fetchHar from 'fetch-har'

import oasToHar from './lib/oas-to-har'
import isAuthReady from './lib/is-auth-ready'
import extensions from '@readme/oas-extensions'
import Waypoint from 'react-waypoint'

import ContentWithTitle from './components/ContentWithTitle'
import Select from './components/Select'

const PathUrl = require('./PathUrl');
const createParams = require('./Params');
const CodeSample = require('./CodeSample');
const Response = require('./Response');
const ResponseSchema = require('./ResponseSchema');
const EndpointErrorBoundary = require('./EndpointErrorBoundary');
const markdown = require('@readme/markdown');

const Oas = require('./lib/Oas');
// const showCode = require('./lib/show-code');
const parseResponse = require('./lib/parse-response');
const Content = require('./block-types/Content');
const getContentTypeFromOperation = require('./lib/get-content-type')

class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      dirty: false,
      loading: false,
      showAuthBox: false,
      needsAuth: false,
      result: null,
      showEndpoint: false,
      selectedContentType: undefined,
    };
    this.onChange = this.onChange.bind(this);
    this.oas = new Oas(this.props.oas, this.props.user);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleAuth = this.toggleAuth.bind(this);
    this.hideResults = this.hideResults.bind(this);
    this.waypointEntered = this.waypointEntered.bind(this);
    this.Params = createParams(this.oas);
  }

  onChange(formData) {
    this.setState(previousState => {
      return {
        formData: Object.assign({}, previousState.formData, formData),
        dirty: true,
      };
    });
  }

  onSubmit() {
    const operation = this.getOperation();

    if (!isAuthReady(operation, this.props.auth)) {
      this.setState({ showAuthBox: true });
      setTimeout(() => {
        this.authInput.focus();
        this.setState({ needsAuth: true });
      }, 600);
      return false;
    }

    this.setState({ loading: true, showAuthBox: false, needsAuth: false });

    const har = oasToHar(this.oas, operation, this.state.formData, this.props.auth, {
      proxyUrl: true,
    });

    return fetchHar(har).then(async res => {
      this.props.tryItMetrics(har, res);

      this.setState({
        loading: false,
        result: await parseResponse(har, res),
      });
    });
  }

  getOperation() {
    if (this.operation) return this.operation;

    const { doc } = this.props;
    const operation = doc.swagger ? this.oas.operation(doc.swagger.path, doc.api.method) : null;
    this.operation = operation;
    return operation;
  }

  toggleAuth(e) {
    e.preventDefault();
    this.setState({ showAuthBox: !this.state.showAuthBox });
  }

  hideResults() {
    this.setState({ result: null });
  }

  waypointEntered() {
    this.setState({ showEndpoint: true });
  }

  renderContentTypeSelect(showTitle = false) {
    const list = getContentTypeFromOperation(this.getOperation())
    const renderSelect = () => {
      return (<Select
        value={this.state.selectedContentType}
        options={list}
        onChange={(e) => this.setState({selectedContentType: e})} 
      />)
    }

    return list && list.length !== 0 && showTitle ? (
      <ContentWithTitle
        title='Select Content Type'
        showBorder={false}
        showDivider={false}
        theme={'dark'}
        titleUpperCase
        content={renderSelect()}
      />
    ) : renderSelect()
  }

  renderCodeAndResponse() {
    const definitionStyle = {
      color: 'white',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }

    return(
      // <div className="hub-reference-section hub-reference-section-code">
      <div style={{display: 'grid', gridGap: '8px'}}>
        {/* <div className="hub-reference-left"> */}
        <ContentWithTitle 
          title={'Definition'} 
          showBorder={false}
          content={
            <pre style={definitionStyle}>
              {this.oas.servers[0].url}{this.getOperation().path}
            </pre>
          } 
        />
        <ContentWithTitle title={'Examples'} subheader={this.renderContentTypeSelect()} content={this.renderCodeSample()} />
        <ContentWithTitle title={'Results'}  content={this.renderResponse()} />
      </div>
    )
  }

  renderCodeSample() {
    const {selectedContentType} = this.state
    let examples;
    try {
      examples = this.props.doc.api.examples.codes;
    } catch (e) {
      examples = [];
    }

    return (
      <CodeSample
        oas={this.oas}
        setLanguage={this.props.setLanguage}
        operation={this.getOperation()}
        formData={this.state.formData}
        auth={this.props.auth}
        language={this.props.language}
        examples={examples}
        selectedContentType={selectedContentType}
      />
    );
  }

  renderResponse() {
    let exampleResponses;
    try {
      exampleResponses = this.props.doc.api.results.codes;
    } catch (e) {
      exampleResponses = [];
    }
    return (
      <Response
        result={this.state.result}
        oas={this.oas}
        operation={this.getOperation()}
        oauth={this.props.oauth}
        hideResults={this.hideResults}
        exampleResponses={exampleResponses}
      />
    );
  }

  renderResponseSchema(theme = 'light') {
    const operation = this.getOperation();

    return (
      operation &&
      operation.responses && (
        <ResponseSchema theme={theme} operation={this.getOperation()} oas={this.oas} />
      )
    )
  }

  // eslint-disable-next-line class-methods-use-this
  renderContentWithUpperTitle(title, content) {
    return(
      <ContentWithTitle
        title={title}
        content={content}
        showDivider={false}
        theme={'dark'}
        showBorder={false}
        titleUpperCase
      />
    )
  }

  renderDescription() {
    const {doc} = this.props
    return(
      <Fragment>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {this.props.suggestedEdits && (
                  // eslint-disable-next-line jsx-a11y/href-no-hash
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <a
              style={{fontSize: 14, color: '#aaaaaa', textTransform: 'uppercase'}}
              href={`${this.props.baseUrl}/reference-edit/${doc.slug}`}
            >
              <span style={{marginRight: 5}}>Suggest Edits</span><Icon type="edit" />
            </a>
          </div>
        )} 
          {this.renderContentWithUpperTitle('Description', doc.excerpt ? <div className="excerpt">{markdown(doc.excerpt)}</div> : 'Description not available')}
        </div>
      </Fragment>
    )
  }

  renderEndpoint() {
    const { doc } = this.props
    return (
      <Fragment>
        {doc.type === 'endpoint' && (
          <Fragment>
            <div className="hub-reference-left" >
              <div className="hub-api"> { /** this class prevent breaking GUI. Find a better way. CSS class dependency (Riccardo Di Benedetto) */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr', gridGap: '16px', paddingRight: '16px'}}>
                  {this.renderPathUrl()}  
                  {this.renderDescription()}
                  {this.renderLogs()}
                  {this.renderContentTypeSelect(true)}
                  {this.renderParams()}
                </div>
              </div>
            </div>
            <div
              style={{
                  padding: 8,
                  border: '1px solid #0f0f0f',
                  background: 'rgb(51, 55, 58)'
                }}
              className="hub-api"
            > { /** this class prevent breaking GUI. Find a better way.  CSS class dependency (Riccardo Di Benedetto) */}

              {this.renderCodeAndResponse()}
              {this.renderResponseSchema()}
            </div>
          </Fragment>
        )}

        <Content
          baseUrl={this.props.baseUrl}
          body={doc.body}
          flags={this.props.flags}
          isThreeColumn
        />
      </Fragment>
    );
  }

  renderLogs() {
    if (!this.props.Logs) return null;
    const { Logs } = this.props;
    const operation = this.getOperation();
    const { method } = operation;
    const url = `${this.oas.url()}${operation.path}`;

    return (
      <Logs
        user={this.props.user}
        baseUrl={this.props.baseUrl}
        query={{
          url,
          method,
        }}
      />
    );
  }

  renderParams() {
    return (
      <this.Params
        oas={this.oas}
        operation={this.getOperation()}
        formData={this.state.formData}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      />
    );
  }

  renderPathUrl() {
    return (
      <PathUrl
        oas={this.oas}
        operation={this.getOperation()}
        dirty={this.state.dirty}
        loading={this.state.loading}
        onChange={this.props.onAuthChange}
        showAuthBox={this.state.showAuthBox}
        needsAuth={this.state.needsAuth}
        oauth={this.props.oauth}
        toggleAuth={this.toggleAuth}
        onSubmit={this.onSubmit}
        authInputRef={el => (this.authInput = el)}
        auth={this.props.auth}
      />
    );
  }

  render() {
    const { doc } = this.props;
    const oas = this.oas;

    const renderEndpoint = () => {
      if (this.props.appearance.splitReferenceDocs) return this.renderEndpoint();

      return (
        <Waypoint onEnter={this.waypointEntered} fireOnRapidScroll={false} bottomOffset="-1%">
          {this.state.showEndpoint && this.renderEndpoint()}
        </Waypoint>
      );
    };

    return (
      <EndpointErrorBoundary>
        <div className="hub-reference" id={`page-${doc.slug}`}>
          <a className="anchor-page-title" id={doc.slug} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px'}}>
            {renderEndpoint()}
          </div>
          {
          // TODO maybe we dont need to do this with a hidden input now
          // cos we can just pass it around?
          }
          <input
            type="hidden"
            id={`swagger-${extensions.SEND_DEFAULTS}`}
            value={oas[extensions.SEND_DEFAULTS]}
          />
        </div>
      </EndpointErrorBoundary>
    );
  }
}

module.exports = Doc;

Doc.propTypes = {
  doc: PropTypes.shape({
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    slug: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    api: PropTypes.shape({
      method: PropTypes.string.isRequired,
      examples: PropTypes.shape({
        codes: PropTypes.arrayOf(
          PropTypes.shape({
            language: PropTypes.string.isRequired,
            code: PropTypes.string.isRequired,
          }),
        ),
      }),
      results: PropTypes.shape({
        codes: PropTypes.arrayOf(
          PropTypes.shape({}), // TODO: Jsinspect threw an error because this was too similar to L330
        ),
      }),
    }),
    swagger: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }),
  }).isRequired,
  user: PropTypes.shape({}),
  auth: PropTypes.shape({}).isRequired,
  Logs: PropTypes.func,
  oas: PropTypes.shape({}),
  setLanguage: PropTypes.func.isRequired,
  flags: PropTypes.shape({
    correctnewlines: PropTypes.bool,
  }).isRequired,
  appearance: PropTypes.shape({
    referenceLayout: PropTypes.string,
    splitReferenceDocs: PropTypes.bool,
  }).isRequired,
  language: PropTypes.string.isRequired,
  baseUrl: PropTypes.string,
  oauth: PropTypes.bool.isRequired,
  suggestedEdits: PropTypes.bool.isRequired,
  tryItMetrics: PropTypes.func.isRequired,
  onAuthChange: PropTypes.func.isRequired,
};

Doc.defaultProps = {
  oas: {},
  flags: {
    correctnewlines: false,
  },
  appearance: {
    referenceLayout: 'row',
    splitReferenceDocs: false,
  },
  Logs: undefined,
  user: undefined,
  baseUrl: '/',
};
