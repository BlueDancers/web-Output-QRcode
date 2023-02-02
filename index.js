const xlsx = require('node-xlsx')
const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
const QRCode = require('QRCode')
const minimist = require('minimist')
let logo = null

init()
async function init() {
  let xlsxList = xlsx.parse('./xls.xls')
  await isLogo()
  // 解析执行命令参数选项
  let argv = minimist(process.argv.slice(2))

  if (!argv.a) {
    let total = xlsxList[0].data.length - 1
    for (let i = 1; i <= total; i++) {
      console.log(`${xlsxList[0].data[i][1]}开始绘制 ${i}/${total}`)
      let buffer = await getCodeImg(
        xlsxList[0].data[i][0],
        xlsxList[0].data[i][1]
      )
      fs.writeFileSync(`./image/${xlsxList[0].data[i][1]}.png`, buffer)
    }
  } else {
    console.log(`${xlsxList[0].data[1][1]}开始绘制`)
    let buffer = await getCodeImg(
      xlsxList[0].data[1][0],
      xlsxList[0].data[1][1]
    )
    fs.writeFileSync(`./image/${xlsxList[0].data[1][1]}.png`, buffer)
  }
  console.log('绘制完了')
}

/**
 *  绘制一个canvas图片
 */
async function getCodeImg(codeUrl, index) {
  const canvas = createCanvas(260, 310)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 260, 310)
  let code = await getCode(codeUrl)
  let codeImg = await loadImage(code)
  ctx.drawImage(codeImg, 0, 0)
  if (logo) {
    ctx.drawImage(logo, 260 / 2 - 20, 260 / 2 - 20, 40, 40)
  }
  ctx.font = '24px Arial'
  ctx.fillStyle = '#000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(index, 130, 270)
  buffer = canvas.toBuffer('image/png')
  return buffer
}

/**
 *  生成二维码
 */
function getCode(codeUrl) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(
      codeUrl,
      {
        width: 260,
        height: 260,
        margin: 3,
      },
      (error, url) => {
        if (error) console.error(error)
        resolve(url)
      }
    )
  })
}

/**
 *  判断是否存在logo, 存在的话使用loadImage把图片加载出来,存在缓存中。
 */
function isLogo() {
  return new Promise((resolve, reject) => {
    fs.access('./logo.jpeg', async (err) => {
      if (err == null) {
        logo = await loadImage('./logo.jpeg')
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}
