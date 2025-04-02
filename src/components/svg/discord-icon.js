import * as React from "react";
import { Svg, Path } from 'react-native-svg';

function Icon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      {...props}
    >
      <Path d="M20.992 20.163a2.884 2.884 0 01-2.695-3.03v.007a2.867 2.867 0 012.687-3.023h.008a2.852 2.852 0 012.695 3.031v-.008a2.859 2.859 0 01-2.688 3.022h-.008zm-9.966 0a2.884 2.884 0 01-2.695-3.03v.007a2.867 2.867 0 012.687-3.023h.008a2.852 2.852 0 012.695 3.031v-.008a2.867 2.867 0 01-2.687 3.023h-.008zM26.393 6.465c-1.763-.832-3.811-1.49-5.955-1.871l-.149-.022a.093.093 0 00-.098.045c-.234.411-.488.924-.717 1.45l-.043.111a23.042 23.042 0 00-6.985.016l.129-.017c-.27-.63-.528-1.142-.813-1.638l.041.077a.095.095 0 00-.083-.047l-.016.001h.001a24.594 24.594 0 00-6.256 1.957l.151-.064a.084.084 0 00-.04.034C2.706 10.538.998 15.566.998 20.993c0 .907.048 1.802.141 2.684l-.009-.11a.103.103 0 00.039.07 24.623 24.623 0 007.313 3.738l.176.048a.082.082 0 00.028.004c.032 0 .06-.015.077-.038a17.453 17.453 0 001.485-2.392l.047-.1a.096.096 0 00-.052-.132h-.001a16.266 16.266 0 01-2.417-1.157l.077.042a.096.096 0 01-.048-.083c0-.031.015-.059.038-.076.157-.118.315-.24.465-.364a.094.094 0 01.097-.013h-.001c2.208 1.061 4.8 1.681 7.536 1.681s5.329-.62 7.643-1.727l-.107.046a.094.094 0 01.099.012c.15.124.307.248.466.365a.098.098 0 01.038.077.097.097 0 01-.046.082c-.661.395-1.432.769-2.235 1.078l-.105.036a.097.097 0 00-.062.089c0 .016.004.031.011.044v-.001c.501.96 1.009 1.775 1.571 2.548l-.04-.057a.096.096 0 00.106.036h-.001c2.865-.892 5.358-2.182 7.566-3.832l-.065.047a.097.097 0 00.039-.069c.087-.784.136-1.694.136-2.615 0-5.415-1.712-10.43-4.623-14.534l.052.078a.078.078 0 00-.038-.036z"></Path>
    </Svg>
  );
}

export default Icon;
