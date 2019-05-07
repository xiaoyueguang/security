const express = require('express')
const fs = require('fs')
const cookie = require('cookie')
const uuidv1 = require('uuid/v1')
const templateRender = require('./templateRender')

/** 模拟支付网站 */
const web1 = express()
/** 模拟攻击网站 */
const web2 = express()

/** 支付网站的数据库 */
const db1 = [
  {
    id: 1,
    nickname: '正常用户',
    amount: 100
  },
  {
    id: 2,
    nickname: '攻击者',
    amount: 0
  }
]

const sessions = []

web1.use((req, res) => {
  const data = {
    sessionId: '',
    amount: 0,
    name: ''
  }
  /** 给新用户设置一个SESSIONID */
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie)
    if (!cookies.NODEJSSID) {
      data.sessionId = uuidv1()
      res.cookie('NODEJSSID', data.sessionId)
    }
    data.sessionId = cookies.NODEJSSID
  } else {
    data.sessionId = uuidv1()
    res.cookie('NODEJSSID', data.sessionId)
  }

  const url = req.url
  /** 模拟登录 */
  if (url === '/loginUser1') {
    sessions.push({
      sessionId: data.sessionId,
      userId: 1
    })
    return res.send('登录user1成功! 即将关闭本窗口<script>setTimeout(function(){window.close()}, 1000)</script>')
  }

  if (data.sessionId) {
    const session = sessions.find(({ sessionId }) => sessionId === data.sessionId)
    if (session) {
      const user = db1.find(({ id }) => id === session.userId)
      if (user) {
        data.name = user.nickname
        data.amount = user.amount
      } else {
        data.name = '未登录'
        data.amount = 0
      }
    } else {
      data.name = '未登录'
      data.amount = 0
    }
  }
  /** 首页 */
  if (url === '/') {
    res.send(templateRender('./csrf-pay.html', data))
  }
  /** 模拟转账 */
  if (url.includes('/transfer')) {
    const query = req.query
    if (!query.to) {
      return res.send('请选择转账目标')
    }
    if (!query.amount) {
      return res.send('请输入转账金额')
    }
    if (data.name === '未登录') {
      return res.send('未登录')
    }
    const userTo = db1.find(({ id }) => id === Number(query.to))
    res.send(templateRender('./csrf-transfer.html', {
      sessionId: data.sessionId,
      name: data.name,
      to: userTo.nickname,
      amount: query.amount
    }))
  }
})

web2.use((req, res) => {
  res.send(fs.readFileSync('./csrf-fake.html').toString())
})

web1.listen(3000, () => {
  console.log('服务1已启动')
})

web2.listen(3001, () => {
  console.log('服务2已启动')
})
