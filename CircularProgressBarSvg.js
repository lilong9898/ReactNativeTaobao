import React, {Component, PropTypes} from 'react';
import Svg, {Circle} from 'react-native-svg';

export default class CircularProgressBarSvg extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Svg
                width={30}
                height={30}
            >
                <Circle
                    cx={15}
                    cy={15}
                    r={10}
                />
            </Svg>
        );
    }
}

