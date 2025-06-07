// context/AuthContext.js
import React, { createContext, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'; // Import auth functions

// Create the AuthContext
export const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// You can also create an AuthProvider component here if you want to encapsulate
// the login/signup/logout functions directly within the provider,
// but for now, we'll expose the 'auth' and 'db' instances via context
// and implement the functions in the screens or dedicated service files.

/*
// Example of how AuthProvider might look if you encapsulate functions:
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app); // Assuming 'app' is accessible or passed
  const db = getFirestore(app); // Assuming 'app' is accessible or passed

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserRole(userDocSnap.data().role);
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Role will be set by onAuthStateChanged listener
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const signup = async (email, password, firstName, lastName, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      await setDoc(doc(db, 'users', newUser.uid), {
        userId: newUser.uid,
        email: newUser.email,
        firstName,
        lastName,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // If role is barber, create barber document too
      if (role === 'barber') {
        await setDoc(doc(db, 'barbers', newUser.uid), {
          userId: newUser.uid,
          bio: '', // Initial empty bio
          location: '',
          averageRating: 0,
          totalReviews: 0,
          servicesOffered: [],
          availability: {},
          portfolioImages: [],
          isAvailable: false,
          updatedAt: serverTimestamp(),
        });
      }
      // Role will be set by onAuthStateChanged listener
      return newUser;
    } catch (error) {
      console.error("Signup error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
*/
