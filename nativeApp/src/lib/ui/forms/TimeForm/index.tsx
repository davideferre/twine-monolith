import React, { FC, useState, useEffect } from 'react';
import { StorageValuesEnum } from '../../../../authentication/types';
import styled from 'styled-components/native';
import { Form as F, Text } from 'native-base';
import { NetInfo, Platform, AsyncStorage, TextInput } from "react-native";

import { useDispatch, useSelector } from 'react-redux';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import Dropdown from '../Dropdown';
import FuzzySearchBox from '../FuzzySearchBox';
import { Forms } from '../enums';
import DateTimePicker from '../DateTimePicker';
import { ColoursEnum } from '../../colours';
import { TimeDiff } from '../../HoursAndMinutesText';
import SubmitButton from '../SubmitButton';
import NoteButton from '../../NoteButton';

import { getTimeLabel } from './helpers';
import { createLog, selectCreateLogStatus, createLogReset, updateLog } from '../../../../redux/entities/logs';
import { IdAndName } from '../../../../api';
import { User } from '../../../../../../api/src/models';
import SavedModal from '../../modals/SavedModal';
import NoteModal from '../../modals/NoteModal';
import useToggle from '../../../hooks/useToggle';

import * as yup from 'yup';
import { Formik } from 'formik';

/*
 * Types
 */
export type TimeValues = {
  project: string;
  activity: string;
  volunteer: string;
  date: Date;
  startTime: Date;
  endTime: Date;

}
type Props = {
  defaultValues?: TimeValues;
  activities: IdAndName[];
  projects: IdAndName[];
  volunteers?: User[];
  forUser: 'admin' | 'volunteer'; // TODO replace with role enum from api
  logId: string;
  selectedProject?: string;
  selectedActivity?: string;
  origin: string;

}

/*
 * Styles
 */

const Form = styled(F)`
  width: ${Forms.formWidth}
`;

const Label = styled(Text)`
  color: ${ColoursEnum.darkGrey};
  marginTop: 15;
`;

const TimeContainer = styled.View`
  marginTop: 15;
`;

const NoteContainer = styled.View`
  justifyContent: space-between;
  flexDirection: row;
`;

// const zeroToNine = [...Array(10).keys()].map((_, i) => ({ id: i, name: `${parseInt(i)}` }));
// const zeroToFiftyNine = [...Array(60).keys()].map((_, i) => ({ id: i, name: `${parseInt(i)}` }));

/*
 * Component
 */
