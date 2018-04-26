import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    AsyncStorage,
    View,
    Text,
    TouchableOpacity,
    WebView,
    Dimensions,
    ScrollView
} from 'react-native';
import { Thumbnail } from 'native-base'
import { domain, cache, colorLogo } from '../../Config/common';
import StorageHelper from '../../Components/StorageHelper';
import { Button, Icon, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
const { height, width } = Dimensions.get('window');
const limit = 24;

class ListPromotion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            webViewHeight: 0,
            infoAdm: [],
            token: '',
            listProEnd: [],
            listPro: [],
            page: 1,
            totalPage: 0,
        };
    }

    _backPayment() {
        AsyncStorage.getItem('infoUser').then((data) => {
            let results = JSON.parse(data);
            if (results != null) {
                Actions.home({ title: 'Chọn Chuyến', data: results });
            } else {
                Actions.welcome();
            }
        }).done();
    }

    async componentWillMount() {

        let results = await StorageHelper.getStore('infoUser');
        results = JSON.parse(results);
        let admId = results.adm_id;
        let token = results.token;
        let page = this.state.page;
        this.setState({
            infoAdm: results,
            token: token
        });

        var that = this;
        // console.log(domain + '/api/user_v1/api_get_list_promotion.php?token=' + token + '&user_id=' + admId + '&used=1' + '&page=' + page + '&limit=' + limit);

        fetch(domain + '/api/user_v1/api_get_list_promotion.php?token=' + token + '&user_id=' + admId + '&page=' + page + '&limit=' + limit, {
            headers: {
                'Cache-Control': cache
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 200) {
                    that.setState({
                        listPro: responseJson.data,
                        totalPage: responseJson.pagination.perPage,
                        loading: false
                    });
                } else {
                    alert(responseJson.mes);
                    Actions.welcome({ type: 'reset' });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async paging() {
        let admId = this.state.infoAdm.adm_id;
        let token = this.state.token;
        let page = this.state.page + 1;
        let listPromotion = this.state.listPro;

        var that = this;
        // console.log(domain + '/api/user_v1/api_get_list_promotion.php?token=' + token + '&user_id=' + admId + '&used=1' + '&page=' + page + '&limit=' + limit);

        fetch(domain + '/api/user_v1/api_get_list_promotion.php?token=' + token + '&user_id=' + admId + '&page=' + page + '&limit=' + limit, {
            headers: {
                'Cache-Control': cache
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 200) {
                    for (let i = 0; i < responseJson.data.length; i++) {
                        listPromotion.push(responseJson.data[i]);
                    }

                    that.setState({
                        listPro: listPromotion,
                        page: page,
                        loading: false
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onNavigationStateChange(navState) {
        this.setState({
            webViewHeight: Number(navState.title)
        });
    }

    renderListPro() {
        let html = [];
        let listPro = this.state.listPro;

        for (let i = 0; i < listPro.length; i++) {
            html.push(
                <View key={i} style={{ paddingHorizontal: 10, paddingBottom: 10, marginHorizontal: 20, marginBottom: 10, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ flex: 1 }}>{listPro[i].promotion_name}</Text>
                    <Text style={{ flex: 1 }}>{listPro[i].used_name}</Text>
                    <Text style={{ flex: 1 }}>{listPro[i].used_txt}</Text>
                </View>
            );
        }

        return html;
    }

    render() {
        let checkPage = (this.state.totalPage > this.state.page) ? true : false;
        return (
            <View style={{ height: height, width: width, paddingTop: 60 }}>

                <ScrollView>
                    {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
                    {!this.state.loading &&
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ backgroundColor: colorLogo, padding: 10, marginHorizontal: 20, marginBottom: 10, marginTop: 20, flexDirection: 'row', borderBottomWidth: 1 }}>
                                <Text style={{ flex: 1 }}>Chương trình</Text>
                                <Text style={{ flex: 1 }}>Trạng thái</Text>
                                <Text style={{ flex: 1 }}>Ngày sử dụng</Text>
                            </View>
                            {this.renderListPro()}
                        </View>
                    }
                    {checkPage &&
                        <TouchableOpacity
                            style={{ margin: 10, alignItems: 'flex-end' }}
                            onPress={() => this.paging()}
                        >
                            <Text style={{ color: '#4CC6FF' }}>Xem thêm >></Text>
                        </TouchableOpacity>}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 64,
        position: 'relative',
        alignItems: 'center',
        padding: 30
    },
    styleText: {
        marginBottom: 10
    },
    styleButton: {

    }
});

export default ListPromotion
