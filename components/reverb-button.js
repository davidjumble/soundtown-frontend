import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";

import styles from "../styles";

const ReverbButton = ({ switchReverb, reverbOn }) => {
  return (
    <TouchableWithoutFeedback onPress={switchReverb}>
      <Image
        style={styles.reverbButton}
        source={
          reverbOn
            ? require("../images/buttons/reverb-buttons/reverbOff.png")
            : require("../images/buttons/reverb-buttons/reverbOn.png")
        }
      />
    </TouchableWithoutFeedback>
  );
};

export default ReverbButton;
