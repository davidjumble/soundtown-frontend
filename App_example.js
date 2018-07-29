/**
 * @flow
 */

import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  ImageBackground
} from "react-native";
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from "expo";

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_RECORD_BUTTON = new Icon(
  require("./assets/images/record_button.png"),
  70,
  119
);

const ICON_PLAY_BUTTON = new Icon(
  require("./assets/images/play_button.png"),
  34,
  51
);

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFF8ED";

const DISABLED_OPACITY = 0.5;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.soundURI = null;
    this.newsound = null;

    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      //final states
      isRecording: false,
      isLoading: false,
      soundsReady: false,
      isPlayingSound: false,
      //old states
      haveRecordingPermissions: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      fontLoaded: false,

      volume: 1.0,
      rate: 1.0
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
    );
    // // UNCOMMENT THIS TO TEST maxFileSize:
    // this.recordingSettings.android['maxFileSize'] = 12000;
  }

  componentDidMount() {
    (async () => {
      await Font.loadAsync({
        "cutive-mono-regular": require("./assets/fonts/CutiveMono-Regular.ttf")
      });
      this.setState({ fontLoaded: true });
    })();
    this._askForPermissions();
  }

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === "granted"
    });
  };

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true
    });
    //clears current sound file if there is one
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    //audio settings
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });
    //clears current recording file
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    //new instance of a recording class
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    //sets a function to be called regularly with the status of the recording
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    //startAsync starts the recording
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    //
    //won't move on to set state as false until recording done
    //then stop recording and enable playback is called
    this.setState({
      isLoading: false
    });
    console.log("recording");
  }

  async downloadNewSounds() {
    await FileSystem.downloadAsync(
      "https://s3.eu-west-2.amazonaws.com/soundtown.pitched.audio/C3.mp3",
      FileSystem.documentDirectory + "C3.mp3"
    )
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
        this.soundURI = uri;
        console.log("dddddddddddd", this.soundURI);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true
    });
    try {
      //this stops the recording
      //also setRecordingStatusUpdate calls updateScreenForRecordingStatus one last Time
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    let uri = await this.recording.getURI();

    //UNCOMMENT THIS OUT ONCE WE ARE READY TO SEND FILES EVERY TIMER

    //await this.uploadAudioAsync(uri);
    // sound will upload and then it will save new sounds using
    await this.downloadNewSounds();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });

    //leaving this in as a way of testing that a recording has been made
    const { sound, status } = await this.recording.createNewLoadedSound(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;

    await Audio.setIsEnabledAsync(true);
    const newsound = new Audio.Sound();
    //could also do loadAsync straight from s3 bucket link
    //need to rearrange so that sound is loaded as this.sound before play
    await newsound.loadAsync({
      uri: this.soundURI
    });
    this.newsound = newsound;

    this.setState({
      isLoading: false
    });
  }

  _updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,

        isPlaybackAllowed: true
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _updateScreenForRecordingStatus = status => {
    //conditional that keeps track of whether recording is a happening in state
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording
      });
    }
    //changes state once recording status is finished
    else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  async uploadAudioAsync(uri) {
    //console.log("Uploading " + uri);e
    let apiUrl = "https://soundtown-dev.herokuapp.com";
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    formData.append("file", {
      uri,
      name: `recording.${fileType}`,
      type: `audio/x-${fileType}`
    });

    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    console.log("POSTing " + uri + " to " + apiUrl);

    return fetch(apiUrl, options);
    //.then(console.log);
  }

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    // if (this.sound != null) {
    //   if (this.state.isPlaying) {
    //     this.sound.pauseAsync();
    //   } else {
    //     this.sound.playAsync();
    //   }
    // }
    this.newsound.replayAsync();

    console.log("playing");
  };

  render() {
    return !this.state.fontLoaded ? (
      <View style={styles.emptyContainer} />
    ) : !this.state.haveRecordingPermissions ? (
      <View style={styles.container}>
        <View />
        <Text
          style={[
            styles.noPermissionsText,
            { fontFamily: "cutive-mono-regular" }
          ]}
        >
          You must enable audio recording permissions in order to use this app.
        </Text>
        <View />
      </View>
    ) : (
      //
      //
      // This is the Main view
      <ScrollView>
        <ImageBackground
          source={require("./images/soundtown-one.jpg")}
          style={styles.background}
        >
          <View style={styles.container}>
            <View />

            <View />
            <View style={styles.recordingContainer}>
              <View />
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={[
                  {
                    opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
                  }
                ]}
                onPress={this._onRecordPressed}
                disabled={this.state.isLoading}
              >
                <Image
                  style={styles.image}
                  source={ICON_RECORD_BUTTON.module}
                />
              </TouchableHighlight>
              <View style={styles.recordingDataContainer}>
                <View />
                <Text
                  style={[
                    styles.liveText,
                    { fontFamily: "cutive-mono-regular" }
                  ]}
                >
                  {this.state.isRecording ? "LIVE" : ""}
                </Text>

                <View />
              </View>
              <View />
            </View>
            <View />

            <View>
              <View style={styles.playButton}>
                <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={[
                    {
                      opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
                    }
                  ]}
                  onPress={this._onPlayPausePressed}
                  disabled={
                    !this.state.isPlaybackAllowed || this.state.isLoading
                  }
                >
                  <Image
                    style={styles.image}
                    source={ICON_PLAY_BUTTON.module}
                  />
                </TouchableHighlight>
              </View>
            </View>

            <View>
              <View style={styles.playButton}>
                <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={[
                    {
                      opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
                    }
                  ]}
                  onPress={this._onPlayPausePressed}
                  disabled={
                    !this.state.isPlaybackAllowed || this.state.isLoading
                  }
                >
                  <Image
                    style={styles.image}
                    source={ICON_PLAY_BUTTON.module}
                  />
                </TouchableHighlight>
              </View>
            </View>

            <View />
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    maxWidth: "100%",
    height: "100%",
    resizeMode: "cover"
  },

  container: {
    flex: 1,
    maxWidth: "95%",
    height: 1000,
    resizeMode: "cover"
  },
  playbutton: {}
});

Expo.registerRootComponent(App);
