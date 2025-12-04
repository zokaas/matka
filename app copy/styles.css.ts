// app copy/styles.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@ui/themes'; // Import from UI package now!

export const bodyStyles = style({
  backgroundColor: vars.background.color,
  backgroundImage: vars.background.image,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  fontFamily: vars.font.family,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.normal,
  color: vars.color.baseContent,
  margin: 0,
  padding: 0,
});

// You can remove the bodyStylesThemeClass export if it exists
// The theme class now comes from the theme itself