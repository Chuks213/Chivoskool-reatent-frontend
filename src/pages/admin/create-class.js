import React, { Component, useContext, useEffect, useState } from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/create-category.module.css';
import { Row, Form, Button, Col } from 'react-bootstrap';
import { AppContext } from '../../providers/app-provider';
import postData from '../../networking/send-post-request';
import { showAlert, showAlertWithCallBack } from '../../components/alerter';
import { createClassUrl, getClassNamesUrl } from '../../networking/external-url';
import doGet from '../../networking/send-get-request';


export default class CreateClass extends Component {
    static async getInitialProps({query}) {
        const {sid} = query;
        return {sid};
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppLayout pageName="Create Class">
                <Row className="ml-0 mr-0 mt-2">
                    <Col md="6" className="pl-1">
                        <CustomForm sid={this.props.sid} />
                    </Col>
                </Row>
            </AppLayout>
        )
    }
}

const CustomForm = (props) => {
    const { toggleSpinner } = useContext(AppContext);

    useEffect(() => {
        getClassNames();
    }, []);

    const [state, setState] = useState({
        classNameId: 0,
        schoolId: props.sid,
        noOfStudents: 0,
        classNames: []
    });

    const getClassNames = async () => {
        let classNameResponse = await doGet(getClassNamesUrl);
        if (classNameResponse) {
            if(classNameResponse.responseCode == 99)
                setState({ ...state, classNames: classNameResponse.responseData });
        } else {
            console.log("unable to fetch all classNames from API");
        }
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let submitFormResponse = await postData(createClassUrl, state);
        if (submitFormResponse) {
            toggleSpinner("hide");
            if (submitFormResponse.responseCode == "99")
                showAlertWithCallBack("success", submitFormResponse.message, () => window.location.href = `/admin/classes?id=${props.sid}`);
            else showAlert("error", submitFormResponse.errorMessage);
        } else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    return (
        <Form method="post" action="#" onSubmit={(e) => submit(e)}>
            <Form.Group>
                <select name="classNameId" className={styles.custom_input} onChange={(e) => handleChange(e)} required>
                    <option value="">Class*</option>
                    {
                        state.classNames ? state.classNames.map(className => {
                            return <option value={className.id} key={className.id}>{className.name}</option>
                        }) : <></>
                    }
                </select>
            </Form.Group>
            <Form.Group>
                <input type="number" name="noOfStudents" className={`form-control ${styles.custom_input}`} placeholder="Number Of Students*" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <div className={`mt-20 ${styles.action_pane}`}>
                        <a href="/admin/classes" className={styles.back}>Go Back</a>
                        <Button type="submit" variant="primary">Create</Button>
                    </div>
                </Form.Row>
            </Form.Group>
        </Form>
    );
}