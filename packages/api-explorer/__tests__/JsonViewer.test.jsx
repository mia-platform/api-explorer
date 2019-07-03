import React from 'react'
import { IntlProvider, FormattedMessage } from 'react-intl';
import {mount} from 'enzyme'
import ReactJson from 'react-json-view'

import JsonViewer from '../src/components/JsonViewer';

describe('JsonViewer', () => {
    test('if schema is defined renders ReactJson', () => {
        const props = {
            schema: {
                foo: 'bar'
            },
            missingMessage: 'foo.id'
        }
        const element = mount(
          <IntlProvider>
            <JsonViewer {...props} />
          </IntlProvider>
        )
        const reactJson = element.find(ReactJson)
        expect(reactJson).toHaveLength(1)
        expect(reactJson.prop('src')).toEqual(props.schema)
        expect(element.html()).toMatchSnapshot()
    })
    
    test('if schema is defined renders ReactJson', () => {
        const props = {
            missingMessage: 'foo.id'
        }
        const element = mount(
          <IntlProvider>
            <JsonViewer {...props} />
          </IntlProvider>
        )
        const formattedMessage = element.find(FormattedMessage)
        expect(formattedMessage).toHaveLength(1)
        expect(formattedMessage.prop('id')).toEqual(props.missingMessage)
    })
})
