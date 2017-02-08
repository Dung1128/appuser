import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  AsyncStorage
} from 'react-native';
import {domain,cache} from '../../Config/common';
import fetchData from '../../Components/FetchData';
import { Container, Content, InputGroup, Icon, Input, Button, Spinner, Card, CardItem, Badge } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
import  Rating from 'react-native-easy-rating';
import Modal from 'react-native-modalbox';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;
import StorageHelper from '../../Components/StorageHelper';
const selectStar = require('../../../App/Skin/Images/select_star.png');
const unSelectStar = require('../../../App/Skin/Images/unselect_star.png');

const url = domain+'/api/api_user_rating.php';
class DanhGia extends Component {

	constructor(props) {
		super(props);
		this.state = {
			token: '',
			height: heightDevice,
			width: widthDevice,
			showDropdown: false,
			results: [],
			dataBen: [],
			rating: 0,
			benA: '',
			benB: '',
			benAA: '',
			benBB: '',
			gio_xuat_ben: '',
			did_id: '',
			textRating: '',
			hanh_trinh: '',
			infoAdm: [],
			rat_values: 5
		};
	}

	async _getRating(token, admId) {
		let data = [];
		try {
			let params = {
				token: token,
				type: '0',
				user_id: admId,
			}
			data = await fetchData('user_rating', params, 'GET');
		} catch (e) {
			console.log(e);
		}

		let that = this;
		setTimeout(() => {
			if(data.status != 404) {
				that.setState({
					results: (data.dataRating != null)? data.dataRating: [],
					dataBen: (data.dataBen != null)? data.dataBen : [],
					loading: false
				});
			}else if(data.status == 404) {
				alert(data.mes);
				Actions.welcome({type: 'reset'});
			}
		}, 500);

   }

	async componentWillMount() {
		let results = await StorageHelper.getStore('infoUser');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		this.setState({
			infoAdm: results,
			token: token,
			loading: true
		});

		this._getRating(token, admId);
	}

	_handleDropdown() {
		if(this.state.showDropdown) {
			this.setState({
				showDropdown: false
			});
		}else {
			this.setState({
				showDropdown: true
			});
		}
	}

