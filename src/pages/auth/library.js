import { useContext, useEffect, useState } from 'react';
import AppLayout from './layout/app-layout';
import getData from '../../networking/send-get-request';
import { getAllMediaUrl, downloadAssessmentUrl, getAssessmentFileNameUrl, getTotalViewsCountByMediaIdUrl, getTotalCommentsCountByMediaIdUrl, getMediaFileSizeUrl } from "../../networking/external-url";
import { Col, Row } from 'react-bootstrap';
import styles from '../../styles/my-classes.module.css';
import EyeIcon from "../../svgs/eye_icon.svg";
import ChatIcon from "../../svgs/chat_icon_sm.svg";
import TextFileIcon from "../../svgs/text_file_icon.svg";
import AudioPlayer from "../../components/custom-audio-player";
import VideoPlayer from "../../components/custom-video-player";
import { AppContext } from '../../providers/app-provider';
import { showAlert } from "../../components/alerter";


const Library = ({searchParams}) => {
    const [mediaList, setMediaList] = useState([]);

    const audioFileExtensions = ".mp3,.aac,.wav.mp2.oog";
    const videoFileExtensions = ".mp4,.avi,.mkv,.mpeg4";

    useEffect(() => {
        getAllMedia();
    }, []);

    const getAllMedia = () => {
        getData(getAllMediaUrl + (searchParams ? ("?s=" + searchParams) : ""))
            .then(data => {
                if (data) {
                    if (data.responseCode == 99) {
                        let { responseData } = data;
                        setMediaList(responseData);
                    }
                }
            })
            .catch(err => {
                console.log("An error occurred while trying to fetch media. See error below \n" + err);
            });
    }

    useEffect(() => {
        if (mediaList.length > 0) fetchAndUpdateMediaMetaData();
    }, [mediaList.length]);

    const fetchAndUpdateMediaMetaData = async () => {
        const newMediaList = [...mediaList];
        for (let mediaFile of newMediaList) {
            const fileTypeFormat = getFileTypeFromFormat(mediaFile.mediaFormat);
            if (fileTypeFormat == "VIDEO") {
                const { id } = mediaFile;
                const getMediaViewsCountResponse = await getData(getTotalViewsCountByMediaIdUrl + id);
                const getCommentViewsCountResponse = await getData(getTotalCommentsCountByMediaIdUrl + id);
                if (getMediaViewsCountResponse) {
                    if (getMediaViewsCountResponse.responseCode == 99) {
                        const { responseData } = getMediaViewsCountResponse;
                        const mediaIndex = newMediaList.findIndex(m => m.id == id);
                        newMediaList[mediaIndex].viewsCount = responseData;
                    }
                }

                if (getCommentViewsCountResponse) {
                    if (getCommentViewsCountResponse.responseCode == 99) {
                        const { responseData } = getCommentViewsCountResponse;
                        const mediaIndex = mediaList.findIndex(m => m.id == id);
                        newMediaList[mediaIndex].commentsCount = responseData;
                    }
                }
            } else if (fileTypeFormat == "FILE") {
                const { id } = mediaFile;
                const getMediaFileSizeResponse = await getData(getMediaFileSizeUrl + id);
                if (getMediaFileSizeResponse) {
                    if (getMediaFileSizeResponse.responseCode == 99) {
                        const { responseData } = getMediaFileSizeResponse;
                        const mediaIndex = newMediaList.findIndex(m => m.id == id);
                        newMediaList[mediaIndex].size = getFormattedBytes(responseData);
                    }
                }
            }
        }
        setMediaList(newMediaList);
    }

    const getFormattedBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2; // To 2d.p
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }


    const getFileTypeFromFormat = (format) => {
        if (!format) return "FILE";
        if (videoFileExtensions.includes(format)) return "VIDEO";
        else if (audioFileExtensions.includes(format)) return "AUDIO";
        return "FILE";
    }

    return (
        <AppLayout pageName="Library">
            <div className={styles.big_text}>Search results for: '{searchParams}'</div>
            <Row className="pt-10 ml-0 mr-0">
                {
                    mediaList.length > 0 ? mediaList.map(mediaFile => {
                        if (getFileTypeFromFormat(mediaFile.mediaFormat) == "VIDEO") {
                            return (
                                <Col lg="3" md="4" sm="12" xs="12" key={mediaFile.id} className={styles.video_item}>
                                    <VideoPlayer videoUrl={mediaFile.mediaUrl} navigationUrl={"/auth/play-video?tn=lib&id=" + mediaFile.id} />
                                    <a href={"/auth/play-video?tn=lib&id=" + mediaFile.id} className={styles.video_item_link}>{mediaFile.title}</a>
                                    <div className={styles.video_item_desc}>{mediaFile.description}</div>
                                    <div className={styles.bottom_row}>
                                        <div>
                                            <EyeIcon /> <span className={styles.count}>{mediaFile.viewsCount ? mediaFile.viewsCount : "0"}</span>
                                        </div>
                                        <div>
                                            <ChatIcon /> <span className={styles.count}>{mediaFile.commentsCount ? mediaFile.commentsCount : "0"}</span>
                                        </div>
                                        <ViewAssessmentBtn mediaFile={mediaFile} />
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
                    }) : (
                        <Col lg="12" md="12" sm="12" xs="12">
                            <div className={styles.section_two_text} style={{ textAlign: "center" }}>No data to show...</div>
                        </Col>
                    )
                }
            </Row>
        </AppLayout>
    )
}

const ViewAssessmentBtn = (props) => {
    const { toggleSpinner } = useContext(AppContext) || {};

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
        <div>
            <a href="#" onClick={(e) => viewAssessment(e, props.mediaFile.id)}>View Assessment</a>
        </div>
    )
}

Library.getInitialProps = async ({query}) => {
    const {s} = query;
    return {searchParams: s}
}

export default Library;
