# bindMouseDrag

[toc]

## 说明
这是一个用来给指定元素添加鼠标拖动事件的函数.
元素也内置了`scale`, `rotate`的属性来控制缩放和旋转


## 引入文件
传统方式, 编辑`bindMouseDrag.js`文件, 删除底部export代码
```html
<script src="./bindMouseDrag.js"></script>
```

模块化开发使用
```ts
import { bindMouseDrag } from './index';
```

## 使用方法
传入需要拖动的元素, 此时所传入的元素上会存在一些属性和方法.
```ts
// 传入所需要拖动的元素
bindMouseDrag( ele );
```

* `rotate`: 控制元素旋转, 示例: `ele.rotate = 30`;
* `scale`: 控制元素缩放, 只能X,Y轴同时缩放.示例: `ele.scale = 1.5`;
* `recover()`: 还原元素最初状态, 清除已缩放,旋转,位移的操作
* `destroy()`: 销毁事件, 彻底清除拖动事件