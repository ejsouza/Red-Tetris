import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

type Props = {
  children?: ReactNode;
  title?: string;
  showNavBar: boolean;
};

const Layout = ({ children, showNavBar, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      {!showNavBar && <NavigationBar />}
    </header>
    {children}
    {!showNavBar && <Footer />}
  </div>
);

export default Layout;
