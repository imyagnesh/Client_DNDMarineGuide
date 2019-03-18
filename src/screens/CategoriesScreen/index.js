import { connect } from 'react-redux';
import { action } from 'utils';
import categoriesScreen from './categoriesScreen';
import { FETCH_CATEGORIES, REQUEST } from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    categories: state.categories,
    loading: !!state.loading.FETCH_CATEGORIES,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCategories: () => dispatch(action(`${FETCH_CATEGORIES}_${REQUEST}`)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(categoriesScreen);
