/**
 * @namespace gyro
 * @class Gyro
 * @constructor
 */
export default class Gyro
{
	private gyro:any            = {};
	private features:any        = [];
	private interval:any        = null;
	private measurements:any    = {
		x: null,
		y: null,
		z: null,
		alpha: null,
		beta: null,
		gamma: null
	};
	private calibration:any     = {
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

	constructor()
	{
		console.log("INIT GYRO");

		this.gyro.frequency = 1000;

		window.addEventListener('MozOrientation', this.mozOrientationInitListener.bind(this), true);
		window.addEventListener('devicemotion', this.deviceMotionListener.bind(this), true);
		window.addEventListener('deviceorientation', this.deviceOrientationListener.bind(this), true);

	}

	public calibrate() {
		for (var i in this.measurements) {
			this.calibration[i] = (typeof this.measurements[i] === 'number') ? this.measurements[i] : 0;
		}
	};

	public getOrientation() {
		return this.measurements;
	};

	public startTracking(callback) {
		this.interval = setInterval(() => {
			callback(this.measurements);
		}, this.gyro.frequency);
	};

	public stopTracking() {
		clearInterval(this.interval);
	};


	/**
	 * Current available features are:
	 * MozOrientation
	 * devicemotion
	 * deviceorientation
	 */
	public hasFeature(feature) {
		console.log("feature", feature);
		for (var i in this.features) {
			if (feature == this.features[i]) {
				return true;
			}
		}
		return false;
	};

	public getFeatures() {
		return this.features;
	};


	private eulerToQuaternion(e) {
		var s:any = Math.PI / 180;
		var x:any = e.beta * s, y = e.gamma * s, z = e.alpha * s;
		var cX:any = Math.cos(x / 2);
		var cY:any = Math.cos(y / 2);
		var cZ:any = Math.cos(z / 2);
		var sX:any = Math.sin(x / 2);
		var sY:any = Math.sin(y / 2);
		var sZ:any = Math.sin(z / 2);
		var w:any = cX * cY * cZ - sX * sY * sZ;
		x = sX * cY * cZ - cX * sY * sZ;
		y = cX * sY * cZ + sX * cY * sZ;
		z = cX * cY * sZ + sX * sY * cZ;
		return {x:x, y:y, z:z, w:w};
	}

	//this.gyro.eulerToQuaternion=this.eulerToQuaternion;

	private quaternionMultiply(a, b) {
		return {
			w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
			x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
			y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
			z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
		};
	}

	private quaternionApply(v, a) {
		v = this.quaternionMultiply(a, {x:v.x,y:v.y,z:v.z,w:0});
		v = this.quaternionMultiply(v, {w:a.w, x:-a.x, y:-a.y, z:-a.z});
		return {x:v.x, y:v.y, z:v.z};
	}

	private vectorDot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	private quaternionToEuler(q) {
		var s = 180 / Math.PI;
		var front = this.quaternionApply({x:0,y:1,z:0}, q);
		var alpha = (front.x == 0 && front.y == 0) ?
			0 : -Math.atan2(front.x, front.y);
		var beta = Math.atan2(front.z,Math.sqrt(front.x*front.x+front.y*front.y));
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
		var up = this.quaternionApply({x:0,y:0,z:1}, q);
		var gamma = Math.atan2(this.vectorDot(up, zgSide), this.vectorDot(up, zgUp));

		// wrap-around the value according to DeviceOrientation
		// Event Specification
		if (alpha < 0) alpha += 2 * Math.PI;
		if (gamma >= Math.PI * 0.5) {
			gamma -= Math.PI; alpha += Math.PI;
			if (beta > 0) beta = Math.PI - beta;
			else beta = -Math.PI - beta;
		} else if (gamma < Math.PI * -0.5) {
			gamma += Math.PI; alpha += Math.PI;
			if (beta > 0) beta = Math.PI - beta;
			else beta = -Math.PI - beta;
		}
		if (alpha >= 2 * Math.PI) alpha -= 2 * Math.PI;
		return {alpha: alpha * s, beta: beta * s, gamma: gamma * s};
	}

	public mozOrientationInitListener(e):void
	{
		this.features.push('MozOrientation');
		e.target.removeEventListener('MozOrientation', this.mozOrientationInitListener, true);

		e.target.addEventListener('MozOrientation', (e) => {
			this.measurements.x = e.x - this.calibration.x;
			this.measurements.y = e.y - this.calibration.y;
			this.measurements.z = e.z - this.calibration.z;
		}, true);
	}

	public deviceMotionListener(e):void
	{
		this.features.push('devicemotion');
		e.target.removeEventListener('devicemotion', this.deviceMotionListener, true);

		e.target.addEventListener('devicemotion', (e) => {
			this.measurements.x = e.accelerationIncludingGravity.x - this.calibration.x;
			this.measurements.y = e.accelerationIncludingGravity.y - this.calibration.y;
			this.measurements.z = e.accelerationIncludingGravity.z - this.calibration.z;
		}, true);
	}

	public deviceOrientationListener(e):void
	{
		this.features.push('deviceorientation');
		e.target.removeEventListener('deviceorientation', this.deviceOrientationListener, true);

		e.target.addEventListener('deviceorientation', (e) => {
			var calib = this.eulerToQuaternion({
				alpha: this.calibration.rawAlpha,
				beta: this.calibration.rawBeta,
				gamma: this.calibration.rawGamma
			});
			calib.x *= -1; calib.y *= -1; calib.z *= -1;

			var raw = this.eulerToQuaternion({
				alpha: e.alpha, beta: e.beta, gamma: e.gamma
			});
			var calibrated = this.quaternionMultiply(calib, raw);
			var calibEuler = this.quaternionToEuler(calibrated);

			this.measurements.alpha = calibEuler.alpha;
			this.measurements.beta = calibEuler.beta;
			this.measurements.gamma = calibEuler.gamma;

			this.measurements.rawAlpha = e.alpha;
			this.measurements.rawBeta = e.beta;
			this.measurements.rawGamma = e.gamma;
		}, true);
	}

	/**
	 * Returns a value!
	 *
	 * @method foo
	 * @param {string} str The input string
	 * @return {string}
	 */
	/*public foo(str?:string):string
	{
		if (typeof str == 'undefined')
		{
			return 'baz';
		}
		else
		{
			return str + 'bar';
		}
	}*/
}
