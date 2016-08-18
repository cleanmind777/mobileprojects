import IQuaternion from "./IQuaternion";
import IEulerToQuaternion from "./IEulerToQuaternion";

/**
 * @namespace gyro
 * @class Gyro
 * @constructor
 */

//type ObjectType = (Object) => void;

export default class Gyro
{
	private gyro:any            			= {};
	private features:any        			= [];
	private trackingIntervalId:any        	= null;
	private measurement:any    				= {
		x: null,
		y: null,
		z: null,
		alpha: null,
		beta: null,
		gamma: null
	};
	private calibration:any     			= {
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
		this.gyro.interval = 800;

		this.addListeners();
	}

	/**
	 * Init all the listeners
	 *
	 * @method addListeners
	 * @return {void}
	 **/
	public addListeners():void
	{
		if (window && window.addEventListener) {
			window.addEventListener('MozOrientation', this.mozOrientationInitListener.bind(this));
			window.addEventListener('devicemotion', this.deviceMotionListener.bind(this));
			window.addEventListener('deviceorientation', this.deviceOrientationListener.bind(this));
		}
	}

	/**
	 * Remove all the listeners
	 *
	 * @method removeListeners
	 * @return {void}
	 **/
	public removeListeners():void
	{
		window.removeEventListener('MozOrientation', this.mozOrientationInitListener.bind(this));
		window.removeEventListener('devicemotion', this.deviceMotionListener.bind(this));
		window.removeEventListener('deviceorientation', this.deviceOrientationListener.bind(this));
	}

	/**
	 * Add an eventlistener
	 *
	 * @method mozOrientationInitListener
	 * @param {any} e
	 * @return {void}
	 **/
	public mozOrientationInitListener(e:any):void
	{
		this.features.push('MozOrientation');
		e.target.removeEventListener('MozOrientation', this.mozOrientationInitListener, true);

		e.target.addEventListener('MozOrientation', (e) => {
			this.measurement.x = e.x - this.calibration.x;
			this.measurement.y = e.y - this.calibration.y;
			this.measurement.z = e.z - this.calibration.z;
		}, true);
	}

	/**
	 * Add an eventlistener
	 *
	 * @method deviceMotionListener
	 * @param {any} e
	 * @return {void}
	 **/
	public deviceMotionListener(e:any):void
	{
		this.features.push('devicemotion');
		e.target.removeEventListener('devicemotion', this.deviceMotionListener, true);

		e.target.addEventListener('devicemotion', (e) => {
			this.measurement.x = e.accelerationIncludingGravity.x - this.calibration.x;
			this.measurement.y = e.accelerationIncludingGravity.y - this.calibration.y;
			this.measurement.z = e.accelerationIncludingGravity.z - this.calibration.z;
		}, true);
	}

	/**
	 * Add an eventlistener
	 *
	 * @method deviceOrientationListener
	 * @param {any} e
	 * @return {void}
	 **/
	public deviceOrientationListener(e:any):void
	{
		this.features.push('deviceorientation');
		e.target.removeEventListener('deviceorientation', this.deviceOrientationListener, true);

		e.target.addEventListener('deviceorientation', (e) => {
			let calib = this.eulerToQuaternion({
				alpha: this.calibration.rawAlpha,
				beta: this.calibration.rawBeta,
				gamma: this.calibration.rawGamma
			});
			calib.x *= -1; calib.y *= -1; calib.z *= -1;

			let raw = this.eulerToQuaternion({
				alpha: e.alpha, beta: e.beta, gamma: e.gamma
			});
			let calibrated = this.quaternionMultiply(calib, raw);
			let calibEuler = this.quaternionToEuler(calibrated);

			this.measurement.alpha = calibEuler.alpha;
			this.measurement.beta = calibEuler.beta;
			this.measurement.gamma = calibEuler.gamma;

			this.measurement.rawAlpha = e.alpha;
			this.measurement.rawBeta = e.beta;
			this.measurement.rawGamma = e.gamma;
		}, true);
	}

	/**
	 * Calibrate
	 *
	 * @method calibrate
	 * @return {void}
	 **/
	public calibrate() {
		for (let i in this.measurement) {
			if (this.measurement.hasOwnProperty(i)) {
				this.calibration[i] = (typeof this.measurement[i] === 'number') ? this.measurement[i] : 0;
			}
		}
	};

	/**
	 * Return the orientation of the device
	 *
	 * @method getOrientation
	 * @return {void}
	 **/
	public getOrientation() {
		return this.measurement;
	};

