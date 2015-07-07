/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

// 创建Map实例
var map = new BMap.Map("map"); 

map.centerAndZoom(new BMap.Point(116.405706, 39.927773), 12);     // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom();                            //启用滚轮放大缩小

var canvasLayer = new CanvasLayer({
    map: map,
    update: update
});

var ctx = canvasLayer.canvas.getContext("2d");

function update() {
    var ctx = this.canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var temp = {};
    ctx.fillStyle = "rgba(50, 50, 255, 0.7)";
    ctx.beginPath();
    var data = [
        new BMap.Point(116.297047,39.979542),
        new BMap.Point(116.321768,39.88748),
        new BMap.Point(116.494243,39.956539)
    ];

    for (var i = 0, len = data.length; i < len; i++) {
        var pixel = map.pointToPixel(data[i]);
        ctx.fillRect(pixel.x, pixel.y, 30, 30);
    }
}

