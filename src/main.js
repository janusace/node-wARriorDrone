
//var videoDiv = document.getElementById('video');
//var ns = new NodecopterStream(videoDiv, {port:5555});
//var videoCanvas = videoDiv.querySelector('canvas');
//var frameBuffer = new Uint8Array(videoCanvas.width * videoCanvas.height * 4);
////var detect = detector({maxDiff: 0.7});
//var pickedColor = [210,50,50];
//var detected;
//var client = new WsClient();
//var xPID = new PID({pGain: 0.1, iGain: 0, dGain: 0});
//var state;
//setState('ground');
//
//var track = document.getElementById('track');
//track.width = 640;
//track.height = 360;
//var ctx = track.getContext("2d");
//ctx.fillStyle = "#FF0000";
//
//var maxDiff = 0.25;
//var w = videoCanvas.width;
//var h = videoCanvas.height;
//var b = frameBuffer;
//
//setInterval(function(){
//
//    b = frameBuffer;
//    var count = 0;
//    var xSum = 0;
//    var ySum = 0;
//    ns.getImageData(b);
//    for(var i =0; i < b.length; i+=4){
//        var match = true;
//        for (var j = 0; j < pickedColor.length; j++) {
//
//            var diffPercent = Math.abs(b[i+j]-pickedColor[j]) / 255;
//            if (diffPercent > maxDiff) {
//                match = false;
//                break;
//            }
//        }
//        if (match) {
//            count++;
//            var y = i/(w*4);
//            var x = i%(w*4)/4;
//            xSum += x;
//            ySum += Math.abs(y - h);
//            ctx.fillStyle = "rgb("+b[i]+","+b[i+1]+","+b[i+2]+")";
//            ctx.fillRect(x,Math.abs(y - h),1,1);
//            // ctx.fillRect(y,x,1,1);
//        }
//    }
//    detected = {x: xSum / count, y: ySum /count};
//
//
//    ctx.beginPath();
//    ctx.moveTo(0,y);
//    ctx.lineTo(645,detected.y);
//    ctx.moveTo(detected.x,0);
//    ctx.lineTo(detected.x,360);
//    ctx.strokeStyle = "black";//"rgb(255,255,255)";
//    ctx.stroke();
//    ctx.closePath();
//    var xVal = (detected.x - w / 2)/(w / 2);
//    // ctx.fillRect(detected.x,Math.abs(detected.y - h),5,5);
//    console.log("xVal: "+xVal+" #: "+count+" x: "+detected.x+ "  y:"+detected.y);
//
//}, 50);
//
//setInterval(function(){
//     ctx.clearRect ( 0 , 0 , w, h);
//}, 200);
//

//                var count = 0;
//                var xSum = 0;
//                var ySum = 0;
//                for (var x = 0; x < w; x++) {
//                    for (var y = 0; y < h; y++) {
//                        var o = x*4+(h-y)*w*4;
//                        var match = true;
//                        for (var i = 0; i < pickedColor.length; i++) {
//                            var diffPercent = Math.abs(b[o+i]-pickedColor[i]) / 255;
//                            if (diffPercent > maxDiff) {
//                                match = false;
//                               // break;
//                            }
//                        }
//                        if (match) {
//                            count++;
//                            xSum += x;
//                            ySum += y;
//                        }
//                    }
//                }
//                detected = {x: xSum / count, y: ySum /count};
//                var xVal = (detected.x - w / 2)/(w / 2);
//                console.log("xVal: "+xVal+"    Count: "+count+" DetectedX: "+detected.x);
//                xPID.update(xVal);
//                if (state === 'follow') {
//                    // client.right(-xPID.pid().sum);
//                } else {
//                    // client.stop();
//                }
//
//


