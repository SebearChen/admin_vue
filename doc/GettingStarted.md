(本框架基于vue-element-admin开发，具体配置说明请参考：https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#%E9%85%8D%E7%BD%AE%E9%A1%B9)

## Environment settings

Environment files:

- .env.development
- .env.production


### Client-side config

#### VUE_APP_BASE_API

API server base URL(no path info), example value: 

```shell
# Your api url will be like this(the "api" prefix will be 
# added to your ajax call's url automatically): 
# http://your_host:port/api/api_path
VUE_APP_BASE_API='/api/'  
```

### Back-end(API) Server config

#### Disable client-side dev mode

This will disable client-side mock and use your real server side api instead.

```shell
API_MODE=1
API_SERVER='http://localhost:9099'  // your api back-end server
```


## Specifications

### Session authentication

- use request header "X-Token" to authenticate client requests, it's value is a token issued by server when user login, the front-end js will store this token and append it to the request header in the subsequent api requests

- token is store in COOKIE in client

### Role and auth design(Both server-side and client-side implementation)
Please refer another documentation for detail: "GettingStarted:RoleAndAuthDesign.md"

### API Specifications

#### Response data structure

```
{
    code: 0,    // 0 for success, otherwise means error happened
    msg: 'error message'  // it can be an object sometimes :)
    data: {}    // business data object if no error happens
}
```

### Response code definition

- 0: everythings' fine;

- 4xx: valification error:
  - FORBIDDEN: 401,
  - TOKEN_ERR: 405,
  - PARAMS_ERR: 402,
  - VALIDATE_ERR: 422,
  - REGISTER_PARAM_ERR: 421,

- 5xx: server side error:
  - DB_ERR: 501,

- 6xx: logical error; 
  - USR_PWD_WRONG: 600,
  - USR_TOKEN_ERR: 601,
  - DUPLICATE_ERR: 610,

#### Basic API list

- Auth module(login and logout)
  - /auth/login
  - /auth/logout
  - /auth/info  // we use this seperate api to get user info, instead of login

User Info object: 
```
{
    id: '@increment',
    name: '@first',
    email: '@email',
    enabled: '@integer(0, 1)',
    passwd: '@string(8, 12)',
    createdAt: '@datetime',
    roles: [
      {
        id: 4343,
        name: 'role-1'
      }
    ],
    mobile: '137@natural(445343)',
    channel: 0  // where the user came from 
}
```

