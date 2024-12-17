import { Text, View, StyleSheet, Button } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
    <Stack.Screen options={{title: "Unrestricted Access",
       headerLeft: ()=> <></>,
       headerTitleAlign:"center"}}/>
    <View style={styles.container}>
      <Link style={styles.link} href="/">Please Login First</Link>
      <Text style={styles.regtext}>Dont have an Account?<Link style={styles.reglink} href="/(tabs)/register">Register</Link></Text>
      
      </View>
    </>
  );
}

 const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  link:{
    color: "black",
    fontSize: 25,
    marginBottom:50
  },
  regtext:{
    fontSize:15
  },
  reglink:{
    fontSize:15,
    color: "blue"
  }
  

 })