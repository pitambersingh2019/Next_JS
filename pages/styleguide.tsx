import { useEffect } from 'react';
import Head from 'next/head';
import { Layout, Providers } from '_molecules';
import { Hero } from '_organisms';
import { Breakpoints, Colours, Fonts, Forms, Hierarchy, Surveys } from '_components/styleguide';
import { delay, lazyload } from '_utils';

// use local placeholder data so the components receive what they're expecting 
const pageContent = require('_data/marketing.json'); // eslint-disable-line
const globalContent = require('_data/global.json'); // eslint-disable-line

// this is a collection of handy visual tips for devs; including fonts, colours, hierarchy breakpoints & grid
const Styleguide = () => {

  useEffect(() => {

    delay(300).then(() => lazyload());

  }, []);

  return (
    <>
      <Head>
        <title>Styleguide | Prosper Ex</title>
      </Head>
      <Providers>
        <Layout theme="admin"
          global={{
            json: globalContent,
            status: 200
          }}>
          <Hero content={pageContent.hero} />
          <Colours />
          <Fonts />
          <Hierarchy />
          <Forms />
          <Surveys />
          <Breakpoints />
        </Layout>
      </Providers>
    </>
  );

};

export default Styleguide;
