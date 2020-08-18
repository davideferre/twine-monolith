import React, { FC, useState, useEffect, useRef } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';
import {LogNote} from '../../api'

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
  log: any;
}

/*
 * Styles
 */


const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
`;

const timeMinusHours = (time: string, hours: number) => {
    let newHour = parseInt(time.slice(0,2)) - hours;

    return newHour + time.slice(2);
}

const LogViewModal:FC<Props> = (props) => {
    const {visible, closeFunction, log} = props;
    const [initialised, setInitialised] = useState(false);
    const [logNote, setLogNote] = useState("");

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, ()=>{closeFunction();setInitialised(false);setLogNote("")});

    const getNote = async () => {
        let {data} = await LogNote.get(log.ID);
        console.log(data)
        if(data)
            setLogNote(data.notes);
        setInitialised(true);
    }
    
    useEffect(()=>{
        if(!initialised)
            if(log.ID)
                getNote();
    })


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
                      /*  borderColor: ColoursEnum.mustard,
                        border: '2px',
                        borderRadius: '4px',*/
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '45px',
                        marginLeft: '75px',
                        marginRight: '75px',
                        padding: '12px',
                    }}
                >
                    <p>Volunteers Time</p>
                    <p>Volunteer: {log.name}</p>
                    <p>Project: {log.project}</p>
                    <p>Activity: {log.activity}</p>
                    <p>Date: {log.date}</p>
                    <p>Start Time: {timeMinusHours(log.endTime,log.hours)}</p>
                    <p>End Time: {log.endTime}</p>
                    <p>Note: {logNote}</p>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            </div>
        );
    else
        return null;

};

export default LogViewModal;