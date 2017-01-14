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
import fetchData from '../../Components/FetchData';
import { Container, Content, Header, Title, Text, Icon, Button, Card, CardItem, Spinner, Badge, Thumbnail } from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';
import StorageHelper from '../../Components/StorageHelper';
const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

class ViewSoDoGiuong extends Component {

	constructor(props) {
		super(props);
		this.state = {
			width: widthDevice,
			height: heightDevice,
			token: '',
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
			checkout: false,
			dataBook: [],
			arrBookGiuong: [],
			arrNumberGiuong: [],
			themVe: [],
			arrThemve: [],
			twoColumn: 'column',
			timeSync: (1000*60),
			clearTimeout: '',
			clearSync: ''
		};
	}

	getSyncArrVeNumber() {
		let that = this;
		this.state.clearSync = setInterval(() => {
			fetch(domain+'/api/api_sync_so_do_giuong.php?type=user&token='+that.state.token+'&adm_id='+that.state.infoAdm.adm_id+'&notId='+that.props.data.notId+'&day='+that.props.data.day, {
				headers: {
			    	'Cache-Control': cache
			  	}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				let dataVeNumber = responseJson.arrVeNumber;
				let dataBookGiuong = that.state.arrBookGiuong;
				for(var i = 0; i < dataBookGiuong.length; i++) {
					dataVeNumber[dataBookGiuong[i].numberGiuong].bvv_status = -2;
				}
				that.setState({
					arrVeNumber: dataVeNumber
				});
			})
			.catch((error) => {
				console.error(error);
			});
		}, this.state.timeSync);
	}

	async componentWillMount() {
		let results = await StorageHelper.getStore('infoUser');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		let time_sync = 60;
		let objTimeSync = await fetchData('adm_get_time_sync', {type: 'user'}, 'GET');
		if(objTimeSync.time_sync >= 60) {
			time_sync = objTimeSync.time_sync;
		}
		this.state.timeSync = (1000*time_sync);
		let data = [];
		this.setState({
			infoAdm: results,
			token: token,
			loading: true
		});

		try {
			let params = {
				token: token,
				adm_id: this.state.infoAdm.adm_id,
				not_id: this.props.data.notId,
				day: this.props.data.day,
			}
			data = await fetchData('adm_so_do_giuong', params, 'GET');
		} catch (e) {
			console.log(e);
			this.setState({
				loading: true
			});
		}
		let that = this;
		this.state.clearTimeout = setTimeout(() => {
			if(data.status != 404) {
				that.setState({
					results:data.so_do_giuong,
					arrVeNumber: data.so_do_giuong.arrVeNumber,
					resultsBen: that.props.data.dataBen,
					loading: false
				});
				return data.so_do_giuong;
			}else if(data.status == 404) {
				alert('Tài khoản của bạn đã được đăng nhập ở thiết bị khác.');
				Actions.welcome({type: 'reset'});
			}
		},1000);

		this.getSyncArrVeNumber();
	}

	componentWillUpdate(nextProps, nextState) {
		nextState.arrVeNumber = nextState.arrVeNumber;
	}

