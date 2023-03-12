import React, { Component, useContext, useEffect, createRef, useState } from "react";
import StudentAppLayout from "../../students/layout/app-layout";
import AdminAppLayout from "../../admin/layout/app-layout";
import AuthAppLayout from "../../auth/layout/app-layout";
import { Row, Col, Form, Button } from "react-bootstrap";
import postData from '../../../networking/send-post-request';
import { AppContext } from '../../../providers/app-provider';
import styles from '../../../styles/create-category.module.css';
import Datepicker from "react-datepicker";
import { showAlert, showAlertWithCallBack, showConfirmAlertWithCallBack } from "../../../components/alerter";
import {editProfileUrl} from "../../../networking/external-url";
import {FontAwesomeIcon} from  "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

export default class EditProfile extends Component {
    static async getInitialProps({ query }) {
        const { id, rl } = query;
        return { id, rl };
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CustomAppLayout roleAccr={this.props.rl}>
                <Row className="ml-0 mr-0 mt-2">
                    <ImageUploadPane />
                </Row>
                <Row className="ml-0 mr-0 mt-2">
                    <Col md="6" className="pl-1">
                        <CustomForm />
                    </Col>
                </Row>
            </CustomAppLayout>
        )
    }
}

const ImageUploadPane = () => {
    const { currentUser, toggleSpinner } = useContext(AppContext) || { currentUser: {} };

    const hasDp = currentUser ? currentUser.profilePhotoUrl : undefined;

    const uploadButtonRef = createRef();

    const showUploadDialog = (base64Image) => {
        showConfirmAlertWithCallBack("warning", "Your photo would be uploaded. Do you want to continue?", () => uploadNow(base64Image));
    }

    const handlePhotoChange = (e) => {
        let fileReader = new window.FileReader();
        let file = e.target.files[0];
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
            showUploadDialog(e.target.result);
        }
    }

    const uploadNow = async (base64Image) => {
        toggleSpinner("show");
        let uploadPhotoResponse = await postData(editProfileUrl, {profilePhoto: base64Image});
        if(uploadPhotoResponse) {
            toggleSpinner("hide");
            if(uploadPhotoResponse.responseCode == 99)
                showAlertWithCallBack("success", "Profile photo changed successfully", () => window.location.reload());
            else showAlert("error", uploadPhotoResponse.errorMessage);
        }else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    return (
        <Col md="6" className="pl-1" style={{margin: "20px 0"}}>
            <h5>Display Image</h5>
            <div style={{borderRadius: "50%", width: 120, height: 120, background: "#564B7C", display: "flex", alignItems: "center", flexDirection: "column", padding: 20, cursor: "pointer"}} onClick={() => uploadButtonRef.current.click()} hidden={hasDp}>
                <span style={{ width: "100%", color: "#FFF", textAlign: "center", fontSize: 30 }}>{currentUser ? (currentUser.firstName.substring(0, 1) + currentUser.lastName.substring(0, 1)) : "N/A"}</span>
                <span style={{ width: "100%", color: "#FFF", textAlign: "center", fontSize: 11 }}>Click to add photo</span>
            </div>
            <div style={{margin: "13px 0", cursor: "pointer"}} onClick={() => uploadButtonRef.current.click()} hidden ={!hasDp}>
                <img src={hasDp} style={{borderRadius: "50%", width: 180, height: 180}} />
            </div>
            <input type="file" className="mt-10" accept="image/*" ref={uploadButtonRef} hidden onChange={(e) => handlePhotoChange(e)} />
        </Col>
    )
}

