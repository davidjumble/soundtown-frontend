import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  ImageBackground
} from "react-native";
import { Audio, Font, Permissions } from "expo";
import styles from "./styles";
import RecordButtons from "./components/record-buttons";
import Buttons from "./components/play-buttons";
import { configureAudioMode} from './utils'

class App extends Component {
  constructor() {
    super();
    this.toneSoundObjs = {};

    this.state = {
      isRecording: false,
      isLoading: false,
      soundsReady: false,
      fontLoaded: false,
      haveRecordingPermissions: false
    };
  }

  componentDidMount() {
    (async () => {
      await Font.loadAsync({
        "cutive-mono-regular": require("./assets/fonts/CutiveMono-Regular.ttf")
      });
      this.setState({ fontLoaded: true });
    })();
    this.getPermission();
  }

  render() {
    return !this.state.fontLoaded ? (
      <View style={styles.emptyContainer} />
    ) : (
      <ScrollView>
        <ImageBackground
          source={require("./images/soundtown25cm.jpg")}
          style={styles.background}
          resizeMode="contain"
        >
          <RecordButtons
            isLoading={this.state.isLoading}
            updateIsLoading={this.updateIsLoading}
            updateSoundsReady={this.updateSoundsReady}
            getTones={this.getTones}
          />
          <Buttons
            toneSoundObjs={this.toneSoundObjs}
            isLoading={this.state.isLoading}
            canPlay={this.state.soundsReady}
          />
        </ImageBackground>
      </ScrollView>
    );
  }

  getPermission = () => {
    if (!this.state.haveRecordingPermissions) {
      Permissions.askAsync(Permissions.AUDIO_RECORDING)
      .then(res => {
        this.setState({
          haveRecordingPermissions: res.status === "granted"
        });
      });
    }
  };

  updateIsLoading = (bool) => {
    this.setState({isLoading: bool})
  }

  updateSoundsReady = (bool) => {
    this.setState({soundsReady: bool})
  }

  getTones = uri => {
    const fileType = "caf";
    const formData = new FormData();

    formData.append("file", {
      uri,
      name: `recording.${fileType}`,
      type: `audio/x-${fileType}`
    });

    const options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    fetch("https://soundtown-dev.herokuapp.com/api/sample", options)
      .then(res => res.json())
      .then(({ convertedTones }) => {
        console.log(convertedTones);
        for (let tone in convertedTones) {
          this.toneSoundObjs[tone] = new Audio.Sound();
          this.toneSoundObjs[tone].loadAsync({ uri: convertedTones[tone] });
        }
        configureAudioMode('playback');
        this.setState({ isLoading: false, soundsReady: true });
      });
  };
}

export default App;
