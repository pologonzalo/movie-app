// In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import _ from "lodash";
import Toast from "react-native-toast-message";
import { useNetInfo } from "@react-native-community/netinfo";

import HomeScreen from "./src/screens/home";
import DetailsScreen from "./src/screens/details";

const Stack = createNativeStackNavigator();

const App = () => {
  const { isConnected } = useNetInfo();

  React.useEffect(() => {
    if (!isConnected)
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "No internet connection",
      });
  }, [isConnected]);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default App;
