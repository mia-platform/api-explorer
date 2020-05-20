import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import ReactJson from 'react-json-view'

import colors from '../../colors'

export default function JsonViewer({ schema, missingMessage }) {
  const message = missingMessage ? <FormattedMessage id={missingMessage} defaultValue={'missing message'} /> : null
  return (
    schema ? <ReactJson
      src={schema}
      collapsed={1}
      collapseStringsAfterLength={100}
      enableClipboard={false}
      name={null}
      displayDataTypes={false}
      displayObjectSize={false}
      style={{
        padding: '20px 10px',
        backgroundColor: colors.jsonViewerBackground,
        fontSize: '12px',
        overflow: 'visible',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      }}
    /> : message
  )
}

JsonViewer.propTypes = {
  schema: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired,
  // eslint-disable-next-line react/require-default-props
  missingMessage: PropTypes.string
}
