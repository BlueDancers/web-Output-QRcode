/**
 * 导出图片的类型和后缀的对应关系
 */
const imageType = {
  'image/jpeg': '.jpeg',
  'image/png': '.png',
}
/**
 * 使用的xls文件、logo图片位置，导出图片类型；导出图片位置的信息
 */
const config = {
  filePath: './assets/xls.xls', // xls文件位置
  logoPath: './assets/logo.jpeg', // logo图片位置
  exportType: 'image/png', // 导出图片类型
  exportPath: './image/', // 导出图片位置
}

module.exports = {
  imageType,
  config,
}
