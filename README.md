# shebao-vis

医保数据可视化

****

## todo

1. 有表格，感觉和原表格差别不大

    参保人员汇总、药师医师汇总、就诊信息、药师违规预警

2. 部分完成表格：表格的触发需要点击操作，数据还有药品明细。
    - [ ]  机构违规预警
    - [ ]  参保人违规预警

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

****

## 配置

编辑器：vscode

以下官网安装

- node
- yarn
- dart-sass

在vscode中安装eslint插件

- eslint (airbnb规则，这个可能有点严格，如果确定没问题在代码上方使用```// eslint-disable-next-line```)
- 感觉no-unused-vars设置成error, 开发时有点太麻烦了2333，暂时改成warning了

    ```
        "rules": {
            "no-unused-vars": 1
        }
    ```

## 项目结构
- .vscode/setting.json ：设置eslint自动修复

    一些可以自动修复的lint错误将会在保存时自动修正（如使用LF换行等）
- .editorconfig: **编辑器的一些配置**

    如换行符、缩进等，如果使用vscode可以直接在右下角设置
- src
    - /assets ：静态文件
    - /components: 公用组件
    - /directives: 自定义指令
    - /mixins：公用的一些代码
    - /router: 路由
    - /store: vuex
    - /views: 视图
      - home: home视图使用的组件（不会咋复用的）
    
- jsconfig.json :设置路径自动补全

****

# 代码说明

## d3

简单写了一个初步封装了的barchart以说明Vue和d3的用法。

### 使用D3进行数学计算

参考LineChart.vue 计算属性line

### 需要让D3操作DOM

通过d3.select($el), 将Vue的虚拟DOM传给d3，如：

1. 使用自定义指令
    如在/src/directives/axis.js中

2. 使用refs
    如在LineChartContainer.vue中，brush相关代码

## Vue

### mixins/toggle.js

如tooltip,model 组件可能都需要控制显示和隐藏

# 样式

src/styles/global.scss中定义全局样式

变量名以```she```为前缀

# svg图标

使用**vue-svg-loader**, 可以直接引入svg为组件

https://vue-svg-loader.js.org/

*如果要修改大小，我发现要写一下viewBox属性*

# 网络访问

vue.config.js 使用proxy配置了跨域问题（开发环境）

在src/util/http.js中封装请求，在组件中引入

修改prefix切换真实和mock api

https://www.yuque.com/docs/share/8393261b-d974-4a0c-97b4-ee3679ee22b3?#
