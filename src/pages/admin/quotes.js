import React, {Component} from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/admin-category.module.css';
import { Row } from 'react-bootstrap';
import CustomTable from "../../components/custom-table";
import {viewAllQuotesUrl} from '../../networking/external-url';

const columns = [
    {
        title: "#",
        data: "id",
        hidden: true
    },
    {
        title: "Title",
        data: "title",
    },
    {
        title: "Name",
        data: "name",
    },
    {
        title: "Name Of Institution",
        data: "nameOfInstitution",
    },
    {
        title: "Mobile Number",
        data: "mobileNumber",
    },
    {
        title: "Email",
        data: "emailAddress",
    },
    {
        title: "Designation",
        data: "designation",
    },
    {
        title: "Website",
        data: "website",
    },
    {
        title: "Country",
        data: "country",
    },
    {
        title: "State",
        data: "state",
    },
    {
        title: "City",
        data: "city",
    },
    {
        title: "No of students",
        data: "noOfStudents",
    },
    {
        title: "Created On",
        data: "createdOn",
    },
    {
        title: "Status",
        data: "quoteStatus",
    },
    {
        title: "Action",
        data: "id",
        buttons: [{type: "Reply", link: "/category/edit/"}]
    }
]

export default class Quotes extends Component {
    render() {
        return(
            <AppLayout pageName="Data">
                <Row className="ml-0 mr-0">
                    <div className={styles.table_description}> Data </div>
                    <CustomTable columns={columns} ajaxUrl={viewAllQuotesUrl} />
                </Row>
            </AppLayout>
        )
    }
}