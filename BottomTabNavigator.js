import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import EditProfile from './screens/EditProfile';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
 return (
    <Tab.Navigator headerMode='none'>
      <Tab.Screen name="MainHome" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="EditProfile" component={EditProfile} />
    </Tab.Navigator>
 );
}

export default BottomTabNavigator;