import React, { Component } from 'react';
import AppLayout from "./layout/app-layout";
import styles from "../../styles/forum.module.css";
import { Container, Col, Row } from 'react-bootstrap';
import Vector from "../../svgs/vector.svg";

export default class Forum extends Component {
    render() {
        return (
            <AppLayout pageName="Forum">
                <Row>
                    {/* <Col lg="6" md="12" sm="12" xs="12" className={styles.column}>

                        <div className={styles.small_text}>Most recent</div>
                        <img className={styles.img} src="/images/forum_image.png" />
                        <div className={styles.date_content}>February 2, 2021</div>
                        <div className={styles.learn_text}>Learning with the new Normal</div>
                        <div className={styles.long_text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Accumsan pretium <br /> odio quis arcu, eu praesent. Praesent ornare a, malesuada erat. At <br /> adipiscing posuere condimentum mauris nunc. Pellentesque sodales<br /> laoreet non diam duis blandit. Nunc, quis sit enim erat morbi sed ac dictum <br />viverra. Purus purus nisl eget laoreet vitae nisl ut. Magna ornare cursus risus,<br /> metus, scelerisque molestie ridiculus erat. Enim, et quam mauris vitae<br /> consequat. Euismod sed at nec erat at ultrices scelerisque id. Amet sem <br /> amet lacus, consequat porttitor vivamus. Etiam sed mauris nunc justo,<br /> mollis.</div>
                        <div className={styles.vector_wrapper}>Continue reading <Vector className={styles.vector} />
                        </div>

                    </Col >

                    <Col lg="6" md="12" sm="12" xs="12" as="div" className={styles.container}>
                        <div className={styles.heading_text}>Order</div>

                        <div className={styles.text_container}>
                            <img className={styles.image01} src="/images/image01.png" />
                            <div className={styles.text_wrapper}>
                                <div className={styles.learning_text}>Learning Sex Education</div>
                                <div className={styles.second_learning_text}>Lorem ipsum dolor sit amet, consectetur </div>
                                <div className={styles.text_time}>January 27, 2021</div>
                                <div className={styles.vector_wrapper}>Continue reading <Vector className={styles.vector} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.text_container}>
                            <img className={styles.image01} src="/images/image01.png" />
                            <div className={styles.text_wrapper}>
                                <div className={styles.learning_text}>Choosing a Career</div>
                                <div className={styles.second_learning_text}>Lorem ipsum dolor sit amet, consectetur</div>
                                <div className={styles.text_time}>January 26, 2021</div>
                                <div className={styles.vector_wrapper}>Continue reading <Vector className={styles.vector} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.text_container}>
                            <img className={styles.image01} src="/images/image02.png" />
                            <div className={styles.text_wrapper}>
                                <div className={styles.learning_text}>History of Education</div>
                                <div className={styles.second_learning_text}>Lorem ipsum dolor sit amet, consectetur</div>
                                <div className={styles.text_time}>January 26, 2021</div>
                                <div className={styles.vector_wrapper}>Continue reading <Vector className={styles.vector} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.text_container}>
                            <img className={styles.image01} src="/images/image03.png" />
                            <div className={styles.text_wrapper}>
                                <div className={styles.learning_text}>Entrepreneurship</div>
                                <div className={styles.second_learning_text}>Lorem ipsum dolor sit amet, consectetur</div>
                                <div className={styles.text_time}>January 25, 2021</div>
                                <div className={styles.vector_wrapper}>Continue reading <Vector className={styles.vector} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.text_container}>
                            <img className={styles.image01} src="/images/image04.png" />
                            <div className={styles.text_wrapper}>
                                <div className={styles.learning_text}>New Prefects</div>
                                <div className={styles.second_learning_text}>Lorem ipsum dolor sit amet, consectetur</div>
                                <div className={styles.text_time}>January 24, 2021</div>
                                <div className={styles.vector_wrapper}>Continue reading <Vector className={styles.vector} />
                                </div>
                            </div>
                        </div>
                        
                    </Col> */}
                </Row>
            </AppLayout>
        )
    }
}