const CustomForm = () => {
    const { toggleSpinner, currentUser } = useContext(AppContext) || { currentUser: {} };

    const [changeDob, setChangeDob] = useState(false);

    const [state, setState] = useState({
        firstName: null,
        lastName: null,
        emailAddress: null,
        unformattedDob: "",
        dob: null,
        oldPassword: null,
        newPassword: null,
        confirmNewPassword: null
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfrimPassword, setShowConfirmPassword] = useState(false);
    const passwordRefOne = createRef();
    const passwordRefTwo = createRef();
    const passwordRefThree = createRef();

    useEffect(() => {
        if(currentUser)
            setState({...state, dob: currentUser.dob});
    }, [currentUser]);

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }

    const handleDpChange = (value) => {
        let year = value.getFullYear();
        let month = (value.getMonth() + 1);
        let day = value.getDate();
        day = day.toString().length == 1 ? ("0" + day) : day;
        month = month.toString().length == 1 ? ("0" + month) : month;
        setState({ ...state, unformattedDob: value, dob: `${year}-${month}-${day}` });
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let submitFormResponse = await postData(editProfileUrl, state);
        if (submitFormResponse) {
            toggleSpinner("hide");
            if (submitFormResponse.responseCode == "99") {
                if(!state.oldPassword && !state.confirmNewPassword)
                    showAlertWithCallBack("success", submitFormResponse.message, () => window.location.reload());
                else
                    showAlertWithCallBack("success", "Profile edited successfully. You would be logged out because your password has changed.", () => window.location.href = "/login");
            }else showAlert("error", submitFormResponse.errorMessage);
        } else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    const renderDobField = () => {
        const datePicker = (
            <Datepicker
                selected={state.unformattedDob}
                onChange={handleDpChange}
                className={`form-control ${styles.custom_input}`}
                minDate={new Date("01/01/1930")}
                maxDate={new Date()}
                placeholderText="D.O.B"
                calendarClassName="rasta-stripes"
                showYearDropdown
                popperModifiers={{
                    offset: {
                        enabled: true,
                        offset: "0px, 0px"
                    },
                    preventOverflow: {
                        enabled: true,
                        escapeWithReference: false,
                        boundariesElement: "scrollParent"
                    }
                }}
            />
        );
        if (currentUser) {
            return currentUser.dob ? 
            changeDob ? datePicker : (
                <Form.Row>
                    <Col md="9">
                        <input type="text" className={styles.custom_input} placeholder="D.O.B" style={{backgroundColor: "#FFFFFF"}} defaultValue={state.dob} readOnly/>
                    </Col>
                    <Col md="3">
                        <a href="#" onClick={(e) => {e.preventDefault(); setChangeDob(true);}}>Change D.O.B</a>
                    </Col>
                </Form.Row>
            ) : (datePicker);
        }
        return datePicker;
    }

    const togglePassword = (action, fieldNo) => {
        if(action == "show") {
            if(fieldNo == 1) {
                passwordRefOne.current.type = "text";
                setShowOldPassword(true);
            }else if(fieldNo == 2) {
                passwordRefTwo.current.type = "text";
                setShowNewPassword(true);
            }else {
                passwordRefThree.current.type = "text";
                setShowConfirmPassword(true);
            }
        }else {
            if(fieldNo == 1) {
                passwordRefOne.current.type = "password";
                setShowOldPassword(false);
            }else if(fieldNo == 2) {
                passwordRefTwo.current.type = "password";
                setShowNewPassword(false);
            }else {
                passwordRefThree.current.type = "password";
                setShowConfirmPassword(false);
            }
        }
    }

    return (
        <Form method="post" action="#" onSubmit={(e) => submit(e)}>
            <Form.Group>
                <h5>Personal Information</h5>
            </Form.Group>
            <Form.Group>
                <input type="text" name="firstName" className={styles.custom_input} placeholder="First Name*" onChange={(e) => handleChange(e)} defaultValue={currentUser ? currentUser.firstName : ""} required />
            </Form.Group>
            <Form.Group>
                <input type="text" name="lastName" className={styles.custom_input} placeholder="Last Name*" onChange={(e) => handleChange(e)} defaultValue={currentUser ? currentUser.lastName : ""} required />
            </Form.Group>
            <Form.Group>
                <input type="email" name="emailAddress" className={styles.custom_input} placeholder="Email Address*" onChange={(e) => handleChange(e)} defaultValue={currentUser ? currentUser.emailAddress : ""} required />
            </Form.Group>
            <Form.Group>
                <input type="tel" name="phoneNumber" className={styles.custom_input} placeholder="Phone Number" onChange={(e) => handleChange(e)} defaultValue={currentUser ? currentUser.phoneNumber : ""} />
            </Form.Group>
            <Form.Group>
                {renderDobField()}
            </Form.Group>
            <Form.Group>
                <h5>Change Password</h5>
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <Col md="6">
                        <div className="input-group mb-3">
                            <label htmlFor="oldPassword" className="control-label sr-only">Old Password</label>
                            <input type="password" className={`form-control ${styles.control_input} borderless-input-fc`} style={{borderRight: 0}} name="oldPassword" placeholder="Old Password" ref={passwordRefOne} onChange={(e) => handleChange(e)} minLength="8" onPaste={(e) => {e.preventDefault(); return false;}} onDrop={(e) => {e.preventDefault(); return false;}} autoComplete="off"/>
                            <div className="input-group-append" hidden={showOldPassword}>
                                <button type="button" className={`input-group-text ${styles.borderless_btn}`} onClick={() => togglePassword("show", 1)} title="Show Password"><FontAwesomeIcon icon={faEye} size="1x" /></button>
                            </div>
                            <div className="input-group-append" hidden={!showOldPassword}>
                                <button type="button" className={`input-group-text ${styles.borderless_btn}`} onClick={() => togglePassword("hide", 1)} title="Hide Password"><FontAwesomeIcon icon={faEyeSlash} size="1x" /></button>
                            </div>
                        </div>
                    </Col>
                    <Col md="6">
                        <div className="input-group mb-3">
                            <label htmlFor="newPassword" className="control-label sr-only">New Password</label>
                            <input type="password" className={`form-control ${styles.control_input} borderless-input-fc`} style={{borderRight: 0}} name="newPassword" placeholder="New Password" ref={passwordRefTwo} onChange={(e) => handleChange(e)} minLength="8" onPaste={(e) => {e.preventDefault(); return false;}} onDrop={(e) => {e.preventDefault(); return false;}} autoComplete="off"/>
                            <div className="input-group-append" hidden={showNewPassword}>
                                <button type="button" className={`input-group-text ${styles.borderless_btn}`} onClick={() => togglePassword("show", 2)} title="Show Password"><FontAwesomeIcon icon={faEye} size="1x" /></button>
                            </div>
                            <div className="input-group-append" hidden={!showNewPassword}>
                                <button type="button" className={`input-group-text ${styles.borderless_btn}`} onClick={() => togglePassword("hide", 2)} title="Hide Password"><FontAwesomeIcon icon={faEyeSlash} size="1x" /></button>
                            </div>
                        </div>
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <Col md="6">
                        <div className="input-group mb-3">
                            <label htmlFor="confirmPassword" className="control-label sr-only">Confirm Password</label>
                            <input type="password" className={`form-control ${styles.control_input} borderless-input-fc`} style={{borderRight: 0}} name="confirmNewPassword" placeholder="Confirm New Password" ref={passwordRefThree} onChange={(e) => handleChange(e)} minLength="8" onPaste={(e) => {e.preventDefault(); return false;}} onDrop={(e) => {e.preventDefault(); return false;}} autoComplete="off"/>
                            <div className="input-group-append" hidden={showConfrimPassword}>
                                <button type="button" className={`input-group-text ${styles.borderless_btn}`} onClick={() => togglePassword("show", 3)} title="Show Password"><FontAwesomeIcon icon={faEye} size="1x" /></button>
                            </div>
                            <div className="input-group-append" hidden={!showConfrimPassword}>
                                <button type="button" className={`input-group-text ${styles.borderless_btn}`} onClick={() => togglePassword("hide", 3)} title="Hide Password"><FontAwesomeIcon icon={faEyeSlash} size="1x" /></button>
                            </div>
                        </div>
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <div className={`mt-20 ${styles.action_pane}`}>
                        <Button type="submit" variant="info">Save</Button>
                    </div>
                </Form.Row>
            </Form.Group>
        </Form>
    );
}

const CustomAppLayout = (props) => {
    switch (props.roleAccr) {
        case "st":
            return <StudentAppLayout pageName="Edit Profile">{props.children}</StudentAppLayout>;
        case "le":
            return <AuthAppLayout pageName="Edit Profile">{props.children}</AuthAppLayout>;
        case "ad":
            return <AdminAppLayout pageName="Edit Profile">{props.children}</AdminAppLayout>;
        default:
            return <div>No data available</div>;
    }
}