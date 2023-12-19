
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabNavigator from './BottomTabNavigator';
import MatchScreen from './screens/MatchScreen';
import MessageScreen from './screens/MessageScreen';
import LandingPage from './screens/Startside';
import Signup from './screens/Signup';
import Name from './screens/profileScreens/Name';
import Age from './screens/profileScreens/Age';
import Login from './screens/Login';

import Besk from './screens/profileScreens/Besk';
import Info from './screens/profileScreens/Info';
import Pic from './screens/profileScreens/Pic';
import EditProfile from './screens/EditProfile';
import Gender from './screens/profileScreens/Gender';
import Inter from './screens/profileScreens/Inter';
import Leje from './screens/profileScreens/Leje';


const Stack = createNativeStackNavigator();



const StackNavigator = () => {

 return (
      <Stack.Navigator >
          <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="Signup" component={Signup} />
            
        <Stack.Screen name="Name" component={Name} />
        <Stack.Screen name="Pic" component={Pic} />
        <Stack.Screen name="Age" component={Age} />
        <Stack.Screen name="Leje" component={Leje} />
        <Stack.Screen name="Besk" component={Besk} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="Gender" component={Gender} />
        <Stack.Screen name="Inter" component={Inter} />
          <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }}/>
          <Stack.Screen name="Match" component={MatchScreen} options={{ presentation: 'transparent' }} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />
          </>
      </Stack.Navigator>

 );
}





export default StackNavigator;
