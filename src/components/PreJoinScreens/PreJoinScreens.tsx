import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import axios from 'axios';

const getParameterByName = (name: string) => {
  let url = window.location.href;

  name = name.replace(/[[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  let results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const getAttendeeInfoFromServer = (id: string, token: string) => {
  const url = 'http://localhost:3000/attendeeDetails?id=' + id + '&token=' + token;

  return axios.get(url).then(response => {
    return response.data[0].firstName + ' ' + response.data[0].lastName;
  });
};

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const { URLRoomName } = useParams();
  const [step, setStep] = useState(Steps.roomNameStep);

  const attendeeId = getParameterByName('id') ?? '';
  const api_token = getParameterByName('token') ?? '';
  const room = getParameterByName('room') ?? '';
  getAttendeeInfoFromServer(attendeeId, api_token).then(response => {
    setName(response);
  });

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>(room || '');

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (step === Steps.deviceSelectionStep && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${room}${window.location.search || ''}`));
    }
    setStep(Steps.deviceSelectionStep);
  };

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      {step === Steps.roomNameStep && (
        <RoomNameScreen
          name={name}
          roomName={room}
          setName={setName}
          setRoomName={setRoomName}
          handleSubmit={handleSubmit}
        />
      )}

      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />
      )}
    </IntroContainer>
  );
}
