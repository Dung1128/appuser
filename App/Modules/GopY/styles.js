import {StyleSheet, Dimensions} from 'react-native';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

module.exports = StyleSheet.create({
	groupInput: {
		width: (widthDevice-40),
		marginBottom: 20
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		marginTop: 5
	},
	errorInput: {
		borderBottomColor: 'red'
	},
	noErrorInput: {
		borderBottomColor: '#777'
	},
	button: {
		backgroundColor: '#6495ed',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15
	},
	colorTextError: {
		color: 'red'
	}
});
