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
import { Col, Row, Grid } from "react-native-easy-grid";


const domain = 'http://hai-van.local';
const urlApi = domain+'/api/api_adm_so_do_giuong.php';
const currentDate = new Date();

class HomeIOS extends Component {
   constructor(props) {
      super(props);
      let date = new Date();
      this.state = {
         date: date,
         day: date.getDate(),
         month: (date.getMonth()+1),
         year: date.getFullYear(),
         fullDate: date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear(),
         WEEKDAYS: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
         MONTHS: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
         'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
         results: [],
         showDatePicker: false,
         optionSelect: '',
         arrSoDoGiuong: [],
         loading: true,
			isDisabled: false
      }
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
      this.setState({
         showDatePicker: true
      });
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

   _renderNot(results) {
      let data = [],
          countData = results.length;
      for(var i = 0; i < countData; i++) {
         data.push({key:results[i].not_id, gio_xuat_ben: this.state.fullDate+' '+results[i].did_gio_xuat_ben_that, label: results[i].did_gio_xuat_ben_that+' ← ' +results[i].did_gio_xuat_ben+' '+results[i].tuy_ma, not_tuy_id: results[i].not_tuy_id, ben_a: results[i].tuy_ben_a, ben_b: results[i].tuy_ben_b});
      }

      return data;
   }

   searchGiuong() {
      var that = this;
      that.setState({
         loadingSDG: true
      });
      return fetch(urlApi+'?not_id='+this.state.optionSelect.key+'&day='+this.state.fullDate)
            .then((response) => response.json())
            .then((responseJson) => {
               that.setState({
                  arrSoDoGiuong:responseJson.so_do_giuong,
                  loadingSDG: false
               });
               return responseJson.so_do_giuong;
            })
            .catch((error) => {
               console.error(error);
            });
   }

	componentDidMount() {
		let newCurrentDate = currentDate.getDate()+(currentDate.getMonth()+1)+currentDate.getFullYear();
		let selectCurrentDate = this.state.day+this.state.month+this.state.year;
		if(newCurrentDate <= selectCurrentDate) {
			var that = this;
			that.setState({
				loading: true
			});
	      return fetch(urlApi+'?day='+that.state.fullDate)
	            .then((response) => response.json())
	            .then((responseJson) => {
	               that.setState({
	                  results:responseJson.so_do_giuong,
	                  loading: false
	               });
	               return responseJson.so_do_giuong;
	            })
	            .catch((error) => {
	               that.setState({
	                  loading: false
	               });
	               console.error(error);
	            });
		}
	}

   _getNot() {
		let newCurrentDate = currentDate.getDate()+(currentDate.getMonth()+1)+currentDate.getFullYear();
		let selectCurrentDate = this.state.day+this.state.month+this.state.year;
		if(newCurrentDate <= selectCurrentDate) {
	      var that = this;
			that.setState({
				loading: true
			});
	      return fetch(urlApi+'?day='+that.state.fullDate)
	            .then((response) => response.json())
	            .then((responseJson) => {
	               that.setState({
	                  results:responseJson.so_do_giuong,
	                  loading: false
	               });
	               return responseJson.so_do_giuong;
	            })
	            .catch((error) => {
	               that.setState({
	                  loading: false
	               });
	               console.error(error);
	            });
		}else {
			alert('Ngày tháng không hợp lệ!');
		}
   }

	openModal(id) {
		this.refs.modal3.open();
	}

	closeModal(id) {
		this.refs.modal3.close();
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

   render() {

      let dataNot = this._renderNot(this.state.results);
      return(
         <View style={styles.container}>
				<View style={{alignItems: 'center', marginTop: 5}}><Text>Bạn vui lòng chọn ngày xuất phát</Text></View>
				<View style={{flexDirection: 'row', padding: 30, paddingTop: 10}}>
					<Text style={{flex: 4, borderWidth:1, borderColor:'#ccc', padding:10, height:39}} onPress={() => this._setDatePickerShow()}>{this.state.fullDate}</Text>
					<Button style={{flex: 1, borderRadius: 0}} onPress={() => {this._getNot()}}><Icon name='ios-search-outline' /></Button>
				</View>
				<ScrollView>
					{ this.state.loading && <Spinner /> }
					{ !this.state.loading && <Card dataArray={dataNot}
	                 renderRow={(dataNot) =>
	                   <CardItem onPress={() => Actions.ViewSoDoGiuong({title: 'Chọn chỗ', data: {adm_id: this.props.data.adm_id, gio_xuat_ben: dataNot.gio_xuat_ben, notId:dataNot.key, day:this.state.fullDate, notTuyenId: dataNot.not_tuy_id, benA: dataNot.ben_a, benB: dataNot.ben_b}})}>
	                       <Text>{dataNot.label}</Text>
	                   </CardItem>
	               }>
	           </Card>}
			  </ScrollView>

			  <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 4}]}>
					  <Text style={{color: 'red'}}>Chọn Chuyến</Text>
				  </TouchableOpacity>
				  <TouchableOpacity onPress={() => Actions.LichSu({title: 'Lịch sử đặt vé', data: {adm_id: this.props.data.adm_id, day:this.state.fullDate}}) } style={[styles.styleTabbars, {flex: 4}]}>
					  <Text>Lịch Sử</Text>
				  </TouchableOpacity>
				  <TouchableOpacity onPress={() => Actions.DanhGia({title: 'Đánh giá', data: {adm_id: this.props.data.adm_id, day:this.state.fullDate}})} style={[styles.styleTabbars, {flex: 4}]}>
					  <Text>Đánh Giá</Text>
				  </TouchableOpacity>
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
					  <Icon name="ios-more" />
					  {this.state.showDropdown && <View style={{position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
						  <View style={{flexDirection: 'row', margin: 10}}>
							  <Text onPress={() => [Actions.LichSu({title: 'Lịch sử đặt vé', data: {adm_id: this.props.data.adm_id, day:this.state.fullDate}}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Lịch Sử</Text>
							  <TouchableOpacity style={{flex: 1,backgroundColor: '#ff4500', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-close-circle-outline" style={{color: '#fff'}} /></TouchableOpacity>
						  </View>
						  <View style={{flexDirection: 'row', margin: 10}}>
							  <Text onPress={() => [Actions.DanhGia({title: 'Đánh giá', data: {adm_id: this.props.data.adm_id, day:this.state.fullDate}}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Đánh Giá</Text>
							  <TouchableOpacity style={{flex: 1,backgroundColor: '#00bfff', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-cloud-done-outline" style={{color: '#fff'}} /></TouchableOpacity>
						  </View>
					  </View>}
				  </TouchableOpacity>
			  </View>

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
      position: 'relative'
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
	styleTabbars: {
		flex: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f7f7f7'
	},
});

export default HomeIOS
