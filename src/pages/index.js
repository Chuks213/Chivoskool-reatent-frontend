import React, { Component } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import styles from "../styles/home.module.css";
import AppLayout from './layout/app-layout';

export default class Homepage extends Component {
  constructor(props) {
    super(props);
  }

  getStarted() {
    window.location.href = "/get-started";
  }

  render() {
    return (
      <AppLayout pageName="Homepage">
        <Container>
          <div className="row" style={{ height: "700px" }}>
            <div className="col-md-6 col-sm-12 col-xs-12">
              <div className="custom-text-box">
                <span className="big-text">You can turn back the hands of time!</span>
                <p className="small-text">
                  Have all your classes recorded and brought back to your Students on request
                  </p>
                <button className="btn get-started-sl" onClick={() => this.getStarted()}>Get Started</button>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-xs-12">
              <img src="images/image1.png" className="home-image-1" alt="Image One" />
            </div>
          </div>
        </Container>

        {/* <Col md="12" className={styles.users_notice} as="div">
          <Col as="span" className={styles.users_text}>Our users are across Africa</Col>
          <Row className={styles.notice_content} as="div">
            <span className={styles.users_notice_long_dash}></span>
            &nbsp;&nbsp;
            <span className={styles.users_notice_short_dash}></span>
            &nbsp;&nbsp;
            <span className={styles.users_notice_short_dash}></span>
          </Row>
        </Col> */}

        {/* <Col md="12" className={styles.images_box} as="div">
          <Container className={styles.images_box_container}>
            <Row className={styles.images_box_row} as="div">
              <span className={styles.rounded_image}></span>
              <span className={styles.rounded_image}></span>
              <span className={styles.rounded_image}></span>
              <span className={styles.rounded_image}></span>
              <span className={styles.rounded_image}></span>
            </Row>
            <Row className={styles.images_box_row2} as="div">
              <span className={styles.rounded_image}></span>
              <span className={styles.rounded_image}></span>
              <span className={styles.rounded_image}></span>
            </Row>
          </Container>
        </Col> */}

        <Col md="12" className="bg-grey" as="div">
          <div className="row" style={{ height: "800px", width: "100%" }}>
            <div className="col-md-6 col-sm-12 col-xs-12">
              <img src="images/image2.PNG" className="home-image-2" alt="Image 2" />
            </div>
            <div className="col-md-6 col-sm-12 col-xs-12">
              <div className="custom-text-box">
                <span className="big-text">Go live to teach your students with ease</span>
                <p className="small-text">
                  Our Platform gives you the ability to live stream lectures to your students, also the videos would be made avialiable on the platform for reference later
                </p>
                <button className="btn get-started-sl" onClick={() => this.getStarted()}>Get Started</button>
              </div>
            </div>
          </div>
        </Col>

        <Col md="12" className="improve-grade" as="div">
          <Container>
            <div className="row" style={{ height: "800px" }}>
              <div className="col-md-6 col-sm-12 col-xs-12">
                <div className="custom-text-box">
                  <span className="big-text">Improve the grade of your students with technology</span>
                  <p className="small-text">
                    Reatent has proven through our research to help students perform better, in their assesments.
                  </p>
                  <button className="btn get-started-sl" onClick={() => this.getStarted()}>Get Started</button>
                </div>
              </div>
              <div className="col-md-6 col-sm-12 col-xs-12">
                <img src="images/image3.PNG" className="home-image-1 home-image-3" alt="Image One" />
              </div>
            </div>
          </Container>
        </Col>

        <Col md="12" className={`${styles.users_notice} ${styles.client_testimony}`} as="div">
          <Col as="span" className={styles.users_text}>What our clients say</Col>
          <Row className={styles.notice_content} as="div">
            <span className={`${styles.users_notice_long_dash} ${styles.client_testimony_dash}`}></span>
            &nbsp;&nbsp;
            <span className={`${styles.users_notice_short_dash} ${styles.client_testimony_dash}`}></span>
            &nbsp;&nbsp;
            <span className={`${styles.users_notice_short_dash} ${styles.client_testimony_dash}`}></span>
          </Row>
          <Row className={styles.notice_content} as="div">
            <span className={styles.client_testimony_text}>Our word we keep, and our work speaks for us.</span>
          </Row>
        </Col>

        <Container>
          <div className={`row ${styles.testimony_pane}`}>
            <Col md="4" className={styles.testimony_box} as="div">
              <div className={styles.position_center}>
                <div className={styles.quote}>
                  <svg width="34" height="27" viewBox="0 0 34 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 16.5837C0 22.7647 3.96779 26.3075 8.36843 26.3075C12.4084 26.3075 15.8712 22.7647 15.8712 18.3928C15.8712 14.1717 13.0576 11.3827 9.59484 11.3827C8.80128 11.3827 8.07986 11.5334 7.71915 11.6842C8.65699 8.81985 11.9755 5.50324 14.284 4.44795L9.0177 0.000671387C3.39066 4.14644 0 9.95052 0 16.5837ZM17.819 16.5837C17.819 22.7647 21.7868 26.3075 26.1874 26.3075C30.2273 26.3075 33.6901 22.7647 33.6901 18.3928C33.6901 14.1717 30.8766 11.3827 27.4138 11.3827C26.6203 11.3827 25.8988 11.5334 25.5381 11.6842C26.476 8.81985 29.7945 5.50324 32.103 4.44795L26.8367 0.000671387C21.2096 4.14644 17.819 9.95052 17.819 16.5837Z" fill="#322035" fillOpacity="0.4" />
                  </svg>

                </div>
                <div className={styles.quote_text}>
                  Reatent has helped my school a lot we get better results with our students now.
                  Its really turning back the hands of time. I would definatly advice everyone to get registered and enjoy too.
              </div>
                <div className={styles.author_text}>
                  <span className={styles.quote_image}>
                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M28.9007 57.1896C44.8621 57.1896 57.8013 44.5057 57.8013 28.8593C57.8013 13.2129 44.8621 0.528992 28.9007 0.528992C12.9393 0.528992 0 13.2129 0 28.8593C0 44.5057 12.9393 57.1896 28.9007 57.1896Z" fill="#7969AC" fillOpacity="0.4" />
                    </svg>

                  </span>
                  <span className={styles.quote_author}>Onifade Joseph</span>
                </div>
              </div>
            </Col>
            <Col md="4" className={styles.testimony_box_2} as="div">
              <div className={styles.position_center}>
                <div className={styles.quote_2}>
                  <svg className={styles.hidden_small_devices} width="44" height="35" viewBox="0 0 44 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.0332031 21.689C0.0332031 29.672 5.15778 34.2476 10.8414 34.2476C16.0592 34.2476 20.5315 29.672 20.5315 24.0255C20.5315 18.5737 16.8977 14.9716 12.4254 14.9716C11.4004 14.9716 10.4687 15.1663 10.0028 15.361C11.2141 11.6616 15.5001 7.37805 18.4817 6.0151L11.68 0.27124C4.41239 5.62569 0.0332031 13.1219 0.0332031 21.689ZM23.0472 21.689C23.0472 29.672 28.1718 34.2476 33.8554 34.2476C39.0732 34.2476 43.5455 29.672 43.5455 24.0255C43.5455 18.5737 39.9117 14.9716 35.4394 14.9716C34.4145 14.9716 33.4827 15.1663 33.0168 15.361C34.2281 11.6616 38.5141 7.37805 41.4957 6.0151L34.694 0.27124C27.4264 5.62569 23.0472 13.1219 23.0472 21.689Z" fill="#322035" />
                  </svg>
                  <svg className={styles.visible_small_devices} width="34" height="27" viewBox="0 0 34 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 16.5837C0 22.7647 3.96779 26.3075 8.36843 26.3075C12.4084 26.3075 15.8712 22.7647 15.8712 18.3928C15.8712 14.1717 13.0576 11.3827 9.59484 11.3827C8.80128 11.3827 8.07986 11.5334 7.71915 11.6842C8.65699 8.81985 11.9755 5.50324 14.284 4.44795L9.0177 0.000671387C3.39066 4.14644 0 9.95052 0 16.5837ZM17.819 16.5837C17.819 22.7647 21.7868 26.3075 26.1874 26.3075C30.2273 26.3075 33.6901 22.7647 33.6901 18.3928C33.6901 14.1717 30.8766 11.3827 27.4138 11.3827C26.6203 11.3827 25.8988 11.5334 25.5381 11.6842C26.476 8.81985 29.7945 5.50324 32.103 4.44795L26.8367 0.000671387C21.2096 4.14644 17.819 9.95052 17.819 16.5837Z" fill="#322035" fillOpacity="0.4" />
                  </svg>
                </div>
                <div className={styles.quote_text_2}>
                  Reatent has helped my school a lot we get better results with our students now.
                  Its really turning back the hands of time. I would definatly advice everyone to get registered and enjoy too.
              </div>
                <div className={styles.author_text}>
                  <span className={styles.quote_image}>
                    <svg className={styles.hidden_small_devices} width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M28.9007 57.1896C44.8621 57.1896 57.8013 44.5057 57.8013 28.8593C57.8013 13.2129 44.8621 0.528992 28.9007 0.528992C12.9393 0.528992 0 13.2129 0 28.8593C0 44.5057 12.9393 57.1896 28.9007 57.1896Z" fill="#7969AC" />
                    </svg>
                    <svg className={styles.visible_small_devices} width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M28.9007 57.1896C44.8621 57.1896 57.8013 44.5057 57.8013 28.8593C57.8013 13.2129 44.8621 0.528992 28.9007 0.528992C12.9393 0.528992 0 13.2129 0 28.8593C0 44.5057 12.9393 57.1896 28.9007 57.1896Z" fill="#7969AC" fillOpacity="0.4" />
                    </svg>

                  </span>
                  <span className={styles.quote_author_2}>Onifade Joseph</span>
                </div>
              </div>
            </Col>
            <Col md="4" className={styles.testimony_box} as="div">
              <div className={styles.position_center}>
                <div className={styles.quote}>
                  <svg width="34" height="27" viewBox="0 0 34 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 16.5837C0 22.7647 3.96779 26.3075 8.36843 26.3075C12.4084 26.3075 15.8712 22.7647 15.8712 18.3928C15.8712 14.1717 13.0576 11.3827 9.59484 11.3827C8.80128 11.3827 8.07986 11.5334 7.71915 11.6842C8.65699 8.81985 11.9755 5.50324 14.284 4.44795L9.0177 0.000671387C3.39066 4.14644 0 9.95052 0 16.5837ZM17.819 16.5837C17.819 22.7647 21.7868 26.3075 26.1874 26.3075C30.2273 26.3075 33.6901 22.7647 33.6901 18.3928C33.6901 14.1717 30.8766 11.3827 27.4138 11.3827C26.6203 11.3827 25.8988 11.5334 25.5381 11.6842C26.476 8.81985 29.7945 5.50324 32.103 4.44795L26.8367 0.000671387C21.2096 4.14644 17.819 9.95052 17.819 16.5837Z" fill="#322035" fillOpacity="0.4" />
                  </svg>

                </div>
                <div className={styles.quote_text}>
                  Reatent has helped my school a lot we get better results with our students now.
                  Its really turning back the hands of time. I would definatly advice everyone to get registered and enjoy too.
              </div>
                <div className={styles.author_text}>
                  <span className={styles.quote_image}>
                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M28.9007 57.1896C44.8621 57.1896 57.8013 44.5057 57.8013 28.8593C57.8013 13.2129 44.8621 0.528992 28.9007 0.528992C12.9393 0.528992 0 13.2129 0 28.8593C0 44.5057 12.9393 57.1896 28.9007 57.1896Z" fill="#7969AC" fillOpacity="0.4" />
                    </svg>

                  </span>
                  <span className={styles.quote_author}>Onifade Joseph</span>
                </div>
              </div>
            </Col>
          </div>
          <div className="row hidden-small-devices" style={{ height: "200px" }}>
            <Col md="12" className="text-center" as="div">
              <span>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="11" fill="#E8E4F6" />
                </svg>

              </span>
              <span style={{ margin: "0 10px" }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="11" fill="#322035" />
                </svg>

              </span>
              <span>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="11" fill="#E8E4F6" />
                </svg>
              </span>
            </Col>
          </div>
        </Container>

        <Col md="12" className="pl-0 pr-0" as="div">
          {/* <span className={`hidden-mobile ${styles.bottom_page_design_1}`}>
            <svg width="1600" height="890" viewBox="0 0 1440 952" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.1" d="M-88.0394 425.873C-88.0394 425.873 249.488 -259.49 815.036 110.038C1380.58 479.565 1365.34 379.551 1652.96 402.712C1940.59 425.873 1768.71 951.213 1768.71 951.213C1768.71 951.213 -122 824.879 -122 820.667C-122 816.456 -88.0394 425.873 -88.0394 425.873Z" fill="#564B7C" />
            </svg>
          </span>
          <span className={`hidden-mobile ${styles.bottom_page_design_2}`}>
            <svg width="2310" height="982" viewBox="0 0 1440 952" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.1" d="M-88.0394 425.873C-88.0394 425.873 249.488 -259.49 815.036 110.038C1380.58 479.565 1365.34 379.551 1652.96 402.712C1940.59 425.873 1768.71 951.213 1768.71 951.213C1768.71 951.213 -122 824.879 -122 820.667C-122 816.456 -88.0394 425.873 -88.0394 425.873Z" fill="#564B7C" />
            </svg>
          </span> */}
          <img src="svgs/stylish_feel.svg" className={`hidden-mobile stylish-feel`} alt="Stylish Feel" />

          <div className="row" style={{ height: "725px", width: "100%" }}>
            <div className="col-md-6 col-sm-12 col-xs-12">
              <img src="svgs/lets_start_something.svg" className="home-image-4" />
            </div>
            <div className="col-md-6 col-sm-12 col-xs-12">
              <div className="custom-text-box">
                <span className="big-text">Let's build something great together</span>
                <p className="small-text">
                  The Success of your students is your Success, and your
                  Success is our Success. Join Reatent and lets win together!
                </p>
                <button className="btn get-started-sl" onClick={() => this.getStarted()}>Get Started</button>
              </div>
            </div>
          </div>
        </Col>
      </AppLayout>
    )
  }
}