import React, {Component} from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/admin-category.module.css';
import { Row } from 'react-bootstrap';
import CustomTable from "../../components/custom-table";
import {getAllStudentsUrl} from '../../networking/external-url';

const columns = [
    {
        title: "#",
        data: "id",
        hidden: true
    },
    {
        title: "Name",
        data: "lastName|firstName",
    },
    {
        title: "Email",
        data: "emailAddress",
    },
    {
        title: "Created On",
        data: "createdOn",
    },
    {
        title: "School",
        data: "studentClass.school--name"
    },
    {
        title: "Class",
        data: "studentClass.name--name"
    },
    {
        title: "Action",
        data: "id",
        buttons: [{type: "Edit", link: "/category/edit/"}, {type: "Delete", link: "/category/delete/"}]
    }
]

export default class Students extends Component {
    render() {
        return(
            <AppLayout pageName="Students">
                <Row className="ml-0 mr-0 mt-2">
                    <a href="/admin/create-student" className="btn btn-info">Create Student</a>
                </Row>
                <Row className="ml-0 mr-0">
                    <div className={styles.table_description}> Students </div>
                    <CustomTable columns={columns} ajaxUrl={getAllStudentsUrl}/>
                </Row>
            </AppLayout>
        )
    }
}