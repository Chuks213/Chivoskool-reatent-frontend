import React, { useContext, useEffect, useState, Component, createRef } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import AppLayout from './layout/app-layout';
import styles from '../../styles/submissions.module.css';
import MaximizeIcon from '../../svgs/maximize_icon.svg';
import getData from "../../networking/send-get-request";
import { getAllSubmissionsUrl, downloadAssessmentUrl, getAssessmentFileNameUrl, uploadAssessmentSolutionUrl } from "../../networking/external-url";
import { AppContext } from '../../providers/app-provider';
import { showAlert, showAlertWithCallBack, showConfirmAlertWithCallBack } from '../../components/alerter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import postData from "../../networking/send-post-request";

export default class Assessment extends Component {
    static async getInitialProps({query}) {
        const {s} = query;
        return {s};
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppLayout pageName="Assessment">
                {this.props.s ? <h5>Search results for: '{this.props.s}'</h5> : <span></span>}
                <Main searchParam={this.props.s} />
            </AppLayout>
        )
    }
}

const normalFileExtesions = ".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf";

const Main = (props) => {
    const { toggleSpinner } = useContext(AppContext) || {};

    const solutionFileInputField = createRef();

    const [submissions, setSubmissions] = useState([]);
    const [mediaId, setMediaId] = useState(0);

    useEffect(() => {
        getSubmissions();
    }, []);

    const getSubmissions = async () => {
        toggleSpinner("show");
        const urlString = getAllSubmissionsUrl + (!props.searchParam ? "" : ("?s=" + props.searchParam));
        let getAllSubissionsResponse = await getData(urlString);
        if (getAllSubissionsResponse) {
            toggleSpinner("hide");
            if (getAllSubissionsResponse.responseCode == 99) {
                setSubmissions(getAllSubissionsResponse.responseData);
            } else console.log("An error occurred while trying to fetch submissions: ", getAllSubissionsResponse.errorMessage);
        } else console.log("An error occurred while trying to fetch submissions. Server is unreachable");
    }

    const handleResponse = (response, fileName) => {
        response.blob().then(blob => {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = fileName;
            link.click();
        });
    }

    const viewAssessment = async (e, mediaId) => {
        e.preventDefault();
        toggleSpinner("show");
        let fileDownloadResponse = await getData(downloadAssessmentUrl + mediaId, true);
        if (fileDownloadResponse) {
            if (fileDownloadResponse.status == 200) {
                let getFileNameResponse = await getData(getAssessmentFileNameUrl + mediaId);
                const fileName = getFileNameResponse.responseData;
                toggleSpinner("hide");
                handleResponse(fileDownloadResponse, fileName);
            } else {
                toggleSpinner("hide");
                showAlert("error", "An error occurred while trying to download assessment. Possible solution: Check your internet connection and try again later");
            }
        } else {
            toggleSpinner("hide");
            showAlert("error", "An error occurred while trying to download assessment. Possible solution: Check your internet connection and try again later");
        }
    }

    const uploadSolution = (e, mediaId) => {
        // Upload...
        setMediaId(mediaId);
        solutionFileInputField.current.click();
    }

    const handleFileUpload = (e) => {
        const { files: newFiles } = e.target;
        if (newFiles && newFiles.length > 0) {
            if (newFiles[0].size <= 3000000) {// Solution file size should not be more than 3MB...
                let formData = new FormData();
                formData.append('solution', newFiles[0]);
                showConfirmAlertWithCallBack("warning", "Your solution would be uploaded. You won't be able to re-submit", () => {
                    toggleSpinner("show");
                    postData(uploadAssessmentSolutionUrl + mediaId, formData, null, true)
                        .then(data => {
                            if (data) {
                                if (data.responseCode == 99) {
                                    toggleSpinner("hide");
                                    showAlertWithCallBack("success", "Solution uploaded successfully", () => window.location.reload());
                                } else {
                                    toggleSpinner("hide");
                                    showAlertWithCallBack("error", data.errorMessage, () => window.location.reload());
                                }
                            } else {
                                toggleSpinner("hide");
                                showAlert("error", "Oops! Solution Upload failed as server is unreachable. Please try again later");
                            }
                        });
                });
            } else showAlert("error", "File is too large. Max. solution file size is 3MB");
        }
    }

    return (
        <Row className={`ml-0 mr-0 ${styles.mt_15}`}>
            {
                submissions.length > 0 ? submissions.map(submission => {
                    return (
                        <Col lg="4" md="6" sm="12" xs="12" className={`${styles.box} ${styles.mt_15}`} key={submission.id}>
                            <div className={styles.box_header}>
                                <a style={{ color: "#EB5757" }}>{submission.media.title}</a>
                                <MaximizeIcon className={styles.maximize_icon} />
                            </div>
                            <div className={styles.assessment_pane}>
                                <a href="#" onClick={(e) => viewAssessment(e, submission.media.id)} className={styles.view_assessment_link}>View Assessment</a>&nbsp;&nbsp;
                                {
                                    submission.submissionEnabled ? (
                                        submission.alreadySubmitted ?
                                            <></>
                                            : <a href="#" onClick={(e) => uploadSolution(e, submission.media.id)} className={`${styles.view_assessment_link} ${styles.upload_link}`}>Upload Solution</a>
                                    ) : <span className={`${styles.view_assessment_link} ${styles.grace_period_exceeded}`}>Submission Closed</span>
                                }
                            </div>
                            {
                                submission.studentGrade ? (
                                    <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
                                        <h6 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: 19, color: "#C4C4C4" }}>Grade</h6>
                                        <div><FontAwesomeIcon icon={faChevronRight} /></div>
                                        <h6 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: 19, color: "#EB5757" }}>{submission.studentGradeScore} ({submission.studentGrade})</h6>
                                        <div></div>
                                        <div></div>
                                    </div>
                                ) : <></>
                            }
                            {
                                !submission.studentGrade ? (
                                    <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
                                        <h6 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: 19, color: "#C4C4C4" }}>Status</h6>
                                        <div><FontAwesomeIcon icon={faChevronRight} /></div>
                                        {
                                            submission.alreadySubmitted ?
                                                <h6 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: 19, color: "yellowGreen" }}>SUBMITED</h6>
                                                : <h6 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: 19, color: "#ff0000" }}>NOT SUBMITED</h6>
                                        }
                                        <div></div>
                                        <div></div>
                                    </div>
                                ) : <></>
                            }
                        </Col>
                    )
                }) : <Col md="12" style={{ textAlign: "center" }}>No record available</Col>
            }

            <Form.File style={{ display: "none" }} title="" value="" ref={solutionFileInputField} accept={normalFileExtesions} onChange={handleFileUpload} />
        </Row>
    )
}