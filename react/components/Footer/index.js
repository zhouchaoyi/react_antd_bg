import React from 'react'

import './index.less'

export default class Footer extends React.Component {
  constructor () {
    super()
  }

  render () {

    return (
      <div className="ant-layout-footer">
      后台管理系统 © 2015 - 2016
      </div>
    )
  }
}
