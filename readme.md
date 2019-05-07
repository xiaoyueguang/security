# 前端安全之XSS与CSRF

这是一个DEMO项目, 主要是用来介绍前端安全以及产生原因.

## XSS DEMO 运行

```bash
npm i
node index.js
```

浏览器中访问`http://localhost:3000`即可访问首页.

`XSS`产生后尽量通过查看源代码来浏览服务端返回的源码.

## CSRF DEMO 运行

```bash
npm i
node index.js
```

同时修改hosts文件

```vim
127.0.0.1 pay.csrf.com
127.0.0.1 fake.csrf.com
```

|网址|作用|
|:--|:--|
|`http://pay.csrf.com:3000/`|正常页面首页|
|`http://pay.csrf.com:3000/loginUser1`|模拟登录用户user1成功|
|`http://pay.csrf.com:3000/transfer`|模拟转账|
|`http://fake.csrf.com:3001/`|攻击页面|

