import { connect } from 'react-redux';
import { action } from 'utils';
import categoryList from './categoryList';
import { FETCH_CATEGORIES, REQUEST } from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    categories: state.categories,
    loading: !!state.loading.FETCH_CATEGORIES,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCategories: search => dispatch(action(`${FETCH_CATEGORIES}_${REQUEST}`, search)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(categoryList);
