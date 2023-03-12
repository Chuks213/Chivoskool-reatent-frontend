import {useContext, useEffect} from "react";
import Header from './header';
import Sidebar from './sidebar';
import { Container } from 'react-bootstrap';
import Spinner from '../../../components/spinner';
import {AppProvider} from '../../../providers/app-provider';
import {NextSeo} from 'next-seo';
import CustomModal from '../../../components/custom-modal';
import {fetchCurrentUser, getUserToken, logout} from '../../../components/host-master';
import { showAlertWithCallBack } from '../../../components/alerter';
import { AppContext } from '../../../providers/app-provider';

const AppLayout = (props) => {
    const pageName = (props.pageName && props.pageName != "Not available") ? 
        ` | ${props.pageName}` : 
        "";

    const showSideBar = (props.showSideBar == undefined || props.showSideBar == "Not available") ? true : 
    props.showSideBar;
    const showHeader = (props.showHeader == undefined || props.showHeader == "Not available") ? true : 
    props.showHeader;
    const customInnerHeader = (props.customInnerHeader && props.customInnerHeader != "Not available") ? 
        props.customInnerHeader : 
        <div className="custom-header">{props.pageName}</div>;

    return(
        <AppProvider>
            <NextSeo title={"Reatent Application" + pageName}/>
            <Spinner />
            <div style={{width: "100vw", position: "relative", height: "100vh"}}>
                <CustomModal />
                {showSideBar ? <Sidebar pageName={pageName} /> : ""}
                <div className="w-78 d-white">
                    {showHeader ? <Header  /> : ""}
                    <Container className="app-container">
                        {customInnerHeader}
                        {props.children}
                    </Container>
                </div>
            </div>
            <Validator/>
        </AppProvider>
    );
}

const Validator = (props) => {
    const { updateCu, toggleSpinner } = useContext(AppContext) || {};

    useEffect(() => {
        if(getUserToken()) {
            toggleSpinner("show");
            fetchCurrentUser().then(data => {
                toggleSpinner("hide");
                if(data) {
                    if(data.role.name != "STUDENT") {
                        showAlertWithCallBack("error", "Oops! You are not authorized to access this resource. You'd be logged out", () => {logout(); window.location.replace("/login");});
                    }else updateCu(data);
                }else {
                    logout(); 
                    window.location.replace("/login");
                }
            });
        }else {
            logout(); 
            window.location.href = "/login";
        }
    }, [props.pageName]);

    return(
        <span></span>
    )
}

export default AppLayout;