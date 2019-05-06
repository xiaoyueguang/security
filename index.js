// const http = require('http')
const app = require('express')()
const fs = require('fs')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

let dataText = ''

app.use((req, res) => {
  if (req.url === '/') {
    res.send(templateRender('./index.html'))
  }
  if (req.url === '/stored') {
    if (req.body && req.body.value) {
      dataText = req.body.value
    }
    res.send(templateRender('./stored.html', { text: dataText }))
  }

  if (req.url.includes('/reflected')) {
    res.send(templateRender('./reflected.html', req.query))
  }

  if (req.url === '/dom') {
    res.send(templateRender('./dom.html'))
  }
})

// 服务器正在运行。
app.listen(3000, '127.0.0.1', () => {
  console.log('服务已启动')
});

/**
 * 读取路径对应的文件, 并通过值生成一个完整的HTML字符串
 * @param {string} path 路径
 * @param {object} data 值
 */
function templateRender (path, data = {}) {
  let template = fs.readFileSync(path).toString()
  for (let key in data) {
    const re = new RegExp('#{' + key + '}', 'g')
    template = template.replace(re, data[key])
  }
  return template
}