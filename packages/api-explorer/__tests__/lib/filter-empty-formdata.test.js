import filterEmptyFormData from '../../src/lib/filter-empty-formdata'

describe('filterEmptyFormData', () => {
  it('filters all empty objects or objects with all undefined', () => {
    const input = {
      body: {
        $set: {
          position: [123, 456],
          "image.$.replace": {
            key: undefined,
          },
          "image.$.merge": {}
        },
        $unset: {
          anotherKey: undefined
        },
        $inc: {},
        $mul: {},
        $currentDate: {},
        $push: {
          image: {}
        }
      }
    }
    const result = filterEmptyFormData(input)
    expect(result).toEqual({
      body: {
        $set: { position: [123, 456] },
      }
    })
  })
  
  test('filters objects into arrays', () => {
    const input = {
      "body": [{
        "filter": {
          "_st": "PUBLIC"
        },
        "update": {
          "$set": {
            "image.$.replace": {},
            "image.$.merge": {}
          },
          "$unset": {},
          "$inc": {},
          "$mul": {},
          "$currentDate": {},
          "$push": {
            "image": {}
          }
        }
      }]
    } 
    const result = filterEmptyFormData(input)
    expect(result).toEqual({
      body: [{
       filter: {_st: 'PUBLIC'} 
      }]
    })
  })
  
  it('keeps unchanged arrays with null content', () => {
    const input = { body: { posizione: [null, null], __STATE__: 'DRAFT'}}
    const result = filterEmptyFormData(input)
    expect(result).toEqual({
      body: {
        posizione: [null, null],
        __STATE__: 'DRAFT'
      },
    })
  })
  
  it('does not filter booleans', () => {
    const input = {
      body: [{
        filter: {
          _st: 'PUBLIC',
          _id:'ff',
          creatorId: 'a',
          createdAt: 'b'
        },
        update: {
          $set: {
            name:'ff',
            location:'89'
          },
          $unset: {
            name: true
          }
        }
      }]
    }
    const result = filterEmptyFormData(input)
    expect(result).toEqual(input)
  })

  it('does not filter numbers', () => {
    const input = {
      body: [{
        filter: {
          _st: 'PUBLIC',
          _id:'ff',
          creatorId: 'a',
          createdAt: 'b'
        },
        update: {
          $set: {
            name:'ff',
            location:'89'
          },
          $unset: {
            size: 123
          }
        }
      }]
    }
    const result = filterEmptyFormData(input)
    expect(result).toEqual(input)
  })
})