import React, { Component, createRef, useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Button, Modal } from 'react-bootstrap';
import AppLayout from './layout/app-layout';
import styles from '../../styles/my-classes.module.css';
import EyeIcon from "../../svgs/eye_icon.svg";
import ChatIcon from "../../svgs/chat_icon_sm.svg";
import TextFileIcon from "../../svgs/text_file_icon.svg";
import AudioPlayer from "../../components/custom-audio-player";
import CloudUploadIcon from "../../svgs/cloud_upload_icon.svg";
import FileIcon from "../../svgs/default_text_file_icon.svg";
import VideoIcon from "../../svgs/default_video_icon.svg";
import MicIcon from "../../svgs/default_mic_icon.svg";
import { AppContext } from "../../providers/app-provider";
import getData from "../../networking/send-get-request";
import postData from "../../networking/send-post-request";
import { uploadMediaUrl, getAllCategoriesUrl, addMediaUrl, getAllMediaByClassUrl, downloadAssessmentUrl, getAssessmentFileNameUrl, getTotalViewsCountByMediaIdUrl, getTotalCommentsCountByMediaIdUrl, getMediaFileSizeUrl } from "../../networking/external-url";
import CustomFileUpload from "../../components/custom-file-upload";
import { showAlert, showAlertWithCallBack } from "../../components/alerter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import VideoPlayer from "../../components/custom-video-player";

export default class MyClasses extends Component {
    static async getInitialProps({query}) {
        const {s} = query;
        return{searchParams: s};
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppLayout pageName="My Classes">
                <ClassSection searchParams={this.props.searchParams} />

                <Row className="pt-10 ml-0 mr-0">
                    <Col lg="8" md="8" sm="12" xs="12" className="pl-0"></Col>
                    <UploadSection />
                </Row>
            </AppLayout>
        )
    }
}

const normalFileExtesions = ".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf";
const audioFileExtensions = ".mp3,.aac,.wav.mp2.oog";
const videoFileExtensions = ".mp4,.avi,.mkv,.mpeg4";

