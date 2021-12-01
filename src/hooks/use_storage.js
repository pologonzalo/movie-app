import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useStorage = (key) => {
  const [storageItem, setStorageItem] = React.useState(null);

  const updateStorage = React.useCallback(() => {
    getData();
  }, [getData]);

  const getData = React.useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      setStorageItem(jsonValue != null ? JSON.parse(jsonValue) : null);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  }, []);

  const saveStorageItem = React.useCallback(async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      setStorageItem(value);
    } catch (e) {
      // saving error
    }
    // return value;
  }, []);

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStorageItem(null);
    } catch (e) {
      // remove error
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return [storageItem, saveStorageItem, clearStorage, updateStorage];
};

export default useStorage;
