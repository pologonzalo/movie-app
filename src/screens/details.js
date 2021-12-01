// In App.js in a new project

import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import _ from "lodash";
import axios from "axios";
import useStorage from "../hooks/use_storage";

import { API_KEY } from "../utils";

function DetailsScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { id } = params;

  const [movie, setMovie] = React.useState({});
  const [favoriteMovies, setFavoriteMovies, remove] = useStorage("favorite");
  const [discardedMovies, setDiscardedMovies] = useStorage("discarded");

  const onFavoritePressed = React.useCallback(() => {
    if (_.has(favoriteMovies, [id])) {
      return setFavoriteMovies(_.omit(favoriteMovies, id));
    }

    setFavoriteMovies({
      ...favoriteMovies,
      [movie.id]: {
        id: movie.id,
        poster: movie.smallPoster,
        title: movie.title,
        rating: movie.rating,
        plot: movie.plot,
      },
    });
  }, [movie.id, movie.smallPoster, movie.title, favoriteMovies]);

  const onDiscardPressed = React.useCallback(() => {
    if (_.has(favoriteMovies, [id])) {
      setFavoriteMovies(_.omit(favoriteMovies, id));
    }
    if (_.isNull(discardedMovies)) return setDiscardedMovies([id]);
    else setDiscardedMovies([...discardedMovies, id]);

    navigation.goBack();
  }, [
    discardedMovies,
    favoriteMovies,
    movie.id,
    movie.smallPoster,
    movie.title,
  ]);

  const fetchMovie = React.useCallback(async ({ id }) => {
    const { data } = await axios.get(
      `http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
    );

    setMovie({
      id: data.imdbID,
      title: data.Title,
      rating: data.imdbRating,
      year: data.Year,
      duration: data.Runtime,
      actors: data.Actors,
      genre: data.Genre,
      poster: _.replace(data.Poster, "SX300", "SX800"),
      smallPoster: data.Poster,
      plot: data.Plot,
    });
  }, []);

  React.useEffect(() => {
    fetchMovie({ id });
  }, [id, fetchMovie]);

  return (
    <View
      style={{ flex: 1, justifyContent: "space-between", marginBottom: 10 }}
    >
      <View style={{ flex: 19 }}>
        <Image
          style={{ width: "100%", height: "70%" }}
          source={{
            uri: movie.poster,
          }}
        />
        <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {movie.title}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={{ fontSize: 16 }}>Actors: </Text>
            <Text style={{ fontSize: 14 }}>{movie.actors}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 14 }}>Description:</Text>
            <Text style={{ fontSize: 12, fontWeight: "200" }}>
              {movie.plot}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "baseline",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Rating: </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {movie.rating}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 10,
            justifyContent: "center",
            marginHorizontal: 5,
          }}
          onPress={onDiscardPressed}
        >
          <Text style={{ fontSize: 20 }}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 10,
            justifyContent: "center",
            marginHorizontal: 5,
          }}
          onPress={onFavoritePressed}
        >
          <Text style={{ fontSize: 20 }}>
            {!_.isEmpty(favoriteMovies) && favoriteMovies[id]
              ? "Remove from Favorite"
              : "Mark as Favorite"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default DetailsScreen;
