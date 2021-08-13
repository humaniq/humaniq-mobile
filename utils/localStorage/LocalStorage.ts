import AsyncStorage from "@react-native-async-storage/async-storage";


export class LocalStorage {
  /**
   * Loads a string from localStorage.
   *
   * @param key The key to fetch.
   */
  async loadString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      // not sure why this would fail... even reading the RN docs I'm unclear
      return null;
    }
  }
  
  /**
   * Saves a string to localStorage.
   *
   * @param key The key to fetch.
   * @param value The value to store.
   */
  async saveString(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Loads something from localStorage and runs it thru JSON.parse.
   *
   * @param key The key to fetch.
   */
  async load(key: string): Promise<any | null> {
    try {
      const almostThere = await AsyncStorage.getItem(key);
      return JSON.parse(almostThere);
    } catch {
      return null;
    }
  }
  
  /**
   * Saves an object to localStorage.
   *
   * @param key The key to fetch.
   * @param value The value to store.
   */
  async save(key: string, value: any): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Removes something from localStorage.
   *
   * @param key The key to kill.
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
    }
  }
  
  /**
   * Burn it all to the ground.
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {
    }
  }
}

export const localStorage = new LocalStorage();

/**
 * Loads a string from localStorage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null;
  }
}

/**
 * Saves a string to localStorage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from localStorage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export async function load(key: string): Promise<any | null> {
  try {
    const almostThere = await AsyncStorage.getItem(key);
    return JSON.parse(almostThere);
  } catch {
    return null;
  }
}

/**
 * Saves an object to localStorage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function save(key: string, value: any): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes something from localStorage.
 *
 * @param key The key to kill.
 */
export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
  }
}

/**
 * Burn it all to the ground.
 */
export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch {
  }
}
