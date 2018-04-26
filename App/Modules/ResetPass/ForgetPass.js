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
let { width, height } = Dimensions.get('window');

class ForgetPass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numberPhone: '',
            cssError: 'noError',
            error: 'false',
            messageError: [],
        };
    }

    async handleAuth() {
        let checkNullForm = false,
            mesValid = [];
        if (this.state.numberPhone.length == 0) {
            checkNullForm = true;
            mesValid.push('Vui lòng nhập số điện thoại.');
        } else {
            if (this.state.numberPhone.length < 10 || !Number.isInteger(Number(this.state.numberPhone))) {
				checkNullForm = true;
                mesValid.push('Số điện thoại bạn nhập không đúng.');
			}
        }

        if (!checkNullForm) {
            try {
                let params = {
                    phone: this.state.numberPhone,
                }

                let data = await fetchData('api_get_code_auth', params, 'GET');

                // let data = {status: 200};

                // đăng ký
                if (data.status == 200) {
                    Actions.ResetPass({ title: 'Reset mật khẩu', data: this.state.numberPhone });
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
        } else {
            this.setState({
                error: 'true',
                messageError: mesValid
            });
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
            <View key="content_mobile" style={styles.paddingContent}>
                <InputGroup key="group_mobile">
                    <Icon name='ios-call' style={styles[this.state.cssError]} />
                    <Input placeholder="Số điện thoại" keyboardType="numeric" maxLength={11} style={{ height: 50 }} onChange={(event) => this.setState({ numberPhone: event.nativeEvent.text })} />
                </InputGroup>

                {arrValid}
                
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        block
                        success
                        style={[styles.buttonAuth, { flex: 1, height: 50 }]}
                        onPress={this.handleAuth.bind(this)}
                    >Lấy mã xác thực</Button>
                </View>

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

export default ForgetPass
