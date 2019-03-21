import { connect } from 'react-redux';
import { action } from 'utils';
import businessList from './businessList';
import { FETCH_BUSINESSES, CLEAR_BUSINESSES, REQUEST } from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    businesses: state.businesses,
    loading: !!state.loading.FETCH_BUSINESSES,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBusinesses: search => dispatch(action(`${FETCH_BUSINESSES}_${REQUEST}`, search)),
    clearBusinesses: () => dispatch(action(CLEAR_BUSINESSES)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(businessList);
