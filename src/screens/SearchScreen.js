import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchMain from "../components/Search/SearchMain";

const SearchStack = createNativeStackNavigator();

const Search = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchMain"
        component={SearchMain}
        options={{ headerShown: false }}
      />
    </SearchStack.Navigator>
  );
};

export default Search;
