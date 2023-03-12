import React, { Component } from 'react';
import AppLayout from "./layout/app-layout";
import styles from "../../styles/activity.module.css";
import { Col } from 'react-bootstrap';
import ChatIcon from "../../svgs/chat_icon.svg";
import ArrowDown from "../../svgs/arrow_down.svg";
import VideoIcon from "../../svgs/video_icon.svg";
import UploadIcon from "../../svgs/upload_icon.svg";

export default class Activity extends Component {
    render() {
        return (
            <AppLayout pageName="Activities">
                <h2 className={styles.big_text}>What’s going on</h2>
                <Col md="12" as="div" className={styles.column}>
                    <h6 className={styles.weekly_text}>Today</h6>

                    <div className={styles.custom_tbl_body}>
                        <div className={styles.tbl_group}>
                            <div className={styles.tbl_left_pane}>
                                <ChatIcon />
                            </div>
                            <div className={styles.tbl_right_pane}>
                                <div className={styles.tbl_right_text}>You replied Omotayo Modupe’s comment on your video to SS3</div>
                                <div className={styles.arrow_down} style={{ display: "flex", flexDirection: "row" }}>
                                    <ArrowDown className={styles.pr_6} />
                                    <div className={styles.reply_content}>“Your answer is correct, it shows you followed the class correctly”</div>
                                </div>
                                <div className={styles.content_time}>12:30 pm</div>
                            </div>
                            <div className={`${styles.activity_line} hidden-mobile`}></div>
                        </div>
                        <div className={styles.tbl_group}>
                            <div className={styles.tbl_left_pane}>
                                <VideoIcon />
                            </div>
                            <div className={styles.tbl_right_pane}>
                                <div className={styles.tbl_right_text}>You uploaded a video to SS3</div>
                                <div className={styles.content_time}>11:30 am</div>
                            </div>
                            <div className={`${styles.activity_line} hidden-mobile`}></div>
                        </div>
                        <div className={styles.tbl_group}>
                            <div className={styles.tbl_left_pane}>
                                <VideoIcon />
                            </div>
                            <div className={styles.tbl_right_pane}>
                                <div className={styles.tbl_right_text}>You uploaded a video to SS2</div>
                                <div className={styles.content_time}> 10:00 am</div>
                            </div>
                            <div className={`${styles.activity_line} hidden-mobile`}></div>
                        </div>
                        <div className={styles.tbl_group}>
                            <div className={styles.tbl_left_pane}>
                                <UploadIcon />
                            </div>
                            <div className={styles.tbl_right_pane}>
                                <div className={styles.tbl_right_text}>You uploaded a video to SS1</div>
                                <div className={styles.content_time}>09:00 am</div>
                            </div>
                        </div>
                    </div>
                </Col>

                <div className={styles.divider}></div>

                <Col md="12" as="div" className={styles.column}>
                    <h6 className={styles.weekly_text}>Yesterday</h6>

                    <div className={styles.custom_tbl_body}>
                        <div className={styles.tbl_group}>
                            <div className={styles.tbl_left_pane}>
                                <ChatIcon />
                            </div>
                            <div className={styles.tbl_right_pane}>
                                <div className={styles.tbl_right_text}>You replied Ajibola Thomson’s comment on your video to SS1</div>
                                <div className={styles.arrow_down} style={{ display: "flex", flexDirection: "row" }}>
                                    <ArrowDown />
                                    <div className={styles.reply_content}>“Use the fomular given in the video you would get the answers correctly”</div>
                                </div>
                                <div className={styles.content_time}>04:00 pm</div>
                            </div>
                            <div className={`${styles.activity_line} hidden-mobile`}></div>
                        </div>
                        <div className={styles.tbl_group}>
                            <div className={styles.tbl_left_pane}>
                                <UploadIcon />
                            </div>
                            <div className={styles.tbl_right_pane}>
                                <div className={styles.tbl_right_text}>You uploaded a video to SS3</div>
                                <div className={styles.content_time}>02:30 pm</div>
                            </div>
                            <div className={`${styles.activity_line} hidden-mobile`}></div>
                        </div>
                        <div className={styles.tbl_group}>
                            <div className={styles.tbl_left_pane}>
                                <UploadIcon />
                            </div>
                            <div className={styles.tbl_right_pane}>
                                <div className={styles.tbl_right_text}>You uploaded a video to SS2</div>
                                <div className={styles.content_time}>02:00 pm</div>
                            </div>
                            <div className={`${styles.activity_line} hidden-mobile`}></div>
                        </div>
                        <div className={styles.tbl_group}>
                            <div className={styles.tbl_left_pane}>
                                <UploadIcon />
                            </div>
                            <div className={styles.tbl_right_pane}>
                                <div className={styles.tbl_right_text}>You uploaded a video to SS1</div>
                                <div className={styles.content_time}>12:00 pm</div>
                            </div>
                            <div className={`${styles.activity_line} hidden-mobile`}></div>
                        </div>
                        <div className={styles.tbl_group}>
                            <div className={styles.tbl_left_pane}>
                                <ChatIcon />
                            </div>
                            <div className={styles.tbl_right_pane}>
                                <div className={styles.tbl_right_text}>You replied Ebunoluwa Olajide’s comment on your video to SS1</div>
                                <div className={styles.arrow_down} style={{ display: "flex", flexDirection: "row" }}>
                                    <ArrowDown />
                                    <div className={styles.reply_content}>“Use the fomular given in the video you would get the answers correctly”</div>
                                </div>
                                <div className={styles.content_time}>12:00 pm</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </AppLayout>
        )
    }
}