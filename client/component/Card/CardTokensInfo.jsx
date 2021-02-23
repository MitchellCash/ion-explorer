
import Component from '../../core/Component';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import Card from './Card';
import CountUp from '../CountUp';

export default class CardTokensInfo extends Component {
  static defaultProps = {
    avgBlockTime: 90,
    avgMNTime: 24,
    blocks: 0,
    peers: 0,
    status: 'Offline',
    supply: 0
  };

  static propTypes = {
    avgBlockTime: PropTypes.number.isRequired,
    avgMNTime: PropTypes.number.isRequired,
    blocks: PropTypes.number.isRequired,
    peers: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    supply: PropTypes.number.isRequired
  };

  render() {
    return (
      <div className="animated fadeInUp">
        <Card title="Active Tokens" className="card--status" >
          <div className="card__row">
            <span className="card__label">More token info coming soon!</span>
          </div>
        </Card>
      </div>
    );
  };
}
