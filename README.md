## 大文件切片上传

-  获取文件 HASH 和 suffix - SparkMD5
-  通过File原型的slice方法切片文件slice 第一次切从(0,1024),第二次切从(1024,2048)...
-  服务端根据接口传入的hash生成一个hash的临时目录存放切片内容,最终合并成一个文件,将之前hash目录删除
-  实现切片处理 [固定切片大小 & 数量]
-  chunks遍历count,每次读取一个切片,计算hash,放入hash目录,直到读取完毕
-  遍历chunks发送切片请求,可以提前发请求获取服务器上改hash已成功的切片数据,请求成功放入already[]中,实现断点续传
-  如果所有切片上传成功发送一个切片合并请求,将服务器hash临时目录合并成一个文件,将hash临时目录删除

```javascript
    let fileReader = new FileReader()
    fileReader.ArrayBuffer(_file)
    fileReader.onload = function (e) {
      let buffer = e.target.result // buffer编码
      const spark = SparkMD5.ArrayBuffer()
      spark.append(buffer)
      const HASH = spark.end()
      const suffix = /\.([a-zA-Z0-9]+)$/.exec(_file.name)[1]
      const filename = `${HASH}.${suffix}`
      console.log(filename)
    }
 ```
