import React from "react";
import { Image, TouchableWithoutFeedback, View } from "react-native";
import { debounce } from "lodash";
import { Audio } from "expo";
import { configureAudioMode } from "../utils";
import styles from "../styles";

class RecordButtons extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;

    this.state = {
      isRecording: false
    };
  }

  render() {
    return (
      <View style={styles.absolute}>
        <TouchableWithoutFeedback
          onPressIn={this.onRecordPressed}
          onPressOut={this.onRecordPressed}
        >
          <Image
            style={styles.recordsize}
            source={
              this.props.isLoading
                ? require("../images/buttons/record-buttons/loading.png")
                : require("../images/buttons/record-buttons/record.png")
            }
          />
        </TouchableWithoutFeedback>
        <Image
          style={styles.ing}
          source={
            this.state.isRecording
              ? require("../images/buttons/record-buttons/ing.png")
              : null
          }
        />
      </View>
    );
  }

  onRecordPressed = () => {
    if (!this.state.isRecording) {
      configureAudioMode("record");
      this.recording = new Audio.Recording();
      this.recording
        .prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
        .then(() => {
          this.recording.startAsync();
          this.setState({ isRecording: true });
          this.props.updateSoundsReady(false);
          this.props.updateReverbStatus(false);
        })
        .catch(console.log);
    } else {
      this.recording
        .stopAndUnloadAsync()
        .then(() => {
          this.setState({ isRecording: false });
          this.props.updateIsLoading(true);
          const uri = this.recording.getURI();
          this.props.getTones(uri);
        })
        .catch(console.log);
    }
  };
}

export default RecordButtons;
