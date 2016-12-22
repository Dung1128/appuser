import React, { Component, PropTypes } from 'react';
import { AppRegistry, StyleSheet, Dimensions, Platform, Image, AsyncStorage, ScrollView } from 'react-native';
import {
   Container,
   Header,
   Title,
   Content,
   Footer,
   FooterTab,
   Button,
   Text,
   View,
   Icon,
   List,
   ListItem
} from 'native-base';

import { Actions } from 'react-native-router-flux';

import sidebarTheme from './theme-sidebar';
import styles from './style';

const logo = require('../../Skin/Images/logo.png');
const {width, height} = Dimensions.get('window');

const tempInterval = '';
class SideBar extends Component {

   constructor(props) {
      super(props);
      this.state = {
         checkLogin: false,
			dataUser: []
      };
   }

   _onPressLogout() {
      AsyncStorage.removeItem('infoUser');
		this.setState({
			checkLogin: false,
			dataUser: []
		});
		Actions.welcome({type: 'reset'});
   }

	componentDidMount() {
		let that = this;
		tempInterval = setInterval(function() {
			AsyncStorage.getItem('infoUser').then((data) => {
				if(data != null) {
					that.setState({
						checkLogin: true,
						dataUser: JSON.parse(data)
					});
					clearInterval(tempInterval);
				}
			}).done();
		}, 500);
	}

	componentWillUpdate() {
		let that = this;
		tempInterval = setInterval(function() {
			AsyncStorage.getItem('infoUser').then((data) => {
				if(data != null) {
					that.setState({
						checkLogin: true,
						dataUser: JSON.parse(data)
					});
					clearInterval(tempInterval);
				}
			}).done();
		}, 500);
	}

   render() {
      return(
         <View theme={sidebarTheme} style={styles.sidebar}>
            <Header style={styles.drawerCover}>
              <Image
                square
                style={{resizeMode: 'contain', height: 30, marginTop: -15}}
                source={logo}
              />
            </Header>

				<View style={{height: (height-71), overflow: 'hidden'}}>
					<ScrollView>
						{this.state.checkLogin &&
							<View style={{alignItems: 'center'}}>
								<Text style={{color: '#fff'}}>Xin Chào: {this.state.dataUser.use_phone}</Text>
							</View>
						}
		           	<List>

							{!this.state.checkLogin &&
							 <ListItem button iconLeft onPress={() => { this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
								  <View style={[styles.iconContainer]}>
									 <Icon name="ios-contact" style={styles.sidebarIcon} />
								  </View>
								  <Text style={styles.text}>Đăng Nhập</Text>
								</View>
							</ListItem>
							}

							<ListItem button iconLeft onPress={() => { Actions.HuongDanSuDung({title: 'Hướng dẫn sử dụng'}); this.props.closeDrawer(); }}>
						 		<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
							  			<Icon name="ios-heart" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Hướng dẫn sử dụng</Text>
						 		</View>
					 		</ListItem>

							<ListItem button iconLeft onPress={() => { Actions.welcome({title: 'Trang Chủ'}); this.props.closeDrawer(); }}>
						 		<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
							  			<Icon name="ios-heart" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Đặt vé</Text>
						 		</View>
					 		</ListItem>

							{this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); Actions.LichSu({title: 'Lịch sử đặt vé', data: {adm_id: this.state.dataUser.adm_id}})}}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-bookmark" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Lịch sử</Text>
									</View>
								</ListItem>
							}
							{this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); Actions.DanhGia({title: 'Lịch sử đặt vé', data: {adm_id: this.state.dataUser.adm_id}})}}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-ribbon" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Đánh giá</Text>
									</View>
								</ListItem>
							}

						  	<ListItem button iconLeft onPress={() => {Actions.ListNews({title: 'Danh sách tin tức'}); this.props.closeDrawer();}}>
							 	<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
									  <Icon name="ios-happy" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Tin tức</Text>
							 	</View>
						 	</ListItem>

						 	<ListItem button iconLeft onPress={() => {this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
							  		<View style={[styles.iconContainer]}>
								 		<Icon name="ios-megaphone" style={styles.sidebarIcon} />
							  		</View>
							  		<Text style={styles.text}>Khuyến mãi</Text>
								</View>
							</ListItem>

							<ListItem button iconLeft onPress={() => { Actions.Contact({title: 'Liên Hệ'}); this.props.closeDrawer(); }}>
						  		<View style={styles.listItemContainer}>
							 		<View style={[styles.iconContainer]}>
										<Icon name="ios-contacts" style={styles.sidebarIcon} />
							 		</View>
							 		<Text style={styles.text}>Liên hệ</Text>
						  		</View>
					  		</ListItem>

					  		<ListItem button iconLeft onPress={() => { Actions.gopy({title: 'Góp Ý'}); this.props.closeDrawer(); }}>
						 		<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
							  			<Icon name="ios-heart" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Góp ý</Text>
						 		</View>
					 		</ListItem>

							{this.state.checkLogin &&
			             	<ListItem button iconLeft onPress={() => {this.props.closeDrawer(); this._onPressLogout();}}>
			                  <View style={styles.listItemContainer}>
			                    <View style={[styles.iconContainer]}>
			                      <Icon name="ios-contact" style={styles.sidebarIcon} />
			                    </View>
			                    <Text style={styles.text}>Đăng Xuất</Text>
			                  </View>
			               </ListItem>
							}
		           	</List>
					</ScrollView>
					<View style={{position: 'absolute', bottom: 0, width: width*.8, left: 0, backgroundColor: '#fff', alignItems: 'center', padding: 10}}>
				  		<Text style={[styles.text, {color: '#777'}]}>Version: 1.1</Text>
				  	</View>
				</View>
         </View>
      );
   }
}

export default SideBar
