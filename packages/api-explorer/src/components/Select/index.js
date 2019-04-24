import React from 'react'
import { Select as SelectComponent } from 'antd'

export default function Select({ options, onChange }) {
  return (
    (options.length === 0) ? null
    :
    <SelectComponent onChange={onChange} defaultValue={options[0]}>
      {options.map((content, index) => <SelectComponent.Option value={content} key={`o-${index}`}>{content}</SelectComponent.Option>)}
    </SelectComponent>
  )
}
