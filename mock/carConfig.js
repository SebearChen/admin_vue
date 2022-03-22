const Mock = require('mockjs')
const mockRoles = require('./roles')
const Random = require('mockjs').Random;

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
    // id: '@increment',
    // name: '@first',
    // email: '@email',
    // enabled: '@integer(0, 1)',
    // passwd: '@string(8, 12)',
    // createdAt: '@datetime',
    // roles: mockRoles.getSome(),
    // mobile: '137@natural(445343)',
    // channel: 0


    // carConfigId: '车系ID',
    // brand: '品牌',
    // carConfigName: '车系名称',
    // belongs: '所属栏目',
    // createTime: '创建时间段',
    // effectiveness: '有效性',
    // search: '查询',
    // add:'新增',
    // img: '图片',
    // priority: '优先级'


    // id: '@increment',
    // carConfigId: '@integer(4)',
    // 'brand|1':['比亚迪','长安汽车','奥迪'],
    // 'carConfigName|1':['上汽集团','东风汽车','北汽集团'],
    // img: Random.image('200x100', '#4A7BF7', '测试'),
    // 'belongs|1':['热门','推荐','SUV','销量排行'],
    // priority: '@integer(1,3)',
    // 'effectiveness|1':['有效','无效'],
    // 'createTime|1':['1~3月','4~5月'],

    order: '@increment',//序号
    id: '@integer(4)',//车系ID
    'brand|1':['比亚迪','长安汽车','奥迪'],//品牌
    'series|1':['上汽集团','东风汽车','北汽集团'],//车系名称
    seriesImg: Random.image('200x100', '#4A7BF7', '测试'),//图片
    columnName: mockRoles.getSome(),//所属栏目
    priority: '@integer(1,3)',//优先级
    'status|1':[0,1],//有效性
    createTime:'@datetime',//创建时间




    
  }))
}

module.exports = [{
  url: '/nhp/api/series',
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
  url: '/nhp/api/one',
  type: 'get',
  response: config => {
    const { id } = config.query
    for (const usr of uLst) {
      // console.log(usr.id === +id);
      if (usr.id === +id) {
        return { code: 0, data: usr }
      }
    }
  }
}, {
  url: '/carConfig/create',
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
  url: '/carConfig/del',
  type: 'post',
  response: _ => {
    return genWriteRes()
  }
}, {
  url: '/carConfig/update',
  type: 'post',
  response: _ => {
    return genWriteRes()
  }
}]

