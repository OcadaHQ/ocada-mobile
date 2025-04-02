import * as React from 'react';
import View from 'react-native-ui-lib/view';
import { Colors } from  'react-native-ui-lib/style';

import SocialButton from './social-button.component';

import DiscordLogo from './svg/discord-icon'
import XLogo from './svg/x-icon'
import TelegramLogo from './svg/telegram-icon'

import { 
  X_URL, DISCORD_URL, TELEGRAM_URL
} from '../constants';

const SocialButtonsRow = () => (
<View row center style={{
  justifyContent: 'space-evenly',
  flex: 1,
  width: '100%'
}}>
  
  <SocialButton
    targetId={'TELEGRAM'}
    bgColor={'#fff'}
    imgSrc={() => <TelegramLogo width={32} height={32} />}
    url={TELEGRAM_URL}
  />
  
  <SocialButton
    targetId={'X'}
    bgColor={Colors.black}
    imgSrc={() => <XLogo width={20} height={20} fill={Colors.white} stroke={Colors.white} />}
    url={X_URL}
  />

  {/* <SocialButton
    targetId={'DISCORD'}
    bgColor={'#5865F2'}
    imgSrc={() => <DiscordLogo width={20} height={20} fill={Colors.white} />}
    url={DISCORD_URL}
  /> */}

</View>
)

export default SocialButtonsRow;