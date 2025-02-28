/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

// eslint-disable-next-line import/no-unresolved
import { ScreenContainer } from 'react-native-screens';

import createTabNavigator, { type InjectedProps } from '../utils/createTabNavigator';
import VerticalMenu, { type TabBarOptions } from '../views/SideMenu';
import HorizontalMenu from '../views/HorizontalMenu';
import ResourceSavingScene from '../views/ResourceSavingScene';

type Props = InjectedProps & {
  lazy?: boolean,
  tabBarComponent?: React.ComponentType<*>,
  tabBarOptions?: TabBarOptions
};

type State = {
  loaded: number[]
};

class TabNavigationView extends React.PureComponent<Props, State> {
  static defaultProps = {
      lazy: true,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
      const { index } = nextProps.navigation.state;

      return {
      // Set the current tab to be loaded if it was not loaded before
          loaded: prevState.loaded.includes(index)
              ? prevState.loaded
              : [...prevState.loaded, index],
      };
  }

  state = {
      loaded: [this.props.navigation.state.index],
  };

  _getButtonComponent = ({ route }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarButtonComponent) {
          return options.tabBarButtonComponent;
      }

      return null;
  };

  _renderTabBar = () => {
      const {
          tabBarComponent: TabBarComponent = this.props.tabBarOptions.position === 'top' ? HorizontalMenu : HorizontalMenu,
          tabBarOptions,
          navigation,
          screenProps,
          getLabelText,
          getAccessibilityLabel,
          getTestID,
          renderIcon,
          onTabPress,
          onTabLongPress,
      } = this.props;

      const { descriptors } = this.props;
      const { state } = this.props.navigation;
      const route = state.routes[state.index];
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarVisible === false) {
          return null;
      }

      return (
          <TabBarComponent
              {...tabBarOptions}
              jumpTo={this._jumpTo}
              navigation={navigation}
              screenProps={screenProps}
              onTabPress={onTabPress}
              onTabLongPress={onTabLongPress}
              getLabelText={getLabelText}
              getButtonComponent={this._getButtonComponent}
              getAccessibilityLabel={getAccessibilityLabel}
              getTestID={getTestID}
              renderIcon={renderIcon}
          />
      );
  };

  _jumpTo = (key: string) => {
      const { navigation, onIndexChange } = this.props;

      const index = navigation.state.routes.findIndex(route => route.key === key);

      onIndexChange(index);
  };

  render() {
      const { navigation, renderScene, lazy, tabBarOptions } = this.props;
      const { routes } = navigation.state;
      const { loaded } = this.state;

      return (
          <View
              style={
                  tabBarOptions.position === 'top'
                      ? styles.topContainer
                      : styles.sideContainer
              }
          >
              {this._renderTabBar()}
              <ScreenContainer style={styles.pages}>
                  {routes.map((route, index) => {
                      if (lazy && !loaded.includes(index)) {
                          // Don't render a screen if we've never navigated to it
                          return null;
                      }

                      const isFocused = navigation.state.index === index;

                      return (
                          <ResourceSavingScene
                              key={route.key}
                              style={StyleSheet.absoluteFill}
                              isVisible={isFocused}
                          >
                              {renderScene({ route })}
                          </ResourceSavingScene>
                      );
                  })}
              </ScreenContainer>
          </View>
      );
  }
}

const styles = StyleSheet.create({
    sideContainer: {
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    topContainer: {
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'column',
    },
    pages: {
        flex: 1,
    },
});

export default createTabNavigator(TabNavigationView);
