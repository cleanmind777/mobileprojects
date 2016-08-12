/**
 * @namespace gyro
 * @class Gyro
 * @constructor
 */
export default class Gyro
{
	/**
	 * Returns a value!
	 *
	 * @method foo
	 * @param {string} str The input string
	 * @return {string}
     */

	constructor()
	{
		console.log("INIT");
	}

	public foo(str?:string):string
	{
		if (typeof str == 'undefined')
		{
			return 'baz';
		}
		else
		{
			return str + 'bar';
		}
	}
}
