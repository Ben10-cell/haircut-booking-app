// App.js
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Platform, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Firebase Core App
import { initializeApp } from 'firebase/app';

// Firebase Auth functions
import {
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  setPersistence,
  browserLocalPersistence,
  getReactNativePersistence,
  initializeAuth, // <-- Import initializeAuth
  signInAnonymously // <-- Import signInAnonymously
} from 'firebase/auth';

// Firebase Firestore functions
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Import the base Firebase configuration object (fallback)
import { firebaseConfig as fallbackFirebaseConfig } from './services/firebaseConfig'; // Assuming you have this file

import AppNavigator from './navigation/AppNavigator';
import { AuthContext } from './context/AuthContext';
import colors from './constants/colors'; // Assuming you have this file

// --- Platform-specific Firebase Auth Persistence Imports ---
let nativeReactNativeAsyncStorage;
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  try {
    const AsyncStorageModule = require('@react-native-async-storage/async-storage');
    nativeReactNativeAsyncStorage = AsyncStorageModule.default;
    console.log("App.js: Native AsyncStorage module loaded.");
  } catch (e) {
    console.warn("App.js: Could not load native AsyncStorage module (this is expected on web or if not installed):", e.message);
    nativeReactNativeAsyncStorage = null; // Ensure it's null if loading fails
  }
}

