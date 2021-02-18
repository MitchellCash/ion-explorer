
import Actions from '../core/Actions';
import Component from '../core/Component';
import throttle from '../../lib/throttle';
import { connect } from 'react-redux';
import { date24Format } from '../../lib/date';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import sortBy from 'lodash/sortBy';

import HorizontalRule from '../component/HorizontalRule';
import Pagination from '../component/Pagination';
import Table from '../component/Table';
import Select from '../component/Select';

import { PAGINATION_PAGE_SIZE } from '../constants';

class Masternode extends Component {
  static propTypes = {
    getMNs: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      cols: [
        { key: 'lastPaidAt', title: 'Last Paid' },
        { key: 'active', title: 'Active' },
        { key: 'addr', title: 'Address' },
        { key: 'txHash', title: 'Collateral TX' },
        { key: 'txOutIdx', title: 'Index' },
        { key: 'ver', title: 'Version' },
        { key: 'status', title: 'Status' },
      ],
      error: null,
      loading: true,
      mns: [] ,
      pages: 0,
      page: 1,
      size: 10
    };

    this.getThrottledMns = throttle(() => {
      this.props
        .getMNs({
          limit: this.state.size,
          skip: (this.state.page - 1) * this.state.size
        })
        .then(({ mns, pages }) => {
          this.setState({ mns, pages, loading: false });
        })
        .catch(error => this.setState({ error, loading: false }));
    }, 800);
  }

  componentDidMount() {
    this.props.setData({isToken: false});
    this.getMNs();
  };

  componentWillUnmount() {
    if (this.getThrottledMns) {
      clearTimeout(this.getThrottledMns);
    }
  }

  getMNs = () => {
    this.setState({ loading: true }, () => {
      this.getThrottledMns();
    });
  };

  handlePage = page => this.setState({ page }, this.getMNs);

  handleSize = size => this.setState({ size, page: 1 }, this.getMNs);

  render() {
    if (!!this.state.error) {
      return this.renderError(this.state.error);
    } else if (this.state.loading) {
      return this.renderLoading();
    }
    const selectOptions = PAGINATION_PAGE_SIZE;

    const select = (
      <Select
        onChange={ value => this.handleSize(value) }
        selectedValue={ this.state.size }
        options={ selectOptions } />
    );

    // Calculate the future so we can use it to
    // sort by lastPaid in descending order.
    const future = moment().add(2, 'years').utc().unix();

    return (
      <div>
        <HorizontalRule
          select={ select }
          title="Masternodes" />
        <Table
          cols={ this.state.cols }
          data={ sortBy(this.state.mns.map((mn) => {
            const lastPaidAt = moment(mn.lastPaidAt).utc();
            const isEpoch = lastPaidAt.unix() === 0;

            return {
              ...mn,
              active: moment().subtract(mn.active, 'seconds').utc().fromNow(),
              addr: (
                <Link to={ `/address/${ mn.addr }` }>
                  { `${ mn.addr.substr(0, 20) }...` }
                </Link>
              ),
              lastPaidAt: isEpoch ? 'N/A' : date24Format(mn.lastPaidAt),
              txHash: (
                <Link to={ `/tx/${ mn.txHash }` }>
                  { `${ mn.txHash.substr(0, 20) }...` }
                </Link>
              )
            };
          }), ['status']) } />
        <Pagination
          current={ this.state.page }
          className="float-right"
          onPage={ this.handlePage }
          total={ this.state.pages } />
        <div className="clearfix" />
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  setData: data => Actions.setData(dispatch, data),
  getMNs: query => Actions.getMNs(query)
});

export default connect(null, mapDispatch)(Masternode);