//        // detector returns a function that tries to find a colored object in the image.
//        function detector(options) {
//            var maxDiff = options.maxDiff;
//            var w = videoCanvas.width;
//            var h = videoCanvas.height;
//            var b = frameBuffer;
//            return function detect() {
//                ns.getImageData(b);
//                var count = 0;
//                var xSum = 0;
//                var ySum = 0;
//                for (var x = 0; x < w; x++) {
//                    for (var y = 0; y < h; y++) {
//                        var o = x*4+(h-y)*w*4;
//                        var match = true;
//                        for (var i = 0; i < pickedColor.length; i++) {
//                            var diffPercent = Math.abs(b[o+i]-pickedColor[i]) / 255;
//                            if (diffPercent > maxDiff) {
//                                match = false;
//                                break;
//                            }
//                        }
//                        if (match) {
//                            count++;
//                            xSum += x;
//                            ySum += y;
//                        }
//                    }
//                }
//                detected = {x: xSum / count, y: ySum /count};
//                var xVal = (detected.x - w / 2)/(w / 2);
//                console.log("xVal: "+xVal+"    Count: "+count);
//                xPID.update(xVal);
//                if (state === 'follow') {
//                   // client.right(-xPID.pid().sum);
//                } else {
//                   // client.stop();
//                }
//            };
//            ns.onNextFrame(frameLoop);
//        }


var myApp = angular.module('myApp',[]);

myApp.controller('Controller', ['$scope', function($scope) {

    $scope.hi = 0;

    var videoDiv = document.getElementById('video');
    var ns = new NodecopterStream(videoDiv, {port:5555});
    var videoCanvas = videoDiv.querySelector('canvas');
    var frameBuffer = new Uint8Array(videoCanvas.width * videoCanvas.height * 4);
//var detect = detector({maxDiff: 0.7});
    var pickedColor = [192,60,60];
    var detected;
    var client = new WsClient();
    var xPID = new PID({pGain: 0.1, iGain: 0, dGain: 0});
    var state;
    setState('ground');

    var track = document.getElementById('track');
    track.width = 640;
    track.height = 360;
    var ctx = track.getContext("2d");
    ctx.fillStyle = "#FF0000";

    var maxDiff = 0.25;
    var w = videoCanvas.width;
    var h = videoCanvas.height;
    var b = frameBuffer;
    var averagePixel;

    setInterval(function(){

        b = frameBuffer;
        var count = 0;
        var xSum = 0;
        var ySum = 0;
        ns.getImageData(b);
        averagePixel = {r: 0, g: 0, b:0};
        for(var i =0; i < b.length; i+=4){
            averagePixel.r += b[i];
            averagePixel.g += b[i+1];
            averagePixel.b += b[i+2];
            var match = true;
            for (var j = 0; j < pickedColor.length; j++) {

                var diffPercent = Math.abs(b[i+j]-pickedColor[j]) / 255;
                if (diffPercent > maxDiff) {
                    match = false;
                    break;
                }
            }
            if (match) {
                count++;
                var y = i/(w*4);
                var x = i%(w*4)/4;
                xSum += x;
                ySum += Math.abs(y - h);
                ctx.fillStyle = "rgb("+b[i]+","+b[i+1]+","+b[i+2]+")";
                ctx.fillRect(x,Math.abs(y - h),1,1);
                // ctx.fillRect(y,x,1,1);
            }
        }
        averagePixel.r = averagePixel.r/(b.length/4);
        averagePixel.g = averagePixel.g/(b.length/4);
        averagePixel.b = averagePixel.b/(b.length/4);
        $scope.hi = averagePixel.r;
        detected = {x: xSum / count, y: ySum /count};


        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(645,detected.y);
        ctx.moveTo(detected.x,0);
        ctx.lineTo(detected.x,360);
        ctx.strokeStyle = "black";//"rgb(255,255,255)";
        ctx.stroke();
        ctx.closePath();
        var xVal = (detected.x - w / 2)/(w / 2);
        // ctx.fillRect(detected.x,Math.abs(detected.y - h),5,5);
        console.log("|xVal: "+xVal+"|# Detected: "+count+"|X: "+Math.round(detected.x)+ "|Y: "+Math.round(detected.y)+"|AvgPixel: "+averagePixel.r);

    }, 50);

    setInterval(function(){
        ctx.clearRect ( 0 , 0 , w, h);
    }, 200);


}]);


