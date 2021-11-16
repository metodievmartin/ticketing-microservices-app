import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // Code is executed on the server and requires extra configuration in order to reach ingress-nginx
    // service, which is running within another namespace

    // Return a pre-configured axios instance
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  }

  // Else the code is executed in the browser and it will work without any pre-configuration
  return axios.create({
    baseURL: '/'
  });
};

export default buildClient;