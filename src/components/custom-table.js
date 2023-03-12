import { useContext, useEffect, useState } from "react";
import styles from "../styles/custom-table.module.css";
import ActionIcon from "../svgs/action_icon.svg";
import doGet from "../networking/send-get-request";
import { useDropdownToggle, Dropdown } from 'react-overlays';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimesCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../providers/app-provider";

const CustomTable = (props) => {
    const { toggleSpinner } = useContext(AppContext);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        toggleSpinner("show");
        doGet(props.ajaxUrl)
            .then((data) => {
                toggleSpinner("hide");
                if (data) {
                    if (props.dataField) setDataList(data.responseData[props.dataField]);
                    else setDataList(data.responseData);
                }
            }).catch(err => {
                toggleSpinner("hide");
                console.log("An error occurred while trying to fetch table data for: " + props.ajaxUrl);
                console.log(err);
            });
    }, [props.ajaxUrl]);

    const renderTableRows = () => {
        if (dataList.length > 0) {
            const body = dataList.map(listItem => {
                return (
                    <tr key={listItem.id}>
                        {
                            props.columns.map((column, index) => {
                                if (!column.hidden) {
                                    if (column.data.includes("|")) {
                                        const dataSplit = column.data.split("|");
                                        if (column.data.includes(".")) {
                                            const diSplit = dataSplit[0].split(".");
                                            const diSplit2 = dataSplit[1].split(".");
                                            return <td key={index}>{listItem[diSplit[0]][diSplit[1]] + " " + listItem[diSplit2[0]][diSplit2[1]]}</td>;
                                        } else return <td key={index}>{listItem[dataSplit[0]] + " " + listItem[dataSplit[1]]}</td>;
                                    } else if (column.data.includes("--")) {
                                        const dataSplit = column.data.split("--");
                                        if (dataSplit[0].includes(".")) {
                                            const diSplit = dataSplit[0].split(".");
                                            const isList = diSplit[0].includes("[0]");
                                            const newDiSplit = isList ? diSplit[0].substring(0, diSplit[0].length - 3) : diSplit[0];
                                            return !isList ? <td key={index}>{listItem[newDiSplit][diSplit[1]][dataSplit[1]]}</td> : <td key={index}>{listItem[newDiSplit][0][diSplit[1]][dataSplit[1]]}</td>;
                                        } else return <td key={index}>{listItem[dataSplit[0]][dataSplit[1]]}</td>;
                                    } else if (column.data.includes("__")) {
                                        const dataSplit = column.data.split("__");
                                        return <td key={index}>{listItem[dataSplit[0]].replaceAll("_", " ")}</td>;
                                    } else {
                                        if (column.data.includes(".")) {
                                            const diSplit = column.data.split(".");
                                            return <td key={index}>{listItem[diSplit[0]][diSplit[1]]}</td>;
                                        }
                                    }
                                    if (column.title == "Action") {
                                        return renderTableRowAction(index, listItem[column.data], column.buttons);
                                    }
                                    if (listItem[column.data]) return <td key={index}>{listItem[column.data]}</td>;
                                    return <td key={index}></td>;
                                } else return null;
                            })
                        }
                    </tr>
                )
            });
            return body;
        } else {
            return (
                <tr>
                    <td className="text-center" colSpan={props.columns.length}>No data available</td>
                </tr>
            );
        }
    }

    const renderTableRowAction = (key, id, buttons) => {
        return (
            // <td key={key} style={{ position: "relative" }}>
            <td key={key}>
                <NotificationsButton id={id} buttons={buttons} />
            </td>
        );
    }


    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead className={styles.table_header}>
                    <tr>
                        {props.columns.map((column, index) => (!column.hidden) ? <th key={index}>{column.title}</th> : null)}
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows()}
                </tbody>

            </table>
        </div>
    );
}

const NotificationsButton = (props) => {
    const [show, setShow] = useState(false);

    const Menu = ({ role, showDropDown }) => {
        return (
            <div role={role} className={`menu-container menu-container-sm ${!showDropDown ? "menu-container-hidden" : ""}`}>
                <div className="notification-body">
                    {
                        props.buttons.map((button, index) => {
                            return (
                                !button.callback ?
                                    <a key={index} href={`${button.link}${props.id}`}>
                                        {button.type}
                                    </a>
                                    : <a key={index} href="#" onClick={(e) => {e.preventDefault(); button.callback(props.id);}}>
                                        {button.type}
                                    </a>
                            )
                        })
                    }
                    <a href="#" title="Dismiss" style={{padding: 7, borderTop: "1px solid #999", textAlign: "center", paddingBottom: 0}} onClick={(e) => {e.preventDefault(); setShow(false);}}><FontAwesomeIcon icon={faTimesCircle} size="2x" style={{fontSize: 23}} /></a>
                </div>
            </div>
        );
    };

    const Toggle = ({ id, children }) => {
        const [props, { show, toggle }] = useDropdownToggle();
        return (
            <button type="button" className="btn" id={id} {...props} onClick={toggle}>
                {children}
            </button>
        );
    };

    const DropdownButton = ({
        show,
        onToggle,
        title,
        role,
    }) => (
        <Dropdown show={false} onToggle={onToggle} drop={"left"}>
            <div className="relative inline-block">
                <Toggle id="example-toggle">{title}</Toggle>
                <Menu role={role} showDropDown={show} />
            </div>
        </Dropdown>
    );

    return (
        <DropdownButton show={show} onToggle={(e) => setShow(!show)} title={<ActionIcon />} />
    );
}

export default CustomTable;