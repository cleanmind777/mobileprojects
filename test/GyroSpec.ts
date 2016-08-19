import Gyro from '../src/lib/Gyro.ts';
import IQuaternion from '../src/lib/IQuaternion.ts';
import IEventListener from '../src/lib/IEventListener.ts';
import IEulerToQuaternion from '../src/lib/IEulerToQuaternion.ts';
import {expect} from 'chai';

let gyroInstance:Gyro;

describe('General', () =>
{
	beforeEach(() =>
	{
		gyroInstance = new Gyro();
	});

	it('features should be empty by default', () =>
	{
		expect(gyroInstance.features).to.be.empty;
	});

	it('the interval should return a number', () =>
	{
		expect(gyroInstance.config.interval).to.be.a('number');
	});

	it('should return an object (gyro)', () =>
	{
		expect(gyroInstance.config).to.be.an('object');
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
});
