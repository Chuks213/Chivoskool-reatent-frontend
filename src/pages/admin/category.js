import React, {Component} from 'react';
import AppLayout from "./layout/app-layout";
import styles from '../../styles/admin-category.module.css';
import { Row } from 'react-bootstrap';
import CustomTable from "../../components/custom-table";
import {getAllCategoriesUrl} from '../../networking/external-url';

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
        buttons: [{type: "Edit", link: "/category/edit/"}, {type: "Delete", link: "/category/delete/"}]
    }
]

export default class Category extends Component {
    render() {
        return(
            <AppLayout pageName="Courses">
                <Row className="ml-0 mr-0 mt-2">
                    <a href="/admin/create-category" className="btn btn-info">Create Course</a>
                </Row>
                <Row className="ml-0 mr-0">
                    <div className={styles.table_description}> Courses </div>
                    <CustomTable columns={columns} ajaxUrl={getAllCategoriesUrl} dataField="categories" />
                </Row>
            </AppLayout>
        )
    }
}