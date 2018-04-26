import { Linking, Platform, Alert } from 'react-native';
import fetchData from './FetchData';
import * as common from '../Config/common';
import DeviceInfo from 'react-native-device-info';

const GetInfoDevice = async () => {

	let url = (Platform.OS == 'ios') ? common.linkApple : common.linkAndroid;

	if (Platform.OS == 'ios') {
		try {
			let params = {
				version: DeviceInfo.getVersion(),
				type: 'ios',
				app: 'appuser'
			}
			
			let data = await fetchData('api_check_version', params, 'GET');
			// console.log(data);
			// let data = {
			// 	status: 201,
			// 	urlApp: "itms://itunes.apple.com/us/app/ha-son-hai-van/id1184424992?l=vi&ls=1&mt=8"
			// };

			if (data.status == 201) {
				let url = data.urlApp;
				return Alert.alert(
					'Hệ thống thông báo',
					'Version của bạn đã cũ. Bạn vui lòng Update lên version mới nhất.',
					[
						{ text: 'Hủy', onPress: () => console.log('Cancel Pressed!') },
						{
							text: 'Cài đặt', onPress: () =>
								Linking.canOpenURL(url).then(supported => {
									if (supported) {
										Linking.openURL(url);
									} else {
										console.log('Don\'t know how to open URI: ' + url);
									}
								})
						},
					]
				);
			}
		} catch (e) {
			console.log(e);
		}
	} else {
		try {
			let params = {
				version: DeviceInfo.getVersion(),
				type: 'android',
				app: 'appuser'
			}
			let data = await fetchData('api_check_version', params, 'GET');
			if (data.status == 201) {
				let url = data.urlApp;
				return Alert.alert(
					'Hệ thống thông báo',
					'Version của bạn đã cũ. Bạn vui lòng Update lên version mới nhất.',
					[
						{ text: 'Hủy', onPress: () => console.log('Cancel Pressed!') },
						{
							text: 'Cài đặt', onPress: () =>
								Linking.canOpenURL(url).then(supported => {
									if (supported) {
										Linking.openURL(url);
									} else {
										console.log('Don\'t know how to open URI: ' + url);
									}
								})
						},
					]
				);
			}
		} catch (e) {
			console.log(e);
		}
	}

	return true;
}

export default GetInfoDevice
