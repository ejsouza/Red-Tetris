import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const Index = () => {
  const router = useRouter();
  return <Layout>404</Layout>;
};

export default Index;
