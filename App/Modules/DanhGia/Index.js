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
import {domain,cache} from '../../Config/common';
import { Container, Content, InputGroup, Icon, Input, Button, Spinner, Card, CardItem, Badge } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
import  Rating from 'react-native-easy-rating';
import Modal from 'react-native-modalbox';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

const selectStar = require('../../../App/Skin/Images/select_star.png');
const unSelectStar = require('../../../App/Skin/Images/unselect_star.png');

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

      fetch(url+'?type=0&user_id='+this.props.data.adm_id, {
			headers: {
				'Cache-Control': cache
			}
		})
	      .then((response) => response.json())
	      .then((responseJson) => {
				that.setState({
					results: responseJson.dataRating,
					dataBen: responseJson.dataBen,
					loading: false
				});
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

	_saveRating() {
		let rating = this.state.rating;
		if(rating == 0) {
			rating = 5;
		}
		let params = '?type=1&user_id='+ this.props.data.adm_id+'&did_id='+this.state.did_id+'&rat_values='+rating+'&rat_comment='+this.state.textRating;

		fetch(url+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			alert('Cảm ơn bạn đã gửi đánh giá cho chúng tôi.');
		})
		.catch((error) => {
			//console.error(error);
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
