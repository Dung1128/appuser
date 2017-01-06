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
			infoAdm: []
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
				alert('Tài khoản của bạn đã được đăng nhập ở thiết bị khác.');
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
						<TouchableOpacity onPress={this._getFormRating.bind(this, item.dav_did_id, dataBen[item.tuy_ben_a], dataBen[item.tuy_ben_b], dataBen[item.dav_diem_a], dataBen[item.dav_diem_b], item.gio_xuat_ben, item.tuy_hanh_trinh, item.laixe1, item.laixe2, item.tiepvien, item.number_ghe)}>
							<View style={{flex: 5}}>
								<Text style={{marginBottom: 10}}>Nơi đi & Nơi đến: {dataBen[item.dav_diem_a]} -> {dataBen[item.dav_diem_b]}</Text>
								<Text style={{marginBottom: 10}}>Thời gian: {item.gio_xuat_ben}</Text>
								<Text style={{marginBottom: 10}}>Số ghế: {item.number_ghe}</Text>
								<Text style={{marginBottom: 5}}>Đánh giá: {item.totalRating}/5</Text>
								<Rating
		  						    rating={item.totalRating}
		  						    max={5}
		  						    iconWidth={24}
		  						    iconHeight={24}
		  						    iconSelected={selectStar}
		  						    iconUnselected={unSelectStar}
									 editable={false}/>
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

	_getFormRating(did_id, benA, benB, benAA, benBB, gio_xuat_ben, hanh_trinh, laixe1, laixe2, tiepvien, number_ghe) {
		this.setState({
			did_id: did_id,
			benA: benA,
			benB: benB,
			benAA: benAA,
			benBB: benBB,
			hanh_trinh: hanh_trinh,
			gio_xuat_ben: gio_xuat_ben,
			laixe1: laixe1,
			laixe2: laixe2,
			tiepvien: tiepvien,
			number_ghe: number_ghe
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
			alert('Cảm ơn bạn đã gửi đánh giá cho chúng tôi.');
		} catch (e) {
			console.log(e);
		}
		this.closeModal();
	}

   render() {
      return(
         <View style={styles.container}>
				  <ScrollView>
					  {this.state.loading &&
						  <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View>
					  }
					  {!this.state.loading &&
						  this.getListRating(this.state.results, this.state.dataBen)
					  }
				 </ScrollView>

			  <Modal style={[styles.modal, styles.modalPopup, {paddingTop: 50}]} position={"top"} ref={"modal3"} isDisabled={this.state.isDisabled}>

				  	<TouchableOpacity onPress={() => this.closeModal()} style={{width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10}}>
					  	<Icon name="ios-close-circle" />
				  	</TouchableOpacity>
					<View style={{paddingBottom: 50}}>
						<ScrollView>
							<View style={{flexDirection: 'column', width: widthDevice}}>
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
							<View style={{marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', flexDirection: 'row'}}>
								<Input placeholder="Viết đánh giá" style={{height: 60}} multiline={true} numberOfLines={4} onChange={(event) => this.setState({textRating: event.nativeEvent.text})} />
							</View>
							<View style={{flexDirection: 'row'}}>
								<Text style={{flex: 1, marginTop: 5}}>Chọn đánh giá: </Text>
								<Rating
									style={{flex: 2}}
									rating={5}
									max={5}
									iconWidth={24}
									iconHeight={24}
									iconSelected={selectStar}
									iconUnselected={unSelectStar}
									onRate={(rating) => this.setState({rating: rating})}/>
							</View>
								<Button block success style={{marginTop: 20}} onPress={() => this._saveRating()}>Gửi Đánh Giá</Button>
						</ScrollView>
					</View>
			  </Modal>
         </View>
      );
   }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 59,
		height: heightDevice,
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
