import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    AsyncStorage,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
import { Container, Content, InputGroup, View, Icon, Input, Text, Button, Thumbnail, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';
import * as common from '../../Config/common';
import StorageHelper from '../../Components/StorageHelper';
import fetchData from '../../Components/FetchData';
import Communications from 'react-native-communications';
import Toast, { DURATION } from 'react-native-easy-toast';
let { width, height } = Dimensions.get('window');

class Authentication extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authCode: '',
            cssError: 'noError',
            error: 'false',
            messageError: [],
        };
    }

    async handleAuth() {
        let checkNullForm = false,
            mesValid = [];
        if (this.state.authCode.length == 0) {
            checkNullForm = true;
            mesValid.push('Vui lòng nhập mã xác thực.');
        }

        if (!checkNullForm) {
            try {
                let params = {
                    phone: this.props.data.phone,
                    code_otp: this.state.authCode,
                }

                let data = await fetchData('api_auth_acc', params, 'GET');

                // đăng ký
                if (data.status == 200) {
                    if (this.props.data.type == 'register') {
                        alert('Tài khoản đã được xác thực.');
                        Actions.welcome({ title: 'Đăng Nhập' });
                    }

                    if (this.props.data.type == 'login') {
                        let params = {
                            type: 'login',
                            username: this.props.data.phone,
                            password: this.props.data.password,
                        }

                        let data = await fetchData('login', params, 'GET');

                        if (data.status == 200) {
                            let result = JSON.stringify(data);
                            AsyncStorage.removeItem('infoUser');
                            AsyncStorage.setItem("infoUser", result);
                            Actions.home({ title: 'Chọn Chuyến', data: result });
                        } else {
                            this.setState({
                                error: 'true',
                                loading: false,
                                messageError: [data.mes]
                            });
                        }
                    }
                } else {
                    // đăng nhập
                    if (data.status == 201) {

                    }
                    
                    this.setState({
                        error: 'true',
                        loading: false,
                        messageError: [data.mes]
                    });
                }
            } catch (e) {
                this.setState({
                    error: 'true',
                    loading: false,
                    messageError: [common.errorHttp]
                });
                console.log(e);
            }
        } else {
            this.setState({
                error: 'true',
                messageError: mesValid
            });
        }
    }

    async handleGetCodeAuth() {
        let body = {
            phone: this.props.data.phone,
        }

        let data = await fetchData('api_get_code_auth', body, 'GET');

        if (data.status == 200) {
            this.refs.toast.show('Mã xác thực đã được gưi tới điện thoại của bạn', DURATION.LENGTH_LONG);
        }
        else {
            this.refs.toast.show(data.mes, DURATION.LENGTH_LONG);
        }
    }

    renderHtml() {
        let htmlContent = [];
        let arrValid = [];

        if (this.state.error == 'true') {
            this.state.cssError = 'cssError';
        } else {
            this.state.cssError = 'noError';
        }

        if (this.state.messageError.length > 0) {
            arrValid.push(<Text style={{ color: 'red', marginTop: 10 }} key="username_vl">{this.state.messageError[0]}</Text>);
        }

        htmlContent.push(
            <View key="content_auth" style={styles.paddingContent}>
                <InputGroup key="group_auth">
                    <Icon name='ios-key' style={styles[this.state.cssError]} />
                    <Input placeholder="Mã xác thực" style={{ height: 50 }} onChange={(event) => this.setState({ authCode: event.nativeEvent.text })} />
                </InputGroup>

                {arrValid}

                <View style={{ flexDirection: 'row' }}>
                    <Button
                        block
                        success
                        style={[styles.buttonAuth, { flex: 1, height: 50 }]}
                        onPress={this.handleAuth.bind(this)}
                    >Xác thực tài khoản</Button>
                </View>
                <TouchableOpacity onPress={this.handleGetCodeAuth.bind(this)}
                    style={{ marginTop: 10, marginBottom: 10, alignItems: 'center' }}>
                    <Text style={{ color: '#365DB5', fontWeight: 'bold' }}>Lấy lại mã xác thực</Text>
                </TouchableOpacity>

            </View>
        );

        return htmlContent;
    }

    render() {
        return (

            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ height: height }}>
                    <Grid>
                        <Row size={1}></Row>
                        <Row size={5}>
                            <View>
                                <ScrollView>
                                    {this.renderHtml()}
                                </ScrollView>
                                <Toast
                                    ref="toast"
                                    style={{ backgroundColor: 'red' }}
                                    position='top'
                                    positionValue={200}
                                    fadeInDuration={750}
                                    fadeOutDuration={1000}
                                    opacity={0.8}
                                />
                            </View>
                        </Row>
                        <Row size={1}></Row>
                    </Grid>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonAuth: {
        marginTop: 10,
        marginRight: 10
    },
    cssError: {
        color: 'red'
    },
    paddingContent: {
        paddingRight: 30,
        paddingLeft: 30
    },
    wrapViewImage: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default Authentication
