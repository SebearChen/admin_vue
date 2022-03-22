const Mock = require('mockjs')

const roleTpl = {
  seriesColumnId: '@increment',
  'name|1': ['热门','推荐','SUV','销量排行']
}

const rCnt = 10
const totals = []
for (let i = 0; i <= rCnt; i++) {
  totals.push(Mock.mock(roleTpl))
}

module.exports = {
  total: () => {
    return totals
  },

  getSome: () => {
    const cnt = Mock.mock('@integer(3,7)')
    const ret = []
    for (let i = 0; i < cnt; i++) {
      ret.push(totals[i])
    }
    return ret
  } // getSome()
}

