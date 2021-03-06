import React, { FC, useState, useRef } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';
import {Files} from '../../api';

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
  destination: string;
}

/*
 * Styles
 */


const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
`;


const UploadModal:FC<Props> = (props) => {
    const {visible, closeFunction, destination} = props;
    const [filename, setFilename] = useState("Upload File Here")
    const [uploadedFile, setUploadedFile] = useState(new File([""], "filename"));

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    const select = () => {
        if(document.getElementById('file-input'))
            document.getElementById('file-input')!.click();
    }

    const handleUpload = (e: any) => {
        setUploadedFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
        
    }

    const confirmUpload = () => {
        if(filename != "Upload File Here"){
            console.log(uploadedFile);
            Files.upload(uploadedFile,destination);
            closeFunction();
        }
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
                        borderColor: ColoursEnum.mustard,
                        border: '2px',
                        borderRadius: '4px',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '45px',
                        marginLeft: '75px',
                        marginRight: '75px',
                        padding: '12px',
                    }}
                >
                    <p>{filename}</p>
                    <button onClick={select}>Select</button>
                    <input id="file-input" type="file" name="name" style={{display: 'none'}}
                        onChange={e=>handleUpload(e)}
                    />
                </div>
                <img
                    src={require('../../../assets/uploadbutton.png')}
                    onClick={confirmUpload}
                />
            </div>
        );
    else
        return null;

};

export default UploadModal;