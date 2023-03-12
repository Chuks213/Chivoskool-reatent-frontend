import {useContext} from 'react';
import {AppContext} from '../providers/app-provider';
import {Modal, Button} from 'react-bootstrap';

const CustomModal = () => {
    const {customModal, activateModal} = useContext(AppContext) || {customModal: {}};

    const performAction = (action) => {
        if(action == "close")
            activateModal({customModal: {...customModal, show: false}});
        else if(action == "show")
            activateModal({customModal: {...customModal, show: true}});
    }

    return (
        <>
            <Modal size="lg" show={customModal.show} onHide={() => performAction("close")}>
                <Modal.Header closeButton>
                    <Modal.Title>{customModal.headerTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{customModal.body ? customModal.body : null}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => performAction("close")}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CustomModal;