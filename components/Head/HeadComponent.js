import React from 'react';
import Head from 'next/head';

const HeadComponent = () => {
    return (
        <div>
            <Head>
                <title>UGPC</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            </Head>
        </div>
    );
};

export default HeadComponent;