	componentWillUnmount() {
		clearTimeout(this.state.clearTimeout);
		clearInterval(this.state.clearSync);
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
					let arrNumberGiuong = this.state.arrNumberGiuong;

					if(dataGiuong.lock > 0) {
						htmlChild.push(
							<Col key={i+j} style={styles.borderCol}>
								<TouchableOpacity style={[styles.activeGiuong, styles.opacityBg]}>
									<Text style={[styles.textCenter, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
								</TouchableOpacity>
							</Col>
						);
					}else {
						if(dataGiuong.bvv_status == -2) {
							htmlChild.push(
								<Col key={i+j} style={styles.borderCol}>
									<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong, item[j].sdgct_label_full)} style={[styles.selectGiuongUser, styles.opacityBg]}>
										<Text style={[styles.textCenter, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
									</TouchableOpacity>
								</Col>
							);
						}else {
							if(dataGiuong.bvv_status == -2) {

								htmlChild.push(
									<Col key={i+j} style={styles.borderCol}>
										<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong,item[j].sdgct_label_full)} style={styles.opacityBg}>
											<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
										</TouchableOpacity>
									</Col>
								);
							}else {

									if(dataGiuong.bvv_status == 0) {
										htmlChild.push(
											<Col key={i+j} style={styles.borderCol}>
												<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong, item[j].sdgct_label_full)} style={styles.opacityBg}>
													<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
												</TouchableOpacity>
											</Col>
										);
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
				}
				html.push(<Grid key={i}>{htmlChild}</Grid>);
			}
		}
		return html;
	}

	async _setActiveGiuong(id, fullLabel) {
		let dataVe = this.state.arrVeNumber;

		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				numberGiuong: dataVe[id].bvv_number,
				bvv_id: dataVe[id].bvv_id,
			}
			let data = await fetchData('api_check_ve', params, 'GET');
			if(data.status != 404) {
				let setStatus = this.state.arrVeNumber;
				let dataBook = this.state.dataBook;
				let arrBookGiuong = this.state.arrBookGiuong;
				let arrNumberGiuong = this.state.arrNumberGiuong;

				if(data.status == 200) {
					setStatus[id].bvv_status = -2;
					setStatus[id].bvv_bex_id_a = this.props.data.benA;
					setStatus[id].bvv_bex_id_b = this.props.data.benB;
					setStatus[id].bvv_price = this.props.data.totalPriceInt;

					dataBook.push({labelFull: fullLabel, 'numberGiuong': parseInt(id), 'bvv_bex_id_a': this.props.data.benA, 'bvv_bex_id_b': this.props.data.benB, 'bvv_price': parseInt(this.props.data.totalPriceInt)});
					arrBookGiuong.push({'numberGiuong': parseInt(id)});
					arrNumberGiuong[parseInt(id)] = true;
					this.setState({
						arrVeNumber: setStatus,
						checkout: true,
						dataBook: dataBook,
						arrBookGiuong: arrBookGiuong,
						arrNumberGiuong: arrNumberGiuong
					});
				}else if(data.status == 201) {
					alert('Ghế đã có người đặt. Bạn vui lòng chọn ghế khác.');
					setStatus[id].bvv_status = 11;
					this.setState({
						arrVeNumber: setStatus
					});
				}
			}else if(data.status == 404) {
				alert('Tài khoản của bạn đã được đăng nhập ở thiết bị khác.');
				Actions.welcome({type: 'reset'});
			}
		} catch (e) {
			console.log(e);
			this.setState({
				loading: true
			});
		}

	}

	_unsetActiveGiuong(id, fullLabel){
		let checkGiuongCurrent = false;
		let that = this;
		if(this.state.checkout) {
			let arrBookGiuong = this.state.arrBookGiuong;
			for(var i in arrBookGiuong) {
				if(arrBookGiuong[i].numberGiuong == parseInt(id)) {
					checkGiuongCurrent = true;
					let dataBook = this.state.dataBook;
					let setStatus = this.state.arrVeNumber;
					let arrNumberGiuong = this.state.arrNumberGiuong;
					setStatus[id].bvv_status = 0;

					arrNumberGiuong.splice(arrBookGiuong[i].numberGiuong, 1);
					arrBookGiuong.splice(i, 1);
					dataBook.splice(i, 1);

					that.setState({
						arrVeNumber: setStatus,
						arrBookGiuong: arrBookGiuong,
						dataBook: dataBook,
						arrNumberGiuong: arrNumberGiuong
					});

					if(dataBook.length == 0 && arrBookGiuong.length == 0) {
						that.setState({checkout: false});
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
			twoColumn: twoColumn,
			width: widthDevice,
			height: heightDevice,
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
								<View style={{marginBottom: 10, width: (this.state.width-45)}}>
									{this.props.data.did_loai_xe == 1 &&
										<View style={{position: 'absolute', right: 0, top: 30}}>
											<Thumbnail size={60} source={require('../../Skin/Images/vip.png')} />
										</View>
									}
									<Text>Nơi đi & Nơi đến: <Text style={{fontWeight: 'bold'}}>{this.state.resultsBen[this.props.data.benA]}</Text> - <Text style={{fontWeight: 'bold'}}>{this.state.resultsBen[this.props.data.benB]}</Text></Text>
									<Text>Giá vé: <Text style={{fontWeight: 'bold'}}>{convertPrice} VNĐ</Text></Text>
									<Text>Tuyến: <Text style={{fontWeight: 'bold'}}>{this.props.data.tuyen}</Text></Text>
									<Text>Giờ xuất bến: <Text style={{fontWeight: 'bold'}}>{this.props.data.gio_xuat_ben + ' ' + this.props.data.day}</Text></Text>
									{this.props.data.laixe1 != '' && this.props.data.laixe1 != null &&
										<Text>Lái xe 1: <Text style={{fontWeight: 'bold'}}>{this.props.data.laixe1}</Text></Text>
									}
									{this.props.data.laixe2 != '' && this.props.data.laixe2 != null &&
										<Text>Lái xe 2: <Text style={{fontWeight: 'bold'}}>{this.props.data.laixe2}</Text></Text>
									}
									{this.props.data.tiepvien != '' &&
										<Text>Tiếp viên: <Text style={{fontWeight: 'bold'}}>{this.props.data.tiepvien}</Text></Text>
									}
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

					{this.state.loading && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }

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
						  <TouchableOpacity style={[styles.styleTabbars, {flex: 1, backgroundColor: '#ffdc42'}]} onPress={() => Actions.ListOrder({title: 'Danh sách đặt vé', data: {id_dieu_do: this.props.data.id_dieu_do, gio_xuat_ben: this.props.data.day+ ' ' + this.props.data.gio_xuat_ben, dataUser: this.state.infoAdm, dataBook: this.state.dataBook, dataBen: this.props.data.dataBen}})}>
						  		<View style={{flexDirection: 'row', flex: 1}}>
									<View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'transparent', paddingRight: 10, marginLeft: 50}}>
			 					  		<Text style={{color: '#000'}}>Tiếp tục</Text>
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
