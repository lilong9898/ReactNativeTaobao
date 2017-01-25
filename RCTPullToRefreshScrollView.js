import React, {Component, PropTypes} from 'react';
import {
    View, requireNativeComponent,
} from 'react-native';

const NAME = "RCTPullToRefreshScrollView";

let iface = {
    name: NAME,
    propTypes: {...View.propTypes},
}

module.exports = requireNativeComponent(NAME, iface);
