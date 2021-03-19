import React from 'react';
import Layout from '../components/Layout';
import HeadLanding from '../components/HeadLanding';
import Menu from '../components/Menu';

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <HeadLanding />
    {/* Here the idea is to have a menu with some animated tetris */}
    <Menu />
  </Layout>
);

export default IndexPage;
