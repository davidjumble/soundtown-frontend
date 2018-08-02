import React, { Component } from "react";
import { View, ScrollView, ImageBackground } from "react-native";
import { Audio, Font, Permissions } from "expo";
import styles from "./styles";
import RecordButtons from "./components/record-buttons";
import Buttons from "./components/play-buttons";
import ReverbButton from "./components/reverb-button";
import Errors from "./components/reverb-button";
import { configureAudioMode } from "./utils";
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.toneSoundObjs = {};
    this.reverbSoundObjs = {};
    this.soundInstance = "";

    this.state = {
      reverbOn: false,
      isRecording: false,
      isLoading: false,
      soundsReady: false,
      fontLoaded: false,
      haveRecordingPermissions: false,
      //errors below
      noSounds: false,
      chillout: false,
      badResponse: false,
      recordingError: false
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
            updateReverbStatus={this.updateReverbStatus}
          />
          <Buttons
            toneSoundObjs={
              this.state.ReverbOn ? this.reverbSoundObjs : this.toneSoundObjs
            }
            isLoading={this.state.isLoading}
            canPlay={this.state.soundsReady}
          />
          <ReverbButton
            switchReverb={this.getReverbTones}
            reverbOn={this.state.reverbOn}
          />

          <Errors />
        </ImageBackground>
      </ScrollView>
    );
  }

  getPermission = () => {
    if (!this.state.haveRecordingPermissions) {
      Permissions.askAsync(Permissions.AUDIO_RECORDING).then(res => {
        this.setState({
          haveRecordingPermissions: res.status === "granted"
        });
      });
    }
  };

  updateIsLoading = bool => {
    this.setState({ isLoading: bool });
  };

  updateSoundsReady = bool => {
    this.setState({ soundsReady: bool });
  };

  updateReverbStatus = bool => {
    this.setState({
      reverbOn: bool
    });
  };

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
        this.soundInstance = convertedTones.a3.slice(59, 72);

        for (let tone in convertedTones) {
          this.toneSoundObjs[tone] = new Audio.Sound();
          this.toneSoundObjs[tone].loadAsync({ uri: convertedTones[tone] });
        }
        configureAudioMode("playback");
        this.setState({ isLoading: false, soundsReady: true });
      })
      .catch(err => {
        console.log(err.message, "this is the error");
        if (err.message === "Cannot load an empty url") {
          this.setState(
            {
              loadingErr: true
            },
            () => console.log(this.state.loadingErr)
          );
        }
      });
  };

  getReverbTones = () => {
    if (this.state.reverbOn) {
      this.setState({
        reverbOn: false
      });
    } else if (Object.keys(this.reverbSoundObjs).length) {
      this.setState({
        reverbOn: true
      });
    } else {
      this.setState({
        soundsReady: false,
        isLoading: true
      });
      console.log(this.soundInstance, "this is the sound instance");
      axios
        .get(
          `https://soundtown-dev.herokuapp.com/api/reverb?instance=${
            this.soundInstance
          }`
        )
        .then(({ reverbedTones }) => {
          for (let tone in reverbedTones) {
            this.reverbSoundObjs[tone] = new Audio.Sound();
            this.reverbSoundObjs[tone].loadAsync({ uri: convertedTones[tone] });
          }
          configureAudioMode("playback");
          this.setState({
            isLoading: false,
            soundsReady: true,
            reverbOn: true
          });
        })
        .catch(err => {
          console.log(err.message, "this is the error");
          if (err.message === "Cannot load an empty url") {
            this.setState(
              {
                loadingErr: true
              },
              () => console.log(this.state.loadingErr)
            );
          }
        });
    }
  };
}

export default App;
