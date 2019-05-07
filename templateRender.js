const fs = require('fs')

/**
 * 读取路径对应的文件, 并通过值生成一个完整的HTML字符串
 * @param {string} path 路径
 * @param {object} data 值
 */
module.exports = function templateRender (path, data = {}) {
  let template = fs.readFileSync(path).toString()
  for (let key in data) {
    const re = new RegExp('#{' + key + '}', 'g')
    template = template.replace(re, data[key])
  }
  return template
}