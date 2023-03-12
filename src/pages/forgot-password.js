import React, {Component} from 'react';
import AppLayout from './layout/app-layout';
import {Row, Col, Form, Button} from 'react-bootstrap';
import styles from '../styles/forgot-password.module.css';
import postData from '../networking/send-post-request';
import {forgotPasswordUrl} from '../networking/external-url';
import {showAlert, showAlertWithCallBack} from '../components/alerter';
import Spinner from '../components/spinner';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.passwordRef = React.createRef();

        this.state = {
            emailAddress: "",
            showSpinner: false
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    async submit(e) {
        e.preventDefault();
        this.toggleSpinner("show");
        let forgotPasswordResponse = await postData(forgotPasswordUrl, this.state);
        if(forgotPasswordResponse) {
            if(forgotPasswordResponse.responseCode == 99) {
                this.toggleSpinner("hide");
                showAlertWithCallBack("success", forgotPasswordResponse.message, () => window.location.reload());
            }else {
                this.toggleSpinner("hide");
                showAlert("error", forgotPasswordResponse.errorMessage);
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
        return(
            <AppLayout pageName="Forgot Password" showHeader={false} showFooter={false}>
                <Spinner showSpinner={this.state.showSpinner}/>
                <Row className={styles.main_row}>
                    <Col md="6" className={styles.forgot_passwordrow}>
                        <div className={styles.big_header}>Learning the SMARTER way, <br/>Learning the REATENT way</div>
                        <div className={styles.text_under}>Reatent is an e-learning platform that allows you watch your lectures, and makes sure you didn’t miss anything from the class.</div>
                        <div className={styles.forgot_passwordimage_pane}>
                            <img src="images/forgot password.png" className={styles.forgot_passwordimage} alt="Login Image" />
                        </div>
                    </Col>
                    <Col md="6" className={styles.light_background}>
                        <div className={styles.center_box}>
                            <div className={styles.logo_bg}>
                                <img src="images/reatent coloured logo.png" alt="Logo" />
                            </div>
                            <div className={styles.forgot_passwordform}>
                                <Form action="#" method="post" onSubmit={this.submit.bind(this)}>
                                    <Form.Group>
                                        <span className={styles.forgot_passwordtext}>Forgot Password?</span>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control placeholder="Email Address" className={styles.control_input} name="emailAddress" onChange={this.handleChange.bind(this)} required />
                                    </Form.Group>
                                    <Form.Group>
                                        <a href="/login" className={styles.forgot_password}>Remembered Password?</a>
                                    </Form.Group>
                                    <Form.Group>
                                        <div style={{float: 'right'}}>
                                            <Button varian="primary" type="submit" style={{padding: "12px 45px"}}>Send Link</Button>
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