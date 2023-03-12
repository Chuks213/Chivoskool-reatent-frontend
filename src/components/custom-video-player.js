import React, {Component} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import styles from "../styles/custom-video-player.module.css";

export default class CustomVideoPlayer extends Component {
    constructor(props) {
        super(props);

        this.bigVideo = this.props.bigVideo;
    }

    handleParentClick(e) {
        e.preventDefault();
        window.location.href = this.props.navigationUrl;
    }

    render() {
        if(!this.bigVideo) {
            return(
                <div className={styles.parent} onClick={this.handleParentClick.bind(this)}>
                    <span className={styles.play_icon} hidden={this.props.controls} >
                        <FontAwesomeIcon icon={faPlayCircle} size="5x" />
                    </span>
                    <video className={styles.video}>
                        <source src={this.props.videoUrl} type="video/mp4" />
                        <source src={this.props.videoUrl} type="video/avi" />
                        <source src={this.props.videoUrl} type="video/mkv" />
                        <source src={this.props.videoUrl} type="video/mpeg4" />
                        Your browser does not support videos.
                    </video>
                </div>
            );
        }else {
            return(
                <video className={`${styles.video} ${styles.video_big}`} controls controlsList="nodownload" >
                    <source src={this.props.videoUrl} type="video/mp4" />
                    <source src={this.props.videoUrl} type="video/avi" />
                    <source src={this.props.videoUrl} type="video/mkv" />
                    <source src={this.props.videoUrl} type="video/mpeg4" />
                    Your browser does not support videos.
                </video>
            );
        }
    }
}