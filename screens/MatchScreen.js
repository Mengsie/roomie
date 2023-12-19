import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';

const MatchScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;

  const handleSendMessage = () => {
    // Navigate to the Chat screen or perform any other action
    navigation.navigate('Chat', { otherUserProfile: userSwiped });
  };

  return (
    <View>
      <Text>You and {userSwiped.name} have liked each other</Text>
      <TouchableOpacity onPress={()=> {
        navigation.goBack();
        navigation.navigate("Chat")

      }}>
        <Text>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchScreen;
