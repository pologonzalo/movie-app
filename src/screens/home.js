// In App.js in a new project

import React from "react";
import {
  View,
  Text,
  FlatList,
  Keyboard,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import _ from "lodash";
import useStorage from "../hooks/use_storage";

import { API_KEY } from "../utils";

import { Input } from "react-native-elements";

const HomeScreen = () => {
  const navigation = useNavigation();

  const [
    favoriteMovies,
    setFavoriteMovies,
    removeMovies,
    updateFavoriteMovies,
  ] = useStorage("favorite");
  const [
    discardedMovies,
    setDiscardedMovies,
    removeDiscardedMovies,
    updateDiscardedMovies,
  ] = useStorage("discarded");

  const [inputValue, setInputValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [page, setPage] = React.useState(1);

  useFocusEffect(
    React.useCallback(() => {
      updateDiscardedMovies();
      updateFavoriteMovies();
      // removeDiscardedMovies();
      // removeMovies();
    }, [updateFavoriteMovies])
  );

  const searchMovies = React.useCallback(async () => {
    Keyboard.dismiss();
    const { data } = await axios.get(
      `http://www.omdbapi.com/?apikey=${API_KEY}&s=${inputValue}&type=movie&page=${page}`
    );

    const { Search } = data;

    setSearchResults((currentResults) =>
      page === 0 ? Search : [...currentResults, ...Search]
    );

    setPage((page) => page + 1);
  }, [inputValue, page, searchResults]);

  const resultsToShow = React.useMemo(() => {
    return _.compact(
      _.map(searchResults, (_movie) => {
        if (_.includes(discardedMovies, _movie.imdbID)) return null;

        return _movie;
      })
    );
  }, [discardedMovies, searchResults]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={{ flex: 6, margin: 10 }}>
        <Text style={{ fontSize: 30 }}>Favorite films</Text>
        <FlatList
          style={{ flex: 1 }}
          horizontal
          data={_.values(favoriteMovies)}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => {
            const { poster, title, plot, id, rating } = item;
            return (
              <TouchableOpacity
                style={{
                  marginHorizontal: 10,
                  width: 300,
                  height: 140,
                  borderWidth: 1,
                  borderColor: "blue",
                }}
                onPress={() =>
                  navigation.navigate("Details", {
                    id,
                  })
                }
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ width: 100, height: 140 }}
                    source={{
                      uri: poster,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{title}</Text>
                    <Text style={{ fontSize: 12 }}>{plot}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ fontSize: 16 }}>{rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={{ flex: 14, margin: 10 }}>
        <Text style={{ fontSize: 30 }}>Search new films</Text>

        <Input
          placeholder="Search a movie"
          onChangeText={setInputValue}
          value={inputValue}
          style={{ flex: 1 }}
          rightIcon={
            <Ionicons
              name="search"
              size={24}
              color="black"
              onPress={searchMovies}
            />
          }
        />
        <View
          style={{
            flex: 16,
          }}
        >
          <FlatList
            data={resultsToShow}
            onEndReached={searchMovies}
            renderItem={({ item }) => {
              const { Title, Poster, Year, imdbID } = item;
              return (
                <TouchableOpacity
                  key={imdbID}
                  style={{
                    borderWidth: 1,
                    borderColor: "black",
                    height: 50,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    marginBottom: 16,
                    paddingHorizontal: 6,
                  }}
                  onPress={() => {
                    navigation.navigate("Details", {
                      id: imdbID,
                    });
                  }}
                >
                  <Text>{Title}</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color="black"
                    onPress={() => {
                      navigation.navigate("Details", {
                        id: imdbID,
                      });
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
