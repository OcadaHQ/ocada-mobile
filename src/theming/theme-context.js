import React from 'react';

export const ThemeContext = React.createContext({
  theme: 'light',  // default theme
  toggleTheme: () => {},
  configureTheme: (themeName) => {}
});
