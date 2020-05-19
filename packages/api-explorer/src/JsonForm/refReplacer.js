/* eslint-disable consistent-return */
function injectDefinitions (ref) {
  return ref.split('/').join('/definitions/')
}

function isChildADefinition (currentKey, obj) {
  if (obj.not) {
    return false
  }
  if (currentKey === 'properties') {
    return false
  }
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return false
  }
  const keys = Object.keys(obj)
  if (keys.length === 0) {
    return false
  }
  if (keys.includes('type')){
    return false
  }
  const firstChild = obj[keys[0]]
  return Object.keys(firstChild).includes('type')
}

export default function replaceRefs(obj)  {
  const searchStr = '$ref'

  if (!obj) {
    return;
  }
  if (typeof obj === 'string') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(k => replaceRefs(k));
  } else if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, k) => {
        if (typeof obj[k] === 'object') {
          if (k === searchStr) {
            return {...acc, [searchStr]: replaceRefs(obj[k])};
          }
          if (k === 'components') {
            return {
              ...acc,
              definitions: { 
                [k]: {
                  definitions: {
                    ...replaceRefs(obj[k])
                  }
                }
              }
            }
          }
          if (isChildADefinition(k, obj[k])) {
            return {
              ...acc,
              [k]: {
                definitions: replaceRefs(obj[k])
              }
            }
          }
          return {...acc, [k]: replaceRefs(obj[k])};
        }
        if (k === searchStr) {
          return {
            ...acc,
            [searchStr]: injectDefinitions(obj[k])
          };
        }
        return {
          ...acc,
          [k]: obj[k]
        };
      }, {})
  }
};
