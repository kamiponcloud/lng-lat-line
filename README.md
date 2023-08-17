# mini-map

## 安装依赖
```
npm install
```

### 编译运行
```
npm run serve
```

### 如何使用LngLatLine（经纬度线）

```js
import LngLatLine from '../utils/lng-lat-line.js' // 引入LngLatLine对象

this.miniMap = new LngLatLine(this.map)
this.miniMap.addLineToMap() // 添加经纬度线到地图上

this.miniMap.removeLineToMap() //移除
this.miniMap = undefined
```
