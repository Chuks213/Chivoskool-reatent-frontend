import React, { Component, useContext, useEffect, useState } from "react";
import AppLayout from "./layout/app-layout";
import getData from "../../networking/send-get-request";
import postData from "../../networking/send-post-request";
import { getMediaUrl, getCommentsByMediaIdUrl, getCommentReplyByCommentIdUrl, getTotalCommentsCountByMediaIdUrl, addCommentReplyUrl, addCommentUrl } from "../../networking/external-url";
import VideoPlayer from "../../components/custom-video-player";
import { Button, Form, FormControl, Row } from "react-bootstrap";
import styles from "../../styles/play-video.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../providers/app-provider";
import { showAlert, showAlertWithCallBack } from "../../components/alerter";

export default class PlayVideo extends Component {
    static async getInitialProps({ query }) {
        const { id, tn } = query;
        return { id, tn };
    }

    constructor(props) {
        super(props);

        this.state = {
            video: null
        }
    }

    componentDidMount() {
        getData(getMediaUrl + this.props.id)
            .then(data => {
                if (data) {
                    if (data.responseCode == 99)
                        this.setState({ video: data.responseData });
                }
            }).catch(err => console.log("Unable to get media. See error below: \n" + err));
    }

    render() {
        return (
            <AppLayout pageName={`${this.props.tn ? (this.props.tn == "lib" ? "Library" : "My Classes") : "My Classes"} ${this.state.video ? ("| Play Video - " + this.state.video.title) : ""}`}>
                <Row className="mt-2 ml-0 mr-0">
                    <a href={this.props.tn ? (this.props.tn == "lib" ? "/auth/library" : "/auth/my-classes") : "/auth/my-classes"} className={styles.back}><FontAwesomeIcon icon={faArrowLeft} size="1x" />&nbsp;&nbsp;Back</a>
                </Row>
                <Row className="mt-2 ml-0 mr-0">
                    {
                        this.state.video ?
                            <VideoPlayer videoUrl={this.state.video.mediaUrl} bigVideo /> :
                            <div style={{ margin: "0 auto", marginTop: "10%" }}>No video found...</div>
                    }
                </Row>
                <Row className="mt-2 ml-0 mr-0">
                    {this.state.video ? <div className={styles.video_title}>{this.state.video.title}</div> : <div></div>}
                </Row>
                <Row className="mt-2 ml-0 mr-0">
                    {this.state.video ? <div className={styles.video_meta}>{this.state.video.mediaCategory.name} &nbsp; &bull; &nbsp; {this.state.video.uploadedOn}</div> : <div></div>}
                </Row>
                <Row className="mt-2 ml-0 mr-0">
                    <div style={{width: "100%", marginBottom: 5, color: "#322035"}}>
                        <h6>Description</h6>
                    </div>
                    {this.state.video ? <div className={styles.video_meta}>{this.state.video.description}</div> : <div></div>}
                </Row>
                <Row className="mt-2 ml-0 mr-0">
                    <div className={styles.divider}></div>
                </Row>

                <CommentsSection mediaId={this.props.id} />
            </AppLayout>
        )
    }
}

