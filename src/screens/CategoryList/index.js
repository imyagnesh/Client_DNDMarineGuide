import { connect } from 'react-redux';
import { action } from 'utils';
import categoryList from './categoryList';
import {
  FETCH_CATEGORIES,
  REQUEST,
  FETCH_ADVERTISEMENT,
  CLEAR_ADVERTISEMENT,
} from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    categories: state.categories,
    loading: !!state.loading.FETCH_CATEGORIES,
    advertisement: state.advertisement,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAdvertisement: search => dispatch(action(`${FETCH_ADVERTISEMENT}_${REQUEST}`, search)),
    clearAdvertisement: () => dispatch(action(CLEAR_ADVERTISEMENT)),
    fetchCategories: search => dispatch(action(`${FETCH_CATEGORIES}_${REQUEST}`, search)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(categoryList);
