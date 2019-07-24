/*
 * Copyright © 2019-present Mia s.r.l.
 * All rights reserved
 */

const allUndefined = o => Object.entries(o).values(v => v !== undefined).length <= 0
const shouldRecurse = (v) => v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length > 0 
const shouldDelete = (v) => typeof v !== "boolean" && typeof v !== "number" && (v === null || v === undefined || Object.keys(v).length <= 0 || allUndefined(v))

const removeEmpty = obj => {
  Object.keys(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      obj[key].forEach(v => v && removeEmpty(v))
    } 

    if (shouldRecurse(obj[key])) removeEmpty(obj[key])
    if (shouldDelete(obj[key])) delete obj[key]
  });
  return obj
}

export default function filterEmptyFormData(formDataChange) {
  if (!formDataChange) {
    return formDataChange
  }
  return removeEmpty(formDataChange)
}
