// const Mock = require('mockjs')
const mockRoles = require('./roles')

const tokens = {
  'admin@admin.com': {
    token: 'admin-token'
  },
  'a@a.com': {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    isAdmin: true,
    roleToSel: mockRoles.total(), // used in role selection component
    authArr: [
      'role/list',
      'role/add',
      'role/update',
      'role/del',
      'user/list'
    ],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roleToSel: mockRoles.getSome(), // used in role selection component
    authArr: [
      'role/list',
      'role/add',
      'role/update'
    ],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/auth/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 0,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/auth/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 0,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/auth/logout',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]
