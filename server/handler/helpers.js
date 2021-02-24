const UTXO = require('../../model/utxo');

async function _getBalance(address) {
  try {
    const utxo = await UTXO.find({ address });
    let bal = 0.0;
    utxo.forEach(tx => bal += tx.value);
    return bal;
  } catch (err) {
    console.log(err);
    return err.message || err;
  }
}

async function _getCirculatingSupply() {
  try {
    const devFundOne = await _getBalance('ikHbMe6SHea4MHxc1psfPE7eVhhof4v1SN');
    const devFundTwo = await _getBalance('iereuy4Vn96x8oUwXEj5E5FKNeA8uHcabv');
    const totalSupply = await _getTotalSupply();

    if (totalSupply > 0) {
      return totalSupply - devFundOne - devFundTwo;
    } else {
      return 0;
    }
  } catch (err) {
    console.log(err);
    return err.message || err;
  }
}

async function _getTotalSupply() {
  try {
    const results = await UTXO.aggregate([
      {$match: {address: {$ne: 'ZERO_COIN_MINT'}}},
      { $group: { _id: 'supply', total: { $sum: '$value' } } }
    ]);
    return results.length ? results[0].total : 0;
  } catch (err) {
    console.log(err);
    return err.message || err;
  }
}

module.exports = {
  _getBalance,
  _getCirculatingSupply,
  _getTotalSupply
};
