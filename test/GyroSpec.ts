import Gyro from '../src/lib/Gyro.ts';
import IQuaternion from '../src/lib/IQuaternion.ts';
import IEulerToQuaternion from '../src/lib/IEulerToQuaternion.ts';
import {expect} from 'chai';
//import sinon from 'sinon';
//chai.use(sinon);

let gyroInstance:Gyro;

describe('Gyro', () =>
{
	beforeEach(function()
	{
		gyroInstance = new Gyro();
	});

	it('should return the default interval', () =>
	{
		expect(gyroInstance.gyro.interval).to.be.a('number');
	});

	it('should return if the feature exists', () =>
	{
		expect(gyroInstance.hasFeature('devicemotion')).to.be.a('boolean');
	});

	it('should return the features', () =>
	{
		expect(gyroInstance.getFeatures()).to.be.instanceof(Array);
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

	it('should return an object (gyro)', () =>
	{
		expect(gyroInstance.gyro).to.be.an('object');
	});

	it('should return an array (features)', () =>
	{
		expect(gyroInstance.features).to.be.instanceOf(Array);
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
