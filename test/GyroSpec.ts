import Gyro from 'Gyro.ts';
import IGyro from 'IGyro.ts';
import {mockGyro} from './GyroMock';
import {expect} from 'chai';

let example:IGyro;

describe('Gyro', () =>
{
	beforeEach(function()
	{
		example = new Gyro();
	});

	it('should return the correct environment', () =>
	{
		expect(example.foo(mockGyro)).to.equal('foobar');
	});

	it('should return the default environment when none has been supplied', () =>
	{
		expect(example.foo()).to.equal('baz');
	});
});
