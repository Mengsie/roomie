import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatScreen from './screens/ChatScreen';
import BottomTabNavigator from './BottomTabNavigator';
import MatchScreen from './screens/MatchScreen';
import MessageScreen from './screens/MessageScreen';
import LandingPage from './screens/Startside';
import Signup from './screens/Signup';
import Login from './screens/Login';

import Name from './screens/profileScreens/Name';
import Age from './screens/profileScreens/Age';
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
    <Stack.Navigator>
      <>
      <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }}  />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="EditProfile" component={EditProfile} />
        
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Name" component={Name} />
        <Stack.Screen name="Pic" component={Pic} />
        <Stack.Screen name="Age" component={Age} />
        <Stack.Screen name="Leje" component={Leje} />
        <Stack.Screen name="Besk" component={Besk} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="Gender" component={Gender} />
        <Stack.Screen name="Inter" component={Inter} />
        <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="MatchScreen" component={MatchScreen}  options={{ presentation: 'transparent' }} />
        <Stack.Screen name="ChatScreen" component={BottomTabNavigator} />
        <Stack.Screen name="Message" component={MessageScreen} />
      </>
    </Stack.Navigator>
  );
};

export default StackNavigator;
