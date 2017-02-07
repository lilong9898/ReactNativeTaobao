import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import CircularProgressBarSvgWithSweepGradientFill from '../view/CircularProgressBarSvgWithSweepGradientFill';

export default class WeTao extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text
                    style={styles.text}
                >
                    oops, 微淘被猫吃了....
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 30,
    },
});
