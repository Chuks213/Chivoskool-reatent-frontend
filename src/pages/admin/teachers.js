import React, {Component} from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/admin-category.module.css';
import { Row } from 'react-bootstrap';
import CustomTable from "../../components/custom-table";
import {getAllLecturersUrl} from '../../networking/external-url';

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
        data: "assignedClasses[0].school--name"
    },
    {
        title: "Action",
        data: "id",
        buttons: [{type: "Edit", link: "/category/edit/"}, {type: "Delete", link: "/category/delete/"}]
    }
]

export default class Teachers extends Component {
    render() {
        return(
            <AppLayout pageName="Tutors">
                <Row className="ml-0 mr-0 mt-2">
                    <a href="/admin/create-teacher" className="btn btn-info">Create Tutor</a>
                </Row>
                <Row className="ml-0 mr-0">
                    <div className={styles.table_description}> Tutors </div>
                    <CustomTable columns={columns} ajaxUrl={getAllLecturersUrl}/>
                </Row>
            </AppLayout>
        )
    }
}