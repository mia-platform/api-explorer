/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import { Card, Tag, Divider, Typography } from 'antd';
import get from 'lodash.get'
import debounce from 'lodash.debounce'
import extensions from '@mia-platform/oas-extensions'

import { IntlProvider, addLocaleData } from 'react-intl';
import itLocale from 'react-intl/locale-data/it';
import enLocale from 'react-intl/locale-data/en';
import it from "../i18n/it.json";
import en from "../i18n/en.json";

import colors from './colors'
import './code-mirror.css'

import Doc from './Doc'
import {List, AutoSizer, CellMeasurerCache, CellMeasurer} from 'react-virtualized';

const Cookie = require('js-cookie');
const PropTypes = require('prop-types');

const VariablesContext = require('@mia-platform/variable/contexts/Variables');
const OauthContext = require('@mia-platform/variable/contexts/Oauth');
const GlossaryTermsContext = require('@mia-platform/markdown/contexts/GlossaryTerms');
const SelectedAppContext = require('@mia-platform/variable/contexts/SelectedApp');
const markdown = require('@mia-platform/markdown');

const getAuth = require('./lib/get-auth');
const ErrorBoundary = require('./ErrorBoundary');

addLocaleData([...itLocale, ...enLocale]);
const messages = {it, en}

function getDescription(oasFiles){
  return get(oasFiles, 'api-setting.info.description')
}

const {Title, Paragraph} = Typography
const styles = {
  panelStyle: {
    cursor: 'pointer',
    borderRadius: 4,
    height: '100%',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: '1fr'
  },
  title: {
    color: '#1890ff',
    lineHeight: 'inherit',
    marginBottom: 0,
    textTransform: 'capitalize'
  }
}

class ApiExplorer extends React.Component {
  constructor(props) {
    super(props);

    this.setLanguage = this.setLanguage.bind(this);
    this.getDefaultLanguage = this.getDefaultLanguage.bind(this);
    this.changeSelected = this.changeSelected.bind(this);
    this.waypointEntered = this.waypointEntered.bind(this);
    this.styleByMethod = this.styleByMethod.bind(this);
    this.onClickRowListDebounced = debounce(this.onClickRowList.bind(this), 300);

    this.list // ref of list
    this.cache = new CellMeasurerCache({
      // fixedWidth: true,
      minHeight: 68, // height + paddingBottom
      // keyMapper: () => 1
    });
    this.state = {
      language: Cookie.get('readme_language') || this.getDefaultLanguage(),
      selectedApp: {
        selected: '',
        changeSelected: this.changeSelected,
      },
      description: getDescription(this.props.oasFiles),
      list: {}
    };
  }

  componentDidUpdate() {
    // re-calculate cache & rowHeight
    if (this.list) {
      this.cache.clearAll();
      this.list.forceUpdateGrid();
    }
  }

  setLanguage(language) {
    this.setState({ language });
    Cookie.set('readme_language', language);
  }
  getDefaultLanguage() {
    try {
      const firstOas = Object.keys(this.props.oasFiles)[0];
      return this.props.oasFiles[firstOas][extensions.SAMPLES_LANGUAGES][0];
    } catch (e) {
      return 'curl';
    }
  }
  getOas(doc) {
    // Get the apiSetting id from the following places:
    // - category.apiSetting if set and populated
    // - api.apiSetting if that's a string
    // - api.apiSetting._id if that's set
    // This will return undefined if apiSetting is not set
    const apiSetting =
      doc.category.apiSetting ||
      (typeof doc.api.apiSetting === 'string' && doc.api.apiSetting) ||
      (typeof doc.api.apiSetting === 'object' && doc.api.apiSetting && doc.api.apiSetting._id);

    const oasFromProps = this.props.oasFiles[apiSetting]
    let oas
    if (oasFromProps) {
      const extensionDefault = Object.assign({}, extensions.defaults)
      const xSampleLanguages = extensionDefault[extensions.SAMPLES_LANGUAGES]
      oas = {
        ...oasFromProps,
        [extensions.SAMPLES_LANGUAGES]: xSampleLanguages
      }
    }
    return oas;
  }

