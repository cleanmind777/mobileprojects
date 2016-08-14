import Gyro from '../src/lib/Gyro.ts';
//import IGyro from '../src/lib/IGyro.ts';
//import {mockGyro} from './GyroMock';
import {expect} from 'chai';

let gyroInstance:Gyro;

describe('Gyro', () =>
{
	beforeEach(function()
	{
		gyroInstance = new Gyro();
	});

	it('should return the default frequency', () =>
	{
		expect(gyroInstance.gyro.frequency).to.be.a('number');
	});

	it('should return if the feature exists', () =>
	{
		expect(gyroInstance.hasFeature('devicemotion')).to.be.a('boolean');
	});

	it('should return the features', () =>
	{
		expect(gyroInstance.getFeatures()).to.be.instanceof(Array);
	});
});
