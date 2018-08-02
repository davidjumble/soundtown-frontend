import { StyleSheet, Dimensions } from "react-native";
const width = Dimensions.get("window").width;
const height = width * 3;

export default (styles = StyleSheet.create({
  background: {
    position: "relative",

    width: width,
    height: width * 3
  },
  absolute: {
    position: "absolute"
  },

  bigheads: {
    position: "relative",
    bottom: height / 6.5,
    width: width
  },

  playButton: {
    position: "absolute",
    left: width / 2,
    top: height / 2
  },

  reverbButton: {
    position: "absolute",
    width: width / 2.5,
    height: width / 2.5,
    left: width / 4.5,

    bottom: height / 3
  },

  recordsize: {
    position: "absolute",
    width: width / 2.5,
    height: width / 2.5,
    left: width / 3.4,
    top: height / 20
  },
  ing: {
    width: width / 4,
    height: width / 4,
    left: width / 1.4,
    top: height / 21
  },

  c3: {
    position: "absolute",
    left: width / 10.2,
    //top: height / 2.23,
    top: height / 2.22
  },

  d3: {
    position: "absolute",
    left: width / 6,
    top: height / 2.35
  },

  e3: {
    position: "absolute",
    left: width / 4.7,
    top: height / 2.5
  },

  f3: {
    position: "absolute",
    left: width / 3.3,
    top: height / 2.6
  },

  g3: {
    position: "absolute",
    left: width / 2.55,
    top: height / 2.75
  },

  a3: {
    position: "absolute",
    left: width / 1.98,
    top: height / 2.94
  },

  b3: {
    position: "absolute",
    left: width / 1.7,
    top: height / 3.1
  },

  c4: {
    position: "absolute",
    left: width / 1.47,
    top: height / 3.3
  },

  d4: {
    position: "absolute",
    left: width / 1.4,
    top: height / 3.57
  },

  e4: {
    position: "absolute",
    left: width / 1.3,
    top: height / 3.87
  },

  f4: {
    position: "absolute",
    left: width / 1.2,
    top: height / 4.23
  },

  g4: {
    position: "absolute",
    left: width / 1.15,
    top: height / 4.9
  },

  size: {
    width: width / 10,
    resizeMode: "contain"
  }
}));
