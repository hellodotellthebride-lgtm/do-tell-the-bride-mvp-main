import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GuestNestProvider } from './GuestNestProvider';

import GuestNestDashboardScreen from './screens/GuestNestDashboardScreen';
import GuestListScreen from './screens/GuestListScreen';
import AddGuestScreen from './screens/AddGuestScreen';
import EditGuestScreen from './screens/EditGuestScreen';
import BulkAddGuestsScreen from './screens/BulkAddGuestsScreen';
import SeatingPlanScreen from './screens/SeatingPlanScreen';
import MealTrackingScreen from './screens/MealTrackingScreen';
import GuestNestSettingsScreen from './screens/GuestNestSettingsScreen';
import MealOptionsScreen from './screens/MealOptionsScreen';
import AddMealOptionScreen from './screens/AddMealOptionScreen';
import EditMealOptionScreen from './screens/EditMealOptionScreen';
import GuestGroupsScreen from './screens/GuestGroupsScreen';
import AddGuestGroupScreen from './screens/AddGuestGroupScreen';

const Stack = createNativeStackNavigator();

export default function GuestNestNavigator() {
  return (
    <GuestNestProvider>
      <Stack.Navigator initialRouteName="GuestNestDashboard" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GuestNestDashboard" component={GuestNestDashboardScreen} />
        <Stack.Screen name="GuestList" component={GuestListScreen} />
        <Stack.Screen name="AddGuest" component={AddGuestScreen} />
        <Stack.Screen name="EditGuest" component={EditGuestScreen} />
        <Stack.Screen name="BulkAddGuests" component={BulkAddGuestsScreen} />
        <Stack.Screen name="SeatingPlan" component={SeatingPlanScreen} />
        <Stack.Screen name="MealTracking" component={MealTrackingScreen} />
        <Stack.Screen name="GuestNestSettings" component={GuestNestSettingsScreen} />
        <Stack.Screen name="MealOptions" component={MealOptionsScreen} />
        <Stack.Screen name="AddMealOption" component={AddMealOptionScreen} />
        <Stack.Screen name="EditMealOption" component={EditMealOptionScreen} />
        <Stack.Screen name="GuestGroups" component={GuestGroupsScreen} />
        <Stack.Screen name="AddGuestGroup" component={AddGuestGroupScreen} />
      </Stack.Navigator>
    </GuestNestProvider>
  );
}
