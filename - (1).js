import React, { Component } from 'react';
import { AppRegistry, View, Image, StyleSheet, Alert ,ScrollView, Text, Button , TouchableHighlight} from 'react-native';

const styles = StyleSheet.create({
  background: {
  width: 380,
  height: 1000
  //resizeMode: cover
  //width: null
  },
})

export default class DisplayAnImageWithStyle extends Component {
  render() {
    return (
    
     <ScrollView>
      <View>
        <Image
          style={styles.background}
          source={require('./images/soundtown-one.jpg')}
        />
       </View>

      <View style={{flex: 1, position: 'absolute' }}>
    
        <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} >
         <Button 
        style={styles.button}
        onPress={() => {
        Alert.alert('You tapped E!');
      }}
      title="E"
/>
      </View>

    <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} >
        <Button 
        style={styles.button}
        onPress={() => {
        Alert.alert('You tapped F!');
      }}
      title="F"
/>
    </View>

 <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} >
        <Button 
        style={styles.button}
        onPress={() => {
        Alert.alert('You tapped G!');
      }}
      title="G"
/>
   </View>

<View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} >
      <Button 
      style={styles.button}
      onPress={() => {
      Alert.alert('You tapped A!');
      }}
      title="A"
/>
   </View>


 <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} >
       <Button 
       style={styles.button}
       onPress={() => {
       Alert.alert('You tapped B!');
      }}
      title="B"
/>
   </View>

 <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} >
       <Button 
       style={styles.button}
       onPress={() => {
       Alert.alert('You tapped C!');
      }}
      title="C"
/>
   </View>


<View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} >
      <Button 
      style={styles.button}
      onPress={() => {
      Alert.alert('You tapped D!');
      }}
      title="D"
/>
  </View>

</View>
      </ScrollView>
      
      
    );
    
  }
} 
