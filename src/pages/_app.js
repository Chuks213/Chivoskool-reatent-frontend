import Head from 'next/head';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css';
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* <title>Reatent Application</title> */}
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* <link rel="shortcut icon" href="images/reatent white logo.png" type="image/png" /> */}
        <meta property="og:image:secure_url" content="/favicon.ico" />

        <meta property="og:url"           content="https://reatent-frontend.herokuapp.com" />
        <meta property="og:type"          content="website" />
        <meta property="og:title"         content="Reatent Application" />
        <meta property="og:description"   content="Online School Management Solution" />
        <meta property="og:image"         content="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins"></link>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat"></link>
        <style>
          {dom.css()}
        </style>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
