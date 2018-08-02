import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";

import styles from "../styles";

const ReverbButton = ({ noSounds, chillout, badResponse, recordingError }) => {
  if (noSounds) {
    return (
      <TouchableWithoutFeedback>
        <Image source={require("../images/errors/NOMORESOUNDS.PNG")} />
      </TouchableWithoutFeedback>
    );
  }

  if (chillout) {
    return (
      <TouchableWithoutFeedback>
        <Image source={require("../images/errors/NOMORESOUNDS.PNG")} />
      </TouchableWithoutFeedback>
    );
  }

  if (badResponse) {
    return (
      <TouchableWithoutFeedback>
        <Image source={require("../images/errors/NOMORESOUNDS.PNG")} />
      </TouchableWithoutFeedback>
    );
  }

  if (recordingError) {
    return (
      <TouchableWithoutFeedback>
        <Image source={require("../images/errors/NOMORESOUNDS.PNG")} />
      </TouchableWithoutFeedback>
    );
  }
};

export default ReverbButton;
