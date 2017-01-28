import React, {Component, PropTypes} from 'react';
import {
    View, requireNativeComponent,
} from 'react-native';

export default class PullToRefreshScrollView extends Component {

    constructor(props) {
        super(props);
    }

    //native向js端传送的消息在此接收
    onChange(event: Event) {
        console.log(event.nativeEvent)
    }

    render() {
        return (
            <RCTPullToRefreshScrollView
                {...this.props}
                onChange={this.onChange.bind(this)}
            />
        );
    }
}

const NAME = "RCTPullToRefreshScrollView";

let iface = {
    name: NAME,
    propTypes: {...View.propTypes},
}

const RCTPullToRefreshScrollView = requireNativeComponent(NAME, iface);
