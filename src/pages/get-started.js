import React, { Component } from 'react';
import AppLayout from './layout/app-layout';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import styles from '../styles/getstarted.module.css';
import doPost from '../networking/send-post-request';
import { getStartedUrl, getCountriesUrl, getAllStatesUrl, getAllCitiesUrl, getAllTitlesUrl} from "../networking/external-url";
import { showAlertWithCallBack, showAlert } from "../components/alerter";
import Spinner from "../components/spinner";
import doGet from '../networking/send-get-request';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobile, faMobileAlt } from '@fortawesome/free-solid-svg-icons';

export default class GetStarted extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            name: "",
            cityId: 0,
            countryId: 0,
            designation: "",
            emailAddress: "",
            mobileNumber: "",
            mobileNumberPrefix: "+234",
            nameOfInstitution: "",
            institutionType: "",
            noOfStudents: 0,
            inpNoOfStudents: 0,
            stateId: 0,
            website: "",
            showSpinner: false,
            countryList: [],
            statesList: [],
            cityList: [],
            titleList: []
        }
    }

    componentDidMount() {
        this.getAllCountries();
        this.getAllTitles();
    }

    async getAllCountries() {
        let allCountriesResponse = await doGet(getCountriesUrl);
        if (allCountriesResponse) {
            if(allCountriesResponse.responseCode == 99) {
                this.setState({ countryList: allCountriesResponse.responseData, countryId: 2 });
                this.getAllStates(2);
            }
        } else {
            console.log("unable to fetch all countries from API");
        }
    }

    async getAllStates(id) {
        let allStatesResponse = await doGet(getAllStatesUrl + id);
        if (allStatesResponse) {
            if(allStatesResponse.responseCode == 99)
                this.setState({ statesList: allStatesResponse.responseData, countryId: id });
        } else {
            console.log("unable to fetch all states from API");
        }
    }

    async getAllCities(id) {
        let allCitiesResponse = await doGet(getAllCitiesUrl + id);
        if (allCitiesResponse) {
            if(allCitiesResponse.responseCode == 99)
                this.setState({ cityList: allCitiesResponse.responseData, stateId: id });
        } else {
            console.log("unable to fetch all cities from API");
        }
    }

    async getAllTitles() {
        let getAllTitlesResponse = await doGet(getAllTitlesUrl);
        if (getAllTitlesResponse) {
            this.setState({ titleList: getAllTitlesResponse.responseData });
         } else {
             console.log("unable to fetch all titles from API");
        }
    }

    handleChange(e) {
        if(e.target.name == "mobileNumber") {
            const {value} = e.target;
            if(!isNaN(value)) {
                let newValue = value.charAt(0) == 0 ? value.substring(0, (value.length - 1)) : value;
                this.setState({ mobileNumber: newValue });
            }
        }else this.setState({ [e.target.name]: e.target.value });
    }

    handleCountryChange(e) {
        const id = e.target.value;
        const country = this.state.countryList.filter(country => country.id == id)[0];
        this.setState({mobileNumberPrefix: country.phoneCode ? (country.phoneCode.includes("+") ? country.phoneCode : ("+" + country.phoneCode)) : ""});
        this.getAllStates(id);
    }

    handleStateChange(e) {
        const id = e.target.value;
        this.getAllCities(id);
    }

    async submit(e) {
        e.preventDefault();
        this.toggleSpinner("show");
        let data = this.state;
        if(this.state.inpNoOfStudents != 0) data["noOfStudents"] = data.inpNoOfStudents;
        if(!data.mobileNumber.includes(data.mobileNumberPrefix))
            data["mobileNumber"] = data.mobileNumberPrefix + data.mobileNumber;
        if(!this.countryAndCountryCodeMatches()) {
            this.toggleSpinner("hide");
            return;
        }
        let getStartedResponse = await doPost(getStartedUrl, data);
        if (getStartedResponse) {
            if (getStartedResponse.responseCode == 99) {
                this.toggleSpinner("hide");
                showAlertWithCallBack("success", getStartedResponse.message, () => window.location.reload());
            } else {
                this.toggleSpinner("hide");
                showAlert("error", getStartedResponse.errorMessage);
            }
        } else {
            this.toggleSpinner("hide");
            console.log("Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later");
        }
    }

    toggleSpinner(action) {
        if (action == "show") this.setState({ showSpinner: true });
        else this.setState({ showSpinner: false });
    }

    countryAndCountryCodeMatches() {
        const {countryList, countryId, mobileNumberPrefix} = this.state;
        const country = countryList.filter(country => country.id == countryId)[0];
        if(country) {
            if(!mobileNumberPrefix.includes(country.phoneCode)) {
                showAlert("error", "Selected country does not match with phone code");
                return false;
            }
        }else {
            showAlert("error", "Oops! An error occurred while trying to process request");
            return false;
        }
        return true;
    }

    render() {
        return (
            <AppLayout pageName="Get Started">
                <Spinner showSpinner={this.state.showSpinner} />
                <Container>
                    <Row as="div" style={{ height: "auto", paddingTop: "5%", paddingBottom: "3%" }}>
                        <Col md="6" className={styles.items_right} as="div">
                            <img src="images/image6.PNG" className={styles.get_started_image} alt="Register Image" />
                        </Col>
                        <Col md="6" as="div">
                            <div className={styles.big_text}>Get Started</div>
                            <div className={styles.offers_text}>To get our amazing offers we’ve got to know you.</div>

                            <Form method="post" action="#" onSubmit={this.submit.bind(this)}>
                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <div className={styles.personal_info_text} style={{ paddingTop: 12 }}>Personal Information</div>
                                    </Form.Row>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <select name="title" className={styles.custom_input} onChange={this.handleChange.bind(this)} required>
                                            <option value="">Title*</option>
                                            {
                                                this.state.titleList ? this.state.titleList.map((title, index) => {
                                                    return <option value={title} key={index}>{title}</option>
                                                }) : <></>
                                            }

                                        </select>
                                        <input type="text" name="name" className={`${styles.custom_input} ${styles.ml_22_perc}`} placeholder="Name*" onChange={this.handleChange.bind(this)} required />
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <div className={`input-group ${styles.w_38_perc}`}>
                                            <div className={`input-group-prepend ${styles.w_28_perc}`}>
                                                {this.state.countryId > 0 ? <img src={this.state.countryList.filter(country => country.id == this.state.countryId)[0].flagUrl} style={{minWidth: 60, maxWidth: 65, borderBottom: "1px solid #000000", padding: 3}} /> : <FontAwesomeIcon icon={faMobileAlt} size="2x" style={{fontSize: 50, marginRight: 10}} />}
                                            </div>
                                            <input type="text" maxLength="12" name="mobileNumber" className={`${styles.custom_input} ${styles.w_72_perc} ${styles.input_ph_number}`} style={{borderLeft: "none"}} placeholder={this.state.countryId > 0 ? "+"+ this.state.countryList.filter(country => country.id == this.state.countryId)[0].phoneCode : "Mobile Number*"} onChange={this.handleChange.bind(this)} value={this.state.mobileNumber} required />
                                        </div>
                                        <input type="email" name="emailAddress" className={`${styles.custom_input} ${styles.ml_22_perc}`} placeholder="Email Address*" onChange={this.handleChange.bind(this)} required />
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <input type="text" name="designation" className={styles.custom_input} placeholder="Designation (Optional)" onChange={this.handleChange.bind(this)} />
                                    </Form.Row>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <div className={styles.personal_info_text} style={{ paddingTop: 12 }}>Institution Information</div>
                                    </Form.Row>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <input type="text" name="nameOfInstitution" className={styles.custom_input} placeholder="Name of Institution*" onChange={this.handleChange.bind(this)} required />
                                        <input type="url" name="website" className={`${styles.custom_input} ${styles.ml_22_perc}`} placeholder="Website (Optional) e.g, http://example.com" onChange={this.handleChange.bind(this)} />
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <select name="country" className={styles.custom_input} onChange={this.handleCountryChange.bind(this)} value={this.state.countryId > 0 ? this.state.countryId : ""} required>
                                            <option value="">Country*</option>
                                            {
                                                this.state.countryList ? this.state.countryList.map(country => {
                                                    return <option value={country.id} key={country.id}>{country.name}</option>
                                                }) : <></>
                                            }
                                        </select>
                                        <select name="state" className={`${styles.custom_input} ${styles.ml_22_perc}`} onChange={this.handleStateChange.bind(this)} required>
                                            <option value="">State*</option>
                                            {
                                                this.state.statesList ? this.state.statesList.map(states => {
                                                    return <option value={states.id} key={states.id}>{states.name}</option>
                                                }) : <></>
                                            }

                                        </select>
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <select name="cityId" className={styles.custom_input} onChange={this.handleChange.bind(this)} required>
                                            <option value="">City*</option>
                                            {
                                                this.state.cityList ? this.state.cityList.map(city => {
                                                    return <option value={city.id} key={city.id}>{city.name}</option>
                                                }) : <></>
                                            }

                                        </select>
                                        <select name="noOfStudents" className={`${styles.custom_input} ${styles.ml_22_perc}`} onChange={this.handleChange.bind(this)} required={this.state.noOfStudents != "higher"} >
                                            <option value="">No of Students*</option>
                                            <option value="200">1 to 200</option>
                                            <option value="500">201 to 500</option>
                                            <option value="1000">501 to 1000</option>
                                            <option value="2000">1001 to 2000</option>
                                            <option value="5000">2001 to 5000</option>
                                            <option value="higher">5000 & above</option>
                                        </select>
                                    </Form.Row>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <select name="institutionType" className={`${styles.custom_input}`} onChange={this.handleChange.bind(this)} >
                                            <option value="">Institution Type*</option>
                                            <option value="PRIMARY">Primary</option>
                                            <option value="SECONDARY">Secondary</option>
                                            <option value="TERTIARY">Tertiary</option>
                                        </select>
                                        <input type="number" name="inpNoOfStudents" className={`${styles.custom_input} ${styles.ml_22_perc}`} placeholder="Enter no. of students*" onChange={this.handleChange.bind(this)} min="5001" required={this.state.noOfStudents == "higher"} hidden={this.state.noOfStudents != "higher"} />
                                    </Form.Row>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Row className={styles.form_row_sm_col}>
                                        <div className={`mt-20 ${styles.action_pane}`}>
                                            <Button type="submit" variant="primary">Get Started</Button>
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