const TimeForm: FC<Props & NavigationInjectedProps> = (props) => {
  const {
    forUser, logId, origin, activities, projects, volunteers, selectedProject, selectedActivity //, timeValues
  } = props;

  // redux
  const dispatch = useDispatch();

  const requestStatus = useSelector(selectCreateLogStatus);

  // local state
  const [responseModal, toggleResponseModal] = useToggle(false);
  const [noteModalVisible, toggleNoteInvisibility] = useToggle(false);

  const [startTime, setStartTime] = useState<Date>(new Date);
  const [endTime, setEndTime] = useState<Date>(new Date);
  const [date, setDate] = useState<Date>(new Date);
  const [hours, setHours] = useState<number>();
  const [minutes, setMinutes] = useState<number>();
  const [note, setNote] = useState('');
  const [userId, setUserID] = useState<number>();

  if (forUser == 'admin') {
    // setUserID(volunteers.find((x) => x.name === volunteer).id);
  }
  if (forUser == 'volunteer') {
    AsyncStorage.getItem(StorageValuesEnum.USER_ID).then(userID => setUserID(parseInt(userID)))
  }

  const CheckConnectivity = async (logData) => {
    await NetInfo.isConnected.fetch()
      .then(isConnected => {
        if (isConnected) {
          console.log('connected to internet');
        } else {
          cache(logData);
        }
        return isConnected;
      })
  }

  const resetForm = () => {
    setDate(new Date);
    setHours(undefined);
    setMinutes(undefined);
    setNote('');
  };

  //function to cache value in asynchstorage
  const cache = async (values) => {

    var cachevalue = await AsyncStorage.getItem('log cache');
    cachevalue = cachevalue == null ? [] : JSON.parse(cachevalue);
    cachevalue.push(values);
    await AsyncStorage.setItem(
      'log cache',
      JSON.stringify(cachevalue)
    );

  }

  const cacheforEdit = async (values) => {

    var cachevalue = await AsyncStorage.getItem('edit log cache');
    cachevalue = cachevalue == null ? [] : JSON.parse(cachevalue);
    cachevalue.push(values);
    await AsyncStorage.setItem(
      'edit log cache',
      JSON.stringify(cachevalue)
    );

  }

  // hooks
  useEffect(() => {
    if (requestStatus.success) {
      toggleResponseModal();
    }
  }, [requestStatus]);

  // handlers
  const onSubmit = async (volunteer, project, activity, startTime, endTime, note) => {

    const hours = Math.floor((endTime - startTime) / (1000 * 60 * 60));
    const minutes = Math.floor((endTime - startTime) / (1000 * 60) - hours * 60);

    const values = {
      project,
      activity,
      startedAt: date as string,
      duration: { hours, minutes },
      userId: userId,
      note
    };

    CheckConnectivity(values);

    //if timeform is called from add time view 
    if (origin == "addTime") {
      try { //error trapping and cache log when network error
        const res = await dispatch(createLog(values));
        if (res.error.statusCode == 500) {
          cache(values);
        }
        if (res.error.statusCode == 400) {
          console.log(res.error.message);
          //ToDo: error trapping here 
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }

    //if timeform is called from edit time view 
    if (origin == "editTime") {
      const valuesEdit: any = {
        project,
        activity,
        startedAt: date as string,
        duration: { hours, minutes },
      };


      try { //error trapping and cache log when network error
        const res = await dispatch(updateLog(userId, logId, valuesEdit));
        if (res.error.statusCode == 500) {
          valuesEdit.userId = userId;
          valuesEdit.logId = logId;
          cacheforEdit(valuesEdit);
        }
        if (res.error.statusCode == 400) {
          console.log(res.error.message);
          //ToDo: error trapping here 
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };


  const onContinue = () => {
    dispatch(createLogReset());
    // resetForm();
    // toggleResponseModal(); ??
  };

  const validationSchema = yup.object().shape({
    // yup.object().shape({
    project: yup
      .string()
      .min(3, 'error')
      .required('enter a project'),
    activity: yup
      .string()
      .min(3, 'error')
      .required('enter an activity'),
  });

  return (

    <Formik
      initialValues={{ volunteer: '', project: selectedProject, activity: selectedActivity, note: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, date) => {
        onSubmit(values.volunteer, values.project, values.activity, startTime, endTime, values.note);
      }}>

      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (

        <Form>
          <SavedModal
            isVisible={responseModal}
            onContinue={onContinue}
          />
          <NoteModal
            isVisible={noteModalVisible}
            // addNote={setNote}
            addNote={values.note}
            onClose={toggleNoteInvisibility}
          />

          {forUser === 'admin' &&
            <FuzzySearchBox
              label="Volunteer"
              placeholder={"Search volunteers"}
              options={volunteers}
              selectedValue={values.volunteer}
              onValueChange={handleChange('volunteer')}
              onBlur={handleBlur('volunteer')}
              value={values.volunteer}
            />
          }

          {forUser === 'volunteer' && <Label>What project are you volunteering on?</Label>}

          <Dropdown
            label="Project"
            options={projects}
            selectedValue={values.project}
            onValueChange={handleChange('project')}
            onBlur={handleBlur('project')}
            value={values.project}
          />

          {errors.project &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.project}</TextInput>
          }

          {forUser === 'volunteer' && <Label>What activity are you doing?</Label>}

          <Dropdown label="Activity"
            options={activities}
            selectedValue={values.activity}
            onValueChange={handleChange('activity')}
            value={values.activity}
          />
          {errors.activity &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.activity}</TextInput>
          }

          <DateTimePicker
            label="Start Time"
            value={startTime}
            onConfirm={(newDate) => setStartTime(newDate)}
            mode="datetime"
            maxDate={new Date()}
          />

          <DateTimePicker
            label="End Time"
            value={endTime}
            onConfirm={(newDate) => setEndTime(newDate)}
            mode="datetime"
            maxDate={new Date()}
          />

          <NoteContainer>
            <Label>{getTimeLabel(forUser, values.volunteer)}</Label>
            <NoteButton label={"Add note"} onPress={toggleNoteInvisibility} />
          </NoteContainer>
          <TimeContainer>
            <TimeDiff align="center" timeValues={[startTime.getTime(), endTime.getTime()]} />
          </TimeContainer>
          {origin === "addTime" && <SubmitButton text="ADD TIME" onPress={handleSubmit} />}
          {origin === "editTime" && <SubmitButton text="EDIT TIME" onPress={handleSubmit} />}
        </Form>

      )}
    </Formik>
  );
};

export default withNavigation(TimeForm);