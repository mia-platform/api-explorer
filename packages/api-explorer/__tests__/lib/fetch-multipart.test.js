import fetchMultipart from '../../src/lib/fetch-multipart'
import {getHarWithValues, formDataFile} from './formDataMock'

describe('fetch-multipart', () => {
  test('calls fetch with numeric value', async () => {
    const MOCK_RESPONSE = {ok: true}

    mockFetch(MOCK_RESPONSE)
    const numberValue = 1234
    const stringValue = 'test string'
    const values = {
      formData: {
        file: formDataFile,
        testString: stringValue,
        testNumber: numberValue
      },
      header: {}
    }
    const har = getHarWithValues(numberValue, stringValue)
    const response = await fetchMultipart(har, values)
    const jsonResponse = await response.json()

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(jsonResponse).toEqual(MOCK_RESPONSE)

    const fetchedBody = getLastFetchBody()
    expect(fetchedBody).toHaveLength(3)

    const file = fetchedBody[0]
    expect(file[0]).toEqual('file')

    const string = fetchedBody[1]
    expect(string[0]).toEqual('testString')
    expect(string[1]).toEqual(stringValue)

    const number = fetchedBody[2]
    expect(number[0]).toEqual('testNumber')
    expect(number[1]).toEqual(`${numberValue}`)
  })
})


function mockFetch(response) {
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(response),
  })
);
}

function getLastFetchBody() {
  const mockCalls = global.fetch.mock.calls
  const last = mockCalls[mockCalls.length -1]
  const options = last[1]
  const formData = options.body
  const values = []
  for(const item of formData.entries()) {
    values.push(item)
  }
  return values
}