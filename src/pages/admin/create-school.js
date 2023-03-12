import React, { Component, useContext, useEffect, useState } from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/create-category.module.css';
import { Row, Form, Button, Col } from 'react-bootstrap';
import { AppContext } from '../../providers/app-provider';
import postData from '../../networking/send-post-request';
import { showAlert, showAlertWithCallBack } from '../../components/alerter';
import { createSchoolUrl, getCountriesUrl, getAllStatesUrl, getAllCitiesUrl } from '../../networking/external-url';
import doGet from '../../networking/send-get-request';


export default class CreateSchool extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppLayout pageName="Create School">
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
    const { toggleSpinner } = useContext(AppContext);

    useEffect(() => {
        getAllCountries();
    }, []);

    const [state, setState] = useState({
        cityId: 0,
        countryId: 0,
        emailAddress: "",
        mobileNumber: "",
        name: "",
        noOfStudents: 0,
        stateId: 0,
        countryList: [],
        stateList: [],
        cityList: []
    });

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }

    const getAllCountries = async () => {
        let allCountriesResponse = await doGet(getCountriesUrl);
        if (allCountriesResponse) {
            if(allCountriesResponse.responseCode == 99)
                setState({ ...state, countryList: allCountriesResponse.responseData });
        } else {
            console.log("unable to fetch all countries from API");
        }
    }

    const getAllStates = async (id) => {
        let allStatesResponse = await doGet(getAllStatesUrl + id);
        if (allStatesResponse) {
            if(allStatesResponse.responseCode == 99)
                setState({ ...state, stateList: allStatesResponse.responseData, countryId: id });
        } else {
            console.log("unable to fetch all states from API");
        }
    }

    const getAllCities = async (id) => {
        let allCitiesResponse = await doGet(getAllCitiesUrl + id);
        if (allCitiesResponse) {
            if(allCitiesResponse.responseCode == 99)
                setState({ ...state, cityList: allCitiesResponse.responseData, stateId: id });
        } else {
            console.log("unable to fetch all cities from API");
        }
    }

    const handleCountryChange = (e) => {
        const id = e.target.value;
        getAllStates(id);
    }

    const handleStateChange = (e) => {
        const id = e.target.value;
        getAllCities(id);
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let submitFormResponse = await postData(createSchoolUrl, state);
        if (submitFormResponse) {
            toggleSpinner("hide");
            if (submitFormResponse.responseCode == "99")
                showAlertWithCallBack("success", submitFormResponse.message, () => window.location.href = "/admin/schools");
            else showAlert("error", submitFormResponse.errorMessage);
        } else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    return (
        <Form method="post" action="#" onSubmit={(e) => submit(e)}>
            <Form.Group>
                <input type="text" name="name" className={`form-control ${styles.custom_input}`} placeholder="School Name*" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <input type="email" name="emailAddress" className={`form-control ${styles.custom_input}`} placeholder="Email Address*" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <input type="tel" name="mobileNumber" className={`form-control ${styles.custom_input}`} placeholder="Mobile Number*" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <input type="number" name="noOfStudents" className={`form-control ${styles.custom_input}`} placeholder="Number Of Students*" onChange={(e) => handleChange(e)} required />
            </Form.Group>
            <Form.Group>
                <select name="countryId" className={styles.custom_input} onChange={(e) => handleCountryChange(e)} required>
                    <option value="">Country*</option>
                    {
                        state.countryList ? state.countryList.map(country => {
                            return <option value={country.id} key={country.id}>{country.name}</option>
                        }) : <></>
                    }
                </select>
            </Form.Group>
            <Form.Group>
                <select name="stateId" className={styles.custom_input} onChange={(e) => handleStateChange(e)} required>
                    <option value="">State*</option>
                    {
                        state.stateList ? state.stateList.map(state => {
                            return <option value={state.id} key={state.id}>{state.name}</option>
                        }) : <></>
                    }
                </select>
            </Form.Group>
            <Form.Group>
                <select name="cityId" className={styles.custom_input} onChange={(e) => handleChange(e)} required>
                    <option value="">City*</option>
                    {
                        state.cityList ? state.cityList.map(city => {
                            return <option value={city.id} key={city.id}>{city.name}</option>
                        }) : <></>
                    }
                </select>
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <div className={`mt-20 ${styles.action_pane}`}>
                        <a href="/admin/category" className={styles.back}>Go Back</a>
                        <Button type="submit" variant="primary">Create</Button>
                    </div>
                </Form.Row>
            </Form.Group>
        </Form>
    );
}