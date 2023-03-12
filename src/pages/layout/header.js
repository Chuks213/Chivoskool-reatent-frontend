import React, { Component } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.currentPage = this.props.currentPage ? this.props.currentPage : "";
    }

    render() {
        return (
            <Navbar bg="dark" expand="lg" style={{ background: "#322035 !important" }}>
                <Container className="nav-container">
                    <Navbar.Brand href="/" className="d-flex">
                        <img src="images/reatent white logo.png" alt="Logo" className="app-logo" />
                        <span className="logo-text align-self-center">Reatent</span>
                    </Navbar.Brand>
                    <Navbar.Toggle className="custom-nav-link" aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <div className="toggle-container">
                            <Nav className="navbar-nav me-auto mb-2 mb-lg-0 ul-design landing-page-nav">
                                <Nav.Link className={"custom-nav-link" + (this.currentPage.includes("Company") ? " active" : "")} href="/company">Company</Nav.Link>
                                <Nav.Link className={"custom-nav-link" + (this.currentPage.includes("Contact Us") ? " active" : "")} href="/contact-us">Contact</Nav.Link>
                                <Nav.Link className={"custom-nav-link" + (this.currentPage.includes("FAQ") ? " active" : "")} href="/faq">FAQ</Nav.Link>
                                <Nav.Link className="custom-nav-link" href="#">Blog</Nav.Link>
                                <Nav.Link className={"btn btn-secondary get-started" + (this.currentPage.includes("Get Started") ? " gs-active" : "")} href="/get-started">Get Started</Nav.Link>
                            </Nav>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}