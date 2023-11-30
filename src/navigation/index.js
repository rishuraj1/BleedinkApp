import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import {
  Createpostscreen,
  Homescreen,
  Loginscreen,
  Signupscreen,
  Userscreen,
  Welcomescreen,
} from "../screens";
import { View } from "react-native";
import Postscreen from "../screens/Postscreen";
import { heightPercentageToDP } from "react-native-responsive-screen";

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
      backgroundColor: "#ffffff",
      borderTopColor: "#ffffff",
      height: heightPercentageToDP("7%"),
    },
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={Homescreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo
                name="home"
                size={heightPercentageToDP("4%")}
                color={focused ? "#3F51B5" : "#748c94"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Createpost"
        component={Createpostscreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="ios-create"
                size={heightPercentageToDP("4%")}
                color={focused ? "#3F51B5" : "#748c94"}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={Welcomescreen} />
        <Stack.Screen name="Home" component={TabNavigation} />
        <Stack.Screen name="Login" component={Loginscreen} />
        <Stack.Screen name="Signup" component={Signupscreen} />
        <Stack.Screen
          name="Profile"
          component={Userscreen}
          options={({ route }) => ({
            title: route?.params?.username,
            animation: "slide_from_right",
            headerShown: true,
            headerTitleAlign: "center",
            headerTintColor: "#3F51B5",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
        <Stack.Screen
          name="Post"
          component={Postscreen}
          options={({ route }) => ({
            title: route?.params?.header.slice(0, 20) + "...",
            animation: "slide_from_right",
            headerShown: true,
            headerTitleAlign: "center",
            headerTintColor: "#3F51B5",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
