const jsf = jest.genMockFromModule('json-schema-faker')

var generate
jsf._generateReturnValue = (value) => {
  generate = value
}

jsf.generate = jest.fn(() => {
  return generate()
})

export default jsf
