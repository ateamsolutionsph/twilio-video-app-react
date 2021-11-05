import { useEffect } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';

import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';

export default function DataTrack({ track }: { track: IDataTrack }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  const listenMuteAllMessage = (message: string) => {
    if (message === 'global-mute-all') {
      toggleAudioEnabled();
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
