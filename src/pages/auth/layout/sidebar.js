import {useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {AppContext} from '../../../providers/app-provider';
import Router from 'next/router';
import DashboardIcon from '../../../svgs/dashboard_icon.svg';
import BookOpenIcon from '../../../svgs/book_open.svg';
import LayersIcon from '../../../svgs/layers.svg';
import TwitchIcon from '../../../svgs/twitch.svg';
import ShoppingCartIcon from '../../../svgs/shopping_cart.svg';
import UsersIcon from '../../../svgs/users.svg';

const Sidebar = (props) => {
    const {showSidebar, toggleSidebar} = useContext(AppContext) || {};
    const pageName = props.pageName;

    const toggleClick = (e) => {
        if(e) e.preventDefault();
        toggleSidebar();
    }

    const getClassName = (id) => {
        return (getPageNumber() == id) ? "active" : "";
    }

    const getPageNumber = () => {
        if(pageName) {
            if(pageName.includes("Dashboard")) return 1;
            else if(pageName.includes("Classes")) return 2;
            else if(pageName.includes("Library")) return 3;
            else if(pageName.includes("Activities")) return 4;
            else if(pageName.includes("Submission") || pageName.includes("Grade")) return 5;
            else if(pageName.includes("Forum")) return 6;
        }
        return 0;
    }

    const navigate = async (url) => {
        window.location.href = url;
    }

    return(
        <div className={`nav-side-menu ${showSidebar ? "show" : "hide"}`}>
            <div className="brand">
                <a href="/auth/dashboard" className="auth-logo">
                    {/* <img src="/images/reatent white logo.png" alt="Logo" className="app-logo" /> */}
                    Reatent
                </a>
            </div>

            <div className="w-100 hide-big">
                <a href="#" title="Close" onClick={(e) => toggleClick(e)}>
                    <FontAwesomeIcon className="close-icon" icon={faTimes} size="lg" />
                </a>
            </div>
        
            <div className="menu-list">
    
                <ul id="menu-content" className={`menu-content collapse ${showSidebar ? "show" : "hide"} out`}>
                    <li className={getClassName(1)} data-id="1" onClick={(e) => navigate("/auth/dashboard")}>
                        <div className="li-div">
                            <DashboardIcon className="icon-left" /> <span className="a-text">Dashboard</span>
                        </div>
                    </li>

                    <li className={getClassName(2)} data-id="2" onClick={(e) => navigate("/auth/my-classes")}>
                        <div className="li-div">
                            <BookOpenIcon className="icon-left" /> <span className="a-text">My Classes</span>
                        </div>
                    </li>

                    <li className={getClassName(3)} data-id="3" onClick={(e) => navigate("/auth/library")}>
                        <div className="li-div">
                            <LayersIcon className="icon-left" /> <span className="a-text">Library</span>
                        </div>
                    </li>

                    <li className={getClassName(4)} data-id="4" onClick={(e) => navigate("/auth/activity")}>
                        <div className="li-div">
                            <TwitchIcon className="icon-left"/> <span className="a-text">Activities</span>
                        </div>
                    </li>

                    <li className={getClassName(5)} data-id="5" onClick={(e) => navigate("/auth/submissions/all")}>
                        <div className="li-div">
                            <ShoppingCartIcon className="icon-left"/> <span className="a-text">Submissions</span>
                        </div>
                    </li>

                    <li className={getClassName(6)} data-id="6" onClick={(e) => navigate("/auth/forum")}>
                        <div className="li-div">
                            <UsersIcon className="icon-left" /> <span className="a-text">Forum</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;