import React, {Component, createContext} from 'react';
import postData from '../networking/send-post-request';
import getData from '../networking/send-get-request';
import {uploadMediaUrl, deleteMediaUrl} from '../networking/external-url';
import {showAlert} from '../components/alerter';


export const AppContext = createContext();


export class AppProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSidebar: false,
            customModal: {},
            showSpinner: false,
            currentUser: null,
            uploadedFiles: {},
            uploadInProgress: false,
            todoListEventDate: null
        }

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.activateModal = this.activateModal.bind(this);
        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.updateCu = this.updateCu.bind(this);
        this.deactivateModal = this.deactivateModal.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.deleteFiles = this.deleteFiles.bind(this);
        this.updateCalendarDate = this.updateCalendarDate.bind(this);
    }

    toggleSidebar() {
        this.setState({showSidebar: !this.state.showSidebar});
    }

    activateModal(data) {
        this.setState({customModal: data});
    }

    deactivateModal() {
        const {customModal} = this.state;
        customModal.show = false;
        this.setState({customModal: customModal});
    }

    toggleSpinner(action) {
        this.setState({showSpinner: (action == "show")});
    }

    updateCu(cu) {
        this.setState({currentUser: cu});
    }

    uploadFiles(files) {
        this.setState({uploadInProgress: true});
        let formData = new FormData();
        for(let i = 0; i < Object.keys(files).length; i++) {
            formData.append('filesUpload[]', Object.values(files)[i]);
        }
        postData(uploadMediaUrl, formData, null, true)
        .then(data => {
            if(data) {
                if(data.responseCode == 99) {
                    this.setState({uploadInProgress: false});
                    this.setState({uploadedFiles: files});
                    // showAlert("success", data.message);
                }else {
                    this.setState({uploadInProgress: false});
                    showAlert("error", data.errorMessage);
                }
            }else {
                this.setState({uploadInProgress: false});
                showAlert("error", "Oops! Upload failed as server is unreachable. Please try again later");
            }
        });
    }

    deleteFiles(fileName) {
        this.setState({uploadInProgress: true});
        getData(deleteMediaUrl + fileName)
        .then(data => {
            if(data) {
                if(data.responseCode == 99) {
                    this.setState({uploadInProgress: false});
                    const {uploadedFiles} = state;
                    delete uploadedFiles[fileName];
                    this.setState({uploadedFiles: uploadedFiles});
                }else {
                    this.setState({uploadInProgress: false});
                    showAlert("error", data.errorMessage);
                }
            }else {
                this.setState({uploadInProgress: false});
                showAlert("error", "Faileed to delete file as sever could not be reached");
            }
        });
    }

    updateCalendarDate(dateToUpdate) {
        if(dateToUpdate) {
            let year = dateToUpdate.getFullYear();
            let month = (dateToUpdate.getMonth() + 1);
            let day = dateToUpdate.getDate();
            day = day.toString().length == 1 ? ("0" + day) : day;
            month = month.toString().length == 1 ? ("0" + month) : month;
            this.setState({todoListEventDate: `${year}-${month}-${day}`});
        }
    }

    render() {
        return(
            <AppContext.Provider value={{
                ...this.state, 
                toggleSidebar: this.toggleSidebar,
                activateModal: this.activateModal, 
                toggleSpinner: this.toggleSpinner,
                updateCu: this.updateCu,
                deactivateModal: this.deactivateModal,
                uploadFiles: this.uploadFiles,
                deleteFiles: this.deleteFiles,
                updateCalendarDate: this.updateCalendarDate
                }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}