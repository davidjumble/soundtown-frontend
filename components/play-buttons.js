import React from "react";

import { Image, TouchableOpacity, View } from "react-native";

import styles from "../styles";
import { Audio } from "expo";

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sounds = this.props.toneSoundObjs;
    return (
      <View style={styles.absolute}>
        <TouchableOpacity
          style={styles.c3}
          onPress={this.props.canPlay ? () => sounds.c3.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/c3.png`)
                : require("../images/buttons/blank-buttons/c3blank.png")
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.d3}
          onPress={this.props.canPlay ? () => sounds.d3.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/d3.png`)
                : require("../images/buttons/blank-buttons/d3blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.e3}
          onPress={this.props.canPlay ? () => sounds.e3.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/e3.png`)
                : require("../images/buttons/blank-buttons/e3blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.f3}
          onPress={this.props.canPlay ? () => sounds.f3.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/f3.png`)
                : require("../images/buttons/blank-buttons/f3blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.g3}
          onPress={this.props.canPlay ? () => sounds.g3.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/g3.png`)
                : require("../images/buttons/blank-buttons/g3blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.a3}
          onPress={this.props.canPlay ? () => sounds.a3.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/a3.png`)
                : require("../images/buttons/blank-buttons/a3blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.b3}
          onPress={this.props.canPlay ? () => sounds.b3.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/b3.png`)
                : require("../images/buttons/blank-buttons/b3blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.c4}
          onPress={this.props.canPlay ? () => sounds.c4.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/c4.png`)
                : require("../images/buttons/blank-buttons/c4blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.d4}
          onPress={this.props.canPlay ? () => sounds.d4.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/d4.png`)
                : require("../images/buttons/blank-buttons/d4blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.e4}
          onPress={this.props.canPlay ? () => sounds.e4.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/e4.png`)
                : require("../images/buttons/blank-buttons/e4blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.f4}
          onPress={this.props.canPlay ? () => sounds.f4.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/f4.png`)
                : require("../images/buttons/blank-buttons/f4blank.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.g4}
          onPress={this.props.canPlay ? () => sounds.g4.replayAsync() : null}
        >
          >
          <Image
            style={styles.size}
            source={
              this.props.canPlay
                ? require(`../images/buttons/note-buttons/g4.png`)
                : require("../images/buttons/blank-buttons/g4blank.png")
            }
          />
        </TouchableOpacity>
      </View>
    );
  }
}
