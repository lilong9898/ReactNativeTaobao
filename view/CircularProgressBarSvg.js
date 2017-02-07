import React, {PropTypes, Component} from 'react';
import {Animated, View} from 'react-native';
import Svg, {Defs, Stop, G, Path, LinearGradient} from 'react-native-svg';
import {arc} from 'd3-shape';

export default class CircularProgressBarSvg extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        size: React.PropTypes.number.isRequired,
        outerRadius: React.PropTypes.number.isRequired,
        innerRadius: React.PropTypes.number.isRequired,
        progress: React.PropTypes.number.isRequired,
        foregroundColor: React.PropTypes.string,
        backgroundColor: React.PropTypes.string,
        renderCenterDrawable: React.PropTypes.func,
    };

    static defaultProps = {
        foregroundColor: 'gray',
    }

    renderBackgroundPath() {

        const backgroundPath = arc()
            .innerRadius(this.props.innerRadius)
            .outerRadius(this.props.outerRadius)
            .startAngle(0)
            .endAngle(2 * Math.PI);

        return (
            <Path
                x={this.props.size / 2}
                y={this.props.size / 2}
                d={backgroundPath()}
                fill={this.props.backgroundColor}
            />
        );
    }

    renderCirclePaths() {

        let progress = Math.min(100, Math.max(0, this.props.progress));

        let startAngle = 0;
        let stopAngle = -(2 * Math.PI) / 100 * progress;

        let circlePath = arc()
            .innerRadius(this.props.innerRadius)
            .outerRadius(this.props.outerRadius)
            .startAngle(startAngle)
            .endAngle(stopAngle);

        return (
            <Path
                x={this.props.size / 2}
                y={this.props.size / 2}
                d={circlePath()}
                fill={this.props.foregroundColor}
            />
        );
    }

    render() {

        const progress = Math.min(100, Math.max(0, this.props.progress));

        let sizeStyle = {
            width: this.props.size,
            height: this.props.size,
        };

        return (
            <View style={[this.props.style, sizeStyle]}>
                <Svg
                    width={this.props.size}
                    height={this.props.size}
                >
                    <G>
                        {this.props.backgroundColor && this.renderBackgroundPath()}
                        {this.renderCirclePaths()}
                    </G>
                </Svg>
                {this.props.renderCenterDrawable && this.props.renderCenterDrawable(progress)}
            </View>
        );
    }
}
