import { connect } from 'react-redux';
import { action } from 'utils';
import marinaList from './marinaList';
import { FETCH_MARINAS, REQUEST } from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    marinas: state.marinas,
    loading: !!state.loading.FETCH_MARINAS,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMarinas: search => dispatch(action(`${FETCH_MARINAS}_${REQUEST}`, search)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(marinaList);
