import React, {Component} from 'react';
import AppLayout from './layout/app-layout';
import {Row, Col, Form, Button} from 'react-bootstrap';
import styles from '../styles/login.module.css';
import {storeUserToken, logout, fetchCurrentUser} from '../components/host-master';
import postData from '../networking/send-post-request';
import {loginUrl} from '../networking/external-url';
import {showAlert, showAlertWithCallBack} from '../components/alerter';
import Spinner from '../components/spinner';
import EyeIcon from '../svgs/eye_icon_bg.svg';
import EyeIconHide from '../svgs/eye_icon.svg';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.passwordRef = React.createRef();

        this.state = {
            emailAddress: "",
            password: "",
            rememberMe: false,
            showSpinner: false,
            showPassword: false
        }
    }

    componentDidMount() {
        logout();
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleCheckboxChange(e) {
        this.setState({rememberMe: e.target.checked});
    }

    togglePassword(action) {
        if(action == "show") {
            this.passwordRef.current.type = "text";
            this.setState({showPassword: true});
        }else {
            this.passwordRef.current.type = "password";
            this.setState({showPassword: false});
        }
    }

    async submit(e) {
        e.preventDefault();
        this.toggleSpinner("show");
        let loginResponse = await postData(loginUrl, this.state);
        if(loginResponse) {
            if(loginResponse.responseCode == 99) {
                if(this.state.rememberMe) storeUserToken(loginResponse.token);
                else storeUserToken(loginResponse.token, true);
                this.navigateToDashBoard();
            }else {
                this.toggleSpinner("hide");
                showAlert("error", "Invalid email address or password");
            }
        }else {
            this.toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    toggleSpinner(action) {
        if(action == "show") this.setState({showSpinner: true});
        else this.setState({showSpinner: false});
    }

    navigateToDashBoard() {
        fetchCurrentUser().then(data => {
            // this.toggleSpinner("hide");
            if(data) {
                switch(data.role.name) {
                    case "ADMIN":
                        try { window.location.replace("/admin/dashboard"); } 
                        catch(e) { window.location = "/admin/dashboard"; }
                        break;
                    case "STUDENT":
                        try { window.location.replace("/students/dashboard"); } 
                        catch(e) { window.location = "/students/dashboard"; }
                        break;
                    case "LECTURER":
                        try { window.location.replace("/auth/dashboard"); } 
                        catch(e) { window.location = "/auth/dashboard"; }
                        break;
                    default:
                        showAlertWithCallBack("error", "An internal server error occurred.", () => window.location.reload());
                        break;
                }
            }else showAlertWithCallBack("error", "An internal server error occurred.", () => window.location.reload());
        }).catch(err => {
            this.toggleSpinner("hide");
            console.log("Couldn't fetch user details");
            console.log(err);
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        })
    }

    render() {
        return(
            <AppLayout pageName="Login" showHeader={false} showFooter={false}>
                <Spinner showSpinner={this.state.showSpinner}/>
                <Row className={styles.main_row}>
                    <Col md="6" className={styles.login_row}>
                        <div className={styles.big_header}>Learning the SMARTER way, <br/>Learning the REATENT way</div>
                        <div className={styles.text_under}>Reatent is an e-learning platform that allows you watch your lectures, and makes sure you didn’t miss anything from the class.</div>
                        <div className={styles.login_image_pane}>
                            <img src="images/image7.PNG" className={styles.login_image} alt="Login Image" />
                        </div>
                    </Col>
                    <Col md="6" className={styles.light_background}>
                        <div className={styles.center_box}>
                            <div className={styles.logo_bg}>
                                <img src="images/reatent coloured logo.png" alt="Logo" />
                            </div>
                            <div className={styles.login_form}>
                                <Form action="#" method="post" onSubmit={this.submit.bind(this)}>
                                    <Form.Group>
                                        <span className={styles.login_text}>Log In</span>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control placeholder="Email Address" className={`${styles.control_input} borderless-input-fc`} name="emailAddress" onChange={this.handleChange.bind(this)} required />
                                    </Form.Group>
                                    <div className="input-group mb-3">
                                        <label htmlFor="signin-password" className="control-label sr-only">Password</label>
                                        <input type="password" className={`form-control ${styles.control_input} borderless-input-fc`} style={{borderRight: 0}} name="password" placeholder="Password" ref={this.passwordRef} onChange={this.handleChange.bind(this)} minLength="8" onPaste={(e) => {e.preventDefault(); return false;}} onDrop={(e) => {e.preventDefault(); return false;}} autoComplete="off" required/>
                                        <div className="input-group-append" hidden={this.state.showPassword}>
                                            <button type="button" className="input-group-text" onClick={() => this.togglePassword("show")} title="Show Password"><EyeIcon /></button>
                                        </div>
                                        <div className="input-group-append" hidden={!this.state.showPassword}>
                                            <button type="button" className="input-group-text" onClick={() => this.togglePassword("hide")} title="Hide Password"><EyeIconHide /></button>
                                        </div>
                                    </div>
                                    <Form.Group controlId="formBasicCheckbox">
                                        <div className={styles.login_extras}>
                                            <Form.Check type="checkbox" label="Remember me" onChange={this.handleCheckboxChange.bind(this)} />
                                            <a href="/forgot-password" className={styles.forgot_password}>Forgot Password?</a>
                                        </div>
                                    </Form.Group>
                                    <Form.Group>
                                        <div style={{float: 'right'}}>
                                            <Button varian="primary" type="submit" style={{padding: "12px 45px"}}>Login</Button>
                                        </div>
                                    </Form.Group>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </AppLayout>
        )
    }
}