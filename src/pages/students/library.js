import React, { useContext, useEffect, useState } from 'react';
import AppLayout from './layout/app-layout';
import getData from '../../networking/send-get-request';
import { getStudentViewsUrl, getTotalViewsCountByMediaIdUrl, getTotalCommentsCountByMediaIdUrl } from "../../networking/external-url";
import { Col, Row } from 'react-bootstrap';
import styles from '../../styles/student_library.module.css';
import EyeIcon from "../../svgs/eye_icon.svg";
import ChatIcon from "../../svgs/chat_icon_sm.svg";
import VideoPlayer from "../../components/custom-video-player";
import { AppContext } from '../../providers/app-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faEye } from '@fortawesome/free-solid-svg-icons';


const Library = ({searchParams}) => {
    const [viewedTodayList, setViewedTodayList] = useState([]);
    const [viewedRecentlyList, setViewedRecentlyList] = useState([]);

    const audioFileExtensions = ".mp3,.aac,.wav.mp2.oog";
    const videoFileExtensions = ".mp4,.avi,.mkv,.mpeg4";

    useEffect(() => {
        getStudentViews();
    }, []);

    const getStudentViews = () => {
        getData(getStudentViewsUrl + (searchParams ? ("?s=" + searchParams) : ""))
            .then(data => {
                if (data) {
                    if (data.responseCode == 99) {
                        let { responseData } = data;
                        if(!searchParams) {
                            setViewedTodayList(responseData.viewedToday);
                            setViewedRecentlyList(responseData.viewedRecently);
                        }else setViewedTodayList(responseData);
                    }
                }
            })
            .catch(err => {
                console.log("An error occurred while trying to fetch student views. See error below \n" + err);
            });
    }

    useEffect(() => {
        if (viewedTodayList.length > 0) fetchAndUpdateMediaMetaData("TODAY");
    }, [viewedTodayList.length]);

    useEffect(() => {
        if (viewedRecentlyList.length > 0) fetchAndUpdateMediaMetaData("RECENTLY");
    }, [viewedRecentlyList.length]);

    const fetchAndUpdateMediaMetaData = async (type) => {
        const viewedList = type == "TODAY" ? [...viewedTodayList] : [...viewedRecentlyList];
        for (let item of viewedList) {
            const fileTypeFormat = getFileTypeFromFormat(item.media.mediaFormat);
            if (fileTypeFormat == "VIDEO") {
                const { id, media } = item;
                const getMediaViewsCountResponse = await getData(getTotalViewsCountByMediaIdUrl + media.id);
                const getCommentViewsCountResponse = await getData(getTotalCommentsCountByMediaIdUrl + media.id);
                if (getMediaViewsCountResponse) {
                    if (getMediaViewsCountResponse.responseCode == 99) {
                        const { responseData } = getMediaViewsCountResponse;
                        const mediaIndex = viewedList.findIndex(m => m.id == id);
                        viewedList[mediaIndex].viewsCount = responseData;
                    }
                }

                if (getCommentViewsCountResponse) {
                    if (getCommentViewsCountResponse.responseCode == 99) {
                        const { responseData } = getCommentViewsCountResponse;
                        const mediaIndex = viewedList.findIndex(m => m.id == id);
                        viewedList[mediaIndex].commentsCount = responseData;
                    }
                }
            }
        }
        if(type == "TODAY") setViewedTodayList(viewedList);
        else setViewedRecentlyList(viewedList);
    }

    const getFileTypeFromFormat = (format) => {
        if (!format) return "FILE";
        if (videoFileExtensions.includes(format)) return "VIDEO";
        else if (audioFileExtensions.includes(format)) return "AUDIO";
        return "FILE";
    }

    return (
        <AppLayout pageName="Library">
            <Row className="pt-10 ml-0 mr-0 mt-10perc" hidden={viewedTodayList.length > 0 || viewedRecentlyList.length > 0}>
                <Col lg="12" md="12" sm="12" xs="12">
                    <div className={styles.section_two_text} style={{ textAlign: "center" }}>No data to show...</div>
                </Col>
            </Row>

            <Row className="pt-10 ml-0 mr-0" hidden={viewedTodayList.length == 0}>
            <div className={styles.big_text}>{!searchParams ? "Viewed Today" : "Search results for: '"+ searchParams + "'"}</div>
                {
                    viewedTodayList.map(record => {
                        const mediaFile = record.media;
                        return (
                            <Col lg="3" md="4" sm="12" xs="12" key={mediaFile.id} className={styles.video_item}>
                                <VideoPlayer videoUrl={mediaFile.mediaUrl} navigationUrl={"/auth/play-video?tn=lib&id=" + mediaFile.id} />
                                <a href={"/auth/play-video?tn=lib&id=" + mediaFile.id} className={styles.video_item_link}>{mediaFile.title}</a>
                                <div className={styles.bottom_row}>
                                    <div style={{marginRight: 25}}>
                                        <FontAwesomeIcon icon={faEye} size="1x" style={{fontSize: 14}} /> <span className={styles.count}>{record.viewsCount ? record.viewsCount : "0"}</span>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faCommentDots} size="1x" style={{fontSize: 14}} /> <span className={styles.count}>{record.commentsCount ? record.commentsCount : "0"}</span>
                                    </div>
                                </div>
                            </Col>
                        )
                    })
                }
            </Row>

            <div className={styles.divider} hidden={viewedRecentlyList.length == 0}></div>

            <Row className="pt-10 ml-0 mr-0" hidden={viewedRecentlyList.length == 0}>
                <div className={styles.big_text}>Viewed Recently</div>
                {
                    viewedRecentlyList.map(record => {
                        const mediaFile = record.media;
                        return (
                            <Col lg="3" md="4" sm="12" xs="12" key={mediaFile.id} className={styles.video_item}>
                                <VideoPlayer videoUrl={mediaFile.mediaUrl} navigationUrl={"/students/play-video?tn=lib&id=" + mediaFile.id} />
                                <a href={"/students/play-video?tn=lib&id=" + mediaFile.id} className={styles.video_item_link}>{mediaFile.title}</a>
                                <div className={styles.bottom_row}>
                                    <div style={{marginRight: 25}}>
                                        <FontAwesomeIcon icon={faEye} size="1x" style={{fontSize: 14}} /> <span className={styles.count}>{record.viewsCount ? record.viewsCount : "0"}</span>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faCommentDots} size="1x" style={{fontSize: 14}} /> <span className={styles.count}>{record.commentsCount ? record.commentsCount : "0"}</span>
                                    </div>
                                </div>
                            </Col>
                        )
                    })
                }
            </Row>
        </AppLayout>
    )
}

Library.getInitialProps = async ({query}) => {
    const {s} = query;
    return {searchParams: s}
}

export default Library;
