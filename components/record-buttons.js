import React from "react";

import { Image, TouchableOpacity, View } from "react-native";

import styles from "../styles";

export default class RecordButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.absolute}>
        <TouchableOpacity onPress={this.props._onRecordPressed}>
          <Image
            style={styles.recordsize}
            source={
              this.props.isLoading
                ? require("../images/buttons/record-buttons/loading.png")
                : require("../images/buttons/record-buttons/record.png")
            }
          />
        </TouchableOpacity>
        <Image
          style={styles.ing}
          source={
            this.props.isRecording
              ? require(`../images/buttons/record-buttons/ing.png`)
              : null
          }
        />
      </View>
    );
  }
}
