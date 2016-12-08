import {StyleSheet, Dimensions} from 'react-native';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

module.exports = StyleSheet.create({
	container: {
		paddingTop: 59
	}
});
