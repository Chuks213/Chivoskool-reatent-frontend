import React, { Component, useContext, useEffect } from "react";
import AppLayout from "../../layout/app-layout";
import styles from '../../../../styles/submissions.module.css';
import { Row, Button } from 'react-bootstrap';
import { getAllSubissionAssessmentsUrl, getSubmissionUrl, toggleAssessmentSubmissionUrl, getAssessmentSolutionFileNameUrl, downloadAssessmentSolutionUrl } from "../../../../networking/external-url";
import CustomTable from "../../../../components/custom-table";
import getData from "../../../../networking/send-get-request";
import { AppContext } from "../../../../providers/app-provider";
import {showAlertWithCallBack} from "../../../../components/alerter";
import {showAlert} from "../../../../components/alerter";

const columns = [
    {
        title: "#",
        data: "id",
        hidden: true
    },
    {
        title: "Name",
        data: "student.firstName|student.lastName"
    },
    {
        title: "Status",
        data: "status__",
    },
    {
        title: "Submitted On",
        data: "submittedOn"
    },
    {
        title: "Grade",
        data: "grade"
    },
    {
        title: "Grade Score",
        data: "gradeScore"
    },
    {
        title: "Action",
        data: "id",
        buttons: [
            { 
                type: "Edit Grade", 
                link: "/auth/submissions/grade-student?id=" 
            }, 
            { 
                type: "View Solution",
                callback: async (id) => {
                    const handleResponse = (response, fileName) => {
                        response.blob().then(blob => {
                            const link = document.createElement('a');
                            const url = URL.createObjectURL(blob);
                            link.href = url;
                            link.download = fileName;
                            link.click();
                        });
                    }

                    let fileDownloadResponse = await getData(downloadAssessmentSolutionUrl + id, true);
                    if (fileDownloadResponse) {
                        if (fileDownloadResponse.status == 200) {
                            let getFileNameResponse = await getData(getAssessmentSolutionFileNameUrl + id);
                            const fileName = getFileNameResponse.responseData;
                            handleResponse(fileDownloadResponse, fileName);
                        } else {
                            showAlert("error", "An error occurred while trying to download solution. Possible solution: Check your internet connection and try again later");
                        }
                    } else {
                        showAlert("error", "An error occurred while trying to download solution. Possible solution: Check your internet connection and try again later");
                    }
                } 
            }
        ]
    }
]

export default class View extends Component {
    static async getInitialProps({ query }) {
        const { id, title } = query;
        return { id, title };
    }

    constructor(props) {
        super(props);

        this.state = {
            submission: null
        }
    }

    componentDidMount() {
        getData(getSubmissionUrl + this.props.id)
            .then((data) => {
                if (data) {
                    if (data.responseCode == 99)
                        this.setState({ submission: data.responseData });
                }
            })
            .catch(err => {
                console.log("An error occurred while trying to fetch submission");
                console.log(err);
            })
    }

    render() {
        return (
            <AppLayout pageName="Submissions">
                <SubmissionButtonPane submission={this.state.submission} />
                <Row className="ml-0 mr-0">
                    <div className={styles.table_content}> {this.state.submission ? this.state.submission.media.title : ""} </div>
                    <CustomTable columns={columns} ajaxUrl={getAllSubissionAssessmentsUrl + this.props.id} />
                </Row>
            </AppLayout>
        );
    }
}

const SubmissionButtonPane = (props) => {
    const {toggleSpinner} = useContext(AppContext);

    const toggleSubmisson = (submissionId, action) => {
        toggleSpinner("show");
        getData(`${toggleAssessmentSubmissionUrl}${submissionId}/${action}`)
            .then(data => {
                if (data) {
                    toggleSpinner("hide");
                    if (data.responseCode == 99)
                        showAlertWithCallBack("success", data.message, () => window.location.reload());
                    else
                        showAlertWithCallBack("error", data.errorMessage, () => window.location.reload());
                }else {
                    toggleSpinner("hide");
                    showAlertWithCallBack("error", "An error occurred while trying to " + action + " submission. Possible solution: Check your internet connection and try again later", () => window.location.reload());
                }
            })
    }

    return (
        <Row className="ml-0 mr-0 jc-flex-end" hidden={props.submission == null}>
            {
                props.submission != null && props.submission.submissionEnabled ?
                    <Button variant="danger" onClick={() => toggleSubmisson(props.submission.id, "close")} style={{ float: "right" }}>Close Assessment Submission</Button>
                    : <Button variant="success" onClick={() => toggleSubmisson(props.submission.id, "open")} style={{ float: "right" }}>Open Assessment Submission</Button>
            }
        </Row>
    )
}