export default function App() {
  const [authInstance, setAuthInstance] = useState(null);
  const [dbInstance, setDbInstance] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializationError, setInitializationError] = useState(null);

  // Effect to initialize Firebase app, auth, and db instances
  useEffect(() => {
    console.log("App.js: Starting Firebase initialization effect.");
    let app;
    let currentDbInstance;
    let currentAuthInstance;

    try {
      let configToUse;
      if (typeof __firebase_config === 'string' && __firebase_config.trim() !== '') {
        try {
          configToUse = JSON.parse(__firebase_config);
          console.log("App.js: Using __firebase_config (parsed).");
        } catch (e) {
          console.error("App.js: Failed to parse __firebase_config. Using fallback configuration.", e);
          configToUse = fallbackFirebaseConfig;
        }
      } else {
        console.log("App.js: __firebase_config not found or empty. Using fallback configuration.");
        configToUse = fallbackFirebaseConfig;
      }

      if (!configToUse || Object.keys(configToUse).length === 0) {
        console.error("App.js: Firebase configuration is missing or empty. Cannot initialize Firebase.");
        setInitializationError("Firebase configuration is missing. Please check your setup.");
        setLoading(false);
        return;
      }
      
      app = initializeApp(configToUse);
      console.log("App.js: Firebase app initialized.");

      currentDbInstance = getFirestore(app);
      setDbInstance(currentDbInstance);
      console.log("App.js: Firebase Firestore initialized.");

      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        if (nativeReactNativeAsyncStorage) {
          try {
            // Initialize Auth directly with persistence for React Native
            currentAuthInstance = initializeAuth(app, {
              persistence: getReactNativePersistence(nativeReactNativeAsyncStorage)
            });
            console.log("App.js: Firebase Auth initialized with React Native AsyncStorage persistence.");
          } catch (authError) {
            console.error("App.js: Error initializing Firebase Auth with native persistence:", authError.message, authError.code);
            // Fallback: Try getAuth for in-memory if initializeAuth with persistence fails
            try {
              currentAuthInstance = getAuth(app);
              console.warn("App.js: Firebase Auth falling back to in-memory persistence after native persistence error.");
            } catch (fallbackError) {
               console.error("App.js: Firebase Auth fallback (getAuth) also failed:", fallbackError.message);
               currentAuthInstance = null;
            }
          }
        } else {
          console.warn("App.js: AsyncStorage not available for React Native. Initializing Firebase Auth with default (in-memory) persistence.");
          try {
            currentAuthInstance = getAuth(app); // Default in-memory
          } catch (authError) {
            console.error("App.js: Error initializing Firebase Auth (no AsyncStorage available):", authError.message);
            currentAuthInstance = null;
          }
        }
      } else { // Web platform
        try {
          currentAuthInstance = getAuth(app);
          // Set web persistence (async, but we don't need to wait for setAuthInstance)
          setPersistence(currentAuthInstance, browserLocalPersistence)
            .then(() => console.log("App.js: Firebase Auth persistence set to browser local storage."))
            .catch((err) => console.error("App.js: Error setting web auth persistence:", err.message));
          console.log("App.js: Firebase Auth initialized for web.");
        } catch (authError) {
           console.error("App.js: Error initializing Firebase Auth for web:", authError.message);
           currentAuthInstance = null;
        }
      }
      setAuthInstance(currentAuthInstance);

      if (!currentAuthInstance || !currentDbInstance) {
        console.error("App.js: Critical Firebase instances (Auth or DB) failed to initialize properly.");
        setInitializationError("Failed to initialize Firebase services. App may not function correctly.");
        // setLoading(false) will be handled by the auth state listener or if it never runs.
      }

    } catch (error) {
      console.error("App.js: Critical error during Firebase core initialization (app/db):", error.message, error.code, error);
      setInitializationError(`Firebase initialization failed: ${error.message}`);
      setAuthInstance(null);
      setDbInstance(null);
      setLoading(false); // Stop loading on critical failure
    }
  }, []); // Run once on component mount

  // Effect to handle authentication state changes and initial token sign-in
  useEffect(() => {
    if (initializationError) { // If there was a critical error in the first useEffect
        setLoading(false);
        return;
    }

    if (authInstance && dbInstance) {
      console.log("App.js: Auth and DB instances are ready. Setting up auth state listener and attempting initial sign-in.");

      const signInInitialUser = async () => {
        if (typeof __initial_auth_token === 'string' && __initial_auth_token.trim() !== '') {
          try {
            console.log("App.js: Attempting to sign in with __initial_auth_token.");
            await signInWithCustomToken(authInstance, __initial_auth_token);
            console.log('App.js: Signed in with initial auth token provided by environment.');
          } catch (error) {
            console.warn('App.js: Failed to sign in with initial auth token:', error.message, '. Attempting anonymous sign-in.');
            try {
              await signInAnonymously(authInstance);
              console.log('App.js: Signed in anonymously after custom token failure.');
            } catch (anonError) {
              console.error('App.js: Anonymous sign-in also failed after custom token failure:', anonError.message);
              setInitializationError(`Authentication failed: ${anonError.message}`); // Set error state
              setLoading(false); // Stop loading if all sign-in attempts fail
            }
          }
        } else {
          console.log("App.js: No __initial_auth_token provided. Attempting anonymous sign-in.");
          try {
            await signInAnonymously(authInstance);
            console.log('App.js: Signed in anonymously.');
          } catch (anonError) {
            console.error('App.js: Anonymous sign-in failed:', anonError.message);
            setInitializationError(`Authentication failed: ${anonError.message}`); // Set error state
            setLoading(false); // Stop loading if anonymous sign-in fails
          }
        }
      };

      signInInitialUser(); // Attempt sign-in

      const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
        console.log("App.js: onAuthStateChanged triggered. User:", firebaseUser ? firebaseUser.uid : null);
        setUser(firebaseUser);
        if (firebaseUser) {
          const userDocRef = doc(dbInstance, 'users', firebaseUser.uid); // Ensure 'users' is your correct collection name
          try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              setUserRole(userDocSnap.data().role); // Ensure 'role' is the correct field name
              console.log("App.js: User role fetched:", userDocSnap.data().role);
            } else {
              setUserRole(null);
              console.log("App.js: User document does not exist, no role set.");
            }
          } catch (error) {
            console.error("App.js: Error fetching user role:", error);
            setUserRole(null);
          }
        } else {
          setUserRole(null);
        }
        setLoading(false); // Auth check complete, stop loading
      });

      return () => {
        console.log("App.js: Cleaning up auth state listener.");
        unsubscribe();
      };
    } else if (!loading && !initializationError) {
        // If instances are null after first effect AND we are not already in an error state from first effect
        console.warn("App.js: Auth or DB instance is null, but no initial loading active. This might indicate an issue. Setting loading to false.");
        setInitializationError("Firebase services not available. App functionality may be limited.");
        setLoading(false);
    }
  }, [authInstance, dbInstance, initializationError]); // Re-run if instances change or init error occurs

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary || '#0000ff'} />
        <Text style={styles.loadingText}>Initializing Firebase...</Text>
      </View>
    );
  }

  if (initializationError && !user) { // Show error if initialization failed and no user session could be established
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Initialization Error</Text>
        <Text style={styles.errorText}>{initializationError}</Text>
        <Text style={styles.errorText}>Please check the console for more details and ensure your Firebase setup is correct.</Text>
      </View>
    );
  }


  const authContextValue = {
    user,
    userRole,
    // loading, // loading is now more for the app's own loading state, not passed directly if AppNavigator handles its own
    auth: authInstance,
    db: dbInstance,
    initializationError // Pass error to context if needed
  };

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={authContextValue}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background || '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    color: colors.text || '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background || '#ffffff',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  errorText: {
    textAlign: 'center',
    color: colors.textSecondary || '#333333',
    marginBottom: 5,
  },
});
