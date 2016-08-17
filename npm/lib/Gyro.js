"use strict";
var Gyro = (function () {
    function Gyro() {
        this.gyro = {};
        this.features = [];
        this.interval = null;
        this.measurements = {
            x: null,
            y: null,
            z: null,
            alpha: null,
            beta: null,
            gamma: null
        };
        this.calibration = {
            x: 0,
            y: 0,
            z: 0,
            alpha: 0,
            beta: 0,
            gamma: 0,
            rawAlpha: 0,
            rawBeta: 0,
            rawGamma: 0
        };
        this.gyro.frequency = 1000;
        if (window && window.addEventListener) {
            window.addEventListener('MozOrientation', this.mozOrientationInitListener.bind(this));
            window.addEventListener('devicemotion', this.deviceMotionListener.bind(this));
            window.addEventListener('deviceorientation', this.deviceOrientationListener.bind(this));
        }
    }
    /**
     * Add an eventlistener
     *
     * @method mozOrientationInitListener
     * @param {any} e
     * @return {void}
     **/
    Gyro.prototype.mozOrientationInitListener = function (e) {
        var _this = this;
        this.features.push('MozOrientation');
        e.target.removeEventListener('MozOrientation', this.mozOrientationInitListener, true);
        e.target.addEventListener('MozOrientation', function (e) {
            _this.measurements.x = e.x - _this.calibration.x;
            _this.measurements.y = e.y - _this.calibration.y;
            _this.measurements.z = e.z - _this.calibration.z;
        }, true);
    };
    /**
     * Add an eventlistener
     *
     * @method deviceMotionListener
     * @param {any} e
     * @return {void}
     **/
    Gyro.prototype.deviceMotionListener = function (e) {
        var _this = this;
        this.features.push('devicemotion');
        e.target.removeEventListener('devicemotion', this.deviceMotionListener, true);
        e.target.addEventListener('devicemotion', function (e) {
            _this.measurements.x = e.accelerationIncludingGravity.x - _this.calibration.x;
            _this.measurements.y = e.accelerationIncludingGravity.y - _this.calibration.y;
            _this.measurements.z = e.accelerationIncludingGravity.z - _this.calibration.z;
        }, true);
    };
    /**
     * Add an eventlistener
     *
     * @method deviceOrientationListener
     * @param {any} e
     * @return {void}
     **/
    Gyro.prototype.deviceOrientationListener = function (e) {
        var _this = this;
        this.features.push('deviceorientation');
        e.target.removeEventListener('deviceorientation', this.deviceOrientationListener, true);
        e.target.addEventListener('deviceorientation', function (e) {
            var calib = _this.eulerToQuaternion({
                alpha: _this.calibration.rawAlpha,
                beta: _this.calibration.rawBeta,
                gamma: _this.calibration.rawGamma
            });
            calib.x *= -1;
            calib.y *= -1;
            calib.z *= -1;
            var raw = _this.eulerToQuaternion({
                alpha: e.alpha, beta: e.beta, gamma: e.gamma
            });
            var calibrated = _this.quaternionMultiply(calib, raw);
            var calibEuler = _this.quaternionToEuler(calibrated);
            _this.measurements.alpha = calibEuler.alpha;
            _this.measurements.beta = calibEuler.beta;
            _this.measurements.gamma = calibEuler.gamma;
            _this.measurements.rawAlpha = e.alpha;
            _this.measurements.rawBeta = e.beta;
            _this.measurements.rawGamma = e.gamma;
        }, true);
    };
    /**
     * Calibrate
     *
     * @method calibrate
     * @return {void}
     **/
    Gyro.prototype.calibrate = function () {
        for (var i in this.measurements) {
            if (this.measurements.hasOwnProperty(i)) {
                this.calibration[i] = (typeof this.measurements[i] === 'number') ? this.measurements[i] : 0;
            }
        }
    };
    ;
    /**
     * Return the orientation of the device
     *
     * @method getOrientation
     * @return {void}
     **/
    Gyro.prototype.getOrientation = function () {
        return this.measurements;
    };
    ;
    /**
     * Begin the tracking
     *
     * @method enableTracking
     * @param {any} callback
     * @return {void}
     **/
    Gyro.prototype.enableTracking = function (callback) {
        var _this = this;
        this.interval = setInterval(function () {
            callback(_this.measurements);
        }, this.gyro.frequency);
    };
    ;
    /**
     * Stop the tracking
     *
     * @method disableTracking
     * @return {void}
     **/
    Gyro.prototype.disableTracking = function () {
        clearInterval(this.interval);
    };
    ;
    /**
     * [...]
     *
     * @method hasFeature
     * @param {any} feature (MozOrientation, devicemotion, or deviceorientation)
     * @return {boolean}
     **/
    Gyro.prototype.hasFeature = function (feature) {
        for (var i in this.features) {
            if (feature == this.features[i]) {
                return true;
            }
        }
        return false;
    };
    ;
    /**
     * Return the features of the device
     *
     * @method getFeatures
     * @return {void}
     **/
    Gyro.prototype.getFeatures = function () {
        return this.features;
    };
    ;
    /**
     * Conversion Euler to Quaternion
     *
     * @method eulerToQuaternion
     * @param {any} e
     * @return {void}
     **/
    Gyro.prototype.eulerToQuaternion = function (e) {
        var s = Math.PI / 180;
        var x = e.beta * s, y = e.gamma * s, z = e.alpha * s;
        var cX = Math.cos(x / 2);
        var cY = Math.cos(y / 2);
        var cZ = Math.cos(z / 2);
        var sX = Math.sin(x / 2);
        var sY = Math.sin(y / 2);
        var sZ = Math.sin(z / 2);
        var w = cX * cY * cZ - sX * sY * sZ;
        x = sX * cY * cZ - cX * sY * sZ;
        y = cX * sY * cZ + sX * cY * sZ;
        z = cX * cY * sZ + sX * sY * cZ;
        return { x: x, y: y, z: z, w: w };
    };
    /**
     * Multiplies two quaternions
     *
     * @method quaternionMultiply
     * @param {any} a
     * @param {any} b
     * @return {void}
     **/
    Gyro.prototype.quaternionMultiply = function (a, b) {
        return {
            w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
            x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
            y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
            z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
        };
    };
    /**
     * Set the quaternion
     *
     * @method quaternionApply
     * @param {any} v
     * @param {any} a
     * @return {void}
     **/
    Gyro.prototype.quaternionApply = function (v, a) {
        v = this.quaternionMultiply(a, { x: v.x, y: v.y, z: v.z, w: 0 });
        v = this.quaternionMultiply(v, { w: a.w, x: -a.x, y: -a.y, z: -a.z });
        return { x: v.x, y: v.y, z: v.z };
    };
    /**
     * Return the vector (for the gamma)
     *
     * @method vectorDot
     * @param {any} a
     * @param {any} b
     * @return {void}
     **/
    Gyro.prototype.vectorDot = function (a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    };
    /**
     * Conversion Quaternion to Euler
     *
     * @method quaternionToEuler
     * @param {any} q
     * @return {void}
     **/
    Gyro.prototype.quaternionToEuler = function (q) {
        var s = 180 / Math.PI;
        var front = this.quaternionApply({ x: 0, y: 1, z: 0 }, q);
        var alpha = (front.x == 0 && front.y == 0) ?
            0 : -Math.atan2(front.x, front.y);
        var beta = Math.atan2(front.z, Math.sqrt(front.x * front.x + front.y * front.y));
        var zgSide = {
            x: Math.cos(alpha),
            y: Math.sin(alpha),
            z: 0
        };
        var zgUp = {
            x: Math.sin(alpha) * Math.sin(beta),
            y: -Math.cos(alpha) * Math.sin(beta),
            z: Math.cos(beta)
        };
        var up = this.quaternionApply({ x: 0, y: 0, z: 1 }, q);
        var gamma = Math.atan2(this.vectorDot(up, zgSide), this.vectorDot(up, zgUp));
        if (alpha < 0) {
            alpha += 2 * Math.PI;
        }
        if (gamma >= Math.PI * 0.5) {
            gamma -= Math.PI;
            alpha += Math.PI;
            if (beta > 0) {
                beta = Math.PI - beta;
            }
            else {
                beta = -Math.PI - beta;
            }
        }
        else if (gamma < Math.PI * -0.5) {
            gamma += Math.PI;
            alpha += Math.PI;
            if (beta > 0) {
                beta = Math.PI - beta;
            }
            else {
                beta = -Math.PI - beta;
            }
        }
        if (alpha >= 2 * Math.PI) {
            alpha -= 2 * Math.PI;
        }
        return { alpha: alpha * s, beta: beta * s, gamma: gamma * s };
    };
    return Gyro;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Gyro;
