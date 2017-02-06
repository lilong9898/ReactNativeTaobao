import React, {PropTypes, Component} from 'react';
import {Animated, View} from 'react-native';
import Svg, {Defs, Stop, G, Path, LinearGradient} from 'react-native-svg';
import {arc} from 'd3-shape';
import range from 'lodash/range';

/** 默认的渐变的起始颜色，RGB*/
const DEFAULT_START_COLOR_RGB = [0x00, 0x00, 0x00];
/** 默认的渐变的结束颜色, RGB*/
const DEFAULT_END_COLOR_RGB = [0xff, 0xff, 0xff];

/** 用多少段线性渐变来近似圆周渐变*/
const DEFAULT_NUMBER_OF_SEGMENTS = 32;

const LINEAR_GRADIENT_PREFIX_ID = 'linear_gradient_prefix_id';

/**
 * 实验发现因为要计算的线性渐变太多，在progress快速变化时，rerender的效果不好，比较慢，不流畅，所以暂时不用渐变了
 * 用不带渐变的CircularProgressBarSvg
 * */
export default class CircularProgressBarSvgWithSweepGradientFill extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        size: PropTypes.number.isRequired,
        outerRadius: PropTypes.number.isRequired,
        innerRadius: PropTypes.number.isRequired,
        startColorRGB: PropTypes.arrayOf(PropTypes.number).isRequired,
        endColorRGB: PropTypes.arrayOf(PropTypes.number).isRequired,
        progress: PropTypes.number.isRequired,
        numberOfSegments: PropTypes.number,
        backgroundColor: PropTypes.string,
        renderCenterDrawable: PropTypes.func,
        linecap: PropTypes.string,
    };

    static defaultProps = {
        startColorRGB: DEFAULT_START_COLOR_RGB,
        endColorRGB: DEFAULT_END_COLOR_RGB,
        numberOfSegments: DEFAULT_NUMBER_OF_SEGMENTS,
        linecap: 'butt'
    };

    /**
     * 计算每个segment结束位置的RGB色值
     * */
    calculateStopColor(i) {
        return [
            Math.round(this.props.startColorRGB[0] + (this.props.endColorRGB[0] - this.props.startColorRGB[0]) * i / this.props.numberOfSegments),
            Math.round(this.props.startColorRGB[1] + (this.props.endColorRGB[1] - this.props.startColorRGB[1]) * i / this.props.numberOfSegments),
            Math.round(this.props.startColorRGB[2] + (this.props.endColorRGB[2] - this.props.startColorRGB[2]) * i / this.props.numberOfSegments)
        ];
    }

    renderLinearGradients() {

        let startColor = this.props.startColorRGB;
        let stopColor = this.calculateStopColor(1);
        let startAngle = 0;
        let stopAngle = (2 * Math.PI) / this.props.numberOfSegments;

        return range(1, this.props.numberOfSegments + 1).map(i => {
            const linearGradient = (
                <LinearGradient
                    id={LINEAR_GRADIENT_PREFIX_ID + i}
                    key={LINEAR_GRADIENT_PREFIX_ID + i}
                    x1={this.props.innerRadius * Math.sin(startAngle)}
                    y1={-this.props.innerRadius * Math.cos(startAngle)}
                    x2={this.props.innerRadius * Math.sin(stopAngle)}
                    y2={-this.props.innerRadius * Math.cos(stopAngle)}
                >
                    <Stop offset="0"
                          stopColor={"rgb(" + startColor.join(',') + ")"}/>
                    <Stop offset="1"
                          stopColor={"rgb(" + stopColor.join(',') + ")"}/>
                </LinearGradient>
            );

            startColor = stopColor;
            stopColor = this.calculateStopColor(i + 1);
            startAngle = stopAngle;
            stopAngle += (2 * Math.PI) / this.props.numberOfSegments;

            return linearGradient;
        });
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

        const progress = Math.min(100, Math.max(0, this.props.progress));

        let numberOfPathsToDraw = Math.floor(
            ((2 * Math.PI) * (progress / 100)) / ((2 * Math.PI) / this.props.numberOfSegments)
        );

        let remains = (((2 * Math.PI) * (progress / 100)) / ((2 * Math.PI) / this.props.numberOfSegments)) % 1;

        if (remains > 0) {
            numberOfPathsToDraw++;
        }

        let startAngle = 0;
        let stopAngle = -(2 * Math.PI) / this.props.numberOfSegments;

        return range(1, numberOfPathsToDraw + 1).map(i => {

            if (i === numberOfPathsToDraw && remains) {
                stopAngle = -2 * Math.PI * (progress / 100);
            }

            const circlePath = arc()
                .innerRadius(this.props.innerRadius)
                .outerRadius(this.props.outerRadius)
                .startAngle(startAngle)
                .endAngle(stopAngle - 0.005);

            const path = (
                <Path
                    x={this.props.size / 2}
                    y={this.props.size / 2}
                    key={progress + i}
                    d={circlePath()}
                    fill={'url(#' + LINEAR_GRADIENT_PREFIX_ID + (this.props.numberOfSegments - i + 1) + ')'}
                />
            );
            startAngle = stopAngle;
            stopAngle -= ((2 * Math.PI) / this.props.numberOfSegments);

            return path;
        });
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
                    <Defs>
                        {this.renderLinearGradients()}
                    </Defs>
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
