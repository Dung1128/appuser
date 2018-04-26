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
import fetchData from '../../Components/FetchData';
import Modal from 'react-native-modalbox';
import { Button, Icon, Spinner, Thumbnail, Input, Card, CardItem } from 'native-base';
import { Actions } from 'react-native-router-flux';
const { height, width } = Dimensions.get('window');

class PointToPromotion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            webViewHeight: 0,
            infoAdm: [],
            token: '',
            listPromotion: [],
            user_level: {},
            soluong: '',
            arrKM: [],
            promotion: '',
            promotion_id: '',
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
        let user_level = {};

        this.setState({
            infoAdm: results,
            token: token
        });

        var that = this;
        // console.log(domain + '/api/user_v1/api_money_point_history.php?token=' + token + '&user_id=' + admId + '&used=1');

        fetch(domain + '/api/user_v1/api_money_point_history.php?token=' + token + '&user_id=' + admId, {
            headers: {
                'Cache-Control': cache
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 200) {
                    user_level = responseJson.user_level;

                    // console.log(domain + '/api/user_v1/api_get_promotion_sell.php?token=' + token + '&user_id=' + admId + '&used=1');

                    fetch(domain + '/api/user_v1/api_get_promotion_sell.php?token=' + token + '&user_id=' + admId, {
                        headers: {
                            'Cache-Control': cache
                        }
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.status == 200) {
                                that.setState({
                                    arrKM: responseJson.data,
                                    user_level: user_level,
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

                    // that.setState({
                    //     listPoint: responseJson.data,
                    //     user_level: responseJson.user_level,
                    // });
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

    render() {
        let promotion = this.state.promotion;

        return (
            <View style={{ height: height, width: width, paddingTop: 60 }}>

                <ScrollView>
                    {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
                    {!this.state.loading &&
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ margin: 20, }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>THÔNG TIN ĐIỂM HẠNG </Text>
                                <Text style={{ flex: 1 }}>Xếp hạng: <Text>{this.state.user_level.level_name}</Text></Text>
                                <Text style={{ flex: 1 }}>Số điểm khuyến mãi: <Text>{this.state.user_level.point}</Text></Text>
                                <Text style={{ flex: 1 }}>Số điểm lên hạng: <Text>{this.state.user_level.point_up_level}</Text></Text>
                                <Text style={{ flex: 1 }}>Số điểm còn lại để lên hạng: <Text>{this.state.user_level.point_remaining}</Text></Text>
                                <Text style={{ flex: 1 }}>Số tiền giao dịch: <Text>{this.state.user_level.money}</Text></Text>
                            </View>
                            <View style={{ margin: 20 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>ĐỔI ĐIỂM LẤY MÃ KHUYẾN MẠI</Text>
                                <TouchableOpacity
                                    style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60 }}
                                    onPress={() => { this.openModalKM() }}>
                                    <Text style={{ marginLeft: 5, textAlignVertical: 'center', }}>
                                        {promotion == '' ? 'Chọn chương trình khuyến mại' : promotion}
                                    </Text>
                                </TouchableOpacity>
                                <Input
                                    keyboardType='numeric'
                                    placeholder="Số lượng"
                                    value={this.state.soluong}
                                    onChange={(event) => { this.setState({ soluong: event.nativeEvent.text }) }}
                                    style={{
                                        height: 60,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // marginHorizontal: 20,
                                        borderColor: '#ccc',
                                        borderWidth: 1,
                                        borderRadius: 10,
                                    }}
                                />
                                <TouchableOpacity
                                    style={{
                                        height: 60,
                                        borderWidth: 2,
                                        borderRadius: 10,
                                        borderColor: colorLogo,
                                        backgroundColor: colorLogo,
                                        marginVertical: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => { this.saveKM() }}
                                >
                                    <Text style={{ alignItems: 'center', justifyContent: 'center' }}>Mua mã</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </ScrollView>
                <Modal style={[styles.modal, styles.wrapPopup, { height: height }]} position={"center"} ref={"modalKM"} isDisabled={this.state.isDisabled}>
                    {this._renderModalKM()}
                </Modal>
            </View>
        );
    }

    async saveKM() {
        let soluong = this.state.soluong;
        let promotion_id = this.state.promotion_id;

        try {
            if (promotion_id != '') {
                if (soluong != '') {

                    let params = {
                        token: this.state.token,
                        user_id: this.state.infoAdm.adm_id,
                        quantity: soluong,
                        km_id: promotion_id,
                    }

                    let data = await fetchData('api_buy_pro_by_point', params, 'GET');

                    if (data.status == 200) {
                        alert(data.mes);
                        Actions.ListPromotion({ title: 'Danh sách mã KM' });
                        // AsyncStorage.getItem('infoUser').then((data) => {
                        //     let results = JSON.parse(data);
                        //     if (results != null) {
                        //         Actions.home({ title: 'Chọn Chuyến', data: results });
                        //     } else {
                        //         Actions.welcome();
                        //     }
                        // }).done();
                    }
                    else {
                        alert(data.mes);
                    }
                }
                else {
                    alert('Chưa nhập số lượng mã KM');
                }
            }
            else {
                alert('Chưa chọn chương trình khuyến mại');
            }
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }

    openModalKM() {
        this.refs.modalKM.open();
    }

    closeModalKM() {
        this.refs.modalKM.close();
    }

    _renderModalKM() {
        var htmlKM = [];
        let arrKM = this.state.arrKM;
        let countData = arrKM.length;
        var itemKM = {};

        for (var i = 0; i < countData; i++) {
            itemKM = arrKM[i];
            let keyKM = itemKM.id;
            htmlKM.push(
                <CardItem key={'km_' + i} style={{ shadowOpacity: 0, shadowColor: 'red', paddingTop: 10 }} onPress={() => { this.closeModalKM(); this.setState({ promotion: itemKM.text, promotion_id: itemKM.id }) }} >
                    <View>
                        <Text>{itemKM.text}</Text>
                    </View>
                </CardItem>
            );
        }

        return (
            <View key="1" style={{ width: width, height: height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

                <View style={styles.close_popup}>
                    <TouchableOpacity onPress={() => this.closeModalKM()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Icon name="md-close" style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ width: width }} keyboardShouldPersistTaps="always">
                    <Card key="group_card_km" style={{ marginTop: 0 }}>{htmlKM}</Card>
                </ScrollView>
            </View>
        )
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

    },
    modal: {
        alignItems: 'center'
    },
    wrapPopup: {
        paddingTop: 60
    },
    close_popup: {
        position: 'absolute', zIndex: 9, top: 10, right: 10, width: 50, height: 50
    },
});

export default PointToPromotion
