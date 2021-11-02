import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';

const getParameterByName = (name: string) => {
  let url = window.location.href;

  name = name.replace(/[[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  let results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export function fetchToken(
  name: string,
  room: string,
  passcode: string,
  create_room = true,
  create_conversation = process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true'
) {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      user_identity: name,
      room_name: room,
      passcode,
      create_room,
      create_conversation,
    }),
  });
}

export function verifyPasscode(passcode: string) {
  return fetchToken('temp-name', 'temp-room', passcode, false /* create_room */, false /* create_conversation */).then(
    async res => {
      const jsonResponse = await res.json();
      if (res.status === 401) {
        return { isValid: false, error: jsonResponse.error?.message };
      }

      if (res.ok && jsonResponse.token) {
        return { isValid: true };
      }
    }
  );
}

export function getErrorMessage(message: string) {
  switch (message) {
    case 'passcode incorrect':
      return 'Passcode is incorrect';
    case 'passcode expired':
      return 'Passcode has expired';
    default:
      return message;
  }
}

export default function usePasscodeAuth() {
  const history = useHistory();

  const [user, setUser] = useState<{ displayName: undefined; photoURL: undefined; passcode: string } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const getToken = useCallback(
    (name: string, room: string) => {
      return fetchToken(name, room, user!.passcode)
        .then(async res => {
          if (res.ok) {
            return res;
          }
          const json = await res.json();
          const errorMessage = getErrorMessage(json.error?.message || res.statusText);
          throw Error(errorMessage);
        })
        .then(res => res.json());
    },
    [user]
  );

  const updateRecordingRules = useCallback(
    async (room_sid, rules) => {
      return fetch('/recordingrules', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_sid, rules, passcode: user?.passcode }),
        method: 'POST',
      }).then(async res => {
        const jsonResponse = await res.json();

        if (!res.ok) {
          const error = new Error(jsonResponse.error?.message || 'There was an error updating recording rules');
          error.code = jsonResponse.error?.code;

          return Promise.reject(error);
        }

        return jsonResponse;
      });
    },
    [user]
  );

  useEffect(() => {
    const passcode = getParameterByName('passcode') ?? window.sessionStorage.getItem('passcode');
    const attendeeId = getParameterByName('id') ?? window.sessionStorage.getItem('attendeeId');
    const roomName = getParameterByName('room') ?? window.sessionStorage.getItem('roomName');

    const attendeeIdString: string = attendeeId ?? '';
    const roomNameString: string = roomName ?? '';

    if (passcode) {
      verifyPasscode(passcode)
        .then(verification => {
          if (verification?.isValid) {
            setUser({ passcode } as any);
            window.sessionStorage.setItem('passcode', passcode);
            window.sessionStorage.setItem('attendeeId', attendeeIdString);
            window.sessionStorage.setItem('roomName', roomNameString);
            history.replace(window.location.pathname);
          }
        })
        .then(() => setIsAuthReady(true));
    } else {
      setIsAuthReady(true);
    }
  }, [history]);

  const signIn = useCallback((passcode: string) => {
    return verifyPasscode(passcode).then(verification => {
      if (verification?.isValid) {
        setUser({ passcode } as any);
        window.sessionStorage.setItem('passcode', passcode);
      } else {
        throw new Error(getErrorMessage(verification?.error));
      }
    });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    window.sessionStorage.removeItem('passcode');
    return Promise.resolve();
  }, []);

  return { user, isAuthReady, getToken, signIn, signOut, updateRecordingRules };
}
