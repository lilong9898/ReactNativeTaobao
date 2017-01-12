import React, {Component} from 'react';
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native';

import CustomPullToRefreshView from './CustomPullToRefreshView';

export default class WeTao extends Component {

    onRefresh(tag_notification_refresh_complete) {
        setTimeout(
            () => {
                DeviceEventEmitter.emit(tag_notification_refresh_complete);
            },
        1000
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <CustomPullToRefreshView
                    style={styles.pullToRefreshView}
                    onRefresh={this.onRefresh}
                >
                    <Text>HAHA</Text>
                </CustomPullToRefreshView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    pullToRefreshView: {
        flex: 1,
        backgroundColor: 'blue',
    },
});
