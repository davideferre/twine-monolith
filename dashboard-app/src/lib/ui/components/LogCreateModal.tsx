import React, { FC, useState, useRef, useEffect } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';
import {CommunityBusinesses, Project, Logs, LogNote,} from '../../api';
import NoteModal from './NoteModal';
import { duration } from 'moment';
import DataTable from '../../../features/dashboard/components/DataTable';

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
}

/*
 * Styles
 */


const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
`;

const getStringArray = (array: any[]) => {
    return array.map(item =>item.name)
}

const getSelected = (e: any) => e.value;

const getDuration = (startTimeElement: any, endTimeElement: any) => {
    const startTime = startTimeElement.value;
    const endTime = endTimeElement.value;


    console.log(startTime)
    console.log(endTime)

    //assuming same day, which you kind of
    const hours = parseInt(endTime.slice(0,2)) - parseInt(startTime.slice(0,2));
    const minutes = 0;
    const seconds = 0;

    return {hours, minutes, seconds}
}

const getDate = (dateElement: any, startTimeElement: any) => {
    console.log(dateElement.value + startTimeElement.value)

    try{
        let date = new Date(
            parseInt(dateElement.value.slice(0,4)),
            parseInt(dateElement.value.slice(5,7)) - 1,
            parseInt(dateElement.value.slice(8,10)),
            startTimeElement.value.slice(0,2),
            startTimeElement.value.slice(3,5),
        )
        console.log(date);
        return date;
    }
    catch{
        console.log("not good");
        return new Date()
    }
}

const getNote = (e: any) => e.value? e.value : ""

const LogCreateModal:FC<Props> = (props) => {
    const {visible, closeFunction,} = props;

    const [projects, setProjects] = useState(["loading project"]);
    const [activities, setActivities] = useState(["loading activities"]);
    const [volunteers, setVolunteers] = useState([{id:0 , name:"loading volunteers"}]);
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const now = new Date();
    const [date, setDate] = useState(now.toISOString().slice(0,10));
    const [startTime, setStartTime] = useState(now.getHours() + ":" + now.getMinutes());
    const [endTime, setEndTime] = useState(now.getHours() + ":" + now.getMinutes());

    const[errorMessage, setErrorMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const[noteModalVisible, setNoteModalVisible] = useState(false);
    const[note, setNote] = useState("");

    console.log(now)
    console.log(date)
    console.log(startTime);
    console.log(endTime);

    const [log, setLog] = useState({
        userId: 0,
        activity: "",
        project: "",
        duration: {hours: 0, minutes: 0, seconds: 0},
        startedAt: new Date(),
    })

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    useEffect(()=>{
        if(loading)
            getOptions();
        if(!loading && document.getElementById('Log Form')){
            let potentialLog = {
                userId: parseInt(getSelected(document.getElementById('Volunteer'))),
                activity: getSelected(document.getElementById('Activity')),
                project: getSelected(document.getElementById('Project')),
                duration: getDuration(document.getElementById('Start Time'),document.getElementById('End Time')),
                startedAt: getDate(document.getElementById("Date"),document.getElementById('Start Time')),
            };

            console.log(potentialLog);
            //validation code
            if(new Date(potentialLog.startedAt) && potentialLog.duration.hours!=0){
                setLog(potentialLog);
                setValid(true);
            }
        }
    })

    const getOptions = async () => {
        const options = {
            projects: await Project.get(),
            activities: await CommunityBusinesses.getVolunteerActivities(),
            volunteers: await CommunityBusinesses.getVolunteers()
        }
        setProjects(getStringArray(options.projects.data.result));
        setActivities(getStringArray(options.activities.data.result));
        setVolunteers(options.volunteers.data.result);

        console.log(options);

        setLoading(false);
    }    

    const submit = ()=>{
        try{
            console.log(log);
            Logs.add(log).then(result=>console.log(result));
            showSuccessMessage();
        }
        catch(error){
            console.log("error");
            console.log(error);
            setErrorMessage(error);
        }
    };

    const showSuccessMessage = ()=>{
        setSuccessMessage("Log created!");
        setTimeout(()=>{setSuccessMessage("")},1000);
    }

    if(visible)
        return (
            <div
                style={{
                    position: 'fixed', 
                    width: "50%", 
                    height: "50%", 
                    bottom: "25%", 
                    right: "25%",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    zIndex: 3,
                    boxShadow: '2px 3px 6px #00000029',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                ref={wrapperRef}
            >
                <h1
                    style={{
                        position: 'fixed', bottom: '50%', zIndex: 4, color: ColoursEnum.purple,
                        textAlign: 'center', left: '50%'
                    }}
                >{successMessage}</h1>
                <NoteModal
                visible={noteModalVisible}
                setNote={setNote}
                closeFunction={()=>setNoteModalVisible(false)}
                />
                <div
                    style={{
                        backgroundColor: ColoursEnum.purple,
                        borderRadius: "8px 8px 0px 0px",
                    }}
                >
                <Heading2>TWINE</Heading2>
                </div>
                <div
                    style={{
                        borderRadius: '4px',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '45px',
                        marginLeft: '75px',
                        marginRight: '75px',
                        padding: '12px',
                    }}
                >
                    <p>Add Time</p>
                {
                loading?
                    <p>loading...</p>
                :
                    <div id="Log Form">
                        <select id="Volunteer" name="Volunteer">
                            {volunteers.map(volunteer=>
                                <option value={volunteer.id}>{volunteer.name}</option>)} 
                        </select>
                        <select id="Project" name="Project">
                            {projects.map(project=>
                                <option value={project}>{project}</option>)} 
                        </select>
                        <select id="Activity" name="Activity">
                            {activities.map(activity=>
                                <option value={activity}>{activity}</option>)} 
                        </select>
                        <input type="date" id="Date" value={date}
                            onChange={(e)=>setDate(e.target.value)}
                            //max={todaysDate}
                        />
                        <input type="time" id="Start Time" value={startTime}
                        onChange={(e)=>setStartTime(e.target.value)}
                        />
                        <input type="time" id="End Time" value={endTime}
                        onChange={(e)=>setEndTime(e.target.value)}
                        />
                        <button onClick={()=>setNoteModalVisible(true)}>Add Note</button>
                        <button onClick={submit}
                        disabled={!valid}
                        >Create</button>
                        <p>{errorMessage}</p>
                    </div>
                    }
                </div>
            </div>
        );
    else
        return null;

};

export default LogCreateModal;