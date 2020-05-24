// 元素添加拖动
interface IMouseDrag {
    // transform 矩阵数组
    matrix: number[]; _matrix: number[];
    // 旋转角度
    rotate: number; _rotate: number;
    // 缩放
    scale: number; _scale: number;

    mouseDownX: number; // 鼠标按下时距离页面可视区左边距离
    mouseDownY: number; // 鼠标按下时距离页面可视区顶部距离
    distanceX: number; // 被拖动的距离
    distanceY: number; // 被拖动的距离

    recover(): void; // 属性还原初始状态
    // 设置矩阵单个元素, 使其能响应
    setMatrix(index: number, value: number): void;
    // 销毁所有事件绑定
    destroy(): void;
    // 监听矩阵数组变化
    listenMatrix(value: number[]): void;
    // 鼠标按下事件
    mouseDownEvent(ev: MouseEvent): void;
    // 鼠标移动事件
    mouseMoveEvent(ev: MouseEvent): void;
    // 鼠标抬起事件
    mouseUpEvent(ev: MouseEvent): void;
}
type TMouseDragThis = HTMLElement & IMouseDrag;
type TMouseDrag = (ele: TMouseDragThis) => void;
const bindMouseDrag: TMouseDrag = function(ele){
    ele._matrix = parseMatrix( window.getComputedStyle(ele)['transform'] );
    ele._rotate = 0;
    ele._scale = 1;
    ele.distanceX = 0;
    ele.distanceY = 0;

    // 按下事件
    ele.mouseDownEvent = function(ev){
        ev.preventDefault();
        this.mouseDownX = ev.clientX;
        this.mouseDownY = ev.clientY;

        // 鼠标事件绑定: 移动事件
        document.addEventListener('mousemove', this.mouseMoveEvent);
        document.addEventListener('mouseup', this.mouseUpEvent);
    }
    // 鼠标移动事件
    ele.mouseMoveEvent = function(this: TMouseDragThis, ev){
        // 计算距离差值: 拖动位置 - 鼠标按下时位置 + 已拖动的位置
        let dX = ev.clientX - ele.mouseDownX + ele.distanceX;
        let dY = ev.clientY - ele.mouseDownY + ele.distanceY;
        ele.setMatrix(4, dX);
        ele.setMatrix(5, dY);
    }
    // 抬起事件
    ele.mouseUpEvent = function(ev){
        // 鼠标抬起时移除文档的mousemove & mouseup事件
        document.removeEventListener('mousemove', ele.mouseMoveEvent);
        document.removeEventListener('mouseup', ele.mouseUpEvent);
        // 记录已拖动的距离
        ele.distanceX += ev.clientX - ele.mouseDownX;
        ele.distanceY += ev.clientY - ele.mouseDownY;
    }
    // 鼠标事件绑定: 按下事件
    ele.addEventListener('mousedown', ele.mouseDownEvent);
    

    // 监听矩阵数组变化
    Object.defineProperty(ele, 'matrix', {
        get(){
            return ele._matrix;
        },
        set(val){
            ele._matrix = val;
            ele.listenMatrix(ele.matrix);
        }
    });
    // 监听旋转属性变化
    Object.defineProperty(ele, 'rotate', {
        get(){
            return this._rotate;
        },
        set(val: number){
            ele._rotate = val;
            ele.listenMatrix(ele.matrix);
        }
    });
    // 监听缩放属性
    Object.defineProperty(ele, 'scale', {
        get(){
            return this._scale;
        },
        set(val: number){
            ele._scale = val;
            ele.listenMatrix(ele.matrix);
        }
    });

    // 监听matrix数组变化, 给元素设置matrix
    ele.listenMatrix = function(val){
        let a = Math.cos( ele.rotate / 180 * Math.PI) * ele.scale;
        let b = Math.sin( ele.rotate / 180 * Math.PI) * ele.scale;
        let c = -Math.sin( ele.rotate / 180 * Math.PI) * ele.scale;
        let d = Math.cos( ele.rotate / 180 * Math.PI) * ele.scale;

        let result = [a, b, c, d, val[4], val[5]];
        this.style.transform = `matrix(${result.join(',')})`;
    }
    // 设置单独的matrix
    ele.setMatrix = function(index, value){
        ele.matrix[index] = value;
        ele.matrix = ele.matrix;
    }

    // 属性还原最初状态
    ele.recover = function(this: TMouseDragThis){
        this.distanceX = 0;
        this.distanceY = 0;
        this._rotate = 0;
        this._scale = 1;
        this._matrix = [1, 0, 0, 1, 0, 0];
        this.style.transform = `translate(${0}px, ${0}px)`;
    }

    // 销毁所有事件绑定
    ele.destroy = function(){
        // 移除mousedown事件
        this.removeEventListener('mousedown', this.mouseDownEvent);
        // 鼠标抬起时移除文档的mousemove & mouseup事件
        document.removeEventListener('mousemove', ele.mouseMoveEvent);
        document.removeEventListener('mouseup', ele.mouseUpEvent);
    }
}

// 解析transform二维矩阵为数组
function parseMatrix(matrix: string | null): number[]{
    if(matrix != 'none') {
        const nums = matrix.match(/matrix\((.*)\)/)[1];
        return nums.split(', ').map(ele => Number(ele));
    } else {
        return [1, 0, 0, 1, 0, 0];
    }
}

export default bindMouseDrag;