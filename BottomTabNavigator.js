import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import EditProfile from './screens/EditProfile';

//til home escreen edit og chat screen 
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      headerMode='none'
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#deb887', 
        },
      }}
    >
      <Tab.Screen name="Match" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Edit Profile" component={EditProfile} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
