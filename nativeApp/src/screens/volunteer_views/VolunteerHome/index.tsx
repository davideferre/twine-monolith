import React, { FC } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationInjectedProps } from 'react-navigation';

import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import Stat from '../../../lib/ui/Stat';
import Line from '../../../lib/ui/Line';

import Tabs from '../../../lib/ui/Tabs';
import Page from '../../../lib/ui/Page';
import AddBar from '../../../lib/ui/AddBar';

import { BadgeCard } from '../../../lib/ui/Badges/BadgesCard';
import useToggle from '../../../lib/hooks/useToggle';

import { BadgeObj } from './BadgeObject';

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
  return (
    <View>
      <Container>
        <Stat
          heading="TOTAL TIME GIVEN"
          value="109"
          unit="hours"
        >
          <MaterialCommunityIcons name="clock-outline" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="TIMES VOLUNTEERED"
          value="42"
          unit="visits"
        >
          <MaterialCommunityIcons name="calendar-blank" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="AVERAGE DURATION"
          value="120"
          unit="minutes"
        >
          <MaterialCommunityIcons name="timer" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
      </Container>
    </View>
  );
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
  const [stats, setBadge] = useToggle(false);



  return (
    <Page heading="Home" withAddBar>
      <AddBar onPress={() => navigation.navigate('VolunteersBadges')} title="Volunteer's Badges" />

      <Tabs
        tabOne={['Stats', Stats, {
          // projects: projects.filter(({ deletedAt }) => !deletedAt),
          // onConfirmDispatch: deleteProject,
          // confirmationText: 'Are you sure you want to archive this project?',
          // buttonType: 'archive',
        }]}
        tabTwo={['Badges', BadgeTab, { badge: badgearray }]}
      />

    </Page>
  );
}

export default VolunteerHome;
