import { useContext, useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Form, Button, InputGroup, Row, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faSignOutAlt, faUserEdit, faTimes, faTimesCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../../providers/app-provider';
import Router from 'next/router';
import { logout } from '../../../components/host-master';
import SettingsIcon from '../../../svgs/settings.svg';
import BellIcon from '../../../svgs/bell.svg';
import { useDropdownToggle, Dropdown } from 'react-overlays';
import ActionIcon from '../../../svgs/action_icon.svg';
import { showAlert, showAlertWithCallBack } from '../../../components/alerter';
import {getSearchCountForLecturer, websocket_url, lecturerGroupTopicUrl, getNotificationsUrl} from "../../../networking/external-url";
import getData from "../../../networking/send-get-request";
import SockJsClient from 'react-stomp';
import { getUserToken } from "../../../components/host-master";

const Header = () => {
    const { currentUser, toggleSidebar, toggleSpinner } = useContext(AppContext) || { currentUser: {} };
    const [displaySearchResults, setDisplaySearchResults] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [totalInClasses, setTotalInClasses] = useState(0);
    const [totalInLibrary, setTotalInLibrary] = useState(0);
    const [totalInSubmissions, setTotalInSubmissions] = useState(0);

    const getTitle = () => {
        if(!currentUser) {
            return (
                <div className="pull-left custom-title">
                    <div className="rounded-image" style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ width: "100%", color: "#FFF", textAlign: "center", fontSize: 11 }}>N/A</span>
                    </div>
                </div>
            )
        }else {
            if(!currentUser.profilePhotoUrl) {
                return (
                    <div className="pull-left custom-title">
                        <div className="rounded-image rounded-image2" style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ width: "100%", color: "#FFF", textAlign: "center", fontSize: 11 }}>{currentUser.firstName ? (currentUser.firstName.substring(0, 1) + currentUser.lastName.substring(0, 1)) : "N/A"}</span>
                        </div>
                    </div>
                )
            }else {
                return (
                    <div className="pull-left custom-title">
                        <div className="rounded-image rounded-image2" style={{ display: "flex", alignItems: "center" }}>
                            <img src={currentUser.profilePhotoUrl} className="thumbnail-image" alt="Profile Photo"/>
                        </div>
                    </div>
                )
            }
        }
    }

    const getRoundedImage = () => {
        if(!currentUser) {
            return (
                <span className="rounded-image rounded-image2">
                    <span className="rounded-image-text">N/A</span>
                </span>
            )
        }else {
            if(!currentUser.profilePhotoUrl) {
                return (
                    <div className="rounded-image rounded-image2" style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ width: "100%", color: "#FFF", textAlign: "center", fontSize: 11 }}>{currentUser.firstName ? (currentUser.firstName.substring(0, 1) + currentUser.lastName.substring(0, 1)) : "N/A"}</span>
                    </div>
                )
            }else {
                return (
                    <div className="rounded-image rounded-image2" style={{ display: "flex", alignItems: "center" }}>
                        <img src={currentUser.profilePhotoUrl} className="thumbnail-image" alt="Profile Photo"/>
                    </div>
                )
            }
        }
    }

    const toggleClick = (e) => {
        e.preventDefault();
        toggleSidebar();
    }

    const editProfile = async (e) => {
        e.preventDefault();
        window.location.href = "/profile/edit/" + currentUser.id + "?rl=le";
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        logout();
        window.location.replace("/login");
    }

    const performSearch = () => {
        if(searchParam.trim() == "") {
            showAlert("error", "Search parameter cannot be empty");
        }else {
            toggleSpinner("show");
            getData(getSearchCountForLecturer + searchParam)
            .then(data => {
                toggleSpinner("hide");
                if(data) {
                    if(data.responseCode == 99) {
                        setTotalInClasses(data.responseData.totalInClasses);
                        setTotalInLibrary(data.responseData.totalInLibrary);
                        setTotalInSubmissions(data.responseData.totalInSubmissions);
                        setDisplaySearchResults(true);
                    }else showAlert("error", data.errorMessage);
                }else {
                    showAlertWithCallBack("error", "Oops! A critical error occurred. Please try again later", () => window.location.reload());
                }
            })
            .catch(err => {
                toggleSpinner("hide");
                console.log("An error occurred while trying to fetch search count: ", err);
                showAlertWithCallBack("error", "Oops! A critical error occurred. Please try again later", () => window.location.reload());
            });
        }
    }

    const dismiss = (e) => {
        e.preventDefault();
        setDisplaySearchResults(false);
        setSearchParam("");
    }

    return (
        <Navbar bg="light" expand="lg" className="bg-white b-bm">
            <Navbar.Brand href="/auth/dashboard" className="w-100 custom-navbar-brand auth-logo" style={{ marginRight: 0 }}>
                {/* <img src="/images/reatent white logo.png" alt="Logo" className="app-logo" /> */}
                Reatent
            </Navbar.Brand>
            {/* <Nav className="mr-auto sidebar-toggle">
                <Nav.Link href="#" title="Toggle Sidebar Menu" onClick={(e) => toggleClick(e)} style={{color: "#000000 !important"}}>
                    <FontAwesomeIcon icon={faBars} size="lg"/>
                </Nav.Link>
            </Nav> */}
            <Nav className="nav-fit-screen">
                <InputGroup className="mb-2 mt-2">
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={faSearch} size="1x" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control className="bl-none" placeholder="Type a date [yyyy-mm-dd], topic, keyword" aria-label="Type a date, topic, subject" aria-describedby="basic-addon2" onChange={(e) => setSearchParam(e.target.value)} value={searchParam} />
                    <InputGroup.Append>
                        <Button variant="secondary" className="search-btn" onClick={() => performSearch()}>Search</Button>
                    </InputGroup.Append>
                </InputGroup>
                <div className={`search-result ${!displaySearchResults ? "d-none" : ""}`}>
                    <a href={"/auth/my-classes?s=" + searchParam}>{totalInClasses == 0 ? "No" : totalInClasses} <span style={{textTransform: "none"}}>Result(s)</span> found in My Classes</a>
                    <a href={"/auth/library?s=" + searchParam}>{totalInLibrary == 0 ? "No" : totalInLibrary} <span style={{textTransform: "none"}}>Result(s)</span> found in Library</a>
                    <a href={"/auth/submissions/all?s=" + searchParam}>{totalInSubmissions == 0 ? "No" : totalInSubmissions} <span style={{textTransform: "none"}}>Result(s)</span> found in submissions</a>
                    <a href="#" title="Dismiss" style={{margin: "0 auto", width: 70, padding: 4, background: "#C4C4C4", color: "#322035", borderRadius: 7}} onClick={(e) => dismiss(e)}><FontAwesomeIcon icon={faTimesCircle} style={{fontSize: 23, verticalAlign: "middle"}} /></a>
                </div>
            </Nav>
            <Nav className="mr-auto sidebar-toggle">
                <Nav.Link href="#" title="Toggle Sidebar Menu" onClick={(e) => toggleClick(e)} style={{ color: "#7969AC !important" }}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </Nav.Link>
            </Nav>
            <Nav className="ml-auto" style={{ paddingRight: 8 }}>
                <Nav.Link href="#" title="Notifications" style={{ paddingRight: 10 }}>
                    <NotificationsButton />
                </Nav.Link>
                {/* <Nav.Link href="#home" title="Settings" style={{ paddingRight: 10 }}>
                    <SettingsIcon />
                </Nav.Link> */}
                <NavDropdown title={getTitle()} id="basic-nav-dropdown">
                    <NavDropdown.Header>
                        <div className="header-div">
                            {getRoundedImage()}
                            <div style={{ width: "80%", padding: 3 }}>
                                {currentUser ? <div className="text-primary">{currentUser.firstName + ' ' + currentUser.lastName}</div> : <div className="text-primary">N/A</div>}
                                {currentUser ? <div className="text-primary" style={{ wordBreak: "break-word" }}>{currentUser.emailAddress}</div> : <div className="text-primary" style={{ wordBreak: "break-word" }}>N/A</div>}
                            </div>
                        </div>
                    </NavDropdown.Header>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#" onClick={(e) => editProfile(e)}>
                        <FontAwesomeIcon icon={faUserEdit} size="sm" className="text-primary" />&nbsp;&nbsp;<span className="text-primary">Edit Profile</span>
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#" onClick={(e) => { handleLogout(e) }}>
                        <FontAwesomeIcon icon={faSignOutAlt} size="sm" className="text-primary" />&nbsp;&nbsp;&nbsp;<span className="text-primary">Logout</span>
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar>
    );
}

