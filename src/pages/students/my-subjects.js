import { createRef, useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import AppLayout from './layout/app-layout';
import styles from '../../styles/my-subjects.module.css';
import EyeIcon from "../../svgs/eye_icon.svg";
import ChatIcon from "../../svgs/chat_icon_sm.svg";
import TextFileIcon from "../../svgs/text_file_icon.svg";
import AudioPlayer from "../../components/custom-audio-player";
import VideoPlayer from "../../components/custom-video-player";
import ChatIconYellow from "../../svgs/chat_icon_yellow.svg";
import VideoIcon from "../../svgs/video_icon.svg";
import MySubjectsIntersection from "../../svgs/my_subjects_intersection.svg";
import { AppContext } from "../../providers/app-provider";
import getData from "../../networking/send-get-request";
import { 
    getAllCategoriesUrl, getAllMediaFilesByCategoryIdUrl, 
    getTotalViewsCountByMediaIdUrl, getTotalCommentsCountByMediaIdUrl, 
    getTotalMediaCountByCategoryIdUrl, getTotalCommentsCountByCategoryIdUrl, 
    downloadAssessmentUrl, getAssessmentFileNameUrl, getMediaFileSizeUrl 
} from "../../networking/external-url";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { showAlert, showAlertWithCallBack } from "../../components/alerter";
import Spinner from "../../components/spinner";


const audioFileExtensions = ".mp3,.aac,.wav.mp2.oog";
const videoFileExtensions = ".mp4,.avi,.mkv,.mpeg4";

const MySubjects = ({searchParams}) => {
    const [showSpinner, setShowSpinner] = useState(false);
    const [categoryId, setCategoryId] = useState(0);
    const [categories, setCategories] = useState([]);
    const [todayMediaFiles, setTodayMediaFiles] = useState([]);
    const [yesterdayMediaFiles, setYesterdayMediaFiles] = useState([]);
    const [olderMediaFiles, setOlderMediaFiles] = useState([]);
    const [selectedItem, setSelectedItem] = useState("Most_recent");
    const [categoryMetaData, setCategoryMetaData] = useState({categoryMedia: "N/A", categoryComments: "N/A"});

    const toggleSpinner = (action) => {
        setShowSpinner(action == "show");
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        if (categories) {
            if (categories.length > 0)
                getAllMedia(categoryId);
        }

        if (categoryId && categoryId != 0) {
            getCategoryMetaData();
        }
    }, [categoryId]);

    useEffect(() => {
        if (todayMediaFiles.length > 0) fetchAndUpdateMediaMetaData("TODAY");
    }, [todayMediaFiles.length]);

    useEffect(() => {
        if (yesterdayMediaFiles.length > 0) fetchAndUpdateMediaMetaData("YESTERDAY");
    }, [yesterdayMediaFiles.length]);

    useEffect(() => {
        if (olderMediaFiles.length > 0) fetchAndUpdateMediaMetaData("OLDER");
    }, [olderMediaFiles.length]);

    const getAllCategories = async () => {
        let getAllCategoriesResponse = await getData(getAllCategoriesUrl);
        if (getAllCategoriesResponse) {
            if (getAllCategoriesResponse.responseCode == 99) {
                const {categories} = getAllCategoriesResponse.responseData;
                setCategories(getAllCategoriesResponse.responseData.categories);
                if(categories) {
                    if(categories.length > 0)  { 
                        if(categoryId == 0) setCategoryId(categories[0].id); 
                    }
                }
            } else console.log("Unable to fetch all categories");
        } else {
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    const getCategoryMetaData = async () => {
        let mediaCount = 0;
        let commentsCount = 0;
        if(toggleSpinner) toggleSpinner("show");

        const urlString = `${getTotalMediaCountByCategoryIdUrl + categoryId}${!searchParams ? "" : ("?s="+ searchParams)}`;
        let getAllMediaCountResponse = await getData(urlString);
        if (getAllMediaCountResponse) {
            if (getAllMediaCountResponse.responseCode == 99) {
                mediaCount = getAllMediaCountResponse.responseData;
            } else console.log("Unable to fetch media count");
        } else {
            console.log("Unable to fetch media count");
        }

        const urlString2 = `${getTotalCommentsCountByCategoryIdUrl + categoryId}${!searchParams ? "" : ("?s="+ searchParams)}`;
        let getAllCommentsCountResponse = await getData(urlString2);
        if (getAllCommentsCountResponse) {
            if (getAllCommentsCountResponse.responseCode == 99) {
                commentsCount = getAllCommentsCountResponse.responseData;
            } else console.log("Unable to fetch comments count");
        } else {
            console.log("Unable to fetch comments count");
        }
        if(toggleSpinner) toggleSpinner("hide");
        const categoryMetaData = {categoryMedia: mediaCount, categoryComments: commentsCount};
        setCategoryMetaData(categoryMetaData);
    }

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
            } else if (fileTypeFormat == "FILE") {
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
        if (listType == "TODAY") setTodayMediaFiles(mediaList);
        else if (listType == "YESTERDAY") setYesterdayMediaFiles(mediaList);
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

    const getAllMedia = async (categoryId) => {
        toggleSpinner("show");
        const urlString = `${getAllMediaFilesByCategoryIdUrl + categoryId}${!searchParams ? "" : ("?s="+ searchParams)}`;
        const getMediaResponse = await getData(urlString);
        if (getMediaResponse) {
            toggleSpinner("hide");
            if (getMediaResponse.responseCode == 99) {
                setCategoryId(categoryId);
                if(!searchParams) {
                    setTodayMediaFiles(getMediaResponse.responseData.todayMediaFiles);
                    setYesterdayMediaFiles(getMediaResponse.responseData.yesterdayMediaFiles);
                    setOlderMediaFiles(getMediaResponse.responseData.olderMediaFiles);
                }else {
                    setOlderMediaFiles(getMediaResponse.responseData);
                }
            }
        }
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

    const CustomInnerHeader = () => {
        const customSelectDropdownRef = createRef();

        const handleSelectToggle = (e) => {
            if (e) e.preventDefault();
            if (customSelectDropdownRef.current.style.display == "none")
                customSelectDropdownRef.current.style.display = "block";
            else
                customSelectDropdownRef.current.style.display = "none";
        }

        const handleSelectChange = (e, name) => {
            e.preventDefault();
            setSelectedItem(name);
            handleSelectToggle();
        }

        return (
            <>
                <div className={styles.custom_header}>
                    <span>Mathematics</span>
                    <a href="#" className={styles.inner_header_select} onClick={(e) => handleSelectToggle(e)}>
                        {selectedItem.replace("_", " ")}
                        <span className={styles.parent}>
                            <span>
                                <FontAwesomeIcon icon={faAngleUp} size="1x" /> <FontAwesomeIcon icon={faAngleDown} size="1x" />
                            </span>
                        </span>
                    </a>
                    <span className={styles.my_subjects_title}>My Subjects</span>
                </div>
                <ul className={styles.inner_header_select_d_i} style={{ display: "none" }} ref={customSelectDropdownRef}>
                    <li><a href="#" onClick={(e) => handleSelectChange(e, "Most_recent")}>Most recent</a></li>
                    <div className={styles.inner_header_select_divider}></div>
                    <li><a href="#" onClick={(e) => handleSelectChange(e, "Today")}>Today</a></li>
                    <div className={styles.inner_header_select_divider}></div>
                    <li><a href="#" onClick={(e) => handleSelectChange(e, "Yesterday")}>Yesterday</a></li>
                    <div className={styles.inner_header_select_divider}></div>
                    <li><a href="#" onClick={(e) => handleSelectChange(e, "Older")}>Older</a></li>
                </ul>
            </>
        );
    }

    const showSection = (sectionName) => {
        switch (sectionName) {
            case "TODAY":
                return todayMediaFiles.length > 0 && (selectedItem.includes("recent") || selectedItem == "Today");
            case "YESTERDAY":
                return yesterdayMediaFiles.length > 0 && (selectedItem.includes("recent") || selectedItem == "Yesterday");
            case "OLDER":
                return olderMediaFiles.length > 0 && (selectedItem.includes("recent") || selectedItem == "Older");
            default:
                return false;
        }
    }

    return (
        <AppLayout pageName="My Subjects" customInnerHeader={<CustomInnerHeader />}>
            <Spinner showSpinner={showSpinner} />
            <Row as="div" className={styles.parent_row}>
                <Col lg="8" as="div">
                    <Row className="pt-10 ml-0 mr-0 mt-2" hidden={todayMediaFiles.length > 0 || yesterdayMediaFiles.length > 0 || olderMediaFiles.length > 0}>
                        <Col lg="12" md="12" sm="12" xs="12">
                            <div className={styles.section_two_text} style={{ textAlign: "center" }}>No data to show...</div>
                        </Col>
                    </Row>

                    <Row className="pt-10 ml-0 mr-0" hidden={!showSection("TODAY")}>
                        <div className={styles.big_text}>Today</div>
                        {
                            todayMediaFiles.map(mediaFile => {
                                if (getFileTypeFromFormat(mediaFile.mediaFormat) == "VIDEO") {
                                    return (
                                        <Col lg="4" md="4" sm="12" xs="12" className={styles.video_item} key={mediaFile.id}>
                                            <VideoPlayer videoUrl={mediaFile.mediaUrl} navigationUrl={"/students/play-video?id=" + mediaFile.id} />
                                            <a href={"/students/play-video?id=" + mediaFile.id} className={styles.video_item_link}>{mediaFile.title}</a>
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
                                        <Col lg="4" md="4" sm="12" xs="12" className={`${styles.text_item} ${styles.audio_item}`} key={mediaFile.id}>
                                            <div className={styles.audio_text}>{mediaFile.title}</div>
                                            <div className={styles.section_two}>
                                                <AudioPlayer fileSrc={mediaFile.mediaUrl} />
                                            </div>
                                        </Col>
                                    )
                                }
                                return (
                                    <Col lg="4" md="4" sm="12" xs="12" className={styles.text_item} key={mediaFile.id}>
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

                    <div className={styles.divider} hidden={!showSection("YESTERDAY")}></div>

                    <Row className="pt-10 ml-0 mr-0" hidden={!showSection("YESTERDAY")}>
                        <div className={styles.big_text}>Yesterday</div>
                        {
                            yesterdayMediaFiles.map(mediaFile => {
                                if (getFileTypeFromFormat(mediaFile.mediaFormat) == "VIDEO") {
                                    return (
                                        <Col lg="4" md="4" sm="12" xs="12" className={styles.video_item} key={mediaFile.id}>
                                            <VideoPlayer videoUrl={mediaFile.mediaUrl} navigationUrl={"/students/play-video?id=" + mediaFile.id} />
                                            <a href={"/students/play-video?id=" + mediaFile.id} className={styles.video_item_link}>{mediaFile.title}</a>
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
                                        <Col lg="4" md="4" sm="12" xs="12" className={`${styles.text_item} ${styles.audio_item}`} key={mediaFile.id}>
                                            <div className={styles.audio_text}>{mediaFile.title}</div>
                                            <div className={styles.section_two}>
                                                <AudioPlayer fileSrc={mediaFile.mediaUrl} />
                                            </div>
                                        </Col>
                                    )
                                }
                                return (
                                    <Col lg="4" md="4" sm="12" xs="12" className={styles.text_item} key={mediaFile.id}>
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

                    <div className={styles.divider} hidden={!showSection("YESTEDAY")}></div>

                    <Row className="pt-10 ml-0 mr-0" hidden={!showSection("OLDER")}>
                        <div className={styles.big_text}>{!searchParams ? "Older" : "Search results for: '"+ searchParams + "'"}</div>
                        {
                            olderMediaFiles.map(mediaFile => {
                                if (getFileTypeFromFormat(mediaFile.mediaFormat) == "VIDEO") {
                                    return (
                                        <Col lg="4" md="4" sm="12" xs="12" className={styles.video_item} key={mediaFile.id}>
                                            <VideoPlayer videoUrl={mediaFile.mediaUrl} navigationUrl={"/students/play-video?id=" + mediaFile.id} />
                                            <a href={"/students/play-video?id=" + mediaFile.id} className={styles.video_item_link}>{mediaFile.title}</a>
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
                                        <Col lg="4" md="4" sm="12" xs="12" className={`${styles.text_item} ${styles.audio_item}`} key={mediaFile.id}>
                                            <div className={styles.audio_text}>{mediaFile.title}</div>
                                            <div className={styles.section_two}>
                                                <AudioPlayer fileSrc={mediaFile.mediaUrl} />
                                            </div>
                                        </Col>
                                    )
                                }
                                return (
                                    <Col lg="4" md="4" sm="12" xs="12" className={styles.text_item} key={mediaFile.id}>
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
                </Col>
                <Col lg="4" as="div" className={styles.categories_col}>
                    {
                        categories.length > 0 ? categories.map(category => {
                            return (
                                <section style={{cursor: "pointer"}} onClick={() => setCategoryId(category.id)} key={category.id}>
                                    <div className={styles.tab} hidden={categoryId == category.id}>{category.name}</div>
                                    <div className={styles.tab_desc} hidden={categoryId != category.id}>
                                        <div className={styles.tab_desc_content}>
                                            <span>{category.name}</span>
                                            <div className={styles.tab_desc_info}>
                                                <div className={styles.tab_desc_info_item}>
                                                    <span className={styles.tab_desc_info_icon}><VideoIcon /></span>
                                                    <span className={styles.tab_desc_info_number}>{categoryMetaData.categoryMedia}<br /><span className={styles.tab_desc_info_meta}>Media</span></span>
                                                </div>
                                                <div className={`${styles.tab_desc_info_item} ${styles.tab_desc_info_item2}`}>
                                                    <span className={styles.tab_desc_info_icon}><ChatIconYellow /></span>
                                                    <span className={styles.tab_desc_info_number}>{categoryMetaData.categoryComments}<br /><span className={styles.tab_desc_info_meta}>Comments</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        <MySubjectsIntersection className={styles.intersection} />
                                    </div>
                                </section>
                            );
                        }) : <div align="center">No category found</div>
                    }
                </Col>
            </Row>
        </AppLayout>
    );
}

MySubjects.getInitialProps = async ({query}) => {
    const {s} = query;
    return {searchParams: s}
}

export default MySubjects;