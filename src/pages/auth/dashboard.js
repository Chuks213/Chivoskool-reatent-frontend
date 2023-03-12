import React, { Component, useContext, useEffect, useState } from 'react';
import AppLayout from "./layout/app-layout";
import Calendar from '../../components/custom-calendar';
import styles from '../../styles/dashboard.module.css';
import { Button, Col, Form, Row } from 'react-bootstrap';
import SubmitTaskIcon from '../../svgs/submit_task_icon.svg';
import NotificationsAvatar from '../../svgs/notifications_avatar.svg';
import PlusIcon from '../../svgs/plus.svg';
import EditIcon from '../../svgs/edit.svg';
import { AppContext } from '../../providers/app-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import getData from '../../networking/send-get-request';
import postData from '../../networking/send-post-request';
import { getAllTodoListItemsUrl, completeTodoListItemUrl, deleteTodoListItemUrl, createTodoListItemUrl } from '../../networking/external-url';
import { showAlert, showAlertWithCallBack } from '../../components/alerter';

export default class DashBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            updateComponent: true
        }
    }

    render() {
        return (
            <AppLayout pageName="Dashboard">
                <LoggedInMessage />
                <Row as="div">
                    <Col md="7">
                        <img src="../svgs/dashboard_image.svg" className={styles.dashboard_image} />
                    </Col>
                    <div className={styles.mobile_clearfix}></div>
                    <Col md="5">
                        <Calendar />
                    </Col>
                </Row>
                <div className={styles.clearfix}></div>
                <Row as="div">
                    <Col md="7">
                        <div className={styles.custom_tbl}>
                            <div className={styles.custom_tbl_header}>
                                <span className={styles.custom_tbl_text}>Notifications</span>
                                <a className={`${styles.custom_tbl_text} ${styles.view_all_btn}`} href="#">View All</a>
                            </div>
                            <div className={styles.custom_tbl_header_border}></div>
                            <div className={styles.custom_tbl_body}>
                                <div className={styles.tbl_group}>
                                    <div className={styles.tbl_left_pane}>
                                        <SubmitTaskIcon />
                                    </div>
                                    <div className={styles.tbl_right_pane}>
                                        <div className={styles.tbl_right_text}>Kemi Adeleke from ss2 sumbitted a task.</div>
                                        <div>
                                            <span className={styles.light_text}>3:56pm</span>
                                            <span className={`${styles.bullet} ${styles.light_text}`}>&bull;</span>
                                            <span className={styles.light_text}>Today</span>
                                        </div>
                                        <div className={styles.custom_tbl_body_border}></div>
                                    </div>
                                </div>
                                <div className={styles.tbl_group}>
                                    <div className={styles.tbl_left_pane}>
                                        <img src="../images/notifications avatar.png" className={styles.avatar} />
                                    </div>
                                    <div className={styles.tbl_right_pane}>
                                        <div className={styles.tbl_right_text}>Admin sent you a general message. click to view</div>
                                        <div>
                                            <span className={styles.light_text}>3:56pm</span>
                                            <span className={`${styles.bullet} ${styles.light_text}`}>&bull;</span>
                                            <span className={styles.light_text}>Today</span>
                                        </div>
                                        <div className={styles.custom_tbl_body_border}></div>
                                    </div>
                                </div>
                                <div className={styles.tbl_group}>
                                    <div className={styles.tbl_left_pane}>
                                        <NotificationsAvatar />
                                    </div>
                                    <div className={styles.tbl_right_pane}>
                                        <div className={styles.tbl_right_text}>Chidubem from ss3 dropped a question Introduction to probability.</div>
                                        <div>
                                            <span className={styles.light_text}>3:56pm</span>
                                            <span className={`${styles.bullet} ${styles.light_text}`}>&bull;</span>
                                            <span className={styles.light_text}>Today</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <div className={styles.mobile_clearfix}></div>
                    <Col md="5">
                        <TodoList />
                    </Col>
                </Row>
            </AppLayout>
        )
    }
}

const LoggedInMessage = (props) => {
    const { currentUser } = useContext(AppContext) || { currentUser: {} };

    return (
        <h2 className={styles.welcome_text}>Welcome back {currentUser ? currentUser.firstName : ""}</h2>
    )
}

