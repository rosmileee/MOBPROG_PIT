import { Tabs } from "expo-router";
import { LogBox } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; 

LogBox.ignoreAllLogs(true);

export default function TabLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor:"black", headerTintColor:"black"}}>
      <Tabs.Screen name="index" options={{headerShown:false,
         headerTitleAlign:"center", 
         headerLeft: () => <></>,
         tabBarIcon: ({ color, size }) => (
            <Icon name="lock-closed-outline" color={color} size={size} /> 
          ),
          }} />
      <Tabs.Screen name="register" options={{headerShown:false,
        headerTitleAlign:"center",
        tabBarIcon: ({ color, size }) => (
            <Icon name="key" color={color} size={size} /> 
          ),}}/>
      <Tabs.Screen name="homepage" options={{headerShown:false,
        headerTitleAlign:"center",
        tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} /> 
          ),}}/>

    </Tabs>
  );
}

