import React, { Component } from 'react';
import AppLayout from './layout/app-layout';
import styles from '../styles/faq.module.css';
import { Container, Col, Row } from 'react-bootstrap';

export default class FAQ extends Component {
    render() {
        return (
            <AppLayout pageName="FAQ">
                <Col md="12" as="div" className={styles.pixel}>
                    <img src="images/faq_image.png" alt="FAQ Image" className={`${styles.faq_image_box}`} />
                </Col>
                <Container className={`${styles.other_device} ${styles.faq_wrapper}`}>
                    <div className={`${styles.custom_title} ${styles.smaller_text_mobile}`}>Frequently Asked Questions</div>

                    <div className={styles.faq_qa_group}>
                        <div className={styles.faq_small_text}>Question 1</div>
                        <div className={styles.faq_small_text}>Answer 1</div>
                    </div>
                    <div className={styles.faq_qa_group}>
                        <div className={styles.faq_small_text}>Question 2</div>
                        <div className={styles.faq_small_text}>Answer 2</div>
                    </div>
                    <div className={styles.faq_qa_group}>
                        <div className={styles.faq_small_text}>Question 3</div>
                        <div className={styles.faq_small_text}>Answer 3</div>
                    </div>
                    <div className={styles.faq_qa_group}>
                        <div className={styles.faq_small_text}>Question 4</div>
                        <div className={styles.faq_small_text}>Answer 4</div>
                    </div>
                    <div className={styles.faq_qa_group}>
                        <div className={styles.faq_small_text}>Question 5 </div>
                        <div className={styles.faq_small_text}>Answer 5</div>
                    </div>
                    <div className={styles.faq_qa_group}>
                        <div className={styles.faq_small_text}>Question 6</div>
                        <div className={styles.faq_small_text}>Answer 6</div>
                    </div>
                    <div className={styles.faq_qa_group}>
                        <div className={styles.faq_small_text}>Question 7</div>
                        <div className={styles.faq_small_text}>Answer 7</div>
                    </div>
                    <div className={styles.faq_qa_group}>
                        <div className={styles.faq_small_text}>Question 8</div>
                        <div className={styles.faq_small_text}>Answer 8</div>
                    </div>
                    <div className={styles.faq_qa_group}>
                        <div className={styles.faq_small_text}>Question 9</div>
                        <div className={styles.faq_small_text}>Answer 9 </div>
                    </div>
                </Container>
                <Col md="12" className="pl-0 pr-0 hidden-mobile">
                    <img src="svgs/stylish_feel.svg" className={`stylish-feel stylish-feel-top`} style={{top: "-70vh", maxHeight: 878}} alt="Stylish Feel" />
                </Col>
            </AppLayout>
        )
    }
}