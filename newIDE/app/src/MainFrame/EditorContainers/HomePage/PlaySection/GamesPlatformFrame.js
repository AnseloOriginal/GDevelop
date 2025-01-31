// @flow
import * as React from 'react';
import GDevelopThemeContext from '../../../../UI/Theme/GDevelopThemeContext';
import { useResponsiveWindowSize } from '../../../../UI/Responsive/ResponsiveWindowMeasurer';
import {
  homepageDesktopMenuBarWidth,
  homepageMediumMenuBarWidth,
} from '../HomePageMenuBar';
import { SECTION_DESKTOP_SPACING } from '../SectionContainer';
import Paper from '../../../../UI/Paper';

export const GAMES_PLATFORM_IFRAME_ID = 'games-platform-frame';

const styles = {
  paper: {
    position: 'absolute',
  },
  iframe: {
    border: 0,
    height: `calc(100% - 4px)`,
    width: '100%',
  },
};

const GamesPlatformFrame = () => {
  const gdevelopTheme = React.useContext(GDevelopThemeContext);
  const paletteType = gdevelopTheme.palette.type;
  const { isMobile, isMediumScreen } = useResponsiveWindowSize();

  const top =
    37 + // tabs title bar
    40 + // toolbar
    SECTION_DESKTOP_SPACING;

  const left = isMobile
    ? 0
    : isMediumScreen
    ? homepageMediumMenuBarWidth + SECTION_DESKTOP_SPACING
    : homepageDesktopMenuBarWidth + SECTION_DESKTOP_SPACING;
  const width = isMobile
    ? '100%'
    : isMediumScreen
    ? `calc(100% - ${homepageMediumMenuBarWidth +
        2 * SECTION_DESKTOP_SPACING}px`
    : `calc(100% - ${homepageDesktopMenuBarWidth +
        2 * SECTION_DESKTOP_SPACING}px`;
  const height = `calc(100% - ${top}px)`;

  // We wrap the iframe in a paper, as its content has a transparent background,
  // and we don't want what's behing the iframe to be visible.
  return (
    <Paper
      background="dark"
      style={{ ...styles.paper, width, height, left, top }}
    >
      <iframe
        id={GAMES_PLATFORM_IFRAME_ID}
        // src={`https://gd.games/embedded/${paletteType}`}
        src={`http://localhost:4000/embedded/${paletteType}`}
        // src={`http://localhost:4000/embedded/riffel/switcheddestiny`}
        // src={`http://localhost:4000?embedded=true&theme=${paletteType}`}
        title="gdgames"
        style={styles.iframe}
      />
    </Paper>
  );
};

export default GamesPlatformFrame;
