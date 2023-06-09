import React, { Component } from 'react';

export default class Footer extends Component {
    render() {
        return (
            <footer>
                <div className="row">
                    <div className="col-md-4">
                        <div className="footer-logo">
                            <img src="images/reatent white logo bg.png" alt="Logo" className="footer-logo-image" />
                            <span className="footer-logo-text">Reatent</span>
                        </div>
                        {/* <div className="footer-info">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque felis commodo ut nisi
        </div> */}
                        <div className="footer-social-links">
                            <svg className="social-links-svg" width="36" height="36" viewBox="0 0 36 36" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M34.5312 0.03125H1.46875C0.673633 0.03125 0.03125 0.673633 0.03125 1.46875V34.5312C0.03125 35.3264 0.673633 35.9688 1.46875 35.9688H34.5312C35.3264 35.9688 35.9688 35.3264 35.9688 34.5312V1.46875C35.9688 0.673633 35.3264 0.03125 34.5312 0.03125ZM10.6912 30.6545H5.35898V13.5033H10.6912V30.6545ZM8.02734 11.1584C7.41608 11.1584 6.81853 10.9771 6.31028 10.6375C5.80203 10.2979 5.4059 9.81524 5.17198 9.2505C4.93806 8.68577 4.87685 8.06434 4.9961 7.46482C5.11536 6.8653 5.40971 6.3146 5.84194 5.88237C6.27417 5.45014 6.82487 5.15579 7.42439 5.03653C8.02392 4.91728 8.64534 4.97849 9.21007 5.21241C9.77481 5.44633 10.2575 5.84246 10.5971 6.35071C10.9367 6.85896 11.118 7.45651 11.118 8.06777C11.1135 9.7748 9.72988 11.1584 8.02734 11.1584ZM30.6545 30.6545H25.3268V22.3125C25.3268 20.3225 25.2908 17.7664 22.5551 17.7664C19.7834 17.7664 19.3566 19.9316 19.3566 22.1687V30.6545H14.0334V13.5033H19.1455V15.8482H19.2174C19.9271 14.5006 21.6656 13.0766 24.2621 13.0766C29.6617 13.0766 30.6545 16.6299 30.6545 21.2479V30.6545Z"
                                    fill="#F2F2F2" />
                            </svg>

                            <svg className="social-links-svg" width="37" height="36" viewBox="0 0 37 36" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.3584 11.9998C15.0611 11.9998 12.3703 14.6906 12.3703 17.9879C12.3703 21.2851 15.0611 23.9759 18.3584 23.9759C21.6556 23.9759 24.3465 21.2851 24.3465 17.9879C24.3465 14.6906 21.6556 11.9998 18.3584 11.9998ZM36.3181 17.9879C36.3181 15.5082 36.3406 13.0509 36.2013 10.5758C36.0621 7.70075 35.4062 5.14919 33.3039 3.04684C31.197 0.940008 28.65 0.288641 25.775 0.149383C23.2953 0.0101252 20.8381 0.0325862 18.3629 0.0325862C15.8832 0.0325862 13.4259 0.0101252 10.9508 0.149383C8.07575 0.288641 5.52419 0.9445 3.42184 3.04684C1.31501 5.15368 0.663641 7.70075 0.524383 10.5758C0.385125 13.0554 0.407586 15.5127 0.407586 17.9879C0.407586 20.4631 0.385125 22.9248 0.524383 25.4C0.663641 28.275 1.3195 30.8265 3.42184 32.9289C5.52868 35.0357 8.07575 35.6871 10.9508 35.8263C13.4304 35.9656 15.8877 35.9431 18.3629 35.9431C20.8425 35.9431 23.2998 35.9656 25.775 35.8263C28.65 35.6871 31.2015 35.0312 33.3039 32.9289C35.4107 30.822 36.0621 28.275 36.2013 25.4C36.3451 22.9248 36.3181 20.4675 36.3181 17.9879ZM18.3584 27.2013C13.2597 27.2013 9.14489 23.0865 9.14489 17.9879C9.14489 12.8892 13.2597 8.77438 18.3584 8.77438C23.457 8.77438 27.5718 12.8892 27.5718 17.9879C27.5718 23.0865 23.457 27.2013 18.3584 27.2013ZM27.9492 10.5488C26.7588 10.5488 25.7974 9.58747 25.7974 8.39704C25.7974 7.20661 26.7588 6.24528 27.9492 6.24528C29.1396 6.24528 30.1009 7.20661 30.1009 8.39704C30.1013 8.67971 30.0459 8.95968 29.9379 9.2209C29.8299 9.48212 29.6714 9.71947 29.4715 9.91935C29.2716 10.1192 29.0343 10.2777 28.7731 10.3857C28.5118 10.4937 28.2319 10.5492 27.9492 10.5488Z"
                                    fill="#F2F2F2" />
                            </svg>

                            <svg className="social-links-svg" width="39" height="39" viewBox="0 0 39 39" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.7519 0.837402C9.16808 0.837402 0.587158 9.41832 0.587158 20.0022C0.587158 29.5663 7.59449 37.4937 16.7581 38.9369V25.5432H11.8897V20.0022H16.7581V15.7797C16.7581 10.9727 19.6197 8.32199 23.9954 8.32199C26.0922 8.32199 28.2887 8.69574 28.2887 8.69574V13.4088H25.8661C23.4894 13.4088 22.7457 14.8885 22.7457 16.4046V19.9983H28.0568L27.2077 25.5394H22.7457V38.9331C31.9093 37.4975 38.9167 29.5682 38.9167 20.0022C38.9167 9.41832 30.3357 0.837402 19.7519 0.837402Z"
                                    fill="#F2F2F2" />
                            </svg>

                            <svg className="social-links-svg" width="41" height="42" viewBox="0 0 41 42" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20.125 0.875C9.01133 0.875 0 9.88633 0 21C0 32.1137 9.01133 41.125 20.125 41.125C31.2387 41.125 40.25 32.1137 40.25 21C40.25 9.88633 31.2387 0.875 20.125 0.875ZM29.7967 16.0451C29.8102 16.2563 29.8102 16.4764 29.8102 16.692C29.8102 23.2865 24.7879 30.8828 15.6104 30.8828C12.7803 30.8828 10.1568 30.0607 7.94668 28.6457C8.35098 28.6906 8.73731 28.7086 9.15059 28.7086C11.4865 28.7086 13.6338 27.918 15.3453 26.5793C13.1531 26.5344 11.3113 25.0969 10.6824 23.1203C11.4506 23.2326 12.1424 23.2326 12.933 23.0305C11.8042 22.8011 10.7897 22.1881 10.0617 21.2955C9.33368 20.4029 8.93715 19.2858 8.93945 18.134V18.0711C9.5998 18.4439 10.377 18.673 11.19 18.7045C10.5065 18.249 9.94596 17.6318 9.55808 16.9078C9.17019 16.1837 8.96696 15.3751 8.96641 14.5537C8.96641 13.6238 9.20899 12.7748 9.64473 12.0381C10.8976 13.5804 12.461 14.8418 14.2333 15.7404C16.0057 16.6389 17.9472 17.1545 19.9318 17.2535C19.2266 13.8619 21.7602 11.1172 24.8059 11.1172C26.2434 11.1172 27.5371 11.7191 28.449 12.6895C29.5766 12.4783 30.6547 12.0561 31.616 11.49C31.2432 12.6445 30.4615 13.6193 29.4238 14.2348C30.4301 14.127 31.4004 13.8484 32.2988 13.4576C31.6205 14.4549 30.7715 15.3398 29.7967 16.0451Z"
                                    fill="#F2F2F2" />
                            </svg>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="footer-quicklink">
                            <h6 className="quicklinks-header">Quicklinks</h6>
                            <ul className="links">
                                <li><a href="#">Home</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="/company">About Us</a></li>
                                <li><a href="/contact-us">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="footer-contact">
                            <div className="contact">
                                <span>Contact Us</span>
                            </div>
                            <p className="address">
                                info@reatentapp.com <br />
            (+234) 7040-326-266 <br />
            1 Ayodele close, off Mose-Shomefun <br />
            Adekoya Estate, Ogba, Lagos, Nigeria.
          </p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <ul className="footer-terms">
                            <li><a href="/faq">Faq</a></li>
                            <li><a href="/privacy-policy">Privacy Policy</a></li>
                            <li><a href="/terms-and-condition">Terms and Conditions</a></li>
                            
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
}