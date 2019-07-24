/*
 * Copyright © 2019-present Mia s.r.l.
 * All rights reserved
 */

const allUndefined = o => Object.entries(o).values(v => v !== undefined).length <= 0
const shouldRecurse = (v) => v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length > 0 
const shouldDelete = (v) => v === null || v === undefined || Object.keys(v).length <= 0 || allUndefined(v)
 
const removeEmpty = obj => {
  Object.keys(obj).forEach(key => {
    if (shouldRecurse(obj[key])) removeEmpty(obj[key]);
    if (shouldDelete(obj[key])) delete obj[key];
  });
  return obj
};

export default function filterEmptyFormData(formDataChange) {
  return removeEmpty(formDataChange)
}