const ClassSection = ({searchParams}) => {
    const { currentUser, toggleSpinner } = useContext(AppContext) || { currentUser: { assignedClasses: [] } };

    const [classId, setClassId] = useState(0);
    const [todayMediaFiles, setTodayMediaFiles] = useState([]);
    const [yesterdayMediaFiles, setYesterdayMediaFiles] = useState([]);
    const [olderMediaFiles, setOlderMediaFiles] = useState([]);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.assignedClasses) {
                getAllMedia(currentUser.assignedClasses[0].id);
            }
        }
    }, [currentUser]);

    useEffect(() => {
        if (todayMediaFiles.length > 0) fetchAndUpdateMediaMetaData("TODAY");
    }, [todayMediaFiles.length]);

    useEffect(() => {
        if (yesterdayMediaFiles.length > 0) fetchAndUpdateMediaMetaData("YESTERDAY");
    }, [yesterdayMediaFiles.length]);

    useEffect(() => {
        if (olderMediaFiles.length > 0) fetchAndUpdateMediaMetaData("OLDER");
    }, [olderMediaFiles.length]);

    const fetchAndUpdateMediaMetaData = async (listType) => {
        const mediaList = listType == "TODAY" ? [...todayMediaFiles] : (listType == "YESTERDAY" ? [...yesterdayMediaFiles] : [...olderMediaFiles]);
        for (let mediaFile of mediaList) {
            const fileTypeFormat = getFileTypeFromFormat(mediaFile.mediaFormat);
            if (fileTypeFormat == "VIDEO") {
                const { id } = mediaFile;
                const getMediaViewsCountResponse = await getData(getTotalViewsCountByMediaIdUrl + id);
                const getCommentViewsCountResponse = await getData(getTotalCommentsCountByMediaIdUrl + id);
                if (getMediaViewsCountResponse) {
                    if (getMediaViewsCountResponse.responseCode == 99) {
                        const { responseData } = getMediaViewsCountResponse;
                        const mediaIndex = mediaList.findIndex(m => m.id == id);
                        mediaList[mediaIndex].viewsCount = responseData;
                    }
                }

                if (getCommentViewsCountResponse) {
                    if (getCommentViewsCountResponse.responseCode == 99) {
                        const { responseData } = getCommentViewsCountResponse;
                        const mediaIndex = mediaList.findIndex(m => m.id == id);
                        mediaList[mediaIndex].commentsCount = responseData;
                    }
                }
            }else if(fileTypeFormat == "FILE") {
                const { id } = mediaFile;
                const getMediaFileSizeResponse = await getData(getMediaFileSizeUrl + id);
                if (getMediaFileSizeResponse) {
                    if (getMediaFileSizeResponse.responseCode == 99) {
                        const { responseData } = getMediaFileSizeResponse;
                        const mediaIndex = mediaList.findIndex(m => m.id == id);
                        mediaList[mediaIndex].size = getFormattedBytes(responseData);
                    }
                }
            }
        }
        if(listType == "TODAY") setTodayMediaFiles(mediaList);
        else if(listType == "YESTERDAY") setYesterdayMediaFiles(mediaList);
        else setOlderMediaFiles(mediaList);
    }

    const getFormattedBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2; // To 2d.p
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const getAllMedia = async (classId) => {
        toggleSpinner("show");
        const urlString = getAllMediaByClassUrl + classId + (!searchParams ? "" : ("?s=" + searchParams));
        const getMediaResponse = await getData(urlString);
        if (getMediaResponse) {
            toggleSpinner("hide");
            if (getMediaResponse.responseCode == 99) {
                setClassId(classId);
                if(!searchParams) {
                    setTodayMediaFiles(getMediaResponse.responseData.todayMediaFiles);
                    setYesterdayMediaFiles(getMediaResponse.responseData.yesterdayMediaFiles);
                    setOlderMediaFiles(getMediaResponse.responseData.olderMediaFiles);
                }else setOlderMediaFiles(getMediaResponse.responseData);
            }
        }
    }

    const handleClassClick = async (e, classId) => {
        if (e) e.preventDefault();
        getAllMedia(classId);
    }

    const getFileTypeFromFormat = (format) => {
        if (!format) return "FILE";
        if (videoFileExtensions.includes(format)) return "VIDEO";
        else if (audioFileExtensions.includes(format)) return "AUDIO";
        return "FILE";
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

    const handleResponse = (response, fileName) => {
        response.blob().then(blob => {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = fileName;
            link.click();
        });
    }

    return (
        <span>
            <Row className="mt-2 ml-0 mr-0">
                {
                    currentUser ? currentUser.assignedClasses.map((clazz, index) => {
                        return (
                            <Col md="4" sm="12" xs="12" key={index} className={`${styles.tab} ${classId == clazz.id ? styles.active : ""}`}>
                                <a href="#" className={styles.link} onClick={(e) => handleClassClick(e, clazz.id)}>{clazz.name.name}</a>
                            </Col>
                        )
                    }) : <></>
                }
            </Row>

            <div className={styles.big_text} hidden={!searchParams}>Search results for: '{searchParams}'</div>

            <Row className="pt-10 ml-0 mr-0 mt-10perc" hidden={todayMediaFiles.length > 0 || yesterdayMediaFiles.length > 0 || olderMediaFiles.length > 0}>
                <Col lg="12" md="12" sm="12" xs="12">
                    <div className={styles.section_two_text} style={{ textAlign: "center" }}>No data to show...</div>
                </Col>
            </Row>

            <Row className="pt-10 ml-0 mr-0" hidden={todayMediaFiles.length == 0}>
                <div className={styles.big_text}>Today</div>
                {
                    todayMediaFiles.map(mediaFile => {
                        if (getFileTypeFromFormat(mediaFile.mediaFormat) == "VIDEO") {
                            return (
                                <Col lg="3" md="4" sm="12" xs="12" className={styles.video_item} key={mediaFile.id}>
                                    <VideoPlayer videoUrl={mediaFile.mediaUrl} navigationUrl={"/auth/play-video?id=" + mediaFile.id} />
                                    <a href={"/auth/play-video?id=" + mediaFile.id} className={styles.video_item_link}>{mediaFile.title}</a>
                                    <div className={styles.video_item_desc}>{mediaFile.description}</div>
                                    <div className={styles.bottom_row}>
                                        <div>
                                            <EyeIcon /> <span className={styles.count}>{mediaFile.viewsCount ? mediaFile.viewsCount : "0"}</span>
                                        </div>
                                        <div>
                                            <ChatIcon /> <span className={styles.count}>{mediaFile.commentsCount ? mediaFile.commentsCount : "0"}</span>
                                        </div>
                                        <div>
                                            <a href="#" onClick={(e) => viewAssessment(e, mediaFile.id)}>View Assessment</a>
                                        </div>
                                    </div>
                                </Col>
                            );
                        } else if (getFileTypeFromFormat(mediaFile.mediaFormat) == "AUDIO") {
                            return (
                                <Col lg="3" md="4" sm="12" xs="12" className={`${styles.text_item} ${styles.audio_item}`} key={mediaFile.id}>
                                    <div className={styles.audio_text}>{mediaFile.title}</div>
                                    <div className={styles.section_two}>
                                        <AudioPlayer fileSrc={mediaFile.mediaUrl} />
                                    </div>
                                </Col>
                            )
                        }
                        return (
                            <Col lg="3" md="4" sm="12" xs="12" className={styles.text_item} key={mediaFile.id}>
                                <div>
                                    <TextFileIcon />
                                </div>
                                <div className={styles.section_two}>
                                    <div className={styles.section_two_text}>{mediaFile.title}</div>
                                    <div>
                                        <span className={styles.file_size}>{mediaFile.size ? mediaFile.size : "0kb"}</span>
                                        <span className="p-5">&bull;</span>
                                        <a className={styles.preview} href={mediaFile.mediaUrl} target="_blank">Preview</a>
                                    </div>
                                </div>
                            </Col>
                        )
                    })
                }
            </Row>

            <div className={styles.divider} hidden={yesterdayMediaFiles.length == 0}></div>

            <Row className="pt-10 ml-0 mr-0" hidden={yesterdayMediaFiles.length == 0}>
                <div className={styles.big_text}>Yesterday</div>
                {
                    yesterdayMediaFiles.map(mediaFile => {
                        if (getFileTypeFromFormat(mediaFile.mediaFormat) == "VIDEO") {
                            return (
                                <Col lg="3" md="4" sm="12" xs="12" className={styles.video_item} key={mediaFile.id}>
                                    <VideoPlayer videoUrl={mediaFile.mediaUrl} navigationUrl={"/auth/play-video?id=" + mediaFile.id} />
                                    <a href={"/auth/play-video?id=" + mediaFile.id} className={styles.video_item_link}>{mediaFile.title}</a>
                                    <div className={styles.video_item_desc}>{mediaFile.description}</div>
                                    <div className={styles.bottom_row}>
                                        <div>
                                            <EyeIcon /> <span className={styles.count}>{mediaFile.viewsCount ? mediaFile.viewsCount : "0"}</span>
                                        </div>
                                        <div>
                                            <ChatIcon /> <span className={styles.count}>{mediaFile.commentsCount ? mediaFile.commentsCount : "0"}</span>
                                        </div>
                                        <div>
                                            <a href="#" onClick={(e) => viewAssessment(e, mediaFile.id)}>View Assessment</a>
                                        </div>
                                    </div>
                                </Col>
                            );
                        } else if (getFileTypeFromFormat(mediaFile.mediaFormat) == "AUDIO") {
                            return (
                                <Col lg="3" md="4" sm="12" xs="12" className={`${styles.text_item} ${styles.audio_item}`} key={mediaFile.id}>
                                    <div className={styles.audio_text}>{mediaFile.title}</div>
                                    <div className={styles.section_two}>
                                        <AudioPlayer fileSrc={mediaFile.mediaUrl} />
                                    </div>
                                </Col>
                            )
                        }
                        return (
                            <Col lg="3" md="4" sm="12" xs="12" className={styles.text_item} key={mediaFile.id}>
                                <div>
                                    <TextFileIcon />
                                </div>
                                <div className={styles.section_two}>
                                    <div className={styles.section_two_text}>{mediaFile.title}</div>
                                    <div>
                                        <span className={styles.file_size}>{mediaFile.size ? mediaFile.size : "0kb"}</span>
                                        <span className="p-5">&bull;</span>
                                        <a className={styles.preview} href={mediaFile.mediaUrl} target="_blank">Preview</a>
                                    </div>
                                </div>
                            </Col>
                        )
                    })
                }
            </Row>

            <div className={styles.divider} hidden={yesterdayMediaFiles.length == 0}></div>

            <Row className="pt-10 ml-0 mr-0" hidden={olderMediaFiles.length == 0}>
                <div className={styles.big_text} hidden={searchParams}>Older</div>
                {
                    olderMediaFiles.map(mediaFile => {
                        if (getFileTypeFromFormat(mediaFile.mediaFormat) == "VIDEO") {
                            return (
                                <Col lg="3" md="4" sm="12" xs="12" className={styles.video_item} key={mediaFile.id}>
                                    <VideoPlayer videoUrl={mediaFile.mediaUrl} navigationUrl={"/auth/play-video?id=" + mediaFile.id} />
                                    <a href={"/auth/play-video?id=" + mediaFile.id} className={styles.video_item_link}>{mediaFile.title}</a>
                                    <div className={styles.video_item_desc}>{mediaFile.description}</div>
                                    <div className={styles.bottom_row}>
                                        <div>
                                            <EyeIcon /> <span className={styles.count}>{mediaFile.viewsCount ? mediaFile.viewsCount : "0"}</span>
                                        </div>
                                        <div>
                                            <ChatIcon /> <span className={styles.count}>{mediaFile.commentsCount ? mediaFile.commentsCount : "0"}</span>
                                        </div>
                                        <div>
                                            <a href="#" onClick={(e) => viewAssessment(e, mediaFile.id)}>View Assessment</a>
                                        </div>
                                    </div>
                                </Col>
                            );
                        } else if (getFileTypeFromFormat(mediaFile.mediaFormat) == "AUDIO") {
                            return (
                                <Col lg="3" md="4" sm="12" xs="12" className={`${styles.text_item} ${styles.audio_item}`} key={mediaFile.id}>
                                    <div className={styles.audio_text}>{mediaFile.title}</div>
                                    <div className={styles.section_two}>
                                        <AudioPlayer fileSrc={mediaFile.mediaUrl} />
                                    </div>
                                </Col>
                            )
                        }
                        return (
                            <Col lg="3" md="4" sm="12" xs="12" className={styles.text_item} key={mediaFile.id}>
                                <div>
                                    <TextFileIcon />
                                </div>
                                <div className={styles.section_two}>
                                    <div className={styles.section_two_text}>{mediaFile.title}</div>
                                    <div>
                                        <span className={styles.file_size}>{mediaFile.size ? mediaFile.size : "0kb"}</span>
                                        <span className="p-5">&bull;</span>
                                        <a className={styles.preview} href={mediaFile.mediaUrl} target="_blank">Preview</a>
                                    </div>
                                </div>
                            </Col>
                        )
                    })
                }
            </Row>
        </span>
    );
}

