import jsf from "json-schema-faker";

jsf.option({
  failOnInvalidTypes: false,
  failOnInvalidFormat: false,
  useDefaultValue: true,
  useExamplesValue: true,
  alwaysFakeOptionals: true,
})

export default function generateFakeSchema(schema) {
  return jsf.generate(schema)
}
