import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, data: any[]) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
};

export const getData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data !== null ? JSON.parse(data) : [];
  } catch (error) {
    console.error(error);
  }
};

export const clearData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};

export const addInstance = async (key: string, instance: object) => {
  try {
    let existingInstances = await getData(key);
    if (!Array.isArray(existingInstances)) {
      existingInstances = [];
    }
    existingInstances.push(instance);
    await storeData(key, existingInstances);
  } catch (error) {
    console.error(error);
  }
};

export const removeInstance = async (key: string, instanceId: string) => {
  try {
    let existingInstances = await getData(key);
    if (!Array.isArray(existingInstances)) {
      existingInstances = [];
    }
    const updatedInstances = existingInstances.filter((instance: any) => instance.id !== instanceId);
    await storeData(key, updatedInstances);
  } catch (error) {
    console.error(error);
  }
};