const UploadSection = () => {
    const { currentUser, uploadedFiles, uploadInProgress } = useContext(AppContext) || { currentUser: { assignedClasses: [] }, uploadedFiles: {} };

    const dropUpRef = createRef();
    const assessmentFileInputField = createRef();
    const resetBtnRef = createRef();

    const [show, setShow] = useState(false);
    const [intUploadInProgress, setIntUploadInProgress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accept, setAccept] = useState("");


    const activateModal = (e, accept) => {
        e.preventDefault();
        setShow(true);
        setAccept(accept);
        toggleDropUp();
    }

    const toggleDropUp = (e) => {
        if (e) e.preventDefault();
        let { display } = dropUpRef.current.style;
        if (display == "" || display == "none")
            dropUpRef.current.style.display = "block";
        else
            dropUpRef.current.style.display = "none";
    }

    const [state, setState] = useState({
        title: "",
        categoryId: 0,
        classId: 0,
        description: "",
        categories: [],
        uploadedMediaFileNames: [],
        assessmentFileName: ""
    });

    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        if (uploadedFiles) {
            const uploadedFileNames = [];
            for (let i = 0; i < Object.keys(uploadedFiles).length; i++) {
                uploadedFileNames.push(Object.keys(uploadedFiles)[i]);
            }
            setState({ ...state, uploadedMediaFileNames: uploadedFileNames });
        }
    }, [uploadedFiles]);

    const getAllCategories = async () => {
        let getAllCategoriesResponse = await getData(getAllCategoriesUrl);
        if (getAllCategoriesResponse) {
            if (getAllCategoriesResponse.responseCode == 99) {
                setState({ ...state, categories: getAllCategoriesResponse.responseData.categories });
            } else console.log("Unable to fetch all categories");
        } else {
            this.toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }

    const toggleModalLoader = (action) => {
        if (action == "show") setLoading(true);
        else setLoading(false);
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleModalLoader("show");
        let addMediaResponse = await postData(addMediaUrl, state);
        if (addMediaResponse) {
            if (addMediaResponse.responseCode == 99) {
                toggleModalLoader("hide");
                showAlertWithCallBack("success", addMediaResponse.message, () => window.location.reload());
            } else {
                toggleModalLoader("hide");
                showAlert("error", addMediaResponse.errorMessage);
            }
        } else {
            toggleModalLoader("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    const performAction = (action) => {
        if (action == "close") {
            resetBtnRef.current.click();
            setShow(false);
        }else if (action == "show") setShow(true);
    }

    const handleFileUpload = (e) => {
        setIntUploadInProgress(true);
        const { files: newFiles } = e.target;
        if (newFiles && newFiles.length > 0) {
            if (newFiles[0].size <= 3000000) {// Assessment file size should not be more than 3MB...
                let formData = new FormData();
                formData.append('assessment', newFiles[0]);
                let fileName = newFiles[0].name;
                postData(uploadMediaUrl, formData, null, true)
                    .then(data => {
                        if (data) {
                            if (data.responseCode == 99) {
                                setIntUploadInProgress(false);
                                setState({ ...state, assessmentFileName: fileName });
                                // showAlert("success", data.message);
                            } else {
                                setIntUploadInProgress(false);
                                showAlert("error", data.errorMessage);
                            }
                        } else {
                            setIntUploadInProgress(false);
                            showAlert("error", "Oops! Assessment Upload failed as server is unreachable. Please try again later");
                        }
                    });
            } else showAlert("error", "File is too large. Max. assessment file size is 3MB");
        }
    }

    const handleUploadBtnClick = (e) => {
        e.preventDefault();
        assessmentFileInputField.current.click();
    }

    const ProcessIcon = () => {
        if (intUploadInProgress || uploadInProgress) return <FontAwesomeIcon icon={faSpinner} className="fa-spin" />;
        if (loading) return <FontAwesomeIcon icon={faSpinner} className="fa-spin" />;
        return <></>
    }

    const getSubmitButtonText = () => {
        if (intUploadInProgress || uploadInProgress) return "Uploading";
        if (loading) return "Loading";
        return "Upload";
    }

    return (
        <Col lg="4" md="4" sm="12" xs="12" className={styles.upload_section}>
            <a className={`btn btn-secondary ${styles.upload_button}`} href="#" onClick={(e) => toggleDropUp(e)}><CloudUploadIcon /> Upload Media</a>

            <ul className={styles.drop_up} ref={dropUpRef}>
                <li className={`${styles.drop_up_item} ${styles.drop_up_item_border}`}>
                    <a href="#" onClick={(e) => activateModal(e, normalFileExtesions)}><FileIcon className={styles.icon} /> File</a>
                </li>
                <li className={`${styles.drop_up_item} ${styles.drop_up_item_border}`}>
                    <a href="#" onClick={(e) => activateModal(e, audioFileExtensions)}><MicIcon className={styles.icon} /> Audio</a>
                </li>
                <li className={styles.drop_up_item}>
                    <a href="#" onClick={(e) => activateModal(e, videoFileExtensions)}><VideoIcon className={styles.icon} /> Video</a>
                </li>
            </ul>

            <Modal size="lg" show={show} onHide={() => performAction("close")}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mt-10" as="div">
                        <Col lg="6" md="12" sm="12" xs="12">
                            <CustomFileUpload label="Media Upload" accept={accept} multiple />
                        </Col>
                        <Col lg="6" md="12" sm="12" xs="12">
                            <Form method="post" action="#" onSubmit={(sf) => submit(sf)}>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" id="title" name="title" placeholder="Type here..." required onChange={(e) => handleChange(e)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Course</Form.Label>
                                    <select id="categoryId" name="categoryId" className="form-control" onChange={(e) => handleChange(e)} required>
                                        <option value="">- select one -</option>
                                        {
                                            state.categories ? state.categories.map(category => {
                                                return <option value={category.id} key={category.id}>{category.name}</option>
                                            }) : <></>
                                        }
                                    </select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Class</Form.Label>
                                    <select id="classId" name="classId" className="form-control" onChange={(e) => handleChange(e)} required>
                                        <option value="">- select one -</option>
                                        {
                                            currentUser ? currentUser.assignedClasses.map(clazz => {
                                                return <option value={clazz.id} key={clazz.id}>{clazz.name.name}</option>
                                            }) : <></>
                                        }
                                    </select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" placeholder="Type description here" rows="4" id="description" name="description" onChange={(e) => handleChange(e)} maxLength="100" required />
                                    <small>Max. length 100 chars</small>
                                </Form.Group>
                                <Form.Group hidden={accept != videoFileExtensions}>
                                    <Form.File style={{ display: "none" }} title="" value="" ref={assessmentFileInputField} accept={normalFileExtesions} onChange={handleFileUpload} />
                                    <a href="#" className={styles.add_assessment_link} onClick={handleUploadBtnClick}>Add Assessment</a>
                                    <div>{state.assessmentFileName}</div>
                                </Form.Group>
                                <Form.Group>
                                    <Button type="submit" variant="secondary" className={styles.modal_upload_button} disabled={intUploadInProgress || uploadInProgress}><ProcessIcon />&nbsp;{getSubmitButtonText()}</Button>
                                    <Button type="reset" variant="default" ref={resetBtnRef} className={styles.cancel_button}>Cancel</Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => performAction("close")}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    )
}



