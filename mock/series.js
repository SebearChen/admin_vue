const Mock = require('mockjs')
const mockRoles = require('./roles')

const sList = []
const count = 100

function genWriteRes() {
  return Mock.mock({
    'code|0-1': 1,
    'msg': '@csentence(6,10)',
    'data': ''
  })
} // genWriteRes()

for (let i = 0; i < count; i++) {
    sList.push(Mock.mock({
    id: '@increment',
    'name|1': ['one','two','three'],
    priority: '@integer(1, 4)',
    'actPhase|1': ['1','2','3'],
    status: '@integer(0, 1)',
    createTime: '@datetime'
  }))
}

module.exports = [{
  url: '/series-column',
  type: 'get',
  response: config => {
    const { email, enabled, name, page = 1, limit = 20, sort } = config.query
    const intEnabled = parseInt(enabled)

    let mockList = sList.filter(item => {
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
  url: '/series-column/detail',
  type: 'get',
  response: config => {
    const { id } = config.query
    for (const usr of sList) {
        console.log(usr.id === +id);
      if (usr.id === +id) {
        return { code: 0, data: usr }
      }
    }
  }
}, {
  url: '/series-column/create',
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
  url: '/series-column/update',
  type: 'post',
  response: _ => {
    return genWriteRes()
  }
}]

