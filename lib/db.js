
const { secretsConfig } = require('../config.server');
const promise = require('bluebird');

/**
 * Return the DSN string for the mongodb connection.
 */
const getDSN = () => {
  return `mongodb://${ secretsConfig.db.user }:${ secretsConfig.db.pass }@${ secretsConfig.db.host }:${ secretsConfig.db.port }/${ secretsConfig.db.name }?ssl=true&replicaSet=globaldb`;
};

/**
 * Return the options for the mongodb connection.
 */
const getOptions = () => {
  return {
    auth: { authdb: secretsConfig.db.name },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false,
    promiseLibrary: promise
  };
};

module.exports = {
  getDSN,
  getOptions
};
