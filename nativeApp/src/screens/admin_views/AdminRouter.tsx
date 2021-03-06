
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { ColoursEnum } from '../../lib/ui/colours';
import AdminHome from './Home';
import Projects from './Projects';
import Volunteers from './Volunteers/VolunteersPage';
import AdminTime from './Time/TimePage';
import AddTime from './AddTime';
import { FontsEnum } from '../../lib/ui/typography';

const getIconName = (name: string) => {
  switch (name) {
    case 'Volunteers':
      return [MaterialIcons, { name: 'person-outline', size: 25 }];
    case 'Projects':
      return [MaterialIcons, { name: 'assignment', size: 25 }];
    case 'AddTime':
      return [MaterialCommunityIcons, { name: 'plus-box-outline', size: 35 }];
    case 'Time':
      return [MaterialCommunityIcons, { name: 'clock-fast', size: 25 }];
    case 'Home':
    default:
      return [MaterialCommunityIcons, { name: 'home-outline', size: 25 }];
  }
};

const TabNavigator = createBottomTabNavigator({
  Home: AdminHome,
  Volunteers,
  AddTime,
  Time: AdminTime,
  Projects,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state;
      const [Icon, iconProps] = getIconName(routeName);

      return <Icon {...iconProps} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: ColoursEnum.purple,
    inactiveTintColor: ColoursEnum.darkGrey,
    labelStyle: { letterSpacing: 1.02, fontFamily: FontsEnum.regular },
  },
});

export default createAppContainer(TabNavigator);
