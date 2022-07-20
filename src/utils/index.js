/**
 * Date:2020/4/15
 * Desc:
 */

//
export function uuid() {
// return (+new Date() * 1e6 + Math.floor(Math.random() * 1e6)).toString(36);
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

//
export function clone(obj) {
    let result = '';
    //
    if (typeof obj === 'object') {
        result = JSON.stringify(obj);
        result = JSON.parse(result);
    } else {
        result = obj;
    }

    return result;
}

export function getMousePosition(event){
    let posX = 0;
    let posY = 0;
    const e = event || window.event;  //标准化事件对象
    if (e.pageX || e.pageY) {  //获取鼠标指针的当前坐标值
        posX = e.pageX;
        posY = e.pageY;
    } else if (e.clientX || e.clientY) {
        posX = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        posY = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    }
    return {
        posX,
        posY
    }
}
