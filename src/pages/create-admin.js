import React, {Component} from 'react';
import AppLayout from './layout/app-layout';
import {Container, Col, Row, Form, Button} from 'react-bootstrap';
import styles from '../styles/getstarted.module.css';
import {createAdminUrl} from "../networking/external-url";
import postData from "../networking/send-post-request";
import {showAlert, showAlertWithCallBack} from "../components/alerter";
import Spinner from "../components/spinner";

export default class CreateAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            emailAddress: "",
            securityKey: "",
            profilePhoto: "",
            showSpinner: false
        }
    }

    handlePhotoChange(e) {
        let fileReader = new window.FileReader();
        let file = e.target.files[0];
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
            this.setState({profilePhoto: e.target.result});
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    async submit(e) {
        e.preventDefault();
        this.toggleSpinner("show");
        let createAdminResponse = await postData(createAdminUrl, this.state);
        if(createAdminResponse) {
            this.toggleSpinner("hide");
            if(createAdminResponse.responseCode == "99")
                showAlertWithCallBack("success", createAdminResponse.message, () => window.location.reload());
            else showAlert("error", createAdminResponse.errorMessage);
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
            <AppLayout pageName="Create Admin">
                <Spinner showSpinner={this.state.showSpinner} />
                <Container>
                    <Row as="div" style={{height: "auto", paddingTop: "5%", paddingBottom: "3%"}}>
                        <Col md="6" className={styles.items_right} as="div">
                            <img src="images/image6.PNG" className={styles.get_started_image} alt="Register Image" />
                        </Col>
                        <Col md="6" as="div" style={{minHeight: 500}}>
                            <div className={styles.big_text}>Create Admin</div>
                            
                            <Form method="post" action="#" onSubmit={this.submit.bind(this)}>
                                <Form.Group>
                                    <Form.Row>
                                        <div className={styles.personal_info_text} style={{paddingTop: 12}}>Personal Information</div>
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row>
                                        <input type="text" name="firstName" className={styles.custom_input} placeholder="First Name*" onChange={this.handleChange.bind(this)} required />
                                        <input type="text" name="lastName" className={`${styles.custom_input} ${styles.ml_22_perc}`} placeholder="Last Name*" onChange={this.handleChange.bind(this)} required />
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row>
                                        <input type="email" name="emailAddress" className={styles.custom_input} placeholder="Email Address*" onChange={this.handleChange.bind(this)} required />
                                        <input type="password" name="securityKey" className={`${styles.custom_input} ${styles.ml_22_perc}`} placeholder="Security Key*" onPaste={(e) => {e.preventDefault(); return false;}} onDrop={(e) => {e.preventDefault(); return false;}} autoComplete="off" onChange={this.handleChange.bind(this)} required />
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Profile Photo</Form.Label>
                                    <Form.Row>
                                        <Form.File className="mt-10" accept="image/*" onChange={(e) => this.handlePhotoChange(e)} required />
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row>
                                        <div className={`mt-20 ${styles.action_pane}`}>
                                            <Button type="submit" variant="primary">Create</Button>
                                            <a href="/" className={styles.existing_acct}>Return home</a>
                                        </div>
                                    </Form.Row>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </AppLayout>
        );
    }
}