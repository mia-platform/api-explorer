import it from '../../i18n/it.json'

import antdTheme from "./antd-theme-json-editor";
import notCustomEditor from "./not-custom-editor";
import anyOfEditor from "./anyOf-custom-editor";

module.exports = function configureJSONEditor(JSONEditor, intl, setFormSubmissionListener) {
  JSONEditor.defaults.languages.it = it
  JSONEditor.defaults.language = intl.locale
  JSONEditor.defaults.themes.antdTheme = antdTheme
  JSONEditor.defaults.editors.not = notCustomEditor(JSONEditor.defaults.editors.multiple)
  JSONEditor.defaults.editors.anyOf = anyOfEditor(intl, setFormSubmissionListener, JSONEditor.defaults.editors.multiple)

  // eslint-disable-next-line consistent-return
  JSONEditor.defaults.resolvers.unshift((scheme) => {
    // If the schema can be of any type
    if (
      (scheme.type === "string" &&
        scheme.media &&
        scheme.media.binaryEncoding === "base64") ||
      scheme.format === "binary"
    ) {
      return "base64";
    }
  });

  // eslint-disable-next-line consistent-return
  JSONEditor.defaults.resolvers.unshift((scheme) => {
    if (scheme.not && scheme.not.type) {
      return 'not'
    }
  })

  // eslint-disable-next-line consistent-return
  JSONEditor.defaults.resolvers.unshift((scheme) => {
    if (scheme.anyOf) {
      return 'anyOf'
    }
  })
}
