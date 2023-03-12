import React, {Component} from 'react';
import Header from './header';
import Footer from './footer';
import {NextSeo} from 'next-seo';

export default class AppLayout extends Component {
    constructor(props) {
        super(props);

        this.pageName = (this.props.pageName && this.props.pageName != "Not available") ? 
        ` | ${this.props.pageName}` : 
        "";

        this.showHeader = (this.props.showHeader == undefined || this.props.showHeader == "Not available") ? true : this.props.showHeader;
        this.showFooter = (this.props.showFooter == undefined || this.props.showHeader == "Not available") ? true : this.props.showFooter;
    }

    render() {
        return(
            <>
                <NextSeo title={"Reatent Application" + this.pageName}/>
                <div className="w-100 app-layout">
                    {this.showHeader ? <Header  currentPage={this.pageName} /> : ""}

                    {this.props.children}

                    {this.showFooter ? <Footer /> : ""}
                </div>
            </>
        );
    }
}