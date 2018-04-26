import { NetInfo } from 'react-native';
import * as common from '../Config/common';
import isConnected from './/CheckNet';

export default class Common {
	static formatPrice(number) {
		let newNumber = parseInt(number);
		return newNumber.toFixed(0).replace(/./g, function (c, i, a) {
			return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		});
	}

	static async checkServerAlive() {
		if (common.net == 0) {
			try {
				let response = await fetch(common.domain + '/api/ping.php');
				let responseJson = await response.json();
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		}
		else {
			return await isConnected();
		}

	}
}
