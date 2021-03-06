
import React, { FC, useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationInjectedProps } from 'react-navigation';

import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import Stat from '../../../lib/ui/Stat';
import Line from '../../../lib/ui/Line';



import { createLog, loadLogs, selectOrderedLogs, selectLogsStatus, updateLog } from '../../../redux/entities/logs';
import Tabs from '../../../lib/ui/Tabs';
import Page from '../../../lib/ui/Page';
import AddBar from '../../../lib/ui/AddBar';

import { BadgeCard } from '../../../lib/ui/Badges/BadgesCard';
import useToggle from '../../../lib/hooks/useToggle';

import { BadgeObj } from './BadgeObject';

import { StorageValuesEnum } from '../../../authentication/types';
import { allowAsync } from 'expo/build/ScreenOrientation/ScreenOrientation';

//For Expo PushNotification
import { Vibration, Platform } from 'react-native';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import API, { getErrorResponse } from '../../../api';




/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const View = styled.View`
  flexDirection: column;
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
  paddingLeft: 40;
  paddingRight: 40;
  flex: 1;
`;

const CardView = styled.View`
  flexDirection: column;
  alignItems: center;
  flex: 1;
`;

const Heading = styled(H)`
  flexGrow: 0;
`;

const Container = styled.View`
  width: 100%;
  flexGrow: 1;
  justifyContent: space-between;
`;

/*
 * Component
 */

const Stats: FC<Props> = () => {
  // setBadge(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadLogs());
  }, []);

  const logs = useSelector(selectOrderedLogs, shallowEqual);
  let hours = 0;
  let minutes = 0;
  Object.keys(logs).forEach(object => {
    for (let key in logs[object].duration) {
      if (key == 'hours') {
        hours += logs[object].duration[key];
      }
      if (key == 'minutes') {
        minutes += logs[object].duration[key];
      }
    }
  });

  hours = ~~(hours + minutes / 60);

  const avgDur = ~~(hours * 60 / logs.length);

  return (
    <View>
      <Container>
        <Stat
          heading="TOTAL TIME GIVEN"
          value={hours.toString()}
          unit="hours"
        >
          <MaterialCommunityIcons name="clock-outline" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="TIMES VOLUNTEERED"
          value={logs.length}
          unit="visits"
        >
          <MaterialCommunityIcons name="calendar-blank" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="AVERAGE DURATION"
          value={avgDur.toString()}
          unit="minutes"
        >
          <MaterialCommunityIcons name="timer" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
      </Container>
    </View>
  )
};

const badgearray = [BadgeObj.FirstLogBadge, BadgeObj.ThridMonthBadge];

const BadgeTab: FC<Props> = (props) => {
  return (
    <CardView>
      {
        props.badge.map((element) => (
          <BadgeCard badge={element} />
        ))
      }
    </CardView >
  );
};

// const Badges = [FirstLogCard, InviteMedalCard];

const VolunteerHome: FC<Props & NavigationInjectedProps> = ({ navigation }) => {
  const registerForPushNotificationsAsync = async () => {

    // const [expoPushToken, setexpoPushToken] = useState('');
    // const [notification, setnotification] = useState<any>();
    const userId = await AsyncStorage.getItem(StorageValuesEnum.USER_ID);

    // const _handleNotification = (notification) => {
    //   Vibration.vibrate();
    //   setnotification({ notification: { notification } });
    // };

    // useEffect(() => {
    //   registerForPushNotificationsAsync();

    //   // Handle notifications that are received or selected while the app
    //   // is open. If the app was closed and then opened by tapping the
    //   // notification (rather than just tapping the app icon to open it),
    //   // this function will fire on the next tick after the app starts
    //   // with the notification data.
    //   _notificationSubscription = Notifications.addListener(_handleNotification);
    // }, []);

    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const pushtoken = await Notifications.getExpoPushTokenAsync();
      // setexpoPushToken(pushtoken);
      API.Users.pushtoken(parseInt(userId), pushtoken);

    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  registerForPushNotificationsAsync();

  const [stats, setBadge] = useToggle(false);
  const dispatch = useDispatch();
  const [userID, setUserID] = useState('');
  const [logged, setLogged] = useState(false);

  //access fail to send log and try logging them again
  const checkStorage = async () => {
    var logStore = await AsyncStorage.getItem('log cache');
    logStore = logStore == null ? [] : JSON.parse(logStore);
    const arr = Object.values(logStore);

    var editlogStore = await AsyncStorage.getItem('edit log cache');
    editlogStore = editlogStore == null ? [] : JSON.parse(editlogStore);
    const editArr = Object.values(editlogStore);

    //return array of promise, assign a value null if succeed
    const newArray = await Promise.all(arr.map(item => {
      const res = createLog(item)(dispatch).then((result) => {
        if (result.status == 200) {
          return null;
        } else {
          return item;
        };
      });
      return res;

    }));

    const newArrayEdit = await Promise.all(editArr.map(item => {
      const { userId, logId } = item;
      delete item.userId;
      delete item.logId;
      const res = updateLog(userId, logId, item)(dispatch).then((result) => {
        if (result.status == 200) {
          return null;
        } else {
          return item;
        };
      });
      return res;
    }));

    const correctedArray = newArray.filter(obj => {
      return obj != null;
    });

    const correctedArrayEdit = newArrayEdit.filter(obj => {
      return obj != null;
    });

    //updating the log (without successful logs)
    AsyncStorage.setItem(
      'log cache',
      JSON.stringify(correctedArray)
    );

    AsyncStorage.setItem(
      'edit log cache',
      JSON.stringify(correctedArrayEdit)
    );
  }

  useEffect(() => {
    AsyncStorage.getItem('HelpSlides').then(val => {
      if (!val) {
        navigation.navigate('HelpSlideStack');
      }
    })
    checkStorage();
    dispatch(loadLogs());
  }, []);

  AsyncStorage.getItem(StorageValuesEnum.USER_ID).then(userID => setUserID(userID))

  return (
    <Page heading="Home" withAddBar>
      <AddBar onPress={() => navigation.navigate('VolunteersBadges')} title="Volunteer's Badges" />

      <Tabs
        tabOne={['Stats', Stats, {}]}
        tabTwo={['Badges', BadgeTab, { badge: badgearray }]}
      />

    </Page>
  );
}
export default VolunteerHome;
