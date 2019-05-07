import { connect } from 'react-redux';
import { action } from 'utils';
import cityList from './cityList';
import {
  FETCH_CITIES,
  REQUEST,
  FETCH_ADVERTISEMENT,
  CLEAR_ADVERTISEMENT,
} from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    cities: state.cities,
    loading: !!state.loading.FETCH_CITIES,
    advertisement: state.advertisement,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAdvertisement: search => dispatch(action(`${FETCH_ADVERTISEMENT}_${REQUEST}`, search)),
    clearAdvertisement: () => dispatch(action(CLEAR_ADVERTISEMENT)),
    fetchCities: search => dispatch(action(`${FETCH_CITIES}_${REQUEST}`, search)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(cityList);
