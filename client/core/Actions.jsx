
import fetchWorker from '../../lib/fetch.worker';
import promise from 'bluebird';
import {
  COIN,
  DATA,
  COINS,
  ERROR,
  TXS,
  WATCH_ADD,
  WATCH_REMOVE
} from '../constants';

const promises = [];
const worker = new fetchWorker();

/**
 * A message sent to worker will have a unique identifier
 */
let messageId = 0;

worker.onerror = (err) => {
  console.log(err);
  return err;
};

worker.onmessage = (ev) => {
  const promiseIndex = promises.findIndex(promise => promise.messageId === ev.data.id);
  if (promiseIndex === -1) {
    return false;
  }

  if (ev.data.error) {
    promises[promiseIndex].reject(ev.data.error);
    promises.splice(promiseIndex, 1);
    return false;
  }

  promises[promiseIndex].resolve(ev.data.data);
  promises.splice(promiseIndex, 1);
  return true;
};

const getFromWorker = (type, resolve, reject, query = null) => {
  messageId++; // For each message to worker, increment the message id (that way we can identify what promise is resolved from worker by the id instead of by type)

  promises.push({ resolve, reject, type, messageId });
  worker.postMessage({ query, type, id: messageId });
  return true;
};

export const verifyTokenOwner = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('verifyTokenOwner', resolve, reject, query);
  });
};

export const getToken = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('token', resolve, reject, query);
  });
};

export const getTokens = (dispatch, query) => {
  return new promise((resolve, reject) => {
    return getFromWorker(
      'tokens',
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: DATA });
        }
        resolve(payload);
      },
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: ERROR });
        }
        reject(payload);
      },
      query
    );
  });
};

export const getAddress = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('address', resolve, reject, query);
  });
};

export const getBlock = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('block', resolve, reject, query);
  });
};

export const getCoinHistory = (dispatch, query) => {
  return new promise((resolve, reject) => {
    return getFromWorker(
      'coins',
      (payload) => {
        if (payload && payload.length) {
          dispatch({ payload: payload[0], type: COIN });
        }
        dispatch({ payload, type: COINS });
        resolve(payload);
      },
      (payload) => {
        dispatch({ payload, type: ERROR });
        reject(payload);
      },
      query
    );
  });
};

export const getCoinsWeek = () => {
  return new promise((resolve, reject) => {
    return getFromWorker('coins-week', resolve, reject);
  });
};

export const getIsBlock = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('is-block', resolve, reject, query);
  });
};

export const getMNs = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('mns', resolve, reject, query);
  });
};

export const getPeers = () => {
  return new promise((resolve, reject) => {
    return getFromWorker(
      'peers',
      (peers) => {
        resolve(peers.map((peer) => {
          const parts = peer.ip.split('.');
          parts[3] = 'XXX';
          peer.ip = parts.join('.');
          return peer;
        }));
      },
      reject
    );
  });
};

export const getTX = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('tx', resolve, reject, query);
  });
};

export const getTXLatest = (dispatch, query) => {
  return new promise((resolve, reject) => {
    return getFromWorker(
      'txs-latest',
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: TXS });
        }
        resolve(payload);
      },
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: ERROR });
        }
        reject(payload);
      },
      query
    );
  });
};

export const getTXs = (dispatch, query) => {
  return new promise((resolve, reject) => {
    return getFromWorker(
      'txs',
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: TXS });
        }
        resolve(payload);
      },
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: ERROR });
        }
        reject(payload);
      },
      query
    );
  });
};

export const getTXsWeek = () => {
  return new promise((resolve, reject) => {
    return getFromWorker('txs-week', resolve, reject);
  });
};

export const setData = (dispatch, data) => {
  dispatch({ payload: data, type: DATA });
};

export const setTXs = (dispatch, txs) => {
  dispatch({ payload: txs, type: TXS });
};

export const setWatch = (dispatch, term) => {
  dispatch({ payload: term, type: WATCH_ADD });
};

export const removeWatch = (dispatch, term) => {
  dispatch({ payload: term, type: WATCH_REMOVE });
};

export default {
  getAddress,
  getBlock,
  setData,
  getCoinHistory,
  getCoinsWeek,
  getIsBlock,
  getMNs,
  getTokens,
  getToken,
  getPeers,
  getTX,
  getTXLatest,
  getTXs,
  getTXsWeek,
  setTXs,
  setWatch,
  removeWatch,
  verifyTokenOwner
};
