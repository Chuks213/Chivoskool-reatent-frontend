import React, {Component} from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/admin-category.module.css';
import { Row } from 'react-bootstrap';
import CustomTable from "../../components/custom-table";
import {getClassesUrl} from '../../networking/external-url';

const columns = [
    {
        title: "#",
        data: "id",
        hidden: true
    },
    {
        title: "Name",
        data: "name.name",
    },
    {
        title: "School",
        data: "school.name",
    },
    {
        title: "No of Students",
        data: "noOfStudents",
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
        buttons: [{type: "Edit", link: "/category/edit/"}, {type: "Delete", link: "/category/delete/"}]
    }
]

export default class Classes extends Component {
    static async getInitialProps({ query }) {
        const { id } = query;
        return { id };
    }

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <AppLayout pageName="Classes">
                <Row className="ml-0 mr-0 mt-2">
                    <a href={`/admin/create-class?sid=${this.props.id}`} className="btn btn-info">Create Class</a>
                    <a href="/admin/class-names" className="btn btn-primary" style={{marginLeft: "5px"}}>Class names</a>
                </Row>
                <Row className="ml-0 mr-0">
                    <div className={styles.table_description}> Classes </div>
                    <CustomTable columns={columns} ajaxUrl={`${getClassesUrl}${this.props.id}`} />
                </Row>
            </AppLayout>
        )
    }
}