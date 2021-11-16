import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  // Simple check for not all pages have defined getInitialProps()
  if (appContext.Component.getInitialProps) {
    // Because we're calling getInitialProps() on the AppComponent now we have to manually
    // call the getInitialProps() on the Landing page and pass the context obj
    // otherwise will not be invoked automatically
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    currentUser: data.currentUser
  };
};

export default AppComponent;