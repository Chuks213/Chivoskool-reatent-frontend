import {useContext} from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "../styles/custom-file-upload.module.css";
import CloudUploadIconDark from "../svgs/cloud_upload_icon_dark.svg";
import {AppContext} from "../providers/app-provider";

const KILO_BYTES_PER_BYTE = 1000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 15000000;

const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);

const convertBytesToMB = (kb) => Math.round(kb / KILO_BYTES_PER_BYTE);

const FileUpload = ({label, maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES, ...otherProps}) => {
    const {uploadFiles, uploadedFiles, deleteFiles} = useContext(AppContext);
    const fileInputField = useRef(null);
    const [files, setFiles] = useState({});

    const handleUploadBtnClick = () => {
        fileInputField.current.click();
    };

    const addNewFiles = (newFiles) => {
        for (let file of newFiles) {
            if (file.size <= maxFileSizeInBytes) {
                if (!otherProps.multiple) {
                    return { file };
                }
                files[file.name] = file;
            }else console.log("File is too large");
        }
        return { ...files };
    };

    const handleNewFileUpload = (e) => {
        const { files: newFiles } = e.target;
        if (newFiles && newFiles.length > 0) {
            let updatedFiles = addNewFiles(newFiles);
            setFiles(updatedFiles);
            uploadFiles(updatedFiles);
        }
    };

    const removeFile = (fileName) => {
        delete files[fileName];
        setFiles({ ...files });
        deleteFiles(fileName);
    };

    const handleDragEnter = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            let updatedFiles = addNewFiles(files);
            setFiles(updatedFiles);
            uploadFiles(uploadFiles);
        }
    };

    return (
        <>
            <div className={styles.image_upload_box}
                onDrop={e => handleDrop(e)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}>
                <CloudUploadIconDark />
                <div className={styles.image_upload_text}>
                    Drag file{otherProps.multiple ? "s" : ""} to upload <br /> or <a href="#" onClick={handleUploadBtnClick}>Browse</a>
                </div>
                <Form.File className={styles.upload_btn} title="" value="" {...otherProps} ref={fileInputField} onChange={handleNewFileUpload} />
            </div>

            <article className={styles.file_preview_container}>
                <span>To Upload</span>
                <section className={styles.preview_list}>
                    {Object.keys(uploadedFiles).map((fileName, index) => {
                        let file = uploadedFiles[fileName];
                        let isImageFile = file.type.split("/")[0] === "image";
                        return (
                            <section className={styles.preview_container} key={fileName}>
                                <div>
                                    {isImageFile && (
                                        <img className={styles.image_preview} src={URL.createObjectURL(file)} alt={`file preview ${index}`} />
                                    )}
                                    <div className={`${styles.file_meta_data} ${isImageFile ? styles.hidden : styles.d_flex}`}>
                                        <span>{file.name}</span>
                                        <aside>
                                            <span>{convertBytesToKB(file.size)} kb</span>
                                            <span className={styles.remove_file_icon} onClick={() => removeFile(fileName)}><FontAwesomeIcon icon={faTrash} size="1x" /></span>
                                        </aside>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </section>
            </article>
        </>
    );
};

export default FileUpload;