	/**
	 * Begin the tracking
	 *
	 * @method enableTracking
	 * @param {any} callback
	 * @return {void}
	 **/
	public enableTracking(callback:any) { // ObjectType
		this.trackingIntervalId = setInterval(() => {
			callback(this.measurement);
		}, this.gyro.interval);
	};

	/**
	 * Stop the tracking
	 *
	 * @method disableTracking
	 * @return {void}
	 **/
	public disableTracking() {
		clearInterval(this.trackingIntervalId);
		this.removeListeners();
	};

	/**
	 * [...]
	 *
	 * @method hasFeature
	 * @param {any} feature (MozOrientation, devicemotion, or deviceorientation)
	 * @return {boolean}
	 **/
	public hasFeature(feature:string) {
		return this.features.indexOf(feature) != -1;
	};

	/**
	 * Return the features of the device
	 *
	 * @method getFeatures
	 * @return {void}
	 **/
	public getFeatures() {
		return this.features;
	};


	/**
	 * Conversion Euler to Quaternion
	 *
	 * @method eulerToQuaternion
	 * @param {any} e
	 * @return {void}
	 **/
	private eulerToQuaternion(e:IEulerToQuaternion) {
		let s:any = Math.PI / 180;
		let x:any = e.beta * s, y = e.gamma * s, z = e.alpha * s;
		let cX:any = Math.cos(x / 2);
		let cY:any = Math.cos(y / 2);
		let cZ:any = Math.cos(z / 2);
		let sX:any = Math.sin(x / 2);
		let sY:any = Math.sin(y / 2);
		let sZ:any = Math.sin(z / 2);
		let w:any = cX * cY * cZ - sX * sY * sZ;
		x = sX * cY * cZ - cX * sY * sZ;
		y = cX * sY * cZ + sX * cY * sZ;
		z = cX * cY * sZ + sX * sY * cZ;
		return {x:x, y:y, z:z, w:w};
	}

	/**
	 * Multiplies two quaternions
	 *
	 * @method quaternionMultiply
	 * @param {any} a
	 * @param {any} b
	 * @return {void}
	 **/
	private quaternionMultiply(a:IQuaternion, b:IQuaternion) {
		return {
			w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
			x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
			y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
			z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
		};
	}

	/**
	 * Set the quaternion
	 *
	 * @method quaternionApply
	 * @param {any} v
	 * @param {any} a
	 * @return {void}
	 **/
	private quaternionApply(v:IQuaternion, a:IQuaternion) {
		v = this.quaternionMultiply( a, { x:v.x, y:v.y, z:v.z, w:0 } );
		v = this.quaternionMultiply( v, { w:a.w, x:-a.x, y:-a.y, z:-a.z } );
		return { x:v.x, y:v.y, z:v.z };
	}

	/**
	 * Return the vector (for the gamma)
	 *
	 * @method vectorDot
	 * @param {any} a
	 * @param {any} b
	 * @return {void}
	 **/
	private vectorDot(a:IQuaternion, b:IQuaternion) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	/**
	 * Conversion Quaternion to Euler
	 *
	 * @method quaternionToEuler
	 * @param {any} q
	 * @return {void}
	 **/
	private quaternionToEuler(q:IQuaternion) {
		let s = 180 / Math.PI;
		let front = this.quaternionApply( { x:0, y:1, z:0 }, q );
		let alpha = (front.x == 0 && front.y == 0) ?
			0 : -Math.atan2(front.x, front.y);
		let beta = Math.atan2( front.z, Math.sqrt( front.x * front.x + front.y * front.y ) );
		let zgSide = {
			x: Math.cos(alpha),
			y: Math.sin(alpha),
			z: 0
		};
		let zgUp = {
			x: Math.sin(alpha) * Math.sin(beta),
			y: -Math.cos(alpha) * Math.sin(beta),
			z: Math.cos(beta)
		};
		let up = this.quaternionApply( { x:0, y:0, z:1 }, q );
		let gamma = Math.atan2( this.vectorDot(up, zgSide), this.vectorDot(up, zgUp) );

		if (alpha < 0) { alpha += 2 * Math.PI; }
		if (gamma >= Math.PI * 0.5) {
			gamma -= Math.PI;
			alpha += Math.PI;
			if (beta > 0) {
				beta = Math.PI - beta;
			} else {
				beta = -Math.PI - beta;
			}
		} else if (gamma < Math.PI * -0.5) {
			gamma += Math.PI; alpha += Math.PI;
			if (beta > 0) {
				beta = Math.PI - beta;
			} else {
				beta = -Math.PI - beta;
			}
		}
		if (alpha >= 2 * Math.PI) { alpha -= 2 * Math.PI; }
		return {alpha: alpha * s, beta: beta * s, gamma: gamma * s};
	}
}
