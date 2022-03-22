const Mock = require('mockjs')
const mockRoles = require('./roles')

const uLst = []
const count = 100

function genWriteRes() {
  return Mock.mock({
    'code|0-1': 1,
    'msg': '@csentence(6,10)',
    'data': ''
  })
} // genWriteRes()

for (let i = 0; i < count; i++) {
  uLst.push(Mock.mock({
    id: '@increment',
    name: '@first',
    email: '@email',
    enabled: '@integer(0, 1)',
    passwd: '@string(8, 12)',
    createdAt: '@datetime',
    roles: mockRoles.getSome(),
    mobile: '137@natural(445343)',
    channel: 0
  }))
}

module.exports = [{
  url: '/user/list',
  type: 'get',
  response: config => {
    const { email, enabled, name, page = 1, limit = 20, sort } = config.query
    const intEnabled = parseInt(enabled)

    let mockList = uLst.filter(item => {
      if (enabled && item.enabled !== intEnabled) return false
      if (email && item.email.indexOf(email) < 0) return false
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      code: 0,
      data: { total: mockList.length, items: pageList }
    }
  }
}, {
  url: '/user/detail',
  type: 'get',
  response: config => {
    const { id } = config.query
    for (const usr of uLst) {
      if (usr.id === +id) {
        return { code: 0, data: usr }
      }
    }
  }
}, {
  url: '/user/create',
  type: 'post',
  response: _ => {
    return {
      code: 0,
      data: {
        id: 343535,
        name: 'mock name'
      }
    }
  }
}, {
  url: '/user/del',
  type: 'post',
  response: _ => {
    return genWriteRes()
  }
}, {
  url: '/user/update',
  type: 'post',
  response: _ => {
    return genWriteRes()
  }
}]