function PID(options) {
    this._pGain = options.pGain || 0;
    this._iGain = options.iGain || 0;
    this._dGain = options.dGain || 0;
    this._min = options.min || -1;
    this._max = options.max || 1;
    this._zero = options.zero || 0;
    this._p = 0;
    this._i = 0;
    this._d = 0;
    this._sum = 0;
    this._target = 0;
    this._sumErr = 0;
    this._lastErr = 0;
    this._lastTime = null;

}
PID.prototype.target = function(val) {
    if (val === undefined) {
        return this._target;
    }
    this._sumErr = 0;
    this._lastErr = 0;
    this._lastTime = null;
    this._sum = this._p = this._i = this._d = this._zero;
    this._target = val;
    return this._target;
};
PID.prototype.update = function(val) {
    var now = Date.now();
    var dt = 0;
    if (this._lastTime !== null) {
        dt = (now - this._lastTime) / 1000;
    }
    this._lastTime = now;
    var err = this._target - val;
    var dErr = (err - this._lastErr)*dt;
    this._sumErr += err * dt;
    this._lastErr = err;
    this._p = this._pGain*err;
    this._i = this._iGain*this._sumErr;
    this._d = this._dGain*dErr;
    this._sum = this._p+this._i+this._d;
    if (this._sum < this._min) {
        this._sum = this._min;
    } else if (this._sum > this._max) {
        this._sum = this._max;
    }
};
PID.prototype.pid = function() {
    return {p: this._p, i: this._i, d: this._d, sum: this._sum};
};

function setState(val) {
    console.log('new state: '+val);
    state = val;
}

function WsClient() {
    this._conn = null;
    this._connected = false;
    this._queue = [];
    this._listeners = {};
    this._takeoffCbs = [];
    this._landCbs = [];

    var self = this;
    self._conn = new WebSocket('ws://'+window.location.host);
    self._conn.onopen = function() {
        self._connected = true;
        self._queue.forEach(function(msg) {
            self._conn.send(msg);
        });
        self._queue = [];

        self._conn.onmessage = function(msg) {
            try {
                msg = JSON.parse(msg.data);
            } catch (err) {
                console.error(err);
                return;
            }
            var kind = msg.shift();
            switch (kind) {
                case 'takeoff':
                    self._takeoffCbs.forEach(function(cb) {
                        cb();
                    });
                    self._takeoffCbs = [];
                    break;
                case 'land':
                    self._landCbs.forEach(function(cb) {
                        cb();
                    });
                    self._landCbs = [];
                    break;
                case 'on':
                    var event = msg.shift();
                    self._listeners[event].forEach(function(cb) {
                        cb.apply(self, msg);
                    });
                    break;
                default:
                    console.error('unknown message: '+kind);
            }
        };
    };

}

WsClient.prototype._connect = function() {
    var self = this;
    self._conn = new WebSocket('ws://'+window.location.host);
    self._conn.onopen = function() {
        self._connected = true;
        self._queue.forEach(function(msg) {
            self._conn.send(msg);
        });
        self._queue = [];

        self._conn.onmessage = function(msg) {
            try {
                msg = JSON.parse(msg.data);
            } catch (err) {
                console.error(err);
                return;
            }
            var kind = msg.shift();
            switch (kind) {
                case 'takeoff':
                    self._takeoffCbs.forEach(function(cb) {
                        cb();
                    });
                    self._takeoffCbs = [];
                    break;
                case 'land':
                    self._landCbs.forEach(function(cb) {
                        cb();
                    });
                    self._landCbs = [];
                    break;
                case 'on':
                    var event = msg.shift();
                    self._listeners[event].forEach(function(cb) {
                        cb.apply(self, msg);
                    });
                    break;
                default:
                    console.error('unknown message: '+kind);
            }
        };
    };

};

WsClient.prototype._send = function(msg) {
    msg = JSON.stringify(msg);
    if (!this._connected) {
        this._queue.push(msg);
        return;
    }
    this._conn.send(msg);
};

WsClient.prototype.on = function(event, cb) {
    var cbs = this._listeners[event] = this._listeners[event] || [];
    cbs.push(cb);
    if (cbs.length === 1) {
        this._send(['on', event]);
    }
};

WsClient.prototype.takeoff = function(cb) {
    this._send(['takeoff']);
    if (cb) {
        this._takeoffCbs.push(cb);
    }
};

WsClient.prototype.land = function(cb) {
    this._send(['land']);
    if (cb) {
        this._landCbs.push(cb);
    }
};

WsClient.prototype.right = function(val) {
    this._send(['right', val]);
};

WsClient.prototype.stop = function() {
    this._send(['stop']);
};

//ANGULAR//




