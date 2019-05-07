import { connect } from 'react-redux';
import { action } from 'utils';
import marinaList from './marinaList';
import {
  FETCH_MARINAS,
  REQUEST,
  FETCH_ADVERTISEMENT,
  CLEAR_ADVERTISEMENT,
} from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    marinas: state.marinas,
    loading: !!state.loading.FETCH_MARINAS,
    advertisement: state.advertisement,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAdvertisement: search => dispatch(action(`${FETCH_ADVERTISEMENT}_${REQUEST}`, search)),
    clearAdvertisement: () => dispatch(action(CLEAR_ADVERTISEMENT)),
    fetchMarinas: search => dispatch(action(`${FETCH_MARINAS}_${REQUEST}`, search)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(marinaList);
