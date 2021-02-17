
const config = require('../config');
const promise = require('bluebird');

/**
 * Return the DSN string for the mongodb connection.
 */
const getDSN = () => {
  return `mongodb://${ config.db.user }:${ config.db.pass }@${ config.db.host }:${ config.db.port }/${ config.db.name }?ssl=true&replicaSet=globaldb`;
};

/**
 * Return the options for the mongodb connection.
 */
const getOptions = () => {
  return {
    auth: { authdb: config.db.name },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false,
    promiseLibrary: promise
  };
};

module.exports =  {
  getDSN,
  getOptions
};
