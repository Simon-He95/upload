let _file = null
choose.addEventListener('click', function () {
  file.click()
})
file.addEventListener('change', function () {
  _file = file.files[0]
  if (!_file) {
    return
  }
  if (!/PNG|JPG|JPEG/i.test(_file.type)) {
    alert('请上传PNG | JPG | JPEG格式的图片')
    return
  }
  if (_file.size > 1024 * 1024 * 2) {
    alert('图片大小不能超过2M')
    return
  }
  console.log(_file)
  const { name } = _file
  const fileList = `
  <div>文件: ${name} <em>删除</em></div>
  `
  show.innerHTML = fileList
  show.addEventListener('click', function (e) {
    if (e.target.tagName !== 'EM') {
      return
    }
    _file = null
    show.innerHTML = ''
  })

})

upload.addEventListener('click', function () {
  if (!_file) {
    alert('请先选择要上传的文件')
    return
  }
  // 1.单文件上传FormData类型
  // 请求头Content-Type: multipart/form-data
  // node:multiparty 解析FormData自动上传到服务器指定文件夹下,并重命名文件防重名
  // let formData = new FormData()
  // formData.append('file', _file)
  // formData.append('filename', _file.name)

  // 2. base64上传
  // 服务端根据文件内容生成hash名
  // 请求头 Content-Type: application/x-www-form-urlencoded
  // node 反解析base64为图片放到服务器,const spark = SparkMD5.ArrayBuffer(),根据文件的内容生成一个hash名,用来判断文件是否重复上传
  // base64 -> const file = Buffer.from(decodeURIComponent(req.body.file).replace(/^data:image\/\w+;base64,/, ''),'base64')
  // spark.append(file)
  // const suffix = /\.([0-9a-zA-z]+)$/.exec(req.body.filename[1]); path = `目录/${spark.end()}.${suffix}`
  // 判断目录下是否有重名文件名,没有就写入

  // let fileReader = new FileReader()
  // fileReader.readAsDataURL(_file)
  // fileReader.onload = function (e) {
  //   let base64 = e.target.result // base64编码
  //   console.log(base64)
  // }

  // 客户端根据文件内容生成hash名交给服务器
  // 将文件内容转成buffer,通过const spark = SparkMD5.ArrayBuffer(); spark.append(buffer);const HASH = spark.end()
  let fileReader = new FileReader()
  fileReader.readAsArrayBuffer(_file)
  fileReader.onload = function (e) {
    let buffer = e.target.result // buffer编码
    console.log(buffer)
    const spark = new SparkMD5.ArrayBuffer()
    spark.append(buffer)
    const HASH = spark.end()
    const suffix = /\.([a-zA-Z0-9]+)$/.exec(_file.name)[1]
    const filename = `${HASH}.${suffix}`
    console.log(filename)
  }
  // 大文件上传
  // 获取文件 HASH 和 suffix ,通过const spark = SparkMD5.ArrayBuffer(); spark.append(buffer);const HASH = spark.end()
  // 后台根据hash生成一个hash目录存放切片内容,最终合并成一个文件,将之前hash目录删除
  // 实现切片处理 [固定切片大小 & 数量]
  // let max = 1024 * 100 // 100kb
  // let count = Math.ceil(_file.size / max)
  // let index = 0
  // const chunks = []
  // if (count > 100) { // 如果切片的数量大于100,可以固定切片的数量为100,来调整每一个切片的大小
  //   count = 100
  //   max = _file.size / count
  // }
  // while (index < count) {
  //   chunks.push({
  //     file: _file.slice(index * max, (index + 1) * max), //一:0 ~ max;二:max ~ 2 * max ...
  //     filename: `${HASH}_${index + 1}.${suffix}`
  //   })
  //   index++
  // }

  // index = 0
  // const complete = () => {
  //   // 每一次上传成功后都调用,可以控制完成进度条,当所有切片上传完成后,可以发送服务器合并切片的请求
  //   index++

  //   if (index >= count) {
  //     // 所有切片上传成功
  //     // 发起切片合并请求
  //     fetch('/merge_upload', { HASH, count }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => {
  //       res => res.json()
  //     }).then(res => {
  //       // 合并成功
  //     }).catch(err => {
  //       // 合并失败
  //     })
  //   }
  // }

  // const already = []


  // chunks.forEach(chunk => {
  //   // 发送请求
  //   // 已上传成功无需再上传,断点续传,中途断网,重新上传,已上传的切片不再上传
  //   if (already.length > 0 && already.indexOf(chunk.filename) > -1) {
  //     complete()
  //     return
  //   }
  //   let form = new FormData()
  //   form.append('file', chunk.file)
  //   form.append('filename', chunk.filename)
  //   fetch('/upload', form).then(res => res.json()).then(res => {
  //     if (+data.code === 0) {
  //       already.push(filename)
  //       complete()
  //     }
  //   }).catch(err => {
  //     // 当前切片上传失败,请稍后再试
  //   })
  // })
})
