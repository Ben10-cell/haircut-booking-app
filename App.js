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
  initializeAuth,
  signInAnonymously,
} from 'firebase/auth';

// Firebase Firestore functions
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Import your Firebase configuration object directly
import { firebaseConfig } from './services/firebaseConfig';

import AppNavigator from './navigation/AppNavigator';
import { AuthContext } from './context/AuthContext';
import colors from '../haircut-booking-app/constants/colors';

let nativeReactNativeAsyncStorage = null;
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  try {
    // Attempt to load AsyncStorage for React Native persistence
    const AsyncStorageModule = require('@react-native-async-storage/async-storage');
    nativeReactNativeAsyncStorage = AsyncStorageModule.default;
    console.log('App.js: Native AsyncStorage module loaded.');
  } catch (e) {
    console.warn(
      'App.js: Could not load native AsyncStorage module (expected if not installed or on web):',
      e.message
    );
    nativeReactNativeAsyncStorage = null;
  }
}

export default function App() {
  const [authInstance, setAuthInstance] = useState(null);
  const [dbInstance, setDbInstance] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializationError, setInitializationError] = useState(null);

  // ─── Effect: Initialize Firebase App, Firestore, and Auth ─────────────────
  useEffect(() => {
    console.log('App.js: Starting Firebase initialization effect.');

    if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) {
      console.error(
        'App.js: firebaseConfig is missing or empty. Cannot initialize Firebase.'
      );
      setInitializationError('Firebase configuration is missing.');
      setLoading(false);
      return;
    }

    let app;
    let currentAuthInstance;
    let currentDbInstance;

    try {
      // 1. Initialize Firebase App
      app = initializeApp(firebaseConfig);
      console.log('App.js: Firebase app initialized.');

      // 2. Initialize Firestore
      currentDbInstance = getFirestore(app);
      setDbInstance(currentDbInstance);
      console.log('App.js: Firebase Firestore initialized.');

      // 3. Initialize Auth with proper persistence
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        if (nativeReactNativeAsyncStorage) {
          try {
            currentAuthInstance = initializeAuth(app, {
              persistence: getReactNativePersistence(nativeReactNativeAsyncStorage),
            });
            console.log(
              'App.js: Firebase Auth initialized with React Native AsyncStorage persistence.'
            );
          } catch (authError) {
            console.error(
              'App.js: Error initializing Firebase Auth with native persistence:',
              authError.message
            );
            // Fallback to in-memory Auth
            currentAuthInstance = getAuth(app);
            console.warn(
              'App.js: Falling back to in-memory persistence for Firebase Auth.'
            );
          }
        } else {
          console.warn(
            'App.js: AsyncStorage not available. Initializing Auth with default (in-memory) persistence.'
          );
          currentAuthInstance = getAuth(app);
        }
      } else {
        // Web platform
        currentAuthInstance = getAuth(app);
        setPersistence(currentAuthInstance, browserLocalPersistence)
          .then(() =>
            console.log(
              'App.js: Web Auth persistence set to browser local storage.'
            )
          )
          .catch((err) =>
            console.error('App.js: Error setting web auth persistence:', err)
          );
        console.log('App.js: Firebase Auth initialized for web.');
      }

      setAuthInstance(currentAuthInstance);
    } catch (error) {
      console.error(
        'App.js: Critical error during Firebase core initialization:',
        error.message
      );
      setInitializationError(`Initialization failed: ${error.message}`);
      setLoading(false);
    }
  }, []);

  // ─── Effect: Listen for Auth State Changes ────────────────────────────────
  useEffect(() => {
    if (initializationError) {
      setLoading(false);
      return;
    }

    if (authInstance && dbInstance) {
      console.log(
        'App.js: Auth and DB instances are ready. Setting up auth state listener.'
      );

      // Attempt anonymous or custom-token sign-in
      const signInInitialUser = async () => {
        // If you have a custom token from environment, you could sign in here.
        // Otherwise, fall back to anonymous sign-in:
        try {
          console.log('App.js: Attempting anonymous sign-in.');
          await signInAnonymously(authInstance);
          console.log('App.js: Signed in anonymously.');
        } catch (anonError) {
          console.error(
            'App.js: Anonymous sign-in failed:',
            anonError.message
          );
          setInitializationError(`Auth failed: ${anonError.message}`);
          setLoading(false);
        }
      };

      signInInitialUser();

      const unsubscribe = onAuthStateChanged(
        authInstance,
        async (firebaseUser) => {
          console.log(
            'App.js: onAuthStateChanged triggered. User:',
            firebaseUser ? firebaseUser.uid : null
          );
          setUser(firebaseUser);

          if (firebaseUser) {
            try {
              const userDocRef = doc(dbInstance, 'users', firebaseUser.uid);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                setUserRole(userDocSnap.data().role);
                console.log(
                  'App.js: Fetched user role:',
                  userDocSnap.data().role
                );
              } else {
                setUserRole(null);
                console.log(
                  'App.js: User document not found. No role set.'
                );
              }
            } catch (error) {
              console.error('App.js: Error fetching user role:', error);
              setUserRole(null);
            }
          } else {
            setUserRole(null);
          }

          setLoading(false);
        }
      );

      return () => {
        console.log('App.js: Cleaning up auth state listener.');
        unsubscribe();
      };
    } else if (!loading && !initializationError) {
      console.warn(
        'App.js: Auth or DB instance is null but no error. Setting loading to false.'
      );
      setInitializationError(
        'Firebase services are unavailable. App may not work correctly.'
      );
      setLoading(false);
    }
  }, [authInstance, dbInstance, initializationError]);

  // ─── Render Loading or Error States ─────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary || '#0000ff'}
        />
        <Text style={styles.loadingText}>Initializing Firebase…</Text>
      </View>
    );
  }

  if (initializationError && !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Initialization Error</Text>
        <Text style={styles.errorText}>{initializationError}</Text>
        <Text style={styles.errorText}>
          Please check your Firebase setup and restart the app.
        </Text>
      </View>
    );
  }

  // ─── Once everything is ready, provide AuthContext and render Navigator ───
  const authContextValue = {
    user,
    userRole,
    auth: authInstance,
    db: dbInstance,
    initializationError,
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
