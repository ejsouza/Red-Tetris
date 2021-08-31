import React from 'react';
import type { AppProps /*, AppContext */ } from 'next/app';
import { Provider } from 'react-redux';
import { useStore } from 'src/store/';
import 'styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = ({ Component, pageProps }: AppProps) => {
  const store = useStore(pageProps.initialReduxState);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
