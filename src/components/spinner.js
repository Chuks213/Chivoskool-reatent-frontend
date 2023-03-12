import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useContext} from 'react';
import {AppContext} from '../providers/app-provider';

const Spinner = (props) => {
    const {showSpinner} = useContext(AppContext) || {};

    const internalShowSpinner = (props.showSpinner == undefined || props.showSpinner == "Not available") ? false : props.showSpinner;

    return(
        <div className="custom-spinner" hidden={!showSpinner && !internalShowSpinner}><FontAwesomeIcon icon={faSpinner} pulse size="5x"/></div>
    );
}

export default Spinner;