	getListRating(data, dataBen) {
		let html = [],
			htmlItem = [];

		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var item = data[i];
				htmlItem.push(
					<CardItem key={item.dav_did_id+i}>
						<TouchableOpacity onPress={this._getFormRating.bind(this, item.ten_bks, item.dav_did_id, dataBen[item.tuy_ben_a], dataBen[item.tuy_ben_b], item.diem_a, item.diem_b, item.gio_xuat_ben, item.tuy_hanh_trinh, item.laixe1, item.laixe2, item.tiepvien, item.number_ghe, item.disable, item.rat_comment, item.rat_values)}>
							<View style={{flex: 5}}>
								<Text style={{marginBottom: 10}}>Nơi đi & Nơi đến: <Text style={{fontWeight: 'bold'}}>{item.diem_a} -> {item.diem_b}</Text></Text>
								<Text style={{marginBottom: 10}}>Thời gian: <Text style={{fontWeight: 'bold'}}>{item.gio_xuat_ben}</Text></Text>
								<Text style={{marginBottom: 10}}>Số ghế: <Text style={{fontWeight: 'bold'}}>{item.number_ghe}</Text></Text>
								<Text style={{marginBottom: 5}}>Đánh giá: <Text style={{fontWeight: 'bold'}}>{item.totalRating}/5</Text></Text>
								<View style={{width: 24*item.totalRating, overflow: 'hidden'}}>
									<Rating
		  						    rating={item.totalRating}
		  						    max={5}
		  						    iconWidth={24}
		  						    iconHeight={24}
		  						    iconSelected={selectStar}
		  						    iconUnselected={unSelectStar}
									 editable={false}/>
								</View>
							</View>
						</TouchableOpacity>
					</CardItem>
				);
			}
		}else {
			htmlItem.push(
				<CardItem key="null">
					<View style={{flex: 5, alignItems: 'center'}}>
						<Text style={{color: 'red'}}>Bạn chưa có chuyến đi nào. Không thể đánh giá!</Text>
					</View>
				</CardItem>
			);
		}
		html.push(
			<Card key="card">
				{htmlItem}
			</Card>
		);
		return html;

	}

	openModal(id) {
		this.refs.modal3.open();
	}

	closeModal(id) {
		this.refs.modal3.close();
	}

	_getFormRating(ten_bks, did_id, benA, benB, benAA, benBB, gio_xuat_ben, hanh_trinh, laixe1, laixe2, tiepvien, number_ghe, disable, rat_comment, rat_values) {
		this.setState({
			did_id: did_id,
			benA: benA,
			benB: benB,
			benAA: benAA,
			benBB: benBB,
			ten_bks: ten_bks,
			hanh_trinh: hanh_trinh,
			gio_xuat_ben: gio_xuat_ben,
			laixe1: laixe1,
			laixe2: laixe2,
			tiepvien: tiepvien,
			number_ghe: number_ghe,
			disable: disable,
			rat_comment: rat_comment,
			rat_values: rat_values
		})
		this.openModal();
	}

	async _saveRating() {
		let rating = this.state.rating;
		if(rating == 0) {
			rating = 5;
		}

		try {
			let params = {
				token: this.state.token,
				type: '1',
				user_id: this.state.infoAdm.adm_id,
				did_id: this.state.did_id,
				rat_values: rating,
				rat_comment: this.state.textRating,
			}
			let data = await fetchData('user_rating', params, 'GET');
			this._getRating(this.state.token, this.state.infoAdm.adm_id);
			alert(data.mes);
		} catch (e) {
			console.log(e);
		}
		this.closeModal();
	}

	_onLayout = event => {
		let heightDevice = Dimensions.get('window').height;
		let widthDevice = Dimensions.get('window').width;
		this.setState({
			height: heightDevice,
			width: widthDevice
		});
	}

   render() {
      return(
         <View style={[styles.container, {height: this.state.height}]} onLayout={this._onLayout}>
				  <ScrollView keyboardShouldPersistTaps="always">
					  {this.state.loading &&
						  <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View>
					  }
					  {!this.state.loading &&
						  this.getListRating(this.state.results, this.state.dataBen)
					  }
				 </ScrollView>

			  <Modal style={[styles.modal, styles.modalPopup, {paddingTop: 50, height: (this.state.height-20)}]} position={"top"} ref={"modal3"} swipeToClose={false}>

				  	<TouchableOpacity onPress={() => this.closeModal()} style={{width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10}}>
					  	<Icon name="ios-close-circle" />
				  	</TouchableOpacity>
					<View style={{paddingBottom: 50}}>
						<ScrollView keyboardShouldPersistTaps="always">
							<View style={{width: (this.state.width-20), paddingBottom: 50}}>

								<View style={{flexDirection: 'column'}}>
									{this.state.ten_bks != '' &&
										<Text style={{marginBottom: 10}}>Biển kiểm soát: <Text style={{fontWeight: 'bold'}}>{this.state.ten_bks}</Text></Text>
									}
									{this.state.laixe1 != '' &&
										<Text style={{marginBottom: 10}}>Lái xe 1: <Text style={{fontWeight: 'bold'}}>{this.state.laixe1}</Text></Text>
									}
									{this.state.laixe2 != '' &&
										<Text style={{marginBottom: 10}}>Lái xe 2: <Text style={{fontWeight: 'bold'}}>{this.state.laixe2}</Text></Text>
									}
									{this.state.tiepvien != '' &&
										<Text style={{marginBottom: 10}}>Tiếp viên: <Text style={{fontWeight: 'bold'}}>{this.state.tiepvien}</Text></Text>
									}
									<Text style={{marginBottom: 10}}>Nơi đi & Nơi đến: <Text style={{fontWeight: 'bold'}}>{this.state.benAA} -> {this.state.benBB}</Text></Text>
									<Text style={{marginBottom: 10}}>Số ghế: <Text style={{fontWeight: 'bold'}}>{this.state.number_ghe}</Text></Text>
					  				<Text style={{marginBottom: 10}}>Thời gian: <Text style={{fontWeight: 'bold'}}>{this.state.gio_xuat_ben}</Text></Text>
								</View>

								{this.state.disable &&
									<View>
										<View style={{flexDirection: 'row'}}>
											<Text style={{flex: 1, marginTop: 5}}>Bạn đã đánh giá: </Text>
											<Rating
												style={{flex: 2}}
												rating={this.state.rat_values}
												max={5}
												iconWidth={24}
												iconHeight={24}
												iconSelected={selectStar}
												iconUnselected={unSelectStar}
												editable={false}/>
										</View>
										<View style={{marginTop: 10, marginBottom: 20}}>
											<Text style={{marginBottom: 10}}>Nội dung đánh giá:</Text>
											<Text style={{fontWeight: 'bold'}}>{this.state.rat_comment}</Text>
										</View>
									</View>
								}

								{!this.state.disable &&
									<View>
										<View style={{marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', flexDirection: 'row'}}>

											<Input placeholder="Viết đánh giá" style={{height: 60}} multiline={true} numberOfLines={4} onChange={(event) => this.setState({textRating: event.nativeEvent.text})} />

										</View>
										<View style={{flexDirection: 'row'}}>
											<Text style={{flex: 1, marginTop: 5}}>Chọn đánh giá: </Text>
											<Rating
												style={{flex: 2}}
												rating={this.state.rat_values}
												max={5}
												iconWidth={24}
												iconHeight={24}
												iconSelected={selectStar}
												iconUnselected={unSelectStar}
												onRate={(rating) => this.setState({rating: rating})}/>
										</View>
										<Button block success style={{marginTop: 20}} onPress={() => this._saveRating()}>Gửi Đánh Giá</Button>
									</View>
								}
							</View>
						</ScrollView>
					</View>
			  </Modal>
         </View>
      );
   }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 59
	},
	modal: {
		alignItems: 'center',
		top: 60,
	},
	modalPopup: {
		padding: 10
	},
});

export default DanhGia
