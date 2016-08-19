import Gyro from '../src/lib/Gyro.ts';
import {expect} from 'chai';

let gyroInstance:Gyro;

describe('Operations', () =>
{
    beforeEach(() =>
    {
        gyroInstance = new Gyro();
    });

    describe('vectorDot', () =>
    {
        it('should return a number', () =>
        {
            let data = gyroInstance.vectorDot({ x:2, y:4, z:6, w:8 }, { x:20, y:30, z:40, w:50 });
            expect(data).to.be.a('number');
        });

        it('should be equal to 400', () =>
        {
            let data = gyroInstance.vectorDot({ x:2, y:4, z:6, w:8 }, { x:20, y:30, z:40, w:50 });
            expect(data).to.equal(400);
        });
    });

    describe('quaternionToEuler', () =>
    {
        it('should return an object', () =>
        {
            let data = gyroInstance.eulerToQuaternion({alpha: 10, beta: 30, gamma: 20});
            expect(data).to.be.an('object');
        });


        it('should return the correct result', () =>
        {
            let data = gyroInstance.eulerToQuaternion({alpha: 10, beta: 30, gamma: 20});
            expect(data).to.deep.equal({x: 0.2392983377447303, y: 0.189307857412, z: 0.12767944069578063, w: 0.943714364147489});
        });
    });

    describe('quaternionMultiply', () =>
    {
        it('should return an object', () =>
        {
            let data = gyroInstance.quaternionMultiply({ x:2, y:4, z:6, w:8 }, { x:20, y:30, z:40, w:50 });
            expect(data).to.be.an('object');
        });


        it('should return the correct result', () =>
        {
            let data = gyroInstance.quaternionMultiply({ x:2, y:4, z:6, w:8 }, { x:20, y:30, z:40, w:50 });
            expect(data).to.deep.equal({w: 0, x: 240, y: 480, z: 600});
        });
    });
});
