import React, { Component } from 'react';
import {
	AppRegistry,
   StyleSheet,
   Dimensions,
   TextInput,
   View,
   ScrollView,
   TouchableOpacity
} from 'react-native';
import { Text, Button, Card, CardItem, Spinner, Icon } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';
import { Col, Row, Grid } from "react-native-easy-grid";

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;
const domain = 'http://hai-van.local';
const urlApi = domain+'/api/api_user_so_do_giuong.php';
const currentDate = new Date();

class ListNot extends Component {

	constructor(props) {
		super(props);
		let date = new Date();
		this.state = {
			results: [],
			date: date,
         day: date.getDate(),
         month: (date.getMonth()+1),
         year: date.getFullYear(),
         fullDate: date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear(),
			WEEKDAYS: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
         MONTHS: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
         'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
			showContentNot: false,
			loading: false,
			listItem1: this.props.data.listItem1,
			listItem2: this.props.data.listItem2
		};
	}

	onDateChange(date) {
      let currentSelectDate = date.date;
      this.setState({
         date: currentSelectDate,
         day: currentSelectDate.getDate(),
         month: (currentSelectDate.getMonth()+1),
         year: currentSelectDate.getFullYear(),
         fullDate: currentSelectDate.getDate()+'-'+(currentSelectDate.getMonth()+1)+'-'+currentSelectDate.getFullYear()
      });
   }

	_setDatePickerShow() {
		this.openModal();
   }

	_renderDatePicker() {
      return (
         <CalendarPicker
            selectedDate={this.state.date}
            onDateChange={(date) => this.onDateChange({date})}
            months={this.state.MONTHS}
            weekdays={this.state.WEEKDAYS}
            previousTitle='Tháng trước'
            nextTitle='Tháng sau'
            screenWidth={Dimensions.get('window').width}
            selectedBackgroundColor={'#5ce600'} />
      );
   }

	componentWillMount() {

		this.setState({
			loading: false,
			showContentNot: true
		});
		var that = this;
		console.log('xxx123123123');
		return fetch(urlApi+'?day='+this.props.data.fullDate+'&diem_a='+this.props.data.keyDiemDi+'&diem_b='+this.props.data.keyDiemDen)
		.then((response) => response.json())
		.then((responseJson) => {

			that.setState({
				results: responseJson.so_do_giuong,
				loading: true,
				showContentNot: false
			});
			console.log('xxxx');
			return responseJson.so_do_giuong;
		})
		.catch((error) => {
			that.setState({
				loading: true,
				showContentNot: false
			});
			console.error(error);
		});
	}

	_renderNot(results) {
		let data = [],
			that = this;
		Object.keys(results).map(function(key) {
			data.push({soChoTrong: results[key].tongSoChoConLai, tenSoDo: results[key].ten_so_do,price: results[key].price, tuyen: results[key].tuyen, not_id:results[key].not_id, id_dieu_do: results[key].id_dieu_do, did_gio_xuat_ben_that: results[key].did_gio_xuat_ben_that, not_tuy_id: results[key].not_tuy_id, ben_a: results[key].diem_di, ben_b: results[key].diem_den});
		});

      return data;
   }

	openModal(id) {
		this.refs.modal3.open();
	}

	closeModal(id) {
		this.refs.modal3.close();
	}

	_getNot() {
		checkData = false;
		if(this.props.data.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		}else {
			if(this.props.data.keyDiemDen == '') {
				checkData = false;
				alert('Vui lòng chọn Điểm Đến!');
			}else {
				checkData = true;
			}
		}

		if(checkData) {

			let newCurrentDate = currentDate.getDate()+(currentDate.getMonth()+1)+currentDate.getFullYear();
			let selectCurrentDate = this.state.day+this.state.month+this.state.year;
			if(newCurrentDate <= selectCurrentDate) {
		      var that = this;
				that.setState({
					loading: true,
					showContentNot: true
				});
				fetch(urlApi+'?day='+that.props.data.fullDate+'&diem_a='+this.props.data.keyDiemDi+'&diem_b='+this.props.data.keyDiemDen)
            .then((response) => response.json())
            .then((responseJson) => {
               that.setState({
                  results:responseJson.so_do_giuong,
                  loading: false,
						showContentNot: false
               });
               return responseJson.so_do_giuong;
            })
            .catch((error) => {
               that.setState({
                  loading: false,
						showContentNot: false
               });
               console.error(error);
            });
			}else {
				alert('Ngày tháng không hợp lệ!');
			}
		}
   }

