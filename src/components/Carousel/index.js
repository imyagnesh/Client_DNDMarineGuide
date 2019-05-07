import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, ViewPropTypes } from 'react-native';

export default class Carousel extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    onScroll: PropTypes.func,
    showsHorizontalScrollIndicator: PropTypes.bool,
    snapToInterval: PropTypes.number,
    snapToAlignment: PropTypes.string,
    verticalInset: PropTypes.number,
    horizontalInset: PropTypes.number,
    scrollEventThrottle: PropTypes.number,
    decelerationRate: PropTypes.number,
    initialPage: PropTypes.number,
    contentContainerStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    snapToAlignment: 'center',
    showsHorizontalScrollIndicator: false,
    scrollEventThrottle: 16,
    snapToInterval: 0,
    verticalInset: 0,
    horizontalInset: 0,
    decelerationRate: 0.5,
    initialPage: 0,
    onScroll: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const { horizontalInset, verticalInset, initialPage, snapToInterval } = this.props;
    setTimeout(() => {
      this.scrollView.scrollTo({
        x: initialPage * snapToInterval - horizontalInset,
        y: -verticalInset,
      });
    }, 0);
  }

  handleScroll(event) {
    const { onScroll, snapToInterval } = this.props;
    const currentIndex = Math.ceil(event.nativeEvent.contentOffset.x / snapToInterval);
    onScroll(currentIndex);
  }

  render() {
    const {
      children,
      snapToInterval,
      snapToAlignment,
      horizontalInset,
      verticalInset,
      scrollEventThrottle,
      decelerationRate,
      showsHorizontalScrollIndicator,
      contentContainerStyle,
      ...props
    } = this.props;
    // const smallerWidth = parseInt(WIDTH / 2, 10);
    return (
      <ScrollView
        ref={scrollView => {
          this.scrollView = scrollView;
        }}
        contentInsetAdjustmentBehavior="automatic"
        horizontal
        pagingEnabled
        directionalLockEnabled
        decelerationRate={decelerationRate}
        snapToInterval={snapToInterval}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={contentContainerStyle}
        // snapToOffsets={[
        //   1 * snapToInterval - (WIDTH - snapToInterval) / 2,
        //   2 * snapToInterval - (WIDTH - snapToInterval) / 2,
        //   3 * snapToInterval - (WIDTH - snapToInterval) / 2,
        //   4 * snapToInterval - (WIDTH - snapToInterval) / 2,
        // ]}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        onScroll={this.handleScroll}
        snapToAlignment={snapToAlignment}
        contentInset={{
          top: verticalInset,
          left: horizontalInset,
          bottom: verticalInset,
          right: horizontalInset,
        }}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
}
