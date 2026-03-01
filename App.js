import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screen Imports (in order of flow)
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import SportsSelectionScreen from './src/screens/SportsSelectionScreen';
import TeamSelectionScreen from './src/screens/TeamSelectionScreen';
import PlayerSelectionScreen from './src/screens/PlayerSelectionScreen';
import NotificationPermissionScreen from './src/screens/NotificationPermissionScreen';
import LocationPermissionScreen from './src/screens/LocationPermissionScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AppNavigator from './src/navigation/AppNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        {/* User's Requested Flow Order */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SportsSelection" component={SportsSelectionScreen} />
        <Stack.Screen name="TeamSelection" component={TeamSelectionScreen} />
        <Stack.Screen name="PlayerSelection" component={PlayerSelectionScreen} />
        <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
        <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        {/* Main App & Profile */}
        <Stack.Screen name="MainApp" component={AppNavigator} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}