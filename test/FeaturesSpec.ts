import Gyro from '../src/lib/Gyro.ts';
import {expect} from 'chai';

let gyroInstance:Gyro;

describe('Features', () =>
{
    beforeEach(() =>
    {
        gyroInstance = new Gyro();

        gyroInstance.features = ['MozOrientation', 'devicemotion', 'deviceorientation'];
    });

    it('should return all the features', () =>
    {
        expect(gyroInstance.getFeatures()).to.be.instanceof(Array);
    });

    it('should return an array with the features', () =>
    {
        expect(gyroInstance.features).to.be.instanceOf(Array);
    });

    it('"devicemotion" exists', () =>
    {
        expect(gyroInstance.hasFeature('devicemotion')).to.be.true;
    });

    it('"MozOrientation" exists', () =>
    {
        expect(gyroInstance.hasFeature('MozOrientation')).to.be.true;
    });

    it('"deviceorientation" exists', () =>
    {
        expect(gyroInstance.hasFeature('deviceorientation')).to.be.true;
    });

    it('"fake_feature" don´t exists', () =>
    {
        expect(gyroInstance.hasFeature('fake_feature')).to.be.false;
    });
});
