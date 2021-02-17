/**
 * Global configuration object.
 *
 * Running:
 * yarn run start:api
 * yarn run start:web (Access project via http://localhost:8081/) (port comes from webpack.config.js)
 *
 * For nginx server installation and production read /script/install.sh `installNginx ()`. Note that we use Certbot to grant SSL certificate.
 *
 */
const config = {
  api: {
    host: 'http://localhost', // ex: 'https://explorer.bulwarkcrypto.com' for nginx (SSL), 'http://IP_ADDRESS'
    port: '3000', // ex: Port 3000 on prod and localhost
    prefix: '/api',
    timeout: '5s'
  },
  coinMarketCap: {
    api: 'http://api.coinmarketcap.com/v1/ticker/',
    ticker: 'ion'
  },
  freegeoip: {
    api: 'https://extreme-ip-lookup.com/json/' //@todo need to find new geoip service as the limits are too small now (hitting limits)
  },
};

module.exports = config;
