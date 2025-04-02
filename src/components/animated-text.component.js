import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { TextInput } from "react-native";
Animated.addWhitelistedNativeProps({ text: true });

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

const AnimatedText = ( { text, style } ) => {
    
    const animatedProps = useAnimatedProps(() => {
      return {
        text: text.value,
      }
    });

    return (
      <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        value={text.value}
        style={style}
        {...{ animatedProps }}
      />
    );
  };
  
  export default AnimatedText;