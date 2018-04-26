import React from 'react';
import {
    NetInfo,
} from 'react-native';


export default isConnected = () => {
    return NetInfo.isConnected.fetch().then(isConnected => {
        return isConnected;
    });
}