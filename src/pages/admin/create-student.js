import React, { Component, useContext, useEffect, useRef, useState } from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/create-category.module.css';
import { Row, Form, Button, Col } from 'react-bootstrap';
import { AppContext } from '../../providers/app-provider';
import postData from  '../../networking/send-post-request';
import {showAlert, showAlertWithCallBack} from '../../components/alerter';
import {getClassesUrl, getAllSchoolsUrl, createUserUrl} from '../../networking/external-url';
import doGet from  '../../networking/send-get-request';


export default class CreateStudent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppLayout pageName="Create Student">
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
        firstName: "",
        lastName: "",
        emailAddress: "",
        role: "STUDENT",
        profilePhoto: "",
        schools: [],
        classes: []
    });

    useEffect(() => {
        getAllSchools();
    }, []);

    const getAllSchools = async () => {
        let schoolsResponse = await doGet(getAllSchoolsUrl);
        if (schoolsResponse) {
            if(schoolsResponse.responseCode == 99)
                setState({ ...state, schools: schoolsResponse.responseData });
        } else {
            console.log("Unable to fetch all schools from API");
        }
    }

    const getAllCLasses = async (schoolId) => {
        let classesResponse = await doGet(getClassesUrl + schoolId);
        if (classesResponse) {
            if(classesResponse.responseCode == 99)
                setState({ ...state, classes: classesResponse.responseData });
        } else {
            console.log("Unable to fetch all classes from API");
        }
    }

    const handlePhotoChange = (e) => {
        let fileReader = new window.FileReader();
        let file = e.target.files[0];
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
            setState({...state, profilePhoto: e.target.result});
        }
    }

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    const handleSchoolChange = (e) => {
        getAllCLasses(e.target.value);
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let submitFormResponse = await postData(createUserUrl, state);
        if(submitFormResponse) {
            toggleSpinner("hide");
            if(submitFormResponse.responseCode == "99")
                showAlertWithCallBack("success", submitFormResponse.message, () => window.location.href = "/admin/students");
            else showAlert("error", submitFormResponse.errorMessage);
        }else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    return (
        <Form method="post" action="#" onSubmit={(e) => submit(e)}>
            <Form.Group>
                <input type="text" name="firstName" className={`form-control ${styles.custom_input}`} placeholder="First Name*" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <input type="text" name="lastName" className={`form-control ${styles.custom_input}`} placeholder="Last Name*" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <input type="email" name="emailAddress" className={`form-control ${styles.custom_input}`} placeholder="Email Address*" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>User Photo</Form.Label>
                <Form.File className="mt-10" accept="image/*" onChange={(e) => handlePhotoChange(e)} required />
            </Form.Group>
            <Form.Group>
                <select name="schoolId" className={styles.custom_input} onChange={(e) => handleSchoolChange(e)} required>
                    <option value="">School*</option>
                    {
                        state.schools ? state.schools.map(school => {
                            return <option value={school.id} key={school.id}>{school.name}</option>
                        }) : <></>
                    }
                </select>
            </Form.Group>
            <Form.Group>
                <select name="classId" className={styles.custom_input} onChange={(e) => handleChange(e)} required>
                    <option value="">Class*</option>
                    {
                        state.classes ? state.classes.map(clazz => {
                            return <option value={clazz.id} key={clazz.id}>{clazz.name.name}</option>
                        }) : <></>
                    }
                </select>
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <div className={`mt-20 ${styles.action_pane}`}>
                        <a href="/admin/students" className={styles.back}>Go Back</a>
                        <Button type="submit" variant="primary">Create</Button>
                    </div>
                </Form.Row>
            </Form.Group>
        </Form>
    );
}