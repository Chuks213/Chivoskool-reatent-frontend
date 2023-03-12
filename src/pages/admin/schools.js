import React, {Component} from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/admin-category.module.css';
import { Row } from 'react-bootstrap';
import CustomTable from "../../components/custom-table";
import {getAllSchoolsUrl} from '../../networking/external-url';

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
        title: "Max. Capacity",
        data: "noOfStudents",
    },
    {
        title: "Capacity",
        data: "currentCapacity",
    },
    {
        title: "Country",
        data: "country.name",
    },
    {
        title: "State",
        data: "state.name",
    },
    {
        title: "City",
        data: "city.name",
        hidden: true
    },
    {
        title: "Mobile No.",
        data: "mobileNumber",
    },
    {
        title: "Email Address",
        data: "emailAddress",
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
        buttons: [
            {type: "Edit", link: "/schools/edit/"}, 
            {type: "Delete", link: "/schools/delete/"},
            {type: "Classes", link: "/admin/classes?id="}
        ]
    }
]

export default class Schools extends Component {
    render() {
        return(
            <AppLayout pageName="Institutions">
                <Row className="ml-0 mr-0 mt-2">
                    <a href="/admin/create-school" className="btn btn-info">Create School</a>
                </Row>
                <Row className="ml-0 mr-0">
                    <div className={styles.table_description}> Schools </div>
                    <CustomTable columns={columns} ajaxUrl={getAllSchoolsUrl} />
                </Row>
            </AppLayout>
        )
    }
}