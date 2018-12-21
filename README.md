# Fastest - Whistle 插件版本

## 背景

原有fastest作为独立服务部署，负责动态配置和转发两个部分，使用过程中发现，自己写服务做转发的缺点非常明显:

- 支持的转发规则非常有限，最多支持普通的路径匹配和host匹配，无法跟whistle本身支持的多种转发规则媲美，如果fastest专门做转发规则将非常耗费人力也属于重复性劳动；
- 用户使用成本变高，还需要重新学习fastest自己的转发规则，也无法直接将他本地的whistle规则直接复制到平台上来使用。

基于此，决定借助whistle自身的插件拓展能力，实现一个fastest插件，转发服务交给whistle自身完成，插件只负责动态获取配置规则透传给whistle。

## 功能规划

whistle.fastest 主要功能点如下：

- 支持动态获取配置，并透传给whistle进行转发
- 白名单抓包，只对有权限的用户展示抓包结果
- 白名单代理，只对有权限的用户进行代理

## 开发调试

### 安装插件

[whistle插件开发文档](https://wproxy.org/whistle/plugins.html) 中提到需要将插件安装到全局，可以使用下面命令将本地的包软链到全局。

```bash
sudo npm link
```

安装成功之后，可以在 whistle 的管理端页面 `Plugins` tab 页看到安装的插件。


### 调试插件

开启 whistle 的调试模式，这样可以在控制台看到插件console输出的日志及错误。

```bash
w2 stop
w2 run
```

修改插件代码后，需要触发插件项目的 package.json 修改才会重新加载该插件，比如添加或删除一个空格。


## 文档

- [whistle插件开发文档](https://wproxy.org/whistle/plugins.html)
- [whistle.script文档](https://github.com/whistle-plugins/whistle.script)（现在的demo就是基于这个插件写的）