import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput
} from 'react-native';
import { Container, Content, InputGroup, Icon, Input, Button, Spinner, Card, CardItem, Badge } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
import  Rating from 'react-native-easy-rating';
import Modal from 'react-native-modalbox';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

const selectStar = require('../../../App/Skin/Images/select_star.png');
const unSelectStar = require('../../../App/Skin/Images/unselect_star.png');

const domain = 'http://haivanexpress.com';
const url = domain+'/api/api_user_rating.php';
class DanhGia extends Component {

	constructor(props) {
		super(props);
		this.state = {
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
			hanh_trinh: ''
		};
	}

	_getRating() {
		this.setState({
			loading: true
		});
		var that = this;

      return fetch(url+'?type=0&day='+this.props.data.day+'&user_id='+this.props.data.adm_id)
	      .then((response) => response.json())
	      .then((responseJson) => {
				that.setState({
					results: responseJson.dataRating,
					dataBen: responseJson.dataBen,
					loading: false
				});
	         return responseJson.dataRating;
	      })
	      .catch((error) => {
	         console.error(error);
	      });
   }

	componentWillMount() {
		this._getRating();
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

		for(var i = 0; i < data.length; i++) {
			var item = data[i];
			htmlItem.push(
				<CardItem key={item.dav_did_id+i}>
					<TouchableOpacity onPress={this._getFormRating.bind(this, item.dav_did_id, dataBen[item.tuy_ben_a], dataBen[item.tuy_ben_b], dataBen[item.dav_diem_a], dataBen[item.dav_diem_b], item.gio_xuat_ben, item.tuy_hanh_trinh)}>
						<View style={{flex: 5}}>
							<Text style={{marginBottom: 10}}>Tuyến đi: {dataBen[item.tuy_ben_a]} -> {dataBen[item.tuy_ben_b]}</Text>
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

	_getFormRating(did_id, benA, benB, benAA, benBB, gio_xuat_ben, hanh_trinh) {
		console.log('DidID: ' + did_id);
		this.setState({
			did_id: did_id,
			benA: benA,
			benB: benB,
			benAA: benAA,
			benBB: benBB,
			hanh_trinh: hanh_trinh,
			gio_xuat_ben: gio_xuat_ben
		})
		this.openModal();
	}

	_saveRating() {
		let rating = this.state.rating;
		let params = '?type=1&user_id='+ this.props.data.adm_id+'&did_id='+this.state.did_id+'&rat_values='+this.state.rating+'&rat_comment='+this.state.textRating;
		console.log(url+encodeURI(params));
		fetch(url+params)
		.then((response) => response.json())
		.then((responseJson) => {
			return responseJson;
		})
		.catch((error) => {
			console.error(error);
		});
		this.closeModal();
	}

   render() {
		let renderHtml = this.getListRating(this.state.results, this.state.dataBen);
      return(
         <View style={styles.container}>
				  <ScrollView>
					  {this.state.loading? <Text>Loading...</Text> : renderHtml }
				 </ScrollView>

				<View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
					{this.props.data.notId > 0 &&
					 <TouchableOpacity onPress={() => Actions.ViewSoDoGiuong({title: 'Chọn chỗ', data: {adm_id:this.props.data.adm_id, gio_xuat_ben: this.props.data.gio_xuat_ben, notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId, benA: this.props.data.benA, benB: this.props.data.benB}}) } style={[styles.styleTabbars, {flex: 4}]}>
						 <Text>Chọn Chỗ</Text>
					 </TouchableOpacity>}
					 {!this.props.data.notId &&
				  <TouchableOpacity onPress={() => Actions.home({title: 'Chọn Chuyến', data: {adm_id:this.props.data.adm_id, day:this.props.data.day}}) } style={[styles.styleTabbars, {flex: 4}]}>
					  <Text>Chọn Chuyến</Text>
				  </TouchableOpacity>}
 				  <TouchableOpacity onPress={() => Actions.LichSu({title: 'Lịch Sử Đặt Vé', data: {adm_id: this.props.data.adm_id, day:this.props.data.day, gio_xuat_ben: this.props.data.gio_xuat_ben, notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId, benA: this.props.data.benA, benB: this.props.data.benB}}) } style={[styles.styleTabbars, {flex: 4}]}>
 					  <Text>Lịch Sử</Text>
 				  </TouchableOpacity>
 				  <TouchableOpacity style={[styles.styleTabbars, {flex: 4}]}>
 					  <Text style={{color: 'red'}}>Đánh Giá</Text>
 				  </TouchableOpacity>
 				  <TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
 					  <Icon name="ios-more" />
 					  {this.state.showDropdown && <View style={{position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
 						  <View style={{flexDirection: 'row', margin: 10}}>
 							  <Text onPress={() => [this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Lịch Sử</Text>
 							  <TouchableOpacity style={{flex: 1,backgroundColor: '#ff4500', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-close-circle-outline" style={{color: '#fff'}} /></TouchableOpacity>
 						  </View>
 						  <View style={{flexDirection: 'row', margin: 10}}>
 							  <Text style={{padding: 10, flex: 6}}>Đánh Giá</Text>
 							  <TouchableOpacity style={{flex: 1,backgroundColor: '#00bfff', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-cloud-done-outline" style={{color: '#fff'}} /></TouchableOpacity>
 						  </View>
 					  </View>}
 				  </TouchableOpacity>
 			  </View>

			  <Modal style={[styles.modal, styles.modalPopup, {paddingTop: 50}]} position={"top"} ref={"modal3"} isDisabled={this.state.isDisabled}>
				  	<TouchableOpacity onPress={() => this.closeModal()} style={{width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10}}>
					  	<Icon name="ios-close-circle" />
				  	</TouchableOpacity>
					<View style={{flexDirection: 'column', width: widthDevice, padding: 20}}>
					  	<Text style={{marginBottom: 20}}>Tuyến đi: <Text style={{fontWeight: 'bold'}}>{this.state.benA} -> {this.state.benB}</Text></Text>
						<Text style={{marginBottom: 20}}>Nơi đi & Nơi đến: <Text style={{fontWeight: 'bold'}}>{this.state.benAA} -> {this.state.benBB}</Text></Text>
		  				<Text style={{marginBottom: 20}}>Thời gian: <Text style={{fontWeight: 'bold'}}>{this.state.gio_xuat_ben}</Text></Text>
						<Text>Viết đánh giá:</Text>
					</View>
					<View style={{marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', flexDirection: 'row'}}>
						<Input placeholder="Viết đánh giá" style={{height: 100}} multiline={true} numberOfLines={4} onChange={(event) => this.setState({textRating: event.nativeEvent.text})} />
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
					<View style={{flexDirection: 'row', marginTop: 30}}>
						<Button block success onPress={() => this._saveRating()}>Gửi Đánh Giá</Button>
					</View>
			  </Modal>
         </View>
      );
   }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 64,
		height: heightDevice,
		paddingBottom: 50
	},
	styleTabbars: {
		flex: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f7f7f7'
	},
	modal: {
		alignItems: 'center',
		top: 80,
		paddingRight: 20,
		paddingLeft: 20
	},
	modalPopup: {
	},
});

export default DanhGia
