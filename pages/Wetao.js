import React, {Component} from 'react';
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native';

import CircularProgressBarSvgWithSweepGradientFill from '../view/CircularProgressBarSvgWithSweepGradientFill';

export default class WeTao extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>Wetao</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'black',
    },
});
