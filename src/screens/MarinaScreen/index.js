import { connect } from 'react-redux';
import { action } from 'utils';
import marinaScreen from './marinaScreen';
import { FETCH_MARINAS, REQUEST } from '../../constants/actionTypes';

function mapStateToProps(state) {
  return {
    marinas: state.marinas,
    loading: !!state.loading.FETCH_MARINAS,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMarinas: () => dispatch(action(`${FETCH_MARINAS}_${REQUEST}`)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(marinaScreen);
