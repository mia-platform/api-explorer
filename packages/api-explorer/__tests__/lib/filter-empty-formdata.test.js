import filterEmptyFormData from '../../src/lib/filter-empty-formdata'

const data = {
  // eslint-disable-next-line global-require
  "schema": require('./sample-schema.json'),
  "formData": {
    "body": {
      "$set": {
        "position": [
          123,
          456
        ],
        "image.$.replace": {
          key: undefined,
        },
        "image.$.merge": {}
      },
      "$unset": {
        anotherKey: undefined
      },
      "$inc": {},
      "$mul": {},
      "$currentDate": {},
      "$push": {
        "image": {}
      }
    }
  }
}

test('properly filters data from example', () => {
  const result = filterEmptyFormData(data.formData, data.schema)
  expect(result).toEqual({
    body: {
      $set: {
        position: [123, 456],
      },
    }
  })
})