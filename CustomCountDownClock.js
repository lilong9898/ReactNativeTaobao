import React, {Component, PropTypes} from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';

// 首页的秒杀抢购倒计时
export default class CustomCountDownClock extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
            // 小时
            hour: Math.min(23, this.props.hour),
            // 分钟
            min: Math.min(59, this.props.min),
            // 秒
            sec: Math.min(59, this.props.sec),
        }

    }

    static propTypes = {
        // 数字字号
        digitFontSize: React.PropTypes.number,
        // 初始小时
        hour: React.PropTypes.number.isRequired,
        // 初始分钟
        min: React.PropTypes.number.isRequired,
        // 初始秒
        sec: React.PropTypes.number.isRequired,
    };

    static defaultProps = {
        digitFontSize: 15,
        hour: 0,
        min: 0,
        sec: 0,
    };

    // 时钟走过一秒
    clockTickAwayOneSec() {

        let hour = this.state.hour;
        let min = this.state.min;
        let sec = this.state.sec;
        if (sec == 0) {
            if (min == 0) {
                if (hour == 0) {
                    return;
                } else {
                    sec = 59;
                    min = 59;
                    hour = hour - 1;
                }
            } else {
                sec = 59;
                min = min - 1;
            }
        } else {
            sec = sec - 1;
        }

        this.setState({
            hour: hour,
            min: min,
            sec: sec,
        });
    }

    componentDidMount() {
        if (!this.countDownClock) {
            this.countDownClock = setInterval(
                () => {
                    this.clockTickAwayOneSec();
                }, 1000
            );
        }
    }

    componentWillUnmount() {
        if (this.countDownClock) {
            clearInterval(this.countDownClock);
            this.countDownClock = null;
        }
    }

    onLayout(event) {

        // 获取view的宽度
        let viewWidth = event.nativeEvent.layout.width;
        // 获取view的高度
        let viewHeight = event.nativeEvent.layout.height;

        // 若view的宽度或高度为空，或者宽高跟原来完全一样
        if (!viewWidth || !viewHeight || (this.state.viewWidth == viewWidth && this.state.viewHeight == viewHeight)) {
            return;
        }

        // 向state中更新最新的view宽度
        this.setState({
            viewWidth: viewWidth,
            viewHeight: viewHeight,
        });
    }

    getTwoDigitString(number: number) {

        let twoDigitString = number + "";

        if (number < 10) {
            twoDigitString = '0' + twoDigitString;
        }

        return twoDigitString;
    }

    render() {

        let customDigitPairStyle = {
            width: this.props.digitFontSize * 1.5,
            height: this.props.digitFontSize * 1.5,
            fontSize: this.props.digitFontSize,
        };

        let customColonStyle = {
            width: this.props.digitFontSize * 0.5,
            height: this.props.digitFontSize * 1.5,
            fontSize: this.props.digitFontSize,
        };

        return (
            <View
                style={[this.props.style, styles.container]}
                onLayout={this.onLayout.bind(this)}
            >
                <Text
                    style={[styles.digitPair, customDigitPairStyle]}
                    numberOfLines={1}
                >
                    {this.getTwoDigitString(this.state.hour)}
                </Text>
                <Text
                    style={[styles.colon, customColonStyle]}
                >
                    :
                </Text>
                <Text
                    style={[styles.digitPair, customDigitPairStyle]}
                    numberOfLines={1}
                >
                    {this.getTwoDigitString(this.state.min)}
                </Text>
                <Text
                    style={[styles.colon, customColonStyle]}
                >
                    :
                </Text>
                <Text
                    style={[styles.digitPair, customDigitPairStyle]}
                    numberOfLines={1}
                >
                    {this.getTwoDigitString(this.state.sec)}
                </Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    digitPair: {
        textAlign: 'center',
        textAlignVertical: 'center',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold',
    },
    colon: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
    },
});
