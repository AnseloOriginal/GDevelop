// @flow

import * as React from 'react';

import PublicProfileDialog from './PublicProfileDialog';
import {
  type PrivateAssetPackListingData,
  type PrivateGameTemplateListingData,
} from '../Utils/GDevelopServices/Shop';

type PublicProfileCallbacks = {|
  onAssetPackOpen?: (
    privateAssetPackListingData: PrivateAssetPackListingData
  ) => void,
  onGameTemplateOpen?: (
    privateAssetPackListingData: PrivateGameTemplateListingData
  ) => void,
  onGameOpen?: (gameId: string) => void,
|};

export type PublicProfileState = {
  openUserPublicProfile: ({
    userId: string,
    callbacks?: PublicProfileCallbacks,
  }) => void,
};

const initialPublicProfileState = {
  openUserPublicProfile: () => {},
};

const PublicProfileContext = React.createContext<PublicProfileState>(
  initialPublicProfileState
);

export default PublicProfileContext;

type Props = {|
  children: React.Node,
|};

export const PublicProfileProvider = ({ children }: Props) => {
  const [
    visitedPublicProfileUserId,
    setVisitedPublicProfileUserId,
  ] = React.useState<?string>(null);
  const [
    profileCallbacks,
    setProfileCallbacks,
  ] = React.useState<?PublicProfileCallbacks>(null);

  const openUserPublicProfile = React.useCallback(
    ({
      userId,
      callbacks,
    }: {
      userId: string,
      callbacks?: PublicProfileCallbacks,
    }): void => {
      setVisitedPublicProfileUserId(userId);
      setProfileCallbacks(callbacks);
    },
    [setVisitedPublicProfileUserId]
  );

  const closeUserPublicProfile = React.useCallback(
    (): void => {
      setVisitedPublicProfileUserId(null);
      setProfileCallbacks(null);
    },
    [setVisitedPublicProfileUserId]
  );

  const publicProfileState: PublicProfileState = React.useMemo(
    () => ({
      openUserPublicProfile: openUserPublicProfile,
    }),
    [openUserPublicProfile]
  );

  const onAssetPackOpenCallback = profileCallbacks
    ? profileCallbacks.onAssetPackOpen
    : undefined;
  const onGameTemplateOpenCallback = profileCallbacks
    ? profileCallbacks.onGameTemplateOpen
    : undefined;
  const onGameOpenCallback = profileCallbacks
    ? profileCallbacks.onGameOpen
    : undefined;

  return (
    <React.Fragment>
      <PublicProfileContext.Provider value={publicProfileState}>
        {children}
      </PublicProfileContext.Provider>
      {visitedPublicProfileUserId && (
        <PublicProfileDialog
          userId={visitedPublicProfileUserId}
          onClose={closeUserPublicProfile}
          onAssetPackOpen={
            onAssetPackOpenCallback
              ? (privateAssetPackListingData: PrivateAssetPackListingData) => {
                  onAssetPackOpenCallback(privateAssetPackListingData);
                  // Assume that the dialog is awlays closed after the asset pack is opened.
                  closeUserPublicProfile();
                }
              : undefined
          }
          onGameTemplateOpen={
            onGameTemplateOpenCallback
              ? (
                  privateGameTemplateListingData: PrivateGameTemplateListingData
                ) => {
                  onGameTemplateOpenCallback(privateGameTemplateListingData);
                  // Assume that the dialog is awlays closed after the game template is opened.
                  closeUserPublicProfile();
                }
              : undefined
          }
          onGameOpen={
            onGameOpenCallback
              ? (gameId: string) => {
                  onGameOpenCallback(gameId);
                  // Assume that the dialog is awlays closed after the game is opened.
                  closeUserPublicProfile();
                }
              : undefined
          }
        />
      )}
    </React.Fragment>
  );
};
