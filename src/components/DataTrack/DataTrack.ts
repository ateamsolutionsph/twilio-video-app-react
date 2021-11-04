import { useEffect } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';

export default function DataTrack({ track }: { track: IDataTrack }) {
  useEffect(() => {
    const handleMessage = (message: string) => console.log(message);
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track, console.log]);

  return null; // This component does not return any HTML, so we will return 'null' instead.
}
