import React, { useContext, useEffect, useState, Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import styles from '../../../styles/submissions.module.css';
import MaximizeIcon from '../../../svgs/maximize_icon.svg';
import getData from "../../../networking/send-get-request";
import { getAllSubmissionsUrl, downloadAssessmentUrl, getAssessmentFileNameUrl } from "../../../networking/external-url";
import { AppContext } from '../../../providers/app-provider';
import { showAlert } from '../../../components/alerter';

export default class All extends Component {
    static async getInitialProps({query}) {
        const {s} = query;
        return {searchParams: s};
    }

    render() {
        return (
            <AppLayout pageName="Submission">
                {this.props.searchParams ? <h5>Search results for: '{this.props.searchParams}'</h5> : <span></span>}
                <Main searchParams={this.props.searchParams} />
            </AppLayout>
        );
    }
}

const Main = ({searchParams}) => {
    const { toggleSpinner } = useContext(AppContext) || {};

    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        getSubmissions();
    }, []);

    const getSubmissions = async () => {
        toggleSpinner("show");
        let getAllSubissionsResponse = await getData(getAllSubmissionsUrl + (searchParams ? ("?s=" + searchParams) : ""));
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

    return (
            <Row className={`ml-0 mr-0 ${styles.mt_15}`}>
                {
                    submissions.length > 0 ? submissions.map(submission => {
                        return (
                            <Col lg="4" md="6" sm="12" xs="12" className={`${styles.box} ${styles.mt_15}`} key={submission.id}>
                                <div className={styles.box_header}>
                                    <a href={"/auth/submissions/view/" + submission.id}>{submission.media.title}</a>
                                    <MaximizeIcon className={styles.maximize_icon} />
                                </div>
                                <div className={styles.assessment_pane}>
                                    <a href="#" onClick={(e) => viewAssessment(e, submission.media.id)} className={styles.view_assessment_link}>View Assessment</a>
                                </div>
                                <div className={styles.box_footer}>
                                    <div className={styles.box_header}>
                                        <span className={styles.count}>{submission.media.studentClass.noOfStudents}</span>
                                        <span className={`${styles.count_text} ${styles.mr_10}`}>Students in class</span>
                                    </div>
                                    <div className={styles.divider}></div>
                                    <div className={styles.box_header}>
                                        <span className={`${styles.count} ${styles.ml_10}`}>{submission.totalSubmitted}</span>
                                        <span className={styles.count_text}>Submitted attempts</span>
                                    </div>
                                </div>
                            </Col>
                        )
                    }) : <Col md="12" style={{ textAlign: "center" }}>No record available</Col>
                }
            </Row>
    )
}