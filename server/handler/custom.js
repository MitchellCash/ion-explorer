const Coin = require('../../model/coin')

const getCustomSupply = async (req, res) => {
  try {
    const coin = await Coin.findOne().sort({ createdAt: -1 });

    res.json(coin.supply);
  } catch(err) {
    console.log(err);
    res.status(500).send(err.message || err);
  }
};

module.exports = {
  getCustomSupply
}
