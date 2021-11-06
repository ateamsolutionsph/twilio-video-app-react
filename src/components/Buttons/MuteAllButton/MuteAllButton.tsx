import React, { useState } from 'react';

import MicOffIcon from '../../../icons/MicOffIcon';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { Button } from '@material-ui/core';

export default function MuteAllButton() {
  const { room } = useVideoContext();

  const handleMuteAll = () => {
    // Get the LocalDataTrack that we published to the room.
    const [localDataTrackPublication] = [...room!.localParticipant.dataTracks.values()];

    // Construct a message to send
    const fullMessage = 'global-mute-all';

    // Send the message
    localDataTrackPublication.track.send(fullMessage);
  };

  return (
    <Button onClick={handleMuteAll} startIcon={<MicOffIcon />}>
      Mute All
    </Button>
  );
}
