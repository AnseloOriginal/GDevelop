// @flow
import * as React from 'react';
import { isMacLike } from '../Utils/Platform';
import useForceUpdate from '../Utils/UseForceUpdate';
import { useWindowControlsOverlayWatcher } from '../Utils/Window';
import optionalRequire from '../Utils/OptionalRequire';

const electron = optionalRequire('electron');

const DRAGGABLE_PART_CLASS_NAME = 'title-bar-draggable-part';

const titleBarStyles = {
  leftSideArea: {
    alignSelf: 'stretch',
    flexShrink: 0,
  },
  rightSideArea: { alignSelf: 'stretch', flex: 1 },
};

export const TitleBarLeftSafeMargins = ({
  backgroundColor,
}: {|
  backgroundColor?: string,
|}) => {
  // An installed PWA can have window controls displayed as overlay. If supported,
  // we set up a listener to detect any change and force a refresh that will read
  // the latest size of the controls.
  const forceUpdate = useForceUpdate();
  useWindowControlsOverlayWatcher({ onChanged: forceUpdate });

  // macOS displays the "traffic lights" on the left.
  const isDesktopMacos = !!electron && isMacLike();
  let leftSideOffset = isDesktopMacos ? 76 : 0;

  // An installed PWA can have window controls displayed as overlay,
  // which we measure here to set the offsets.
  // $FlowFixMe - this API is not handled by Flow.
  const { windowControlsOverlay } = navigator;
  if (windowControlsOverlay) {
    if (windowControlsOverlay.visible) {
      const { x } = windowControlsOverlay.getTitlebarAreaRect();
      leftSideOffset = x;
    }
  }

  if (leftSideOffset) {
    return (
      <div
        className={DRAGGABLE_PART_CLASS_NAME}
        style={{
          ...titleBarStyles.leftSideArea,
          width: leftSideOffset,
          backgroundColor: backgroundColor || 'transparent',
        }}
      />
    );
  }

  // Not on the desktop app, and not in an installed PWA with window controls displayed
  // as overlay: no need to display a spacing.
  return null;
};

export const TitleBarRightSafeMargins = ({
  backgroundColor,
}: {|
  backgroundColor?: string,
|}) => {
  // An installed PWA can have window controls displayed as overlay. If supported,
  // we set up a listener to detect any change and force a refresh that will read
  // the latest size of the controls.
  const forceUpdate = useForceUpdate();
  useWindowControlsOverlayWatcher({ onChanged: forceUpdate });

  const isDesktopWindowsOrLinux = !!electron && !isMacLike();
  // Windows and Linux have their "window controls" on the right
  let rightSideOffset = isDesktopWindowsOrLinux ? 150 : 0;

  // An installed PWA can have window controls displayed as overlay,
  // which we measure here to set the offsets.
  // $FlowFixMe - this API is not handled by Flow.
  const { windowControlsOverlay } = navigator;
  if (windowControlsOverlay) {
    if (windowControlsOverlay.visible) {
      const { x, width } = windowControlsOverlay.getTitlebarAreaRect();
      rightSideOffset = window.innerWidth - x - width;
    }
  }

  const rightSideAdditionalOffsetToGiveSpaceToDrag = 30;

  if (rightSideOffset) {
    return (
      <div
        className={DRAGGABLE_PART_CLASS_NAME}
        style={{
          ...titleBarStyles.rightSideArea,
          minWidth:
            rightSideOffset + rightSideAdditionalOffsetToGiveSpaceToDrag,
          backgroundColor: backgroundColor || 'transparent',
        }}
      />
    );
  }

  // Not on the desktop app, and not in an installed PWA with window controls displayed
  // as overlay: no need to display a spacing.
  return null;
};
