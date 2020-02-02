# 1. 说明

一个简易的基于 Koa 的 web 文件上传服务，仅供个人学习与测试使用。

![](http://study.esunr.xyz/1580650377267.jpg)

文件将会被上传至 `/src/upload` 文件下。

安装：

```sh
npm install
```

开发模式：

```sh
npm run dev
```

# 2. API

#### 上传文件

POST: `/api/upload` 

发送数据（form/data）：

```
file: 上传的文件
fileName: 写入服务器的文件名（可选）
```

返回数据示例：

```json
{ 
  "success":true,
  "data":{
    "fileName":"banner1.jpg",
    "size":15984,
    "type":"image/jpeg"
  },
  "msg":""
}
```

#### 获取文件

GET: `/upload/[fileName]`

返回的数据自动提供 Content-Type，图片类等可以直接预览。