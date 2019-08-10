import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from '../src/theme';
import ProjectState from "../context/project/ProjectState";

class MyApp extends App {
    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps } = this.props;

        return (

                <Container>
                    <Head>
                        <title>UGPC</title>
                    </Head>

                    <ThemeProvider theme={theme}>
                        <ProjectState>
                        <CssBaseline />
                        <Component {...pageProps} />
                        </ProjectState>
                    </ThemeProvider>

                </Container>

        );
    }
}

export default MyApp;