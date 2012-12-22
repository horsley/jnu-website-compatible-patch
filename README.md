暨南大学官方网站首页兼容补丁
===================================

## 起因
暨南大学官方网站首页[(http://www.jnu.edu.cn)](http://www.jnu.edu.cn)存在着兼容性问题，主要问题是在Chrome 等浏览器中无法加载首页滚动新闻。今儿无聊，选完课之后又被某同学问到为什么暨大首页的通知看不了。
才想起来这是个被诟病已久的问题，官方一直没有解决，估计是javascript的问题，这一块正是我不熟悉的领域，于是想要探索一下如何解决。

## 问题描述与解决
chrome开发人员工具中提示

	Uncaught TypeError: Cannot set property 'imgArray' of null    //focus_banner2.js:73行
	Uncaught TypeError: Cannot read property 'style' of null    //scrollnews.js:17行

几番探寻跟踪下断点发现加载xml的load方法（RSS2.js:109行）会抛出异常，此外前一行（RSS2.js:108行）也有语法错误（漏写一个符号'.'）。
原文件捕获异常之后直接返回null，调试取出错误信息为

	Object #<Document> has no method 'load'

经过查找相关资料，发现

>document.load() is a part of an old version of the W3C DOM Level 3 Load & Save module. Can be used with document.async to indicate whether the request is synchronous or asynchronous (the default). As of at least Gecko 1.9, this no longer supports cross-site loading of documents (Use XMLHttpRequest instead).

可能在这个方法已经在某些新型浏览器中废弃，可以选择采用XMLHttpRequest代替，使用兼容性的写法再做了一些修补，就正常了，其实是个小case

## 样式的修正
以前很多使用表格来布局的网页，暨大的首页也不例外，有好多处使用table布局，使用align: center来做块居中，在现代浏览器中好像都会打回原形变成左对齐（默认）.
我做了一些样式修正，把宽度固定的，把align: center属性换成：

	style="margin-left:auto;margin-right:auto;"

## 关于Proxy
非常简单，看看代码就好了，主要是利用apache的mod_rewrite 把请求全部转发到index.php，index.php根据$_SERVER["REQUEST_URI"]从远端捕获请求再转发到浏览器

### Proxy的补丁
原理还是请看下源文件index.php，这里方式有两种

* 静态文件覆盖
* 动态替换处理

因为使用mod_rewrite	时的重写规则是，如果本地找不到对应的文件或目录才会重写请求，所以如果需要大幅修改文件则可以按照原有目录结构创建对应文件的静态覆盖版本（如RSS2.js的补丁）。
而动态替换处理处理一些小的修改，在获取远程文档后调用自定义函数patch()进行处理再输出，可以在这个函数中做一些简单的文本替换等等（例如居中对齐的补丁）

## 相关链接
* [Document.load的文档](https://developer.mozilla.org/en-US/docs/DOM/document.load)
* [XMLHttpRequest的文档](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest)
