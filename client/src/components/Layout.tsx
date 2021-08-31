import React, { ReactNode } from 'react';
import Head from 'next/head';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

type Props = {
  children?: ReactNode;
  title?: string;
  showNavBar: boolean;
};

const Layout = ({ children, showNavBar, title = 'RedTetris' }: Props) => (
  <div className="home-page">
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/logo.svg" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>{!showNavBar && <NavigationBar />}</header>
    {children}
    {!showNavBar && <Footer />}
  </div>
);

export default Layout;