const NotificationsButton = (props) => {
    const { toggleSpinner, currentUser } = useContext(AppContext) || { currentUser: {} };

    const [show, setShow] = useState(false);
    const [userToken, setUserToken] = useState("");
    const [notificationsList, setNotificationsList] = useState([]);
    const [newMessageReceived, setNewMessageReceived] = useState(false);

    useEffect(() => {
        if (notificationsList.length == 0) getAllNotifications();
        if (localStorage) {
            let tkn = getUserToken();
            setUserToken(tkn);
        }
    }, []);

    const getAllNotifications = async () => {
        let getAllNotificationsResponse = await getData(`${getNotificationsUrl}0/10`);
        if (getAllNotificationsResponse) {
            if (getAllNotificationsResponse.responseCode == 99)
                setNotificationsList(getAllNotificationsResponse.responseData);
        }
    }

    const onConnected = () => {
        console.log("Connected!!");
    }

    const onDisconnect = () => {
        console.log("Disconnected!!");
    }

    const onMessageReceived = (msg) => {
        if (msg) {
            if (msg.responseCode == "99") {
                const {responseData} = msg;
                if (responseData && responseData.length > 0 && currentUser) {
                    const {assignedClasses} = currentUser;
                    
                    const newList = responseData.filter(notification => {
                        let isForLecturer = false;
                        if(assignedClasses && assignedClasses.length > 0)
                            if(assignedClasses.filter(clazz => clazz.id == notification.schoolClassId).length > 0) isForLecturer = true;
                        return isForLecturer;
                    });

                    setNotificationsList(newList);
                    setNewMessageReceived(true);
                }
            }
        }
    }

    const handleDropdownToggle = (e) => {
        e.preventDefault();
        setShow(!show);
        if (show) setNewMessageReceived(false);
    }

    const deleteNotification = async (notificationId) => {
        toggleSpinner("show");
        const deleteNotificationResponse = await getData(deleteNotificationUrl + notificationId);
        if (deleteNotificationResponse) {
            if (deleteNotificationResponse.responseCode == 99) {
                getAllNotifications();
                toggleSpinner("hide");
            } else {
                showAlert("error", "Unable to delete notification at this moment. Please try again later");
            }
        } else {
            showAlert("error", "Unable to delete notification at this moment. Please check your internet connection and try again later");
        }
    }

    const clearAllNotifications = async () => {
        toggleSpinner("show");
        if (notificationsList.length == 0) return;
        const clearAllNotificationsResponse = await getData(clearAllNotificationsUrl + notificationsList[0].id);
        if (clearAllNotificationsResponse) {
            if (clearAllNotificationsResponse.responseCode == 99) {
                getAllNotifications();
                toggleSpinner("hide");
            } else {
                showAlert("error", "Unable to clear all notification at this moment. Please try again later");
            }
        } else {
            showAlert("error", "Unable to clear all notification at this moment. Please check your internet connection and try again later");
        }
    }

    const Menu = ({ role, showDropDown }) => {
        return (
            <div role={role} className={`menu-container ${!showDropDown ? "menu-container-hidden" : ""}`}>
                <div className="notification-header">
                    Notification
                    <a href="#" className="clr-all-btn" hidden={notificationsList.length == 0} onClick={(e) => { e.preventDefault(); clearAllNotifications(); }}>Clear all notifications</a>
                    <a href="#" title="Close" className="close-button" onClick={(e) => { e.preventDefault(); setShow(false); setNewMessageReceived(false); }}>
                        <FontAwesomeIcon icon={faTimes} sixe="1x" />
                    </a>
                </div>
                <div className="divider"></div>
                <div className="notification-body">
                    {
                        notificationsList.length > 0 ? notificationsList.map((notification, index) => {
                            return (
                                <div className="notification-container" key={index}>
                                    <div className="w-10">
                                        <span className="rounded-image rounded-image2 w-90 b-r-50" title="Notification Image">
                                            {
                                                notification.photoUrl ? <img src={notification.photoUrl || "https://dummyimage.com/600x400/000/fff"} className="thumbnail-image" alt="Profile Photo" /> : <span className="rounded-image-text">N/A</span>
                                            }
                                            {/* <span className="rounded-image-text">N/A</span> */}
                                        </span>
                                    </div>
                                    <div className="w-80 notification-message" title="Notification Message">
                                        {notification.message}
                                        <div style={{ padding: "10px 0" }}>{notification.timeStamp}</div>
                                    </div>
                                    <div className="w-10" title="Remove">
                                        <a href="#" onClick={(e) => { e.preventDefault(); deleteNotification(notification.id); }}><FontAwesomeIcon icon={faTrashAlt} className="del-btn" /></a>
                                    </div>
                                </div>
                            )
                        }) : <div className="notification-container" style={{ justifyContent: "center", color: "#322035" }}>No record available</div>
                    }
                </div>
                <div className="divider" hidden={notificationsList.length < 10}></div>
                <div className="notification-footer" hidden={notificationsList.length < 10}><a href="#" title="View All Notifications">View All</a></div>
            </div>
        );
    };

    const Toggle = ({ id, children }) => {
        const [props, { show, toggle }] = useDropdownToggle();
        return (
            <button type="button" className="btn" id={id} {...props} onClick={toggle} style={{padding: 0}}>
                {children}
            </button>
        );
    };

    const DropdownButton = ({
        show,
        onToggle,
        title,
        role,
    }) => (
        <Dropdown show={false} onToggle={onToggle} drop={"left"}>
            <div className="relative inline-block">
                <Toggle id="example-toggle">{title}</Toggle>
                <Menu role={role} showDropDown={show} />
            </div>
        </Dropdown>
    );

    return (
        <DropdownButton show={show} onToggle={(e) => setShow(!show)} title={<BellIcon/>} />
    );
}

export default Header;