// @flow
import * as React from 'react';
import GamesPlatformFrame, {
  GAMES_PLATFORM_IFRAME_ID,
} from './GamesPlatformFrame';
import AuthenticatedUserContext from '../../../../Profile/AuthenticatedUserContext';
import { generateCustomAuthToken } from '../../../../Utils/GDevelopServices/User';
import PublicProfileContext from '../../../../Profile/PublicProfileContext';

const TIMEOUT_TO_UNLOAD_IFRAME_IN_MS = 10000;

type GamesPlatformFrameState = {|
  startTimeoutToUnloadIframe: () => void,
  loadIframeOrRemoveTimeout: () => void,
  iframeLoaded: boolean,
  iframeVisible: boolean,
|};

export const GamesPlatformFrameContext = React.createContext<GamesPlatformFrameState>(
  {
    startTimeoutToUnloadIframe: () => {},
    loadIframeOrRemoveTimeout: () => {},
    iframeLoaded: false,
    iframeVisible: false,
  }
);

type GamesPlatformFrameStateProviderProps = {|
  children: React.Node,
|};

const GamesPlatformFrameStateProvider = ({
  children,
}: GamesPlatformFrameStateProviderProps) => {
  const [loadIframeInDOM, setLoadIframeInDOM] = React.useState(false);
  const [iframeVisible, setIframeVisible] = React.useState(false);
  const [iframeHeight, setIframeHeight] = React.useState(0);
  const timeoutToUnloadIframe = React.useRef<?TimeoutID>(null);
  const { openUserPublicProfile } = React.useContext(PublicProfileContext);

  const { profile, getAuthorizationHeader } = React.useContext(
    AuthenticatedUserContext
  );
  const userId = profile ? profile.id : null;

  const startTimeoutToUnloadIframe = React.useCallback(() => {
    // The iframe becomes invisible right away,
    // but we wait a bit before unloading it, so that navigating to another
    // page doesn't cause the iframe to be reloaded.
    setIframeVisible(false);
    timeoutToUnloadIframe.current = setTimeout(() => {
      setLoadIframeInDOM(false);
      setIframeHeight(0);
    }, TIMEOUT_TO_UNLOAD_IFRAME_IN_MS);
  }, []);

  const loadIframeOrRemoveTimeout = React.useCallback(() => {
    if (timeoutToUnloadIframe.current) {
      clearTimeout(timeoutToUnloadIframe.current);
      timeoutToUnloadIframe.current = null;
    }

    // The iframe is loaded on the same page as where it's displayed,
    // so we assume it's visible right away.
    setLoadIframeInDOM(true);
    setIframeVisible(true);
  }, []);

  const handleIframeMessage = React.useCallback(
    (event: any) => {
      if (
        event.origin !== 'https://gd.games' &&
        event.origin !== 'http://localhost:4000'
      ) {
        return;
      }
      if (event.data.id === 'set-embedded-height') {
        setIframeHeight(event.data.height);
      }
      if (event.data.id === 'openUserProfile') {
        openUserPublicProfile(event.data.userId);
      }
    },
    [openUserPublicProfile]
  );

  React.useEffect(
    () => {
      window.addEventListener('message', handleIframeMessage);

      return () => {
        window.removeEventListener('message', handleIframeMessage);
      };
    },
    [handleIframeMessage]
  );

  const iframeLoaded = React.useMemo(() => loadIframeInDOM && !!iframeHeight, [
    loadIframeInDOM,
    iframeHeight,
  ]);

  const sendTokenToIframeIfConnected = React.useCallback(
    async () => {
      if (iframeLoaded && userId) {
        // The iframe is loaded and the user is authenticated, so we can
        // send that information to the iframe to automatically log the user in.
        // $FlowFixMe - we know it's an iframe.
        const iframe: ?HTMLIFrameElement = document.getElementById(
          GAMES_PLATFORM_IFRAME_ID
        );
        if (iframe && iframe.contentWindow) {
          try {
            const userCustomToken = await generateCustomAuthToken(
              getAuthorizationHeader,
              userId
            );
            iframe.contentWindow.postMessage(
              {
                id: 'authenticated-user-custom-token',
                token: userCustomToken,
              },
              // Specify the target origin to avoid leaking the customToken.
              // Replace with '*' to test locally.
              // 'https://gd.games'
              '*'
            );
          } catch (error) {
            console.error(
              'Error while generating custom token. User will not be logged in in the frame.',
              error
            );
            return;
          }
        }
      }
    },
    [iframeLoaded, userId, getAuthorizationHeader]
  );

  React.useEffect(
    () => {
      sendTokenToIframeIfConnected();
    },
    [sendTokenToIframeIfConnected]
  );

  const gamesPlatformFrameState = React.useMemo(
    () => ({
      startTimeoutToUnloadIframe,
      loadIframeOrRemoveTimeout,
      iframeLoaded,
      iframeVisible,
    }),
    [
      startTimeoutToUnloadIframe,
      loadIframeOrRemoveTimeout,
      iframeLoaded,
      iframeVisible,
    ]
  );

  return (
    <GamesPlatformFrameContext.Provider value={gamesPlatformFrameState}>
      {loadIframeInDOM && <GamesPlatformFrame />}
      {children}
    </GamesPlatformFrameContext.Provider>
  );
};

export default GamesPlatformFrameStateProvider;
