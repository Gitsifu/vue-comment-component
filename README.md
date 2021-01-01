# 仿掘金评论组件

一个[掘金](https://juejin.cn/)风格的评论组件。  

之前在写[个人博客网站](https://www.striveforus.com/)时，需要有评论功能，由于个人比较喜欢掘金风格的评论系统，于是仿写出了这个评论组件。希望可以对你有帮助，如果喜欢的话请点个⭐，感谢😃！

## Demo 地址

<https://fengfengfeng-up.github.io/components/vue-juejin-comment>

## 功能

* 基础评论和回复。
* 点赞和删除。
* 自适应高度输入框。
* 表情输入和图片上传（复制）。

## 属性

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ----| ---- | ----- | ------ |
| data / v-model | 绑定数据| Array | —— |
| user | 当前用户| Object | —— |
| props | 单条评论模型| Object | —— |
| before-submit | 提交评论的回调函数| Function(comment) | —— |
| before-like | 点赞的回调函数 | Function(comment) | —— |
| before-delete | 点击删除评论的回调函数 | Function(comment) | —— |
| upload-img | 上传（复制）图片的回调函数 | Function({ file, callback }) | —— |  

## 注意事项

❗❗❗ 评论初始数据模型为：

``` js
{
  content: '', // 评论内容，必需
  imgSrc: '', // 评论中的图片地址，非必需
  children: [], // 子评论（回复），非必需
  likes: 0, // 点赞数，非必需
  reply: null, // 子评论（回复）人信息，非必需
  createAt: null, // 评论时间，必需
  user: {
    author: false // 是否为作者，类型为 Boolean，非必需
  } // 评论人信息，必需
}
```

如需修改评论数据模型，请提供 `props` 属性，例如：

``` js
props: {
  content: 'content',
  imgSrc: 'img',
  children: 'childrenComments',
  likes: 'likeCount',
  reply: 'replyInfo',
  createAt: 'time',
  user: 'visitor'
}
```

如有问题，请提 Issues，或直接与我联系，微信IOHX12358。

## 本地开发

``` shell
# install dependencies
npm install

# serve with hot reload at localhost
npm run serve

# build for production with minification
npm run build
```
