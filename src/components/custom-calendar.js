import React, { Component, useContext, useEffect } from 'react';
import {addMonths, format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay, parse, subMonths, getISODay} from "date-fns";
import styles from '../styles/calendar.module.css';
import { AppContext } from '../providers/app-provider';
import getData from "../networking/send-get-request";
import {getAllTodoListItemsCountUrl} from "../networking/external-url";

export default class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date()
        }
    }

    renderHeader() {
        const dateFormat = "MMMM yyyy";

        return (
            <div className={`${styles.header} ${styles.row}`}>
                <div className={``}>
                    <div className={styles.icon} onClick={this.prevMonth}>
                        chevron_left
              </div>
                </div>
                <div className={`${styles.col} ${styles.col_center}`}>
                    <span>{format(this.state.currentMonth, dateFormat)}</span>
                </div>
                <div className={``} onClick={this.nextMonth}>
                    <div className={styles.icon}>chevron_right</div>
                </div>
            </div>
        );
    }

    getISOFullDay(isoDay) {
        switch(isoDay) {
            case 1: 
                return "MON";
            case 2: 
                return "TUE";
            case 3:
                return "WED";
            case 4: 
                return "THU";
            case 5:
                return "FRI";
            case 6:
                return "SAT";
            case 7:
                return "SUN";
            default:
                return "N/A";
        }
    }

    renderDays() {
        const dateFormat = "ddd";
        const days = [];

        let startDate = startOfWeek(this.state.currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className={`${styles.col} ${styles.col_center} ${styles.calendar_days_of_the_week}`} key={i}>
                    {/* {format(addDays(startDate, i), dateFormat)} */}
                    {this.getISOFullDay(getISODay(addDays(startDate, i), dateFormat))}
                </div>
            );
        }

        return <div className={`${styles.days} ${styles.row}`}>{days}</div>;
    }

    renderCells() {
        const { currentMonth, selectedDate } = this.state;
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                days.push(
                    <div
                        className={`${styles.col} ${styles.cell} ${isSameDay(day, selectedDate) ? `${styles.selected}` : ""}`}
                        key={day}
                        onClick={() => this.onDateClick(cloneDay)}
                    >
                        <span className={styles.indicator} id={`indicator|${cloneDay.getFullYear()}-${cloneDay.getMonth() + 1}-${cloneDay.getDate()}`} hidden={true}></span>
                        <span className={`${styles.number} ${!isSameMonth(day, monthStart)
                                ? `${styles.disabled}` : ''}`}>{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className={styles.row} key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className={styles.body}>{rows}</div>;
    }

    onDateClick = day => {
        this.setState({
            selectedDate: day
        });
    };

    nextMonth = () => {
        this.setState({
            currentMonth: addMonths(this.state.currentMonth, 1)
        });
    };

    prevMonth = () => {
        this.setState({
            currentMonth: subMonths(this.state.currentMonth, 1)
        });
    };

    render() {
        return (
            <div className={styles.calendar}>
                {this.renderHeader()}
                {this.renderDays()}
                {this.renderCells()}
                <CalendarDateUpdater selectedDate={this.state.selectedDate} currentMonth={this.state.currentMonth} />
            </div>
        );
    }
}

const CalendarDateUpdater = (props) => {
    const {updateCalendarDate} = useContext(AppContext);

    const formatDateToServerSpec = (dateToFormat) => {
        let year = dateToFormat.getFullYear();
        let month = (dateToFormat.getMonth() + 1);
        let day = dateToFormat.getDate();
        day = day.toString().length == 1 ? ("0" + day) : day;
        month = month.toString().length == 1 ? ("0" + month) : month;
        return (`${year}-${month}-${day}`);
    }

    const getTodoItemsCountByEventDate = async (eventDate) => {
        let getTodoItemsCountResponse = await getData(getAllTodoListItemsCountUrl + eventDate);
        if(getTodoItemsCountResponse) {
            if(getTodoItemsCountResponse.responseCode == 99) return getTodoItemsCountResponse.responseData;
        }
        return 0;
    }

    const addDateIndidcator = async () => {
        let startDate = props.selectedDate;
        startDate.setHours(0, 0, 0, 0);
        const monthStart = startOfMonth(props.currentMonth);
        const endDate = endOfMonth(monthStart);
        while (startDate <= endDate) {
            const formattedServerDate = formatDateToServerSpec(startDate);
            const count = await getTodoItemsCountByEventDate(formattedServerDate);
            const indicatorElement = document.getElementById(`indicator|${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`);
            if(count > 0)
                indicatorElement.removeAttribute("hidden");
            else
                indicatorElement.setAttribute("hidden", "hidden");
            startDate = addDays(startDate, 1);
        }
    }

    useEffect(() => {
        if(props.selectedDate) {
            updateCalendarDate(props.selectedDate);
            addDateIndidcator();
        }
    }, [props.selectedDate]);

    return <span></span>;
}