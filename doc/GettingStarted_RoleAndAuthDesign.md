# 角色权限的设计与实现
设计原则：简单、容易理解。

本方案不对用户设置权限，只对【角色】设置访问权限，访问权限的对象为【资源】，资源的实际形式用PATH(例如/user/create)描述。

权限管理时，只需要对角色进行权限分配。分配好角色的权限后，对实际的操作员（即【用户】）可分配多个角色。
当用户登录时，前端/Session存储的就是服务端计算出来的结果：当前用户可访问的【资源】列表。

## 权限控制的粒度
资源的访问控制由服务端负责（ACL），原则上前端只做菜单入口的控制（基于服务端返回的权限列表过滤菜单），但个别特殊情况可例外。


### 重要概念：【资源】
web服务器对外公开的所有URL在本质上其实都是【资源地址】，对于【资源】，可以简单地分为两类：

- API资源: 有动态数据的读/写操作，一般需要控制不同用户的“访问权限”，这是本文档要讨论的重点
- 静态资源(例如css/js/html等纯静态的资源): 默认公开，无需权限控制

对于API资源，在管理后台的领域里，【资源】主要由【模块】、【动作】(具体的操作，例如CRUD)构成。
例如，“增加一个用户”这样的操作对于管理后台来说就是一个资源，用类Restful的形式描述就是

```POST /user/create```

## 服务端实现

角色权限模块涉及的功能列表：

- 资源管理: 管理后台所包含的"模块"及"操作"，需要存储在DB里；
- 用户管理：除了存储常规的用户资料（登录名、密码等）外，还需要保存用户所属的角色列表；
- 角色管理: 
    - 角色的描述、角色名等实体属性的CRUD
    - 角色与资源绑定关系（CRUD）
- Session管理：登录时，需要直接计算出用户可访问的资源列表，直接存储在Session中，以实现每个路由的访问控制；


### 权限模块E-R图

由于时间关系，不画图，直接用文字描述。

#### 实体列表

User: 用户
- email
- passwd
- roles

Role: 角色
- name
- desc
- selection: 拥有此角色后，可为用户分配的其它角色列表

AuthRes: 权限资源
- name
- group: 分组（资源分类,方便管理）
- path: 访问路径
- method: 访问方式: HTTP 协议中的GET/POST，此字段为扩展字段，暂时未实现method的控制

** 以下实体为绑定关系(绑定表) **

RoleAuth: 角色绑定权限资源，角色与权限资源是多对多的关系
- role: 角色
- auth: 角色对应的AuthRes

UserRoles: 用户绑定的角色，用户与角色是多对多的关系
- user: 用户
- role: 角色


### 返回给前端的数据结构

- /auth/login: 登录接口

``` 
// 请参考mock/auth.js对应接口
{
    code: 0,
    data: token
}
```

- /auth/info: 获取Session中用户信息，** 关键接口 **

```
// 请参考mock/auth.js对应接口
{
    code: 0,
    data: {
        isAdmin: true,  // 是否管理员，管理员默认有所有权限，这是关键字段
        roleToSel: mockRoles.total(), // used in role selection component, 在用户模块为新用户分配角色时可以选择的角色列表
        authArr: [  // 用户所拥有的权限资源列表，即path list，构造动态路由时要使用
            'role/list',
            'role/add',
            'role/update',
            'role/del',
            'user/list'
        ],
        name: 'Super Admin'
    }
}
```

## 前端开发指引

### 添加有权限控制的模块（菜单）

1. 添加动态路由
- 动态路由入口文件：``` src/router/asyncRoutes.js ```
- 系统管理类路由统一在：``` src/router/sysRoutes.js ```

例如用户、角色、权限等系统管理的模块可加在`sysRoutes.js`里，而其它运营管理的模块则可添加到`asyncRoutes.js`里。

** route格式说明 **

以"用户权限"模块为例：

meta对象最重要。
meta中的`res`字段存放该菜单/节点(及所有子孙节点)下包含的后端API列表（权限资源列表）。

- 若没有res字段，则表示该路由不需要权限控制。
- 当有res字段时，框架会根据res数组的值及session中用户的authArr过滤得到可显示的route入口（左侧栏）。

可见，res字段的格式与登录时/auth/info接口返回的authArr格式一样。本质上，res数组里的每个item其实就是服务端的API(URL)。


- 多级菜单的实现：每个路由节点可添加children字段表示子路由，结构大同小异。

```

{
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    alwaysShow: true, // will always show the root menu
    name: 'user',
    meta: {
        title: 'user',
        icon: 'lock',
        res: ['user/add', 'user/update', 'user/delete', 'user/deleteBatch']
    },
    children: [{
        path: 'list',
        component: () => import('@/views/admin/user/list'),
        name: 'userList',
        meta: { title: 'UserList' }
    }, {
        path: 'create',
        hidden: true,
        component: () => import('@/views/admin/user/detail'),
        name: 'userCreate',
        meta: { title: 'userCreate', module: '用户', crud: 'c' }
    }, {
        path: 'detail/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/user/detail'),
        name: 'userDetail',
        meta: { title: 'userDetail', module: '用户' }
    }]
}

```


2. 添加API
前端要访问服务端的API时，本框架有统一的api访问层，入口在 `/src/api/`，请为每个模块添加一个文件，具体格式请参考已有的文件（比较简单）。

所有模块一般都有的API如下(以user模块为例)：

- /user/list
- /user/detail
- /user/create
- /user/update
- /user/delete
- /user/deleteBatch


以上模块的返回数据结构请参考mock/user.js里的mock数据。

3. 添加view
为与示例分开，管理后台真实的view入口在/src/views/admin/里。

### 添加公开模块（菜单）

无需权限控制的模块可直接添加到静态路由中,对应文件为：``` src/router/constantRoutes.js ```。
目前所有文档性质的菜单统一在'/guide'菜单下。


### 页面内（按钮级）控制
暂不考虑。


