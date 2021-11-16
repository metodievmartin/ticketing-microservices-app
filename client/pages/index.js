import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return (
    <div>
      <h1>{currentUser ? `Welcome ${currentUser.email}` : 'Not signed in'}</h1>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;