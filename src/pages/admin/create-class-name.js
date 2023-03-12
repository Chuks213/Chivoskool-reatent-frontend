import React, { Component, useContext, useState } from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/create-category.module.css';
import { Row, Form, Button, Col } from 'react-bootstrap';
import { AppContext } from '../../providers/app-provider';
import postData from  '../../networking/send-post-request';
import {showAlert, showAlertWithCallBack} from '../../components/alerter';
import {createClassNameUrl} from '../../networking/external-url';


export default class CreateClassName extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppLayout pageName="Create Class Name">
                <Row className="ml-0 mr-0 mt-2">
                    <Col md="6" className="pl-1">
                        <CustomForm />
                    </Col>
                </Row>
            </AppLayout>
        )
    }
}

const CustomForm = () => {
    const {toggleSpinner} = useContext(AppContext);

    const [state, setState] = useState({
        name: ""
    });

    const handleChange = (e) => {
        setState({[e.target.name]: e.target.value});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let submitFormResponse = await postData(createClassNameUrl, state);
        if(submitFormResponse) {
            toggleSpinner("hide");
            if(submitFormResponse.responseCode == "99")
                showAlertWithCallBack("success", submitFormResponse.message, () => window.location.href = "/admin/class-names");
            else showAlert("error", submitFormResponse.errorMessage);
        }else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    return (
        <Form method="post" action="#" onSubmit={(e) => submit(e)}>
            <Form.Group>
                <Form.Row>
                    <div className={styles.overhead_text} style={{ paddingTop: 12 }}>Class names could be levels...</div>
                </Form.Row>
            </Form.Group>
            <Form.Group>
                <input type="text" name="name" className={`form-control ${styles.custom_input}`} placeholder="Class Name*" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <div className={`mt-20 ${styles.action_pane}`}>
                        <a href="/admin/class-names" className={styles.back}>Go Back</a>
                        <Button type="submit" variant="primary">Create</Button>
                    </div>
                </Form.Row>
            </Form.Group>
        </Form>
    );
}