const CommentsSection = (props) => {
    const { toggleSpinner, currentUser } = useContext(AppContext) || { currentUser: {} };
    const [comments, setComments] = useState([]);
    const [totalNoOfPages, setTotalNoOfPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    const [commentSectionVisible, setCommentSectionVisible] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [loadComments, setLoadComments] = useState(false);

    useEffect(() => {
        getCommentsCount();
    }, []);

    const getCommentsCount = async () => {
        toggleSpinner("show");
        const getCommentsCountResponse = await getData(getTotalCommentsCountByMediaIdUrl + props.mediaId);
        if (getCommentsCountResponse) {
            if (getCommentsCountResponse.responseCode == 99) {
                setTotalCount(getCommentsCountResponse.responseData);
                toggleSpinner("hide");
            }else {
                console.log("An error occurred while trying to fetch comments count: ", getCommentsCountResponse.errorMessage);
                toggleSpinner("hide");
            }
        }else {
            console.log("An critical error occured while trying to fetch comments count");
            toggleSpinner("hide");
        }
    }

    const showCommentsSection = (e) => {
        e.preventDefault();
        setLoadComments(true);
    }

    useEffect(() => {
        if(loadComments) {
            getComments();
            updateReplySection();
        }
    }, [loadComments]);

    const getComments = async (cp) => {
        toggleSpinner("show");
        const getCommentsResponse = await getData(getCommentsByMediaIdUrl + props.mediaId + "/" + (cp || currentPage) + "/" + pageSize);
        if (getCommentsResponse) {
            if (getCommentsResponse.responseCode == 99) {
                const { comments, totalPages } = getCommentsResponse.responseData;

                let newComments = await Promise.all(comments.map(async (comment) => {
                    const getCommentReplyResponse = await getData(getCommentReplyByCommentIdUrl + comment.id);
                    let commentReply = null;
                    if (getCommentReplyResponse) {
                        if (getCommentReplyResponse.responseCode == 99) {
                            commentReply = getCommentReplyResponse.responseData;
                        }
                    }

                    return {
                        ...comment,
                        reply: commentReply
                    }
                }));
                setComments(newComments);
                if (cp) setCurrentPage(cp);
                else setTotalNoOfPages(totalPages);
                toggleSpinner("hide");
            }else {
                console.log("An error occurred while trying to fetch comments: ", getCommentsResponse.errorMessage);
                toggleSpinner("hide");
            }
        }else {
            console.log("An critical error occured while trying to fetch comments");
            toggleSpinner("hide");
        }
    }

    const loadMore = (e) => {
        e.preventDefault();
        getComments(currentPage + 1);
    }

    const handleReply = (e, id) => {
        e.preventDefault();
        const modComments = comments.map(comment => {
            if(comment.id == id)
                return {...comment, showReplyBox: true}
            else 
                return {...comment, showReplyBox: false}
        });
        setComments(modComments);
    }

    const updateReplySection = () => {
        if(currentUser) {
            if(Object.keys(currentUser).length > 0) {
                if(currentUser.role.name == "LECTURER") {
                    setCommentSectionVisible(true);
                }else setCommentSectionVisible(false);
            }else setCommentSectionVisible(false);
        }else setCommentSectionVisible(false);
    }

    const replyBoxEnabled = (id) => {
        if(!id) return false;
        const comment = comments.filter(comment => comment.id == id);
        if(comment) {
            if(comment.showReplyBox) return true;
        }
        return false;
    }

    const replyComment = async (e, id) => {
        e.preventDefault();
        toggleSpinner("show");
        let message = document.getElementById("message-"+ id).value;
        console.log("Message is: ", message);
        if(!message) {
            showAlert("error", "Reply message is required");
            return;
        }else {
            if(message.toString().trim() == "") {
                showAlert("error", "Message field cannot be left empty");
                return;
            }
        }
        let replyCommentResponse = await postData(addCommentReplyUrl, {commentId: id, message: message});
        if(replyCommentResponse) {
            toggleSpinner("hide");
            if(replyCommentResponse.responseCode == 99) {
                showAlertWithCallBack("success", replyCommentResponse.message, () => window.location.reload());
            }else showAlert("error", replyCommentResponse.errorMessage);
        }else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    const addComment = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let message = document.getElementById("comment-msg").value;
        if(!message) {
            showAlert("error", "Reply message is required");
            return;
        }else {
            if(message.toString().trim() == "") {
                showAlert("error", "Message field cannot be left empty");
                return;
            }
        }
        let addCommentResponse = await postData(addCommentUrl, {mediaId: props.mediaId, message: message});
        if(addCommentResponse) {
            toggleSpinner("hide");
            if(addCommentResponse.responseCode == 99) {
                showAlertWithCallBack("success", addCommentResponse.message, () => window.location.reload());
            }else showAlert("error", addCommentResponse.errorMessage);
        }else {
            toggleSpinner("hide");
            showAlertWithCallBack("error", "Oops! We are unable to process your request at the moment, server is unreachable. Please check your internet connection and try again later", () => window.location.reload());
        }
    }

    const showLoadMore = () => {
        if(!comments) return false;
        if(comments.length > 0) {
            if(totalNoOfPages > (currentPage + 1)) return true;
        }
        return false;
    }

    return (
        <>
            <Row className="mt-2 ml-0 mr-0">
                <a href="#" className={styles.comments_link} onClick={(e) => showCommentsSection(e)}>{totalCount} Comment(s)</a>
            </Row>
            
            <Row className="mt-2 ml-0 mr-0" hidden={!loadComments}>
                <div className={styles.comment_box}>
                    <ul>
                        {
                            comments.length > 0 ? comments.map(comment => {
                                return(
                                    <span key={comment.id}>
                                        <li>
                                            <div className={styles.comment_name}>{comment.createdBy ? (comment.createdBy.firstName + ' ' + comment.createdBy.lastName) : ""}</div>
                                            <div className={styles.comment_date}>{comment.createdOn}</div>
                                            <div className={styles.comment_message}>{comment.message}</div>
                                            {
                                                !comment.reply ? 
                                                    <a href="#" className={styles.reply_btn} onClick={(e) => handleReply(e, comment.id)} hidden={!commentSectionVisible && !replyBoxEnabled(comment.id)}>Reply</a>
                                                : <></>
                                            }
                                            <div className={styles.comment_add_reply_box} id={comment.id} hidden={!comment.showReplyBox}>
                                                <Form action="#" method="post" onSubmit={(e) => replyComment(e, comment.id)}>
                                                    <FormControl id={"message-"+ comment.id} rows="4" as="textarea" />
                                                    <div className={styles.spacer}></div>
                                                    <Button type="submit" variant="success">Submit</Button>
                                                </Form>
                                            </div>
                                            <div className={styles.comment_reply_box} hidden={!comment.reply}>
                                                <small>
                                                    <b>{`${comment.reply ? comment.reply.createdBy.firstName : "N/A"} ${comment.reply ? comment.reply.createdBy.lastName : "N/A"} replied on ${comment.reply ? comment.reply.createdOn : "N/A"}`}</b>
                                                    <div>{comment.reply ? comment.reply.message : "N/A"}</div>
                                                </small>
                                            </div>
                                        </li>
                                        <div className={styles.spacer}></div>
                                    </span>
                                )
                            }) : <li><div align="center" className={styles.comment_name}>No comments yet</div></li>
                        }
                    </ul>
                    <div align="center" hidden={!showLoadMore()}><a href="#" className={styles.load_more_btn} onClick={(e) => loadMore(e)}>Load more</a></div>
                </div>
                <div className={styles.add_comment_box} hidden={currentUser ? (currentUser.role ? currentUser.role.name != "STUDENT" : true) : true}>
                    <div className={styles.add_comment_inner_box}>
                        <h4>Add Comment</h4>
                        <div>
                            <Form action="#" method="post" onSubmit={(e) => addComment(e)}>
                                <FormControl id="comment-msg" rows="6" as="textarea" required />
                                <div className={styles.spacer}></div>
                                <Button type="submit" variant="info">Submit</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </Row>
        </>
    )
}