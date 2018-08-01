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
  // recordButton: {
  //   position: "absolute",
  //   left: width / 3.5,
  //   top: 1
  // },

  recordsize: {
    position: "absolute",
    width: width / 2.5,
    height: width / 2.5,
    left: width / 3.4,
    top: height / 20
  },
  ing: {
    width: width / 2.5
  },
  c3: {
    position: "absolute",
    left: width / 10,
    //top: height / 2.23
    top: height / 2.23
  },

  d3: {
    position: "absolute",
    left: width / 4,
    top: height / 2.3
  },

  e3: {
    position: "absolute",
    left: width / 3,
    top: height / 2.5
  },

  f3: {
    position: "absolute",
    left: width / 2.5,
    top: height / 2.6
  },

  g3: {
    position: "absolute",
    left: width / 2.1,
    top: height / 2.8
  },

  a3: {
    position: "absolute",
    left: width / 1.8,
    top: height / 3
  },

  b3: {
    position: "absolute",
    left: width / 1.6,
    top: height / 3.2
  },

  c4: {
    position: "absolute",
    left: width / 1.4,
    top: height / 3.3
  },

  d4: {
    position: "absolute",
    left: width / 1.2,
    top: height / 3.5
  },

  e4: {
    position: "absolute",
    left: width / 1.2,
    top: height / 3.7
  },

  f4: {
    position: "absolute",
    left: width / 1.2,
    top: height / 4.3
  },

  g4: {
    position: "absolute",
    left: width / 1.2,
    top: height / 5
  },

  size: {
    width: width / 10,
    resizeMode: "contain"
  }
}));
