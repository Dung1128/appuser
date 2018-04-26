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
import { domain, cache, colorLogo } from '../../Config/common';
import StorageHelper from '../../Components/StorageHelper';
import { Button, Icon, Spinner, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux';
const { height, width } = Dimensions.get('window');

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

const limit = 24;

class ListPointDown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            webViewHeight: 0,
            infoAdm: [],
            token: '',
            listPoint: [],
            user_level: {},
            listPointDown: [],
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
        // console.log(domain + '/api/user_v1/api_money_point_history.php?token=' + token + '&user_id=' + admId + '&type=2&page=' + page + '&limit=' + limit);

        fetch(domain + '/api/user_v1/api_money_point_history.php?token=' + token + '&user_id=' + admId + '&type=2&page=' + page + '&limit=' + limit, {
            headers: {
                'Cache-Control': cache
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 200) {
                    // let listPoint = responseJson.data;

                    that.setState({
                        listPoint: responseJson.data,
                        user_level: responseJson.user_level,
                        totalPage: responseJson.pagination.perPage,
                        loading: false
                    });

                    // console.log(domain + '/api/user_v1/api_money_point_history.php?token=' + token + '&user_id=' + admId + '&type=2');

                    // fetch(domain + '/api/user_v1/api_money_point_history.php?token=' + token + '&user_id=' + admId + '&type=2', {
                    //     headers: {
                    //         'Cache-Control': cache
                    //     }
                    // })
                    //     .then((response) => response.json())
                    //     .then((responseJson) => {
                    //         if (responseJson.status == 200) {
                    //             console.log('lich su tiêu diem');
                    //             console.log(responseJson);

                    //             that.setState({
                    //                 listPoint: listPoint,
                    //                 listPointDown: responseJson.data,
                    //                 user_level: responseJson.user_level,
                    //                 loading: false
                    //             });
                    //         } else {
                    //             alert(responseJson.mes);
                    //             Actions.welcome({ type: 'reset' });
                    //         }
                    //     })
                    //     .catch((error) => {
                    //         console.error(error);
                    //     });
                } else {
                    alert(responseJson.mes);
                    Actions.welcome({ type: 'reset' });
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

    async paging() {
        let admId = this.state.infoAdm.adm_id;
        let token = this.state.token;
        let page = this.state.page + 1;
        let listPoint = this.state.listPoint;

        var that = this;
        // console.log(domain + '/api/user_v1/api_money_point_history.php?token=' + token + '&user_id=' + admId + '&type=2&page=' + page + '&limit=' + limit);

        fetch(domain + '/api/user_v1/api_money_point_history.php?token=' + token + '&user_id=' + admId + '&type=2&page=' + page + '&limit=' + limit, {
            headers: {
                'Cache-Control': cache
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 200) {
                    // let listPoint = responseJson.data;
                    for (let i = 0; i < responseJson.data.length; i++) {
                        listPoint.push(responseJson.data[i]);
                    }

                    that.setState({
                        listPoint: listPoint,
                        user_level: responseJson.user_level,
                        page: page,
                        loading: false
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    renderListPro() {
        let html = [];
        let listPoint = this.state.listPoint;

        for (let i = 0; i < listPoint.length; i++) {
            let nameIcon = listPoint[i].type == 1 ? 'ios-add' : 'ios-remove';
            let backColor = listPoint[i].type == 1 ? '#449d44' : '#E24150';
            let tg = listPoint[i].type == 1 ? '+' : '-';
            // let nameIcon = 'ios-remove-circle-outline';

            html.push(
                <View key={i} style={{ paddingBottom: 10, marginHorizontal: 20, marginBottom: 10, borderBottomWidth: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                    <Text style={{ flex: 1 }}>Mã KM: <Text>{listPoint[i].promotion_name}</Text></Text>
                    <Text style={{ flex: 1 }}>Tiền giao dịch: <Text>{listPoint[i].money}</Text></Text>
                    <Text style={{ flex: 1 }}>Điểm khuyến mãi: <Text>{listPoint[i].point}</Text></Text>
                    <Text style={{ flex: 1 }}>Điểm lên hạng: <Text>{listPoint[i].point_up_level}</Text></Text>
                    <Text style={{ flex: 1 }}>Ngày tạo: <Text>{listPoint[i].created_at}</Text></Text>
                    <Text style={{ flex: 1 }}>Ghi chú: <Text>{listPoint[i].note}</Text></Text>
                    {/* <View style={{ marginBottom: 10, flex: 1 }}>
                        <View style={{ width: 40, height: 40, backgroundColor: backColor, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{tg}</Text>
                        </View>
                    </View> */}
                </View>
            );
        }

        // for (let i = 0; i < listPointDown.length; i++) {
        //     let nameIcon = listPointDown[i].type == 1 ? 'ios-add' : 'ios-remove';
        //     let backColor = listPointDown[i].type == 1 ? '#449d44' : '#E24150';
        //     let tg = listPointDown[i].type == 1 ? '+' : '-';
        //     // let nameIcon = 'ios-remove-circle-outline';

        //     html.push(
        //         <View key={i + '_down'} style={{ paddingHorizontal: 10, paddingBottom: 10, marginHorizontal: 20, marginBottom: 10, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
        //             <Text style={{ marginBottom: 10, flex: 2 }}>{listPointDown[i].money}</Text>
        //             <Text style={{ marginBottom: 10, flex: 1, paddingLeft: 10 }}>{listPointDown[i].point}</Text>
        //             <Text style={{ marginBottom: 10, flex: 2, paddingLeft: 10 }}>{listPointDown[i].point_up_level}</Text>
        //             <View style={{ marginBottom: 10, flex: 1 }}>
        //                 {/* <Icon name={nameIcon} style={{ backgroundColor: backColor, width: 30, margin: 10 }} /> */}
        //                 <View style={{ width: 40, height: 40, backgroundColor: backColor, justifyContent: 'center', alignItems: 'center' }}>
        //                     <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{tg}</Text>
        //                 </View>
        //             </View>
        //         </View>
        //     );
        // }

        return html;
    }

    render() {
        let checkPage = (this.state.totalPage > this.state.page) ? true : false;
        return (
            <View style={{ height: height, width: width, paddingTop: 60 }}>

                <ScrollView
                // onScroll={({ nativeEvent }) => {
                //     if (isCloseToBottom(nativeEvent)) {
                //         console.log('cuoi cua list');
                //     }
                //     console.log('cuoi cua list');
                // }}
                // scrollEventThrottle={400}
                >
                    {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
                    {!this.state.loading &&
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ margin: 20 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>THÔNG TIN ĐIỂM HẠNG </Text>
                                <Text style={{ flex: 1 }}>Xếp hạng: <Text>{this.state.user_level.level_name}</Text></Text>
                                <Text style={{ flex: 1 }}>Số điểm thưởng: <Text>{this.state.user_level.point}</Text></Text>
                                <Text style={{ flex: 1 }}>Số điểm lên hạng: <Text>{this.state.user_level.point_up_level}</Text></Text>
                                <Text style={{ flex: 1 }}>Số điểm còn lại để lên hạng: <Text>{this.state.user_level.point_remaining}</Text></Text>
                                <Text style={{ flex: 1 }}>Số tiền giao dịch: <Text>{this.state.user_level.money}</Text></Text>
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginBottom: 10 }}>LỊCH SỬ TIÊU ĐIỂM</Text>
                            {/* <View style={{ marginHorizontal: 20, marginBottom: 10, marginTop: 20, flexDirection: 'row', borderBottomWidth: 1, backgroundColor: colorLogo, padding: 10 }}>
                                <Text style={{ flex: 1 }}>Tiền giao dịch</Text>
                                <Text style={{ flex: 1 }}>Điểm KM</Text>
                                <Text style={{ flex: 1 }}>Điểm lên hạng</Text>
                                <Text style={{ flex: 1 }}>Loại</Text>
                            </View> */}
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

export default ListPointDown