  onClickRowList(index) {
    const {onDocChange} = this.props
    const {list} = this.state

    this.setState({
      list: {[`${index}`]: !list[`${index}`]}
    }, onDocChange())
  }
  changeSelected(selected) {
    this.setState({ selectedApp: { selected, changeSelected: this.changeSelected } });
  }

  waypointEntered(id) {
    this.setState(prevState => ({ showEndpoint: {...prevState.showEndpoint, [id]: true }}));
  }

  renderDescription(){
    const style = {
      maxHeight: 300,
      overflowY: 'auto',
      margin: '10px',
      border: '1px solid',
      padding: '10px',
      background: colors.descriptionBackground,
      fontSize: 14,
      lineHeight: '24px',
      color: colors.descriptionText
    }
    const {description} = this.state
    return(
      description ?
        <div id="oas-initial-description" style={style}>{markdown(description)}</div> :
        null
    )
  }
  renderDoc(doc) {
    const auth = getAuth(this.props.variables.user, this.props.oasFiles)
    return (
      <Doc
        key={`${doc.swagger.path}-${doc.api.method}`}
        doc={doc}
        oas={this.getOas(doc)}
        setLanguage={this.setLanguage}
        flags={this.props.flags}
        user={this.props.variables.user}
        Logs={this.props.Logs}
        baseUrl={this.props.baseUrl.replace(/\/$/, '')}
        appearance={this.props.appearance}
        language={this.state.language}
        oauth={this.props.oauth}
        suggestedEdits={false}
        tryItMetrics={this.props.tryItMetrics}
        auth={auth}
        fallbackUrl={this.props.fallbackUrl}
        stripSlash={this.props.stripSlash}
      />
    )
  }
  // eslint-disable-next-line class-methods-use-this
  renderHeaderPanel(doc) {
    const swagger = doc.swagger
    const tagStyle = {
      textTransform: 'uppercase',
      color: colors.defaultTag,
      fontWeight: 600,
    }
    const uriStyle = {
      color: colors.bold,
      fontFamily: 'monospace',
    }

    const colorStyle = colors[doc.api.method]
    const borderColor = colorStyle ? colorStyle.border : colors.defaultBorder
    const method = <Tag color={borderColor} style={tagStyle}>{doc.api.method}</Tag>
    return(
      <div>
        {method}
        <b style={uriStyle}>
          {swagger && swagger.path}
        </b>
        <Divider type="vertical" />
        {doc.title}
      </div>
    )
  }

  styleByMethod (method) {
    return {
      backgroundColor: colors[method] ? colors[method].bg : colors.defaultBackground,
      border: `1px solid ${colors[method] ? colors[method].border : colors.defaultBorder}`,
    }
  }

  renderCardRowList(index, title, description) {
    const {docs} = this.props
    const {lastGroupTitle} = this.state
    const doc = docs[index]

    return (
      <div key={`${doc.api.method}-${doc.swagger.path}`}>
        <Title style={styles.title}>{title}</Title>
        <Paragraph>{description}</Paragraph>
        <Card
          title={this.renderHeaderPanel(doc)}
          // forceRender={this.props.forcePanelRender}
          bodyStyle={{padding: 0}}
          onClick={() => this.onClickRowListDebounced(index)}
          style={{...this.styleByMethod(doc.api.method), ...styles.panelStyle}}
        >
          {this.state.list[index] ? this.renderDoc(doc) : null}
        </Card>
      </div>
    )
  }

