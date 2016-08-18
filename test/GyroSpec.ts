import Gyro from '../src/lib/Gyro.ts';
import IQuaternion from '../src/lib/IQuaternion.ts';
import IEulerToQuaternion from '../src/lib/IEulerToQuaternion.ts';
import {expect} from 'chai';

let gyroInstance:Gyro;

describe('General', () =>
{
	beforeEach(() =>
	{
		gyroInstance = new Gyro();
	});

	it('the interval should return a number', () =>
	{
		expect(gyroInstance.gyro.interval).to.be.a('number');
	});

	it('should return an object (gyro)', () =>
	{
		expect(gyroInstance.gyro).to.be.an('object');
	});

	it('should return the orientation', () =>
	{
		expect(gyroInstance.getOrientation()).to.be.an('object');
	});

	it('should return an object (calibration)', () =>
	{
		expect(gyroInstance.calibration).to.be.an('object');
	});

	it('should return an object (measurement)', () =>
	{
		expect(gyroInstance.measurement).to.be.an('object');
	});

	/*it('should return ok the event listener of devicemotion', () =>
	{
		const event = new Event('devicemotion');
		const A = window;
		const A_handler = sinon.spy();
		A.addEventListener('T', A_handler);
		A.dispatchEvent(event);
		expect(A_handler).to.have.been.called;
	});*/
});
