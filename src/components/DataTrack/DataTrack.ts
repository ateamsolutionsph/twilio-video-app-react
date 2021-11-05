import { useEffect } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';

import { useLocalAudioMuteAll } from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';

export default function DataTrack({ track }: { track: IDataTrack }) {
  const [toggleAudioMuteAll] = useLocalAudioMuteAll();

  const listenMuteAllMessage = (message: string) => {
    if (message === 'global-mute-all') {
      toggleAudioMuteAll();
    }
  };

  useEffect(() => {
    const handleMessage = (message: string) => listenMuteAllMessage(message);
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track]);

  return null; // This component does not return any HTML, so we will return 'null' instead.
}
