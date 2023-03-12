import React, { Component } from 'react';
import AppLayout from './layout/app-layout';
import { Container, Col, Row } from 'react-bootstrap';
import styles from "../styles/company.module.css";

export default class Company extends Component {
    render() {
        return (
            <AppLayout pageName="Company">
                <Col md="12" as="div" className={styles.pixel}>
                    <img src="images/company image.png" alt="Company Image" className={`${styles.company_box}`} />
                </Col>
                <Container className={`${styles.other_device} ${styles.company_wrapper}`}>
                    <div className={`${styles.about_us} ${styles.smaller_text_mobile}`}> About us </div>
                    <p>Franciseth Nigeria Ltd. with the vision of providing a smart solution that meets the demand of students thereby aiding their retention level. Reatent is an Indigenous and simplified technological web application which allows students to retrieve and watch recorded videos of their lecturers at their convenience anywhere and anytime.</p>
                    <p>Our Features On Reatent, you have the access to; 1. Video on Demand (Watch recorded videos of your lectures) 2. Livestreaming of lectures (Go live with your lecturer/tutor)</p>
                    <p>Our Goal Reatent aims to ensure the delivery of quality education and promote continuous learning for all students in various educational institution by providing the essential resources for retention in their learning process.</p>

                    <div className={`${styles.unique_text} ${styles.smaller_text_mobile} ${styles.lh_65_mobile}`}> What makes us Unique </div>
                    <p>“A friend in need is Reatent Indeed”,  Reatent is not just an application but a friend to students because it creates an avenue to solve the problem of retention for past lectures and granting them access to watch them over and over again.</p>
                    <p>It was discovered that majority of students are only able to recall 5% of lectures received in their lecture halls and this has made Reatent a solution provider which encompasses unique features for delivery of past lectures to aid retention to students at their fingertips. Our unique feature of Video on Demand would help consolidate institutions effort in delivering quality education which would be reflective on students’ performance and our Livestreaming feature would aid real time broadcast of lecturers to disperse locations for distant learning students.</p>
                    <p>With our unique features, it helps to also bridge the barrier of distance to the part time students who are not usually fully present for the normal academic calendar of an institution. Our target is to ensure that the quality of education through Reatent is brought to the door step of every student studying in any institution across the globe and with our unique resources and features, academic excellence will be optimally attained by students learning in every institution.</p>

                    <div className={`${styles.our_platform} ${styles.smaller_text_mobile} ${styles.lh_65_mobile}`}> <p>Why should you use our platform? </p></div>
                    <p>Are you tired of trying to recall every of your lectures? With Reatent, rather than lurking around to get notes from previous lectures, students have an easy access to retrieve and watch recorded videos of their lecturers at their convenience. So what are you waiting for? Start Reading and be Retentive!!</p>

                    <div className={`${styles.Careers} ${styles.smaller_text_mobile}`}>  Careers </div>
                    We would be working with some amazing people who would be Admins in each institution and the institution will be charged with the function of selecting these admins based on some certain criteria with few listed below:
                    <div>&bull;They must be passionate about education.</div>
                    <span>&bull;They must be computer literates</span>

                    <div style={{ padding: "20px 0" }}>You can email info@reatent.net for opportunity at arise from time to time.</div>

                    <div className={`${styles.our_team} ${styles.smaller_text_mobile}`}> Our Team </div>

                    <Col md="12" as="div" className="pl-0-mobile">
                        <Row className={`${styles.company_avatar}`}>
                            <Col md="12" sm="12" lg="4" as="div" className={styles.col_avatar}>
                                <div className={styles.image1}>
                                    <img src="images/image-avatar.png" className={styles.avatar} alt="Image 1" />
                                </div>
                            </Col>

                            <Col md="12" sm="12" lg="4" as="div" className={styles.col_avatar}>
                                <div className={styles.image1}>
                                    <img src="images/image-avatar.png" className={styles.avatar} alt="Image 2" />
                                </div>
                            </Col>

                            <Col md="12" sm="12" lg="4" as="div" className={styles.col_avatar}>
                                <div className={styles.image1}>
                                    <img src="images/image-avatar.png" className={styles.avatar} alt="Image 3" />
                                </div>
                            </Col>
                        </Row>

                        <Row className={`${styles.company_avatar}`}>

                            <Col md="12" sm="12" lg="4" as="div" className={styles.col_avatar}>
                                <div className={styles.image1}>
                                    <img src="images/image-avatar.png" className={styles.avatar} alt="Image 4" />
                                </div>
                            </Col>

                            <Col md="12" sm="12" lg="4" as="div" className={styles.col_avatar}>
                                <div className={styles.image1}>
                                    <img src="images/image-avatar.png" className={styles.avatar} alt="Image 2" />
                                </div>
                            </Col>

                            <Col md="12" sm="12" lg="4" as="div" className={styles.col_avatar}>
                                <div className={styles.image1}>
                                    <img src="images/image-avatar.png" className={styles.avatar} alt="Image 1" />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Container>
                <Col md="12" className="pl-0 pr-0 hidden-mobile">
                    <img src="svgs/stylish_feel.svg" className={`stylish-feel stylish-feel-top`} alt="Stylish Feel" />
                </Col>
            </AppLayout>
        );
    }
}