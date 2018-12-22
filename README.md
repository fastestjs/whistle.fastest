# whistle.fastest

whistle.fastest 为 [whistle](https://github.com/avwo/whistle) 的一个插件，主要用于 fastest 项目。

## 特性

whistle.fastest 主要功能点如下：

- 从远程服务器中获取相关配置，并动态设置到 whistle 规则中，实现转发
- 将请求的结果在返回之前进行二次处理，以便实现静态资源、CGI 等的替换
- 支持权限控制


## 安装使用

whistle 的插件需要安装到全局（[whistle插件开发文档](https://wproxy.org/whistle/plugins.html) ，安装命令如下：

```bash
$ npm install whistle.fastest -g
```

安装成功之后，可以在 whistle 的管理端页面 `Plugins` tab 页看到安装的插件。


## 开发调试

### 安装插件

在开发的时候，可以使用下面命令将本地的包软链到全局。

```bash
sudo npm link
```

### 调试插件

开启 whistle 的调试模式，这样可以在控制台看到插件console输出的日志及错误。

```bash
w2 stop
w2 run
```

> 如果需要自定义端口，则可以使用 `w2 run -p 8080`

修改插件代码后，需要触发插件项目的 package.json 修改才会重新加载该插件，比如添加或删除一个空格。

## 参考文档

- [whistle插件开发文档](https://wproxy.org/whistle/plugins.html)
- [whistle.script文档](https://github.com/whistle-plugins/whistle.script)
