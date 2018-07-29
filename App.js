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
import Expo, {
  Asset, Audio, FileSystem, Font, Permissions,
} from 'expo';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isRecording: false,
      isLoading: false,
      soundsReady: false,
      isPlayingSound: false,
      fontLoaded: false,
      haveRecordingPermissions: false,
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
    return !this.state.fontLoaded ? (
      <View style={styles.emptyContainer} />
    ) : !this.state.haveRecordingPermissions ? (
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
      //
      //
      // This is the Main view
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
            <View>
              <View style={styles.playButton}>
                <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={[
                    {
                      opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
                    },
                  ]}
                  onPress={this._onPlayPausePressed}
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
                  onPress={this._onPlayPausePressed}
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