  renderRowList ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    parent,
    style     // Style object to be applied to row (to position it)
  }) {
    const {docs, title, description} = this.props
    const doc = docs[index]
    const content = ({measure}) => this.renderCardRowList(index, title, description)

    return (
      <div key={key} style={style}>
        <div style={{padding: '0 0 8px', height: '100%'}}>
          <CellMeasurer
            cache={this.cache}
            columnIndex={0}
            key={key}
            rowIndex={index}
            parent={parent}
          >
            {content}
          </CellMeasurer>
        </div>
      </div>
      )
  }

  render() {
    const defaultOpenDoc = this.props.defaultOpenDoc ? this.props.defaultOpenDoc : '0'
    const defaultOpen = this.props.defaultOpen ? [defaultOpenDoc] : null
    const localizedMessages = messages[this.props.i18n.locale] || messages[this.props.i18n.defaultLocale]

    const {showEndpoint} = this.state
    const {docs} = this.props

    return (
      <IntlProvider
        locale={this.props.i18n.locale}
        defaultLocale={this.props.i18n.defaultLocale}
        messages={localizedMessages}
      >
        <VariablesContext.Provider value={this.props.variables}>
          <OauthContext.Provider value={this.props.oauth}>
            <GlossaryTermsContext.Provider value={this.props.glossaryTerms}>
              <SelectedAppContext.Provider value={this.state.selectedApp}>
                <div className={`is-lang-${this.state.language}`} style={{display: 'grid', gridTemplateRows: `${this.props.showOnlyAPI ? '' : 'auto'} 1fr`}}>
                  {this.props.showOnlyAPI ? null : this.renderDescription()}
                  <div
                    id="hub-reference"
                    className={`content-body hub-reference-sticky hub-reference-theme-${this.props.appearance.referenceLayout}`}
                    style={{padding: 16, height: '100%'}}
                  >
                    {/*<Collapse
                      defaultActiveKey={defaultOpen}
                      onChange={this.props.onDocChange}
                    >*/}
                    <AutoSizer>
                      {({width, height}) => {
                        this.listWidth = width
                        return (
                          <List
                            ref={ref => this.list = ref}
                            estimatedRowSize={60}
                            height={height}
                            overscanRowCount={4}
                            rowCount={docs.length}
                            rowHeight={this.cache.rowHeight}
                            rowRenderer={renderProps => this.renderRowList(renderProps)}
                            style={{outline: 'none'}}
                            width={width}
                          />
                        )
                      }}
                    </AutoSizer>
                  </div>
                </div>
              </SelectedAppContext.Provider>
            </GlossaryTermsContext.Provider>
          </OauthContext.Provider>
        </VariablesContext.Provider>
      </IntlProvider>
    );
  }
}

ApiExplorer.propTypes = {
  docs: PropTypes.arrayOf(PropTypes.object).isRequired,
  oasFiles: PropTypes.shape({}).isRequired,
  appearance: PropTypes.shape({
    referenceLayout: PropTypes.string,
  }).isRequired,
  flags: PropTypes.shape({
    correctnewlines: PropTypes.bool,
  }).isRequired,
  oauth: PropTypes.bool,
  baseUrl: PropTypes.string.isRequired,
  Logs: PropTypes.func,
  suggestedEdits: PropTypes.bool.isRequired,
  tryItMetrics: PropTypes.func,
  variables: PropTypes.shape({
    user: PropTypes.shape({
      keys: PropTypes.array,
    }).isRequired,
    defaults: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string.isRequired, default: PropTypes.string.isRequired }),
    ).isRequired,
  }).isRequired,
  glossaryTerms: PropTypes.arrayOf(
    PropTypes.shape({ term: PropTypes.string.isRequired, definition: PropTypes.string.isRequired }),
  ).isRequired,
  i18n: PropTypes.shape({
    locale: PropTypes.string,
    defaultLocale: PropTypes.string,
  }),
  showOnlyAPI: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  defaultOpenDoc: PropTypes.string,
  onDocChange: PropTypes.func,
  fallbackUrl: PropTypes.string,
  stripSlash: PropTypes.bool,
  forcePanelRender: PropTypes.bool,
};

ApiExplorer.defaultProps = {
  oauth: false,
  flags: {
    correctnewlines: false,
  },
  tryItMetrics: () => {},
  Logs: undefined,
  baseUrl: '/',
  i18n: {
    locale: 'en',
    defaultLocale: 'en',
  },
  showOnlyAPI: false,
  defaultOpen: true,
  defaultOpenDoc: '',
  onDocChange: () => {},
  fallbackUrl: '',
  stripSlash: false,
  forcePanelRender: false,
};

module.exports = props => (
  <ErrorBoundary>
    <ApiExplorer {...props} />
  </ErrorBoundary>
);
module.exports.ApiExplorer = ApiExplorer;
