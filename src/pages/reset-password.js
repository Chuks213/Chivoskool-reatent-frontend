import React, { Component } from 'react';
import AppLayout from './layout/app-layout';
import { Row, Col, Form, Button } from 'react-bootstrap';
import styles from '../styles/reset-password.module.css';
import postData from '../networking/send-post-request';
import {resetPasswordUrl} from '../networking/external-url';
import {showAlert, showAlertWithCallBack} from '../components/alerter';
import Spinner from '../components/spinner';
import EyeIcon from '../svgs/eye_icon_bg.svg';
import EyeIconHide from '../svgs/eye_icon.svg';

export default class ResetPassword extends Component {
    static async getInitialProps({ query }) {
        const { at } = query;
        return { at };
    }

    constructor(props) {
        super(props);

        this.passwordRef = React.createRef();

        this.state = {
            newPassword: "",
            confirmNewPassword: "",
            rememberMe: false,
            showSpinner: false,
            showPassword: false
        }
    }

    handleChange(e) {
        const {value} = e.target;
        this.setState({newPassword: value, confirmNewPassword: value});
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
        let resetPasswordResponse = await postData(resetPasswordUrl, this.state, this.props.at);
        if(resetPasswordResponse) {
            if(resetPasswordResponse.responseCode == 99) {
                this.toggleSpinner("hide");
                showAlertWithCallBack("success", "Password rest successful. Kindly login with new password", () => window.location.href = "/login");
            }else {
                this.toggleSpinner("hide");
                showAlert("error", resetPasswordResponse.errorMessage);
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

    render() {
        return (
            <AppLayout pageName="ResetPassword" showHeader={false} showFooter={false}>
                <Spinner showSpinner={this.state.showSpinner}/>
                <Row className={styles.main_row}>
                    <Col md="6" className={styles.reset_row}>
                        <div className={styles.big_header}>Learning the SMARTER way, <br />Learning the REATENT way</div>
                        <div className={styles.text_under}>Reatent is an e-learning platform that allows you watch your lectures, and makes sure you didn’t miss anything from the class.</div>
                        <div className={styles.reset_image_pane}>
                            <img src="/images/image99.png" className={styles.reset_image} alt="Reset Password Image" />
                        </div>
                    </Col>
                    <Col md="6" className={styles.light_background}>
                        <div className={styles.center_box}>
                            <div className={styles.logo_bg}>
                                <img src="/images/reatent coloured logo.png" alt="Logo" />
                            </div>
                            <div className={styles.reset_form}>
                                <Form action="#" method="post" onSubmit={this.submit.bind(this)}>
                                    <Form.Group>
                                        <span className={styles.reset_text}>Reset Password</span>
                                    </Form.Group>

                                    {/* <Form.Group>
                                        <Form.Label></Form.Label>
                                        <Form.Control type="password" placeholder="Password" />
                                    </Form.Group> */}

                                    <div className="input-group mb-3">
                                        <label htmlFor="signin-password" className="control-label sr-only">Password</label>
                                        <input type="password" className={`form-control ${styles.control_input}`} style={{borderRight: 0}} name="password" placeholder="Password" ref={this.passwordRef} onChange={this.handleChange.bind(this)} minLength="8" onPaste={(e) => {e.preventDefault(); return false;}} onDrop={(e) => {e.preventDefault(); return false;}} autoComplete="off" required/>
                                        <div className="input-group-append" hidden={this.state.showPassword}>
                                            <button type="button" className="input-group-text" onClick={() => this.togglePassword("show")} title="Show Password"><EyeIcon /></button>
                                        </div>
                                        <div className="input-group-append" hidden={!this.state.showPassword}>
                                            <button type="button" className="input-group-text" onClick={() => this.togglePassword("hide")} title="Hide Password"><EyeIconHide /></button>
                                        </div>
                                    </div>

                                    <Form.Group>
                                        <div className={styles.reset_text} style={{ float: 'right' }}>
                                            <Button type="submit" variant="primary" style={{ padding: "12px 45px" }}>Reset Password</Button>
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