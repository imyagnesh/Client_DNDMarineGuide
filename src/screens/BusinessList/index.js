import { connect } from 'react-redux';
import { action } from 'utils';
import businessList from './businessList';
import {
  FETCH_BUSINESSES,
  CLEAR_BUSINESSES,
  REQUEST,
  FETCH_ADVERTISEMENT,
  CLEAR_ADVERTISEMENT,
} from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    businesses: state.businesses,
    advertisement: state.advertisement,
    loading: !!state.loading.FETCH_BUSINESSES,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBusinesses: search => dispatch(action(`${FETCH_BUSINESSES}_${REQUEST}`, search)),
    clearBusinesses: () => dispatch(action(CLEAR_BUSINESSES)),
    getAdvertisement: search => dispatch(action(`${FETCH_ADVERTISEMENT}_${REQUEST}`, search)),
    clearAdvertisement: () => dispatch(action(CLEAR_ADVERTISEMENT)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(businessList);
