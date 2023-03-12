import React, { Component, createRef } from "react";
import styles from "../styles/audio_player.module.css";
import PlayIcon from "../svgs/play_arrow_icon.svg";
import MuteIcon from "../svgs/mic_icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPauseCircle, faVolumeOff } from "@fortawesome/free-solid-svg-icons";

export default class AudioPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAudioPlaying: false,
            isAudioMuted: false,
            duration: 0,
            currentTime: 0
        }

        this.audioPlayerRef = createRef();
        this.seekSliderRef = createRef();
    }

    componentDidMount() {
        this.currentTimeInterval = null;
        
        // Get duration of the song and set it as max slider value
        this.audioPlayerRef.current.onloadedmetadata = function () {
            this.setState({ duration: this.audioPlayerRef.current.duration });
        }.bind(this);

        // Sync slider position with song current time
        this.audioPlayerRef.current.onplay = () => {
            this.currentTimeInterval = setInterval(() => {
                this.seekSliderRef.current.value = this.audioPlayerRef.current.currentTime;
                this.setState({ currentTime: this.formatTime(this.audioPlayerRef.current.currentTime) });
            }, 500);
        };

        this.audioPlayerRef.current.onpause = () => {
            clearInterval(this.currentTimeInterval);
            this.setState({ isAudioPlaying: false });
        };

        // Seek functionality
        this.seekSliderRef.current.onchange = (e) => {
            // clearInterval(this.currentTimeInterval);
            this.audioPlayerRef.current.currentTime = e.target.value;
            this.setState({ currentTime: this.formatTime(this.audioPlayerRef.current.currentTime) });
        };
    }

    formatTime(secs) {
        var hr = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600)) / 60);
        var sec = Math.floor(secs - (hr * 3600) - (min * 60));
        if (sec < 10)
            sec = "0" + sec;
        return min + ':' + sec;
    }

    playAudio() {
        let audioPlayer = this.audioPlayerRef.current;
        audioPlayer.play();
        this.setState({ isAudioPlaying: true });
    }

    pauseAudio() {
        let audioPlayer = this.audioPlayerRef.current;
        audioPlayer.pause();
        this.setState({ isAudioPlaying: false });
    }

    muteAudio() {
        let audioPlayer = this.audioPlayerRef.current;
        audioPlayer.muted = true;
        this.setState({ isAudioMuted: true });
    }

    unMuteAudio() {
        let audioPlayer = this.audioPlayerRef.current;
        audioPlayer.muted = false;
        this.setState({ isAudioMuted: false });
    }

    render() {
        return (
            <div>
                <audio ref={this.audioPlayerRef} src={this.props.fileSrc}></audio>
                <div className={styles.audio_player_container}>
                    <div className={styles.row}>
                        <button type="button" className={`${styles.play_icon} ${styles.pos_relative}`} onClick={() => this.playAudio()} hidden={this.state.isAudioPlaying}>
                            <PlayIcon className={styles.play_icon_svg} />
                        </button>

                        <button type="button" className={`${styles.play_icon} ${styles.pos_relative}`} onClick={() => this.pauseAudio()} hidden={!this.state.isAudioPlaying}>
                            <FontAwesomeIcon icon={faPauseCircle} size="2x" style={{ color: "red" }} />
                        </button>

                        <input type="range" className={styles.seek_slider} min="0" max={this.state.duration} ref={this.seekSliderRef} />

                        <button type="button" className={styles.mute_icon} onClick={() => this.muteAudio()} hidden={this.state.isAudioMuted}>
                            <MuteIcon />
                        </button>

                        <button type="button" className={styles.mute_icon} onClick={() => this.unMuteAudio()} hidden={!this.state.isAudioMuted}>
                            <FontAwesomeIcon icon={faVolumeOff} size="2x" />
                        </button>
                    </div>
                    <span className={styles.time}>{this.state.currentTime == 0 ? "0.00" : this.state.currentTime}</span>
                </div>
            </div>
        );
    }
}