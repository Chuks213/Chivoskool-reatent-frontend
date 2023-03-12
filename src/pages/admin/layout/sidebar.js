import {useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {AppContext} from '../../../providers/app-provider';
import Router from 'next/router';
import DashboardIcon from '../../../svgs/dashboard_icon.svg';
import BookOpenIcon from '../../../svgs/book_open.svg';
import QuoteIcon from '../../../svgs/quote_icon.svg';
import TwitchIcon from '../../../svgs/twitch.svg';
import CategoryIcon from '../../../svgs/layers.svg';
import UsersIcon from '../../../svgs/users.svg';
import StudentsIcon from '../../../svgs/students.svg';

const Sidebar = (props) => {
    const {showSidebar, toggleSidebar} = useContext(AppContext) || {};
    const pageName = props.pageName;

    const toggleClick = (e) => {
        if(e) e.preventDefault();
        toggleSidebar();
    }

    const getClassName = (id) => {
        return ((getPageNumber() == id) ? "active" : "") + " theme-dark-item";
    }

    const getPageNumber = () => {
        if(pageName) {
            if(pageName.includes("Dashboard")) return 1;
            else if(pageName.includes("Institution") || pageName.includes("Class")) return 2;
            else if(pageName.includes("Tutor")) return 3;
            else if(pageName.includes("Student")) return 4;
            else if(pageName.includes("Course")) return 5;
            else if(pageName.includes("Data")) return 6;
        }
        return 0;
    }

    const navigate = async (url) => {
        window.location.href = url;
    }

    return(
        <div className={`nav-side-menu ${showSidebar ? "show" : "hide"} dark`}>
            <div className="brand dark">
                <a href="/admin/dashboard" className="auth-logo">
                    <img src="/images/reatent white logo.png" alt="Logo" className="app-logo" />&nbsp;
                    Reatent
                </a>
            </div>

            <div className="w-100 hide-big">
                <a href="#" title="Close" onClick={(e) => toggleClick(e)}>
                    <FontAwesomeIcon className="close-icon text-white" icon={faTimes} size="lg" />
                </a>
            </div>
        
            <div className="menu-list">
    
                <ul id="menu-content" className={`menu-content collapse ${showSidebar ? "show" : "hide"} out`}>
                    <li className={getClassName(1)} data-id="1" onClick={(e) => navigate("/admin/dashboard")}>
                        <div className="li-div">
                            <DashboardIcon className="icon-left theme-dark-icon" /> <span className="a-text theme-dark-text">Dashboard</span>
                        </div>
                    </li>

                    <li className={getClassName(2)} data-id="2" onClick={(e) => navigate("/admin/schools")}>
                        <div className="li-div">
                            <BookOpenIcon className="icon-left theme-dark-icon" /> <span className="a-text theme-dark-text">Institutions</span>
                        </div>
                    </li>

                    <li className={getClassName(3)} data-id="3" onClick={(e) => navigate("/admin/teachers")}>
                        <div className="li-div">
                            <UsersIcon className="icon-left theme-dark-icon" /> <span className="a-text theme-dark-text">Tutors</span>
                        </div>
                    </li>

                    <li className={getClassName(4)} data-id="4" onClick={(e) => navigate("/admin/students")}>
                        <div className="li-div">
                            <UsersIcon className="icon-left theme-dark-icon"/> <span className="a-text theme-dark-text">Students</span>
                        </div>
                    </li>

                    <li className={getClassName(5)} data-id="5" onClick={(e) => navigate("/admin/category")}>
                        <div className="li-div">
                            <CategoryIcon className="icon-left theme-dark-icon"/> <span className="a-text theme-dark-text">Courses</span>
                        </div>
                    </li>

                    <li className={getClassName(6)} data-id="6" onClick={(e) => navigate("/admin/quotes")}>
                        <div className="li-div">
                            <QuoteIcon className="icon-left theme-dark-icon" /> <span className="a-text theme-dark-text">Data</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;