	render() {
		let listItem1 = this.state.listItem1;
		let listItem2 = this.state.listItem2;
		if(this.props.data.keyDiemDi != undefined) {
			for(var i = 0; i < listItem1.length; i++) {
				listItem1[i].section = false;
				if(listItem1[i].value == this.props.data.keyDiemDi) {
					listItem1[i].section = true;
					break;
				}
			}
		}
		if(this.props.data.keyDiemDen != undefined) {
			for(var i = 0; i < listItem2.length; i++) {
				listItem2[i].section = false;
				if(listItem2[i].value == this.props.data.keyDiemDen) {
					listItem2[i].section = true;
					break;
				}
			}
		}
		console.log('----');
		console.log(this.state.results);
		if(this.state.loading) {
		let dataNot = this._renderNot(this.state.results);
	}
		return(
			<View style={styles.container}>
				<ScrollView>

					{ !this.state.loading? <Spinner /> : <Card dataArray={dataNot}
	                 renderRow={(dataNot) =>
	                   <CardItem>
									<TouchableOpacity style={{flexDirection: 'row'}} onPress={() => Actions.ViewSoDoGiuong({title: 'Chọn chỗ', data: {dataBen: this.state.dataBx, id_dieu_do: dataNot.id_dieu_do, totalPriceInt: dataNot.price, adm_id: this.props.data.adm_id, gio_xuat_ben: dataNot.did_gio_xuat_ben_that, notId:dataNot.not_id, day:this.state.fullDate, notTuyenId: dataNot.not_tuy_id, benA: dataNot.ben_a, benB: dataNot.ben_b}})}>
										<View style={{flex: 2}}>
											<Text style={{fontWeight: 'bold'}}>{dataNot.did_gio_xuat_ben_that}</Text>
											<Text>{this.state.dataBx[dataNot.ben_a]} -> {this.state.dataBx[dataNot.ben_b]}</Text>
											<Text>{dataNot.tenSoDo}</Text>
											<Text>Số chỗ trống: {dataNot.soChoTrong}</Text>
										</View>
										<View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',alignItems: 'center'}}>
											<View style={{padding: 5, alignItems: 'center', justifyContent: 'center'}}>
												<Text style={{fontWeight: 'bold', color: '#ff931f'}}>{dataNot.price} VNĐ</Text>
											</View>
  											<View style={{backgroundColor: '#f9af00', alignItems: 'center', justifyContent: 'center', padding: 10}}>
												<Text>Chọn Chỗ</Text>
											</View>
										</View>
									</TouchableOpacity>
	                   </CardItem>
	               }>
	           	</Card>}
			  	</ScrollView>

			  	<Modal style={[styles.modal, styles.modalPopup, {paddingTop: 50}]} position={"top"} ref={"modal3"} isDisabled={this.state.isDisabled}>
				  	<TouchableOpacity onPress={() => this.closeModal()} style={{width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10}}>
					  	<Icon name="ios-close-circle" />
				  	</TouchableOpacity>
				  	{this._renderDatePicker()}
			  	</Modal>
         </View>
		);
	}
}

const styles = StyleSheet.create({
   container: {
		flex: 1,
      marginTop: 64,
      position: 'relative',
   },
   contentAbsolute: {
      position: 'absolute',
      top: 0
   },
   selectedDate: {
      backgroundColor: 'rgba(0,0,0,0)',
      color: '#000',
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

export default ListNot
