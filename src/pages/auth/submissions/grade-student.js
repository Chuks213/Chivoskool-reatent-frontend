import React, { Component, useContext, useState } from 'react';
import AppLayout from "../layout/app-layout";
import styles from '../../../styles/create-category.module.css';
import { Row, Form, Button, Col } from 'react-bootstrap';
import { AppContext } from '../../../providers/app-provider';
import postData from  '../../../networking/send-post-request';
import getData from  '../../../networking/send-get-request';
import {showAlert, showAlertWithCallBack} from '../../../components/alerter';
import {gradeStudentUrl, getStudentSubmission} from '../../../networking/external-url';


export default class GradeStudent extends Component {
    static async getInitialProps({query}) {
        const {id} = query;
        return {id};
    }

    constructor(props) {
        super(props);

        this.state = {
            studentName: "Student"
        }
    }

    componentDidMount() {
        getData(getStudentSubmission + this.props.id)
        .then(data => {
            if(data) {
                if(data.responseCode == 99)
                    this.setState({studentName: data.responseData.student.firstName + " " + data.responseData.student.lastName});
                else console.log(data.errorMessage);
            }
        })
        .catch(err => {
            console.log("An error occurred while trying to fetch student name: ", err);
        })
    }

    render() {
        return (
            <AppLayout pageName={"Grade " + this.state.studentName}>
                <Row className="ml-0 mr-0 mt-20" style={{marginTop: 30}}>
                    <Col md="6" className="pl-0">
                        <CustomForm studentSubmissionId={this.props.id} />
                    </Col>
                </Row>
            </AppLayout>
        )
    }
}

const CustomForm = (props) => {
    const {toggleSpinner} = useContext(AppContext);

    const [state, setState] = useState({
        studentSubmissionId: props.studentSubmissionId,
        grade: "",
        gradeScore: 0
    });

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let submitFormResponse = await postData(gradeStudentUrl, state);
        if(submitFormResponse) {
            toggleSpinner("hide");
            if(submitFormResponse.responseCode == "99")
                showAlertWithCallBack("success", submitFormResponse.message, () => window.history.back());
            else showAlert("error", submitFormResponse.errorMessage);
        }else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    return (
        <Form method="post" action="#" onSubmit={(e) => submit(e)}>
            <Form.Group>
                <Form.Control type="text" name="grade" placeholder="Enter grade e.g A, B, F" onChange={(e) => handleChange(e)} maxLength="2" required />
            </Form.Group>
            <Form.Group>
                <Form.Control type="number" name="gradeScore" placeholder="Enter score" min="0" max="100" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <div className={`mt-20 ${styles.action_pane}`}>
                        <a href="#" onClick={(e) => {e.preventDefault(); window.history.back()}} className="btn btn-secondary">Go Back</a>
                        <Button type="submit" variant="success">Submit</Button>
                    </div>
                </Form.Row>
            </Form.Group>
        </Form>
    );
}