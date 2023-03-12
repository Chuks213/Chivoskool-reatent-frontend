import React, {Component} from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/admin-category.module.css';
import { Row } from 'react-bootstrap';
import CustomTable from "../../components/custom-table";
import {getClassNamesUrl} from '../../networking/external-url';

const columns = [
    {
        title: "#",
        data: "id",
        hidden: true
    },
    {
        title: "Name",
        data: "name",
    },
    {
        title: "Created On",
        data: "createdOn",
    },
    {
        title: "Created By",
        data: "createdBy.firstName|createdBy.lastName",
    },
    {
        title: "Action",
        data: "id",
        buttons: [{type: "Edit", link: "/class-name/edit/"}, {type: "Delete", link: "/class-name/delete/"}]
    }
]

export default class ClassName extends Component {
    render() {
        return(
            <AppLayout pageName="Class Names">
                <Row className="ml-0 mr-0 mt-2">
                    <a href="/admin/create-class-name" className="btn btn-info">Create Class Name</a>
                </Row>
                <Row className="ml-0 mr-0">
                    <div className={styles.table_description}> Class names </div>
                    <CustomTable columns={columns} ajaxUrl={getClassNamesUrl} />
                </Row>
            </AppLayout>
        )
    }
}