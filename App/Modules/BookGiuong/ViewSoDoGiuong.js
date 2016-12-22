import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity,
	AsyncStorage,
	TabBarIOS,
	View,
	ScrollView,
	TouchableHighlight,
	Alert
} from 'react-native';
import {domain,cache} from '../../Config/common';
import { Container, Content, Header, Title, Text, Icon, Button, Card, CardItem, Spinner, Badge } from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

class ViewSoDoGiuong extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			results: [],
			isOpen: false,
			isDisabled: false,
			nameGiuong: '',
			resultsBen: [],
			priceTotal: 0,
			arrVeNumber: [],
			currentIdGiuong: 0,
			totalPriceInt: 0,
			bvv_id_can_chuyen: 0,
			bvv_bvn_id_muon_chuyen: 0,
			bvv_number_muon_chuyen: 0,
			type: '',
			infoAdm: [],
			chuyenVaoCho: this.props.data.chuyenVaoCho,
			arrOrder: [],
			checkout: false,
			dataBook: [],
			arrBookGiuong: [],
			themVe: [],
			arrThemve: [],
			twoColumn: 'column'
		};
	}

	infoAdm() {
		var that = this;
		AsyncStorage.getItem('infoUser').then((data) => {
			let results = JSON.parse(data);
			that.setState({
				infoAdm: results
			});
		}).done();
	}

	componentDidMount() {
		this.infoAdm();
		this.setState({
			loading: true
		});
		var that = this;
		setTimeout(() => {
			fetch(domain+'/api/api_adm_so_do_giuong.php?not_id='+this.props.data.notId+'&day='+this.props.data.day, {
				headers: {
					'Cache-Control': cache
				}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				that.setState({
					results:responseJson.so_do_giuong,
					arrVeNumber: responseJson.so_do_giuong.arrVeNumber,
					resultsBen: that.props.data.dataBen,
					arrOrder: responseJson.so_do_giuong.arrOrder,
					loading: false
				});
				return responseJson.so_do_giuong;
			})
			.catch((error) => {
				that.setState({
					loading: true
				});
				console.error(error);
			});
		},800);
	}

	_renderSoDoGiuong(data, tang) {
		let html = [],
		dataTang = [];
		switch (tang) {
			case 1:
			dataTang = data.arrChoTang_1;
			break;
			case 2:
			dataTang = data.arrChoTang_2;
			break;
			case 3:
			dataTang = data.arrChoTang_3;
			break;
			case 4:
			dataTang = data.arrChoTang_4;
			break;
			case 5:
			dataTang = data.arrChoTang_5;
			break;
			default:
		}
		if(dataTang != undefined) {
			for(var i in dataTang) {
				var item = dataTang[i];
				var htmlChild = [];
				for(var j in item) {
					if(Object.keys(item).length <= 2) {
						if(j == 1) {
							htmlChild.push(
								<Col key={i+(j+999)}>
									<TouchableOpacity style={styles.opacityBg}>
										<Text style={styles.textCenter}></Text>
									</TouchableOpacity>
								</Col>
							);
						}
					}
					var idGiuong = item[j].sdgct_number;
					var dataGiuong = this.state.arrVeNumber[idGiuong];

					if(dataGiuong.bvv_status == -2) {
						htmlChild.push(
							<Col key={i+j} style={styles.borderCol}>
								<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.selectGiuongUser, styles.opacityBg]}>
									<Text style={[styles.textCenter, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
								</TouchableOpacity>
							</Col>
						);
					}else {
						if(dataGiuong.bvv_status == -2) {
							htmlChild.push(
								<Col key={i+j} style={styles.borderCol}>
									<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong)} style={styles.opacityBg}>
										<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
									</TouchableOpacity>
								</Col>
							);
						}else {
							if(dataGiuong.bvv_status == 0) {
								if(this.state.arrOrder[idGiuong] == undefined) {
									htmlChild.push(
										<Col key={i+j} style={styles.borderCol}>
											<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong)} style={styles.opacityBg}>
												<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
											</TouchableOpacity>
										</Col>
									);
								}else {
									if(this.state.arrOrder[idGiuong].ord_status >= 0) {
										htmlChild.push(
											<Col key={i+j} style={styles.borderCol}>
												<TouchableOpacity style={[styles.activeGiuong, styles.opacityBg]}>
													<Text style={[styles.textCenter, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
												</TouchableOpacity>
											</Col>
										);
									}else if(this.state.arrOrder[idGiuong].ord_status >= 0 && dataGiuong.bvv_status == 0) {
										htmlChild.push(
											<Col key={i+j} style={styles.borderCol}>
												<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong)} style={styles.opacityBg}>
													<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
												</TouchableOpacity>
											</Col>
										);
									}
								}
							}else {
								htmlChild.push(
									<Col key={i+j} style={styles.borderCol}>
										<TouchableOpacity style={[styles.activeGiuong, styles.opacityBg]}>
											<Text style={[styles.textCenter, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
										</TouchableOpacity>
									</Col>
								);
							}
						}
					}
				}
				html.push(<Grid key={i}>{htmlChild}</Grid>);
			}
		}
		return html;
	}

	_setActiveGiuong(id) {
		let setStatus = this.state.arrVeNumber;
		let dataBook = this.state.dataBook;
		let arrBookGiuong = this.state.arrBookGiuong;
		setStatus[id].bvv_status = -2;
		setStatus[id].bvv_bex_id_a = this.props.data.benA;
		setStatus[id].bvv_bex_id_b = this.props.data.benB;
		setStatus[id].bvv_price = this.props.data.totalPriceInt;

		dataBook.push({'numberGiuong': parseInt(id), 'bvv_bex_id_a': this.props.data.benA, 'bvv_bex_id_b': this.props.data.benB, 'bvv_price': parseInt(this.props.data.totalPriceInt)});
		arrBookGiuong.push({'numberGiuong': parseInt(id)});
		this.setState({
			arrVeNumber: setStatus,
			checkout: true,
			dataBook: dataBook,
			arrBookGiuong: arrBookGiuong
		});
	}

	_unsetActiveGiuong(id){
		let checkGiuongCurrent = false;
		if(this.state.checkout) {
			let arrBookGiuong = this.state.arrBookGiuong;
			for(var i in arrBookGiuong) {
				if(arrBookGiuong[i].numberGiuong == parseInt(id)) {
					checkGiuongCurrent = true;
					let dataBook = this.state.dataBook;
					let setStatus = this.state.arrVeNumber;
					setStatus[id].bvv_status = 0;

					arrBookGiuong.splice(i, 1);
					dataBook.splice(i, 1);

					this.setState({
						arrVeNumber: setStatus,
						loadingModalAction: false,
						arrBookGiuong: arrBookGiuong,
						dataBook: dataBook
					});

					if(dataBook.length == 0 && arrBookGiuong.length == 0) {
						this.setState({
							checkout: false
						});
					}
				}
			}
		}
	}

	_onLayout = event => {
		let widthDevice = Dimensions.get('window').width;
		let heightDevice = Dimensions.get('window').height;
		let twoColumn = (widthDevice >= 600)? 'row' : 'column' ;

    	this.setState({
			twoColumn: twoColumn
    	});
	}

	render() {
		let classContainer = 'container';
		if(this.state.checkout) {
			classContainer = 'containerMarginBottom';
		}
		let currentPrice = parseInt(this.props.data.totalPriceInt);
		let convertPrice = currentPrice.toFixed(0).replace(/./g, function(c, i, a) {
			return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		});
		return(
			<View onLayout={this._onLayout}>
				<ScrollView style={[styles[classContainer]]}>

					<Card style={[styles.paddingContent]}>
						<CardItem header>
							<View style={{flexDirection: 'column'}}>
								<View style={{marginBottom: 10}}>
									<Text>Nơi đi & Nơi đến: <Text style={{fontWeight: 'bold'}}>{this.state.resultsBen[this.props.data.benA]}</Text> - <Text style={{fontWeight: 'bold'}}>{this.state.resultsBen[this.props.data.benB]}</Text></Text>
									<Text>Giờ xuất bến: <Text style={{fontWeight: 'bold'}}>{this.props.data.gio_xuat_ben + ' ' + this.props.data.day}</Text></Text>
									<Text>Giá vé: <Text style={{fontWeight: 'bold'}}>{convertPrice} VNĐ</Text></Text>
								</View>
								<View>
									<View style={{flexDirection: 'row', flex: 1}}>
										<View style={{marginRight: 20}}>
											<View style={{flex: 1}}>
												<View style={{flexDirection: 'row'}}>
													<View width={25} height={25} backgroundColor={'#d6d7da'} style={{marginRight: 10,marginTop: -2}}></View>
													<View><Text>Đã có người</Text></View>
												</View>
											</View>
										</View>
										<View>
											<View style={{flex: 1}}>
												<View style={{flexDirection: 'row'}}>
													<View width={25} height={25} backgroundColor={'#ff8c00'} style={{marginRight: 10,marginTop: -2}}></View>
													<View><Text>Đang chọn</Text></View>
												</View>
											</View>
										</View>
										<View>
											<View style={{flex: 1}}>
												<View style={{flexDirection: 'row'}}>
													<View style={{marginLeft: 5}}></View>
												</View>
											</View>
										</View>
									</View>
								</View>
							</View>
						</CardItem>
					</Card>

					{this.state.loading && <Spinner />}

					<View style={{flexDirection: this.state.twoColumn}}>
						{this._renderSoDoGiuong(this.state.results, 1).length > 0 &&
							<Card style={[styles.paddingContent, {flex: 1}]}>
								<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
									<Text style={{fontSize: 20}}>Tầng 1</Text>
								</CardItem>

								<CardItem>
									{this._renderSoDoGiuong(this.state.results, 1)}
									{this._renderSoDoGiuong(this.state.results, 3).length > 0 &&
										this._renderSoDoGiuong(this.state.results, 3)
									}
								</CardItem>
							</Card>
						}

						{this._renderSoDoGiuong(this.state.results, 2).length > 0 &&
							<Card style={[styles.paddingContent, {flex: 1}]}>
								<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
									<Text style={{fontSize: 20}}>Tầng 2</Text>
								</CardItem>

								<CardItem>
									{this._renderSoDoGiuong(this.state.results, 2)}
									{this._renderSoDoGiuong(this.state.results, 4).length > 0 &&
										this._renderSoDoGiuong(this.state.results, 4)
									}
								</CardItem>
							</Card>
						}
					</View>

					{this._renderSoDoGiuong(this.state.results, 5).length > 0 &&
						<Card style={styles.paddingContent}>
							<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
								<Text style={{fontSize: 20}}>Ghế Sàn</Text>
							</CardItem>

							<CardItem>
								{this._renderSoDoGiuong(this.state.results, 5)}
							</CardItem>
						</Card>
					}
				</ScrollView>

				<View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
					  {this.state.checkout &&
						  <TouchableOpacity style={[styles.styleTabbars, {flex: 1, backgroundColor: '#6495ed'}]} onPress={() => Actions.ListOrder({title: 'Danh sách đặt vé', data: {id_dieu_do: this.props.data.id_dieu_do, gio_xuat_ben: this.props.data.day+ ' ' + this.props.data.gio_xuat_ben, dataUser: this.state.infoAdm, dataBook: this.state.dataBook, dataBen: this.props.data.dataBen}})}>
						  		<View style={{flexDirection: 'row', flex: 1}}>
									<View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'transparent', paddingRight: 10, marginLeft: 50}}>
			 					  		<Text style={{color: '#fff'}}>Tiếp tục</Text>
									</View>
									<View style={{flex: 1, alignItems: 'flex-start',justifyContent: 'center', backgroundColor: 'transparent', paddingTop: 5}}>
										<Icon name="md-arrow-round-forward" color={'#fff'} />
									</View>
							  	</View>
		 				  </TouchableOpacity>
					  }
 			  	</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 64
	},
	containerMarginBottom: {
		marginTop: 64,
		marginBottom: 50
	},
	wrapOrder: {
		marginBottom: 0
	},
	paddingContent: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10
	},
	borderCol: {
		height: 50,
		borderWidth: 1,
		borderColor: '#d6d7da',
		marginRight: 5,
		marginBottom: 5
	},
	nullBorderCol: {
		height: 50,
		borderWidth: 1,
		borderColor: '#d6d7da',
		marginRight: 5,
		marginBottom: 5,
		backgroundColor: '#d6d7da'
	},
	opacityBg: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	disabled: {
		backgroundColor: 'red'
	},
	activeGiuong: {
		backgroundColor: '#d6d7da',
	},
	activeGiuongUser: {
		backgroundColor: '#7eecb5',
	},
	selectGiuongUser: {
		backgroundColor: '#ff8c00'
	},
	activeLenXe: {
		backgroundColor: '#5fb760',
	},
	activeThanhToan: {
		backgroundColor: '#60c0dc',
	},
	textActiveGiuong: {
		color: '#ffffff'
	},
	textRightGiuong: {
		fontSize: 10,
		lineHeight: 10,
		position: 'absolute',
		right: 5,
		top: 5
	},
	textCenter: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 13
	},
	textLeft: {
		fontSize: 13,
		alignItems: 'flex-start',
		width: 80
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: '#000066'
	},
	welcomePress: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: '#ffffff'
	},
	button: {
		borderColor: '#000066',
		borderWidth: 1,
		borderRadius: 10,
	},
	buttonPress: {
		borderColor: '#000066',
		backgroundColor: '#000066',
		borderWidth: 1,
		borderRadius: 10,
	},
	modal: {
		alignItems: 'center',
		top: 80,
		paddingRight: 20,
		paddingLeft: 20
	},
	modalPopup: {
		height: 300,
		width: 300
	},
	modalAction: {
		alignItems: 'center',
		paddingRight: 20,
		paddingLeft: 20
	},
	modalPopupAction: {
		width: 300,
		height: 200
	},
	modalOrder: {
		paddingTop: 65
	},
	modalPopupOrder: {
		width: widthDevice,
		paddingRight: 0,
		paddingLeft: 0
	},
	marginTopButton: {
		marginTop: 20
	},
	styleTabbars: {
		flex: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f7f7f7'
	},
	countDanhSachCho: {
		position: 'absolute',
		right: 25,
		top: 0
	},
	borderChuyenChoo: {
		borderWidth: 3,
		borderColor: '#000000'
	},
	fontWeight: {
		fontWeight: 'bold'
	}
});

export default ViewSoDoGiuong
