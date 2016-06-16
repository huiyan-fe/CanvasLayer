/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

var canvasLayer = new CanvasLayer({
    map: map,
    update: update
});

var ctx = canvasLayer.canvas.getContext("2d");

var backDom = document.createElement('canvas');
var backCtx = backDom.getContext('2d');
backDom.width = ctx.canvas.width;
backDom.height = ctx.canvas.height;
backCtx.globalAlpha = 0.85; //关键
backCtx.globalCompositeOperation = 'copy';

var lines = [];

var animationFlag = true;

function update() {
    if (!ctx) {
        return;
    }

    backCtx.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!animationFlag) {
        return;
    }

    for (var i = 0; i < lines.length; i++) {
        lines[i].draw();
    }

    ctx.drawImage(backDom, 0, 0, backDom.width, backDom.height);

}


function Line(options) {
    this.options = options;
    this.size = options.size || 15;
    this.path = options.path;
    this._index = 0;
}

Line.prototype.draw = function () {
    
    var pixel = map.pointToPixel(this.path[this._index]);

    ctx.beginPath();
    ctx.save();
    ctx.arc(pixel.x, pixel.y, this.size, 0, Math.PI * 2, true);
    if (this.options.style) {
        for (var key in this.options.style) {
            ctx[key] = this.options.style[key];
        }
    }
    ctx.closePath();
    ctx.fillStyle = this.options.color || 'rgba(200, 200, 50, 1)';
    ctx.fill();
    ctx.restore();
    this._index += this.options.step || 1;
    if (this._index >= this.path.length) {
        this._index = 0;
    }
}

Line.prototype.dispose = function () {
}


map.addEventListener('movestart', function() {
    animationFlag = false;
});

map.addEventListener('moveend', function() {
    animationFlag = true;
});

function animateAction() {
    update();
}

function animate() {
    animateAction();
    setTimeout(arguments.callee, 60);
};

animate();

function addLine(marker) {
    lines.push(marker);
}

addLine(new Line({
    path: getCurveByTwoPoints(new BMap.Point(116.405706, 39.927773), new BMap.Point(110.522595,23.442552), 70),
    size: 5,
    color: 'rgba(250, 250, 50, 1)'
}));



/**
   * 根据两点获取曲线坐标点数组
   * @param Point 起点
   * @param Point 终点
   */
  function getCurveByTwoPoints(obj1, obj2, count) {
    if (!obj1 || !obj2 || !(obj1 instanceof BMap.Point) || !(obj2 instanceof BMap.Point)) {
      return null;
    }

    var B1 = function(x) {
      return 1 - 2 * x + x * x;
    };
    var B2 = function(x) {
      return 2 * x - 2 * x * x;
    };
    var B3 = function(x) {
      return x * x;
    };

    curveCoordinates = [];

    count= count || 30; // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数
    var isFuture=false;
    var t, h, h2, lat3, lng3, j, t2;
    var LnArray = [];
    var i = 0;
    var inc = 0;

    if (typeof(obj2) == "undefined") {
      if (typeof(curveCoordinates) != "undefined") {
        curveCoordinates = [];
      }
      return;
    }

    var lat1 = parseFloat(obj1.lat);
    var lat2 = parseFloat(obj2.lat);
    var lng1 = parseFloat(obj1.lng);
    var lng2 = parseFloat(obj2.lng);
      
    // 计算曲线角度的方法
    /*
    if (lng2 > lng1) {
      if (parseFloat(lng2-lng1) > 180) {
        if (lng1 < 0) {
          lng1 = parseFloat(180 + 180 + lng1);
        }
      }
    }
    
    if (lng1 > lng2) {
      if (parseFloat(lng1-lng2) > 180) {
        if (lng2 < 0) {
          lng2 = parseFloat(180 + 180 + lng2);
        }
      }
    }
    */
    j = 0;
    t2 = 0;
    if (lat2 == lat1) {
      t = 0;
      h = lng1 - lng2;
    } else if (lng2 == lng1) {
      t = Math.PI / 2;
      h = lat1 - lat2;
    } else {
      t = Math.atan((lat2 - lat1) / (lng2 - lng1));
      h = (lat2 - lat1) / Math.sin(t);
    }
    if (t2 == 0) {
      t2 = (t + (Math.PI / 5));
    }
    h2 = h / 2;
    lng3 = h2 * Math.cos(t2) + lng1;
    lat3 = h2 * Math.sin(t2) + lat1;

    for (i = 0; i < count + 1; i++) {
      curveCoordinates.push(new BMap.Point(
        (lng1 * B1(inc) + lng3 * B2(inc)) + lng2 * B3(inc),
        (lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc))
      ));
      inc = inc + (1 / count);
    }
    return curveCoordinates;
  }