const TodoList = () => {
    const { todoListEventDate, toggleSpinner } = useContext(AppContext);

    const [todoListItems, setTodoListItems] = useState([]);
    const [enableEdit, setEnableEdit] = useState(false);
    const [showCreateTextBox, setShowCreateTextBox] = useState(false);
    const [title, setTitle] = useState("");
    const [todoDisabled, setTodoDisabled] = useState(false);

    useEffect(() => {
        if(todoListEventDate) {
            const convertedEventDate = new Date(todoListEventDate);
            convertedEventDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if(convertedEventDate < today)
                setTodoDisabled(true);
            else
                setTodoDisabled(false);
            getTodoListItems();
        }
    }, [todoListEventDate]);

    const getTodoListItems = async () => {
        let todoListItemsResponse = await getData(`${getAllTodoListItemsUrl}${todoListEventDate}`);
        if (todoListItemsResponse) {
            if (todoListItemsResponse.responseCode == 99) {
                setTodoListItems(todoListItemsResponse.responseData);
            } else console.log("Unable to fetch todo list items: " + todoListItemsResponse.errorMessage);
        } else console.log("Unable to fetch todo list items");
    }

    const handleEdit = (e) => {
        e.preventDefault();
        setEnableEdit(!enableEdit);
    }

    const handleAddNewTextBox = (e) => {
        e.preventDefault();
        setShowCreateTextBox(!showCreateTextBox);
    }

    const completeTodoListItem = async (e, itemId) => {
        e.preventDefault();
        toggleSpinner("show");
        let completeTodoListItemResponse = await getData(`${completeTodoListItemUrl}${itemId}`);
        if (completeTodoListItemResponse) {
            if (completeTodoListItemResponse.responseCode == 99) {
                showAlert("success", "Action completed successfully");
                await getTodoListItems();
                toggleSpinner("hide");
            } else {
                toggleSpinner("hide");
                showAlert("error", deleteTodoListItemResponse.errorMessage);
            }
        } else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    const deleteTodoListItem = async (e, itemId) => {
        e.preventDefault();
        toggleSpinner("show");
        let deleteTodoListItemResponse = await getData(`${deleteTodoListItemUrl}${itemId}`);
        if (deleteTodoListItemResponse) {
            if (deleteTodoListItemResponse.responseCode == 99) {
                showAlert("success", "Action completed successfully");
                await getTodoListItems();
                toggleSpinner("hide");
            } else {
                toggleSpinner("hide");
                showAlert("error", deleteTodoListItemResponse.errorMessage);
            }
        } else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        const data = {
            title: title,
            eventDate: todoListEventDate
        }
        let createTodoListItemResponse = await postData(createTodoListItemUrl, data);
        if(createTodoListItemResponse) {
            if(createTodoListItemResponse.responseCode == "99") {
                showAlert("success", "Task added successfully");
                await getTodoListItems();
                setShowCreateTextBox(false);
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", createTodoListItemResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    return (
        <div className={styles.custom_tbl}>
            <div className={styles.custom_tbl_header}>
                <span className={styles.custom_tbl_text}>To-do-List</span>
                <div hidden={todoDisabled}>
                    <a href="#" style={{ marginRight: 15 }} onClick={(e) => handleEdit(e)}><EditIcon /></a>
                    <a href="#" title="Add New" onClick={(e) => handleAddNewTextBox(e)}><PlusIcon /></a>
                </div>
            </div>
            <div className={styles.custom_tbl_header_border}></div>
            <div className={styles.custom_tbl_body}>
                <Form action="#" onSubmit={submit} hidden={!showCreateTextBox}>
                    <Form.Group>
                        <Form.Control placeholder="Enter title*" style={{maxWidth: "95%"}} required onChange={(e) => setTitle(e.target.value)} maxLength="150" />
                    </Form.Group>
                    <Form.Group>
                        <Button type="submit" variant="info">Save</Button>
                    </Form.Group>
                </Form>
                {
                    todoListItems.map(todoListItem => {
                        return (
                            <div className={styles.todo_list_group} key={todoListItem.id}>
                                <span className={`${styles.todo_list_bullet} ${todoListItem.status == "COMPLETED" ? styles.color_completed : ''}`}>&bull;</span>
                                <div className={styles.todo_list_text}>{todoListItem.eventTitle}</div>
                                <a href="#" hidden={!enableEdit || todoListItem.status == "COMPLETED"} title="Delete" onClick={(e) => deleteTodoListItem(e, todoListItem.id)}><FontAwesomeIcon icon={faTrash} size="1x" style={{ color: "red" }} /></a>
                                <a href="#" hidden={enableEdit || todoListItem.status == "COMPLETED"} title="Complete" onClick={(e) => completeTodoListItem(e, todoListItem.id)}><FontAwesomeIcon icon={faCheck} size="1x" style={{ color: "green" }} /></a>
                            </div>
                        );
                    })
                }
                <div style={{textAlign: 'center'}} hidden={todoListItems.length > 0}>No data available</div>
            </div>
        </div>
    );
}