import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  Asset,
  Audio,
  FileSystem,
  Font,
  Permissions,
} from 'expo';

class App extends Component {
  constructor() {
    super();
    this.recording = null;

    this.state = {
      isRecording: false,
      isLoading: false,
      soundsReady: false,
      isPlayingSound: false,
      fontLoaded: false,
      haveRecordingPermissions: false,
      toneSoundObjs: {},
    };

  }

  componentDidMount() {
    (async () => {
      await Font.loadAsync({
        'cutive-mono-regular': require('./assets/fonts/CutiveMono-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });
    })();
    this.askForPermissions();
  }

  render() {
    return !this.state.fontLoaded ? 
    ( 
    <View style={styles.emptyContainer} />
    ) : !this.state.haveRecordingPermissions ? 
    (
      <View style={styles.container}>
        <View />
        <Text
          style={[
            styles.noPermissionsText,
            { fontFamily: 'cutive-mono-regular' },
          ]}
        >
          You must enable audio recording permissions in order to use this app.
          </Text>
        <View />
      </View>
    ) : (
          <ScrollView>
            <ImageBackground
              source={require('./images/soundtown-one.jpg')}
              style={styles.background}
            >
              <View style={styles.container}>
                <View style={styles.recordingContainer}>
                  <TouchableHighlight
                    underlayColor={BACKGROUND_COLOR}
                    style={[
                      {
                        opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
                      },
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
                    <Text
                      style={[
                        styles.liveText,
                        { fontFamily: 'cutive-mono-regular' },
                      ]}
                    >
                      {this.state.isRecording ? 'LIVE' : ''}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <View style={styles.playButton}>
                  <TouchableHighlight
                    underlayColor={BACKGROUND_COLOR}
                    style={[
                      {
                        opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
                      },
                    ]}
                    onPress={() => this.playSound('c3')}
                    disabled={
                      !this.state.soundsReady || this.state.isLoading
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
                        opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
                      },
                    ]}
                    onPress={() => this.playSound('c4')}
                    disabled={
                      !this.state.soundsReady || this.state.isLoading
                    }
                  >
                    <Image
                      style={styles.image}
                      source={ICON_PLAY_BUTTON.module}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </ImageBackground>
          </ScrollView>
    );
         
  }

  askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === "granted"
    });
  };


  getTones = (uri) => {
    const fileType = 'caf';
    const formData = new FormData();

    formData.append('file', {
      uri,
      name: `recording.${fileType}`,
      type: `audio/x-${fileType}`,
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
      .then(({convertedTones}) => {
        console.log(convertedTones);
        const toneSoundObjs = {};
        for (let tone in convertedTones) {
          const newTone = new Audio.Sound();
          newTone.loadAsync({uri: convertedTones[tone]});
          toneSoundObjs[tone] = newTone;
        }
        this.setState({toneSoundObjs, isLoading: false, soundsReady: true});
      });
  }

  playSound = (tone) => {
    this.state.toneSoundObjs[tone].replayAsync();
  }
  
  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isRecording: true
    });
    //clears current sound file if there is one
    const tones = this.state.toneSoundObjs;
    for (let tone in tones) {
      if (tones[tone] !== null) {
        await tones[tone].unloadAsync();
        //may not work
        tones[tone].setOnPlaybackStatusUpdate(null);
        tones[tone] = {};
      }
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

    const recordingSettings = JSON.parse(
      JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
    );

    //new instance of a recording class
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(recordingSettings);
    //sets a function to be called regularly with the status of the recording
    // recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    //startAsync starts the recording
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    //
    //won't move on to set state as false until recording done
    //then stop recording and enable playback is called

    console.log("recording");
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
      isRecording: false
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


    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });

    //leaving this in as a way of testing that a recording has been made

    this.setState({
      isLoading: true
    });
    this.getTones(uri)

  }
}

//Moved all styling related code here

const styles = StyleSheet.create({
  background: {
    flex: 1,
    maxWidth: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  container: {
    flex: 1,
    maxWidth: '95%',
    height: 1000,
    resizeMode: 'cover',
  },
  playbutton: {},
});

const BACKGROUND_COLOR = "#FFF8ED";
const DISABLED_OPACITY = 0.5;

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

export default App;
