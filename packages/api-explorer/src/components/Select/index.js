import React from 'react'
import { Select as SelectComponent } from 'antd'

export default class Select extends React.Component {

  shouldComponentUpdate(nextProps) {
    const {value} = this.props
    if (nextProps.value === undefined || value === undefined) {
      return true
    }
    if (nextProps.value !== value) {
      return true
    }
    return false
  }

  render() {
    const { options, value, onChange } = this.props
    return (
      (options.length === 0) ? null
      :
      <SelectComponent onChange={onChange}  value={value || options[0]}>
        {options.map((content, index) => <SelectComponent.Option value={content} key={`o-${index}`}>{content}</SelectComponent.Option>)}
      </SelectComponent>
    )
  }
}
