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

class ResetPass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authCode: '',
            newPassword: '',
            renewPassword: '',
            cssError: 'noError',
            error: 'false',
            messageError: [],
        };
    }

    async handleResetPass() {
        let checkNullForm = false,
            mesValid = [];

        if (this.state.authCode.length == 0) {
            checkNullForm = true;
            mesValid.push('Vui lòng nhập mã xác thực.');
            this.setState({
                error: 'true',
                messageError: mesValid
            });
            return;
        }

        if (this.state.newPassword.length == 0) {
            checkNullForm = true;
            mesValid.push('Vui lòng nhập mật khẩu mới.');
            this.setState({
                error: 'true',
                messageError: mesValid
            });
            return;
        }

        if (this.state.renewPassword.length == 0) {
            checkNullForm = true;
            mesValid.push('Vui lòng nhập lại mật khẩu mới.');
            this.setState({
                error: 'true',
                messageError: mesValid
            });
            return;
        }

        if (this.state.newPassword != this.state.renewPassword) {
            checkNullForm = true;
            mesValid.push('Nhập lại mật khẩu không khớp với mật khẩu mới.');
            this.setState({
                error: 'true',
                messageError: mesValid
            });
            return;
        }

        // if (!checkNullForm) {
        try {
            let params = {
                phone: this.props.data,
                code_otp: this.state.authCode,
                password: this.state.newPassword,
                password_confirm: this.state.renewPassword,
            }

            let data = await fetchData('api_reset_pass', params, 'GET');

            // đăng ký
            if (data.status == 200) {
                alert('Mật khẩu của bạn đã được cấp lại.');
                Actions.welcome({ title: 'Đăng Nhập' });
            } else {
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
        // } else {
        //     this.setState({
        //         error: 'true',
        //         messageError: mesValid
        //     });
        // }
    }

    async handleGetCodeAuth() {
        let body = {
            phone: this.props.data,
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
            <View key="content_resetPass" style={styles.paddingContent}>
                <InputGroup key="group_resetPass">
                    <Icon name='ios-key' style={styles[this.state.cssError1]} />
                    <Input placeholder="Mã xác thực" style={{ height: 50 }} onChange={(event) => this.setState({ authCode: event.nativeEvent.text })} />
                </InputGroup>
                <InputGroup key="group_password">
                    <Icon name='ios-unlock' style={styles[this.state.cssError2]} />
                    <Input placeholder="Mật khẩu mới" style={{ height: 50 }} secureTextEntry={true} onChange={(event) => this.setState({ newPassword: event.nativeEvent.text })} />
                </InputGroup>
                <InputGroup key="group_repassword">
                    <Icon name='ios-unlock' style={styles[this.state.cssError3]} />
                    <Input placeholder="Nhập lại mật khẩu mới" style={{ height: 50 }} secureTextEntry={true} onChange={(event) => this.setState({ renewPassword: event.nativeEvent.text })} />
                </InputGroup>

                {arrValid}

                <View style={{ flexDirection: 'row' }}>
                    <Button
                        block
                        success
                        style={[styles.buttonResetPass, { flex: 1, height: 50 }]}
                        onPress={this.handleResetPass.bind(this)}
                    >Thiết lập lại mật khẩu</Button>
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
    buttonResetPass: {
        marginTop: 10,
        marginRight: 10
    },
    cssError1: {
        color: 'red'
    },
    cssError2: {
        color: 'red'
    },
    cssError3: {
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

export default ResetPass
