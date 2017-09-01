import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import Dimensions from 'Dimensions';

export const SCREEN_WIDTH = Dimensions.get('window').width;
const weekCN = ['日', '一', '二', '三', '四', '五', '六'];
const weekEN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export default class CalendarView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: this.props.year ? this.props.year : this.getNowYear(),
            month: (this.props.month && this.props.month <= 12 && this.props.month > 0) ? this.props.month : this.getNowMonth(),
            isShow: true,
            isShowStr: '收起',
            select: this.props.selectDay?this.props.selectDay:-1,
            head: this.props.head ? this.props.head : (this.props.isEN ? weekEN : weekCN),
            isShowHeader: this.props.isShowHeader ? this.props.isShowHeader : false,
        };
    }

    static propTypes = {
        style: View.propTypes.style,
        //指定年 不传值默认本年
        year: PropTypes.number,
        //指定月 不传值默认本月
        month: PropTypes.number,
        //监听选择事件
        selectOnListener: PropTypes.func,
        //自定义表头
        head: PropTypes.array,
        //是否英文 表头
        isEN: PropTypes.bool,
        //是否显示头部
        isShowHeader: PropTypes.bool,
        //指定默认选中
        selectDay:PropTypes.number,

    }

    componentDidMount() {
       /* this.setState({
            select: this.mGetTodyDate(),
        });*/
    }

    componentWillReceiveProps(nextProps) {
        //动态更新
        if (this.state.year !== nextProps.year || this.state.month !== nextProps.month) {
            this.setState({
                year: nextProps.year ? nextProps.year : this.getNowYear(),
                month: (nextProps.month && nextProps.month <= 12 && nextProps.month > 0) ? nextProps.month : this.getNowMonth(),

            })
        }
        if (this.state.head !== nextProps.head || this.state.isEN !== nextProps.isEN) {
            this.setState({
                head: nextProps.head ? nextProps.head : (nextProps.isEN ? weekEN : weekCN),
            })
        }
        if (this.state.isShowHeader !== nextProps.isShowHeader) {
            this.setState({
                isShowHeader: nextProps.isShowHeader ? nextProps.isShowHeader : false,
            })
        }
        if (this.state.select !== nextProps.selectDay) {
            this.setState({
                select: nextProps.selectDay ? nextProps.selectDay : false,
            })
        }
    }

    _PressIsShow() {
        this.setState({
            isShow: !this.state.isShow,
            isShowStr: this.state.isShow ? '展开' : '收起',
        });
    }

    render() {
        return (
            <View
                style={[styles.container, this.props.style]}>
                {this.getHeader()}
                <View style={styles.outLineViewStyle}>
                    {this.getTitleView()}
                </View>
                {this.getDataListView()}
                <TouchableOpacity onPress={() => this._PressIsShow()}>
                    <Text style={styles.bottomStyle}>{this.state.isShowStr}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    getHeader() {
        if (this.state.isShowHeader) {
            return (<View style={[styles.outLineViewStyle, {backgroundColor: '#efefef'}]}>
                <TouchableOpacity onPress={() => this.changDate(false)}><Text>pre Month</Text></TouchableOpacity>
                <Text>{this.state.year}-{this.state.month}</Text>
                <TouchableOpacity onPress={() => this.changDate(true)}><Text>next Month</Text></TouchableOpacity>
            </View>);
        } else {
            return null;
        }
    }

    changDate(isAdd) {
        var month = isAdd ? this.state.month + 1 : this.state.month - 1;
        var year = this.state.year;
        if (month > 12) {
            year = this.state.year + 1;
            month = 1;
        } else if (month < 1) {
            year = this.state.year - 1;
            month = 12;
        }
        this.setState({
            year: parseInt(year),
            month: parseInt(month),
        });
    }

    getDataListView() {
        var MonthDaySum = this.mGetDate();
        var weekStart = this.mGetDataWeek();
        var today = this.mGetTodyDate();
        var numItemByWeek = (MonthDaySum + weekStart) / 7;//4
        var OutViews = [];
        var ItemIndex = 0;
        var date = 1;
        var RowSum = (this.state.isShow) ? numItemByWeek : 1;
        console.log("tag date:" + date + " weekStart" + weekStart + " MonthDaySum" + MonthDaySum + " numItemByWeek" + numItemByWeek + " select " + this.state.select);
        for (var i = 0; i < RowSum; i++) {
            var RowViews = [];
            for (var j = 0; j < 7; j++) {
                ItemIndex++;
                if (ItemIndex <= weekStart) {
                    RowViews.push(<Text key={ItemIndex}
                                        style={styles.nullStyle}> </Text>)
                } else {
                    if ((MonthDaySum + weekStart) >= ItemIndex) {
                        var selectStyle = {};
                        var textColorStyle = {};
                        if (date === this.state.select) {
                            //选中的样式
                            selectStyle = {backgroundColor: "#ff9821", color: 'white'};
                        } else {
                            selectStyle = null;
                        }
                        if (j === 0 || j === 6) {
                            //周六周日的样式
                            textColorStyle = {color: "#ff6e32", backgroundColor: "#f4f4f4"};
                        } else {
                            textColorStyle = null;
                        }
                        if (ItemIndex === (today + weekStart)) {
                            //今天
                            RowViews.push(
                                <TouchableOpacity key={ItemIndex}
                                                  onPress={this._pressDay.bind(this, this.state.year, date)}>
                                    <Text
                                        style={[styles.monthDayStyle, {backgroundColor: "#72ff17"}, selectStyle, textColorStyle]}
                                    >{date}</Text>
                                </TouchableOpacity>)
                        } else {
                            //除了今天的其他的所有天
                            console.log("tag date:" + date + "select" + this.state.select);
                            RowViews.push(
                                <TouchableOpacity key={ItemIndex}
                                                  onPress={this._pressDay.bind(this, this.state.year, date)}>
                                    <Text style={[styles.monthDayStyle, textColorStyle, selectStyle]}>{date}</Text>
                                </TouchableOpacity>)

                        }
                    } else {
                        //空白留空
                        RowViews.push(<Text key={ItemIndex}
                                            style={styles.nullStyle}> </Text>)
                    }
                    date++;
                }
            }
            OutViews.push(<View key={i} style={styles.outLineViewStyle}>
                {RowViews}
            </View>)
        }
        return OutViews;
    }

    _pressDay(year, date) {
        this.setState({
            select: date,
        })
        if (this.props.selectOnListener) {
            this.props.selectOnListener(year, date);
        }
    }

    getTitleView() {
        var views = [];
        var arr = this.state.head;
        for (var i = 0; i < arr.length; i++) {
            views.push(<Text key={i}
                             style={styles.titleStyle}>{arr[i]}</Text>)
        }
        return views;
    }

    /**
     *  当月多少天
     * @returns {number}
     */
    mGetDate() {
        if (this.state.year !== null && this.state.month !== null) {
            //指定日期
            var d = new Date(this.state.year, this.state.month, 0);
            return d.getDate();
        } else {
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var d = new Date(year, month, 0);
            return d.getDate();
        }
    }

    /**
     * 获取当前日
     * @returns {number}
     */
    mGetTodyDate() {
        var d = new Date();
        // console.log("TAG"+d.getFullYear() +"  " +this.state.year+" "+(d.getMonth() + 1) +"   "+ this.state.month)
        if (d.getFullYear() === this.state.year && (d.getMonth() + 1) === this.state.month) {
            return d.getDate();
        } else {
            return -1;
        }
    }

    /**
     * 获取当前时间year
     * @returns {number}
     */
    getNowYear() {
        var d = new Date();
        return d.getFullYear();
    }

    /**
     * 获取当前时间month
     * @returns {number}
     */
    getNowMonth() {
        var d = new Date();
        return d.getMonth();
    }

    /**
     * 当月第一天星期几
     * @returns {number}
     */
    mGetDataWeek() {
        if (this.state.year !== null && this.state.month !== null) {
            //指定日期
            var d = new Date(this.state.year, this.state.month, 0);
            d.setDate(1);
            return d.getDay();
        } else {
            var d = new Date();
            d.setDate(1);
            return d.getDay();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    monthDayStyle: {
        width: 24,
        height: 24,
        textAlign: 'center',
        fontSize: 12,
        paddingTop: 4,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: "#ffc226",
        overflow: 'hidden',
    },
    nullStyle: {
        width: 24,
        height: 24,
        textAlign: 'center',
        fontSize: 12,
    },
    outLineViewStyle: {
        width: SCREEN_WIDTH,
        height: 40,
        marginTop: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center',
    },
    bottomStyle: {
        height: 40,
        textAlign: 'center',
        width: SCREEN_WIDTH,
        color: '#ffab3b'

    },
    titleStyle: {
        width: 30,
        textAlign: 'center',
        height: 30,
        fontSize: 14,
        marginTop: 4,
        color: '#ff3e08',
    }
});

