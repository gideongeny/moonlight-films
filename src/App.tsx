import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';

import Protected from "./components/Common/Protected";
import Auth from "./pages/Auth";
import Bookmarked from "./pages/Bookmarked";
import Copyright from "./pages/Copyright";
import Error from "./pages/Error";
import Explore from "./pages/Explore";
import History from "./pages/History";
import Home from "./pages/Home";
import MovieInfo from "./pages/Movie/MovieInfo";
import MovieWatch from "./pages/Movie/MovieWatch";
import SportsHome from "./pages/Sports/SportsHome";
import SportsWatch from "./pages/Sports/SportsWatch";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import TVInfo from "./pages/TV/TVInfo";
import TVWatch from "./pages/TV/TVWatch";
import { auth, db } from "./shared/firebase";
import { useAppDispatch } from "./store/hooks";
import { setCurrentUser } from "./store/slice/authSlice";
import { useLocalStorage } from "@uidotdev/usehooks";

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [isSignedIn, setIsSignedIn] = useLocalStorage("isSignedIn", false);

  useEffect(() => {
    let unSubDoc: (() => void) | undefined;
    
    // This listener automatically restores the user session when the app loads
    // Firebase Auth persistence ensures the user stays logged in across app restarts
    const unSubAuth: () => void = onAuthStateChanged(
      auth,
      (user) => {
        try {
          if (!user) {
            dispatch(setCurrentUser(null));
            setIsSignedIn(false);
            return;
          }

          // User is authenticated - restore their session
          setIsSignedIn(true);

          if (user.providerData && user.providerData.length > 0) {
            const providerId = user.providerData[0].providerId;
            
            if (providerId === "google.com") {
              unSubDoc = onSnapshot(
                doc(db, "users", user.uid),
                (docSnapshot) => {
                  try {
                    dispatch(
                      setCurrentUser({
                        displayName:
                          docSnapshot.data()?.lastName + " " + docSnapshot.data()?.firstName || "",
                        email: user.email || "",
                        emailVerified: user.emailVerified,
                        photoURL: docSnapshot.data()?.photoUrl || "",
                        uid: user.uid,
                      })
                    );
                  } catch (error) {
                    console.error("Error setting user data (Google):", error);
                  }
                },
                (error) => {
                  console.error("Firestore snapshot error (Google):", error);
                }
              );
            } else if (providerId === "facebook.com") {
              unSubDoc = onSnapshot(
                doc(db, "users", user.uid),
                (docSnapshot) => {
                  try {
                    dispatch(
                      setCurrentUser({
                        displayName:
                          docSnapshot.data()?.lastName + " " + docSnapshot.data()?.firstName || "",
                        email: user.email || "",
                        emailVerified: user.emailVerified,
                        photoURL: docSnapshot.data()?.photoUrl || "",
                        uid: user.uid,
                      })
                    );
                  } catch (error) {
                    console.error("Error setting user data (Facebook):", error);
                  }
                },
                (error) => {
                  console.error("Firestore snapshot error (Facebook):", error);
                }
              );
            } else {
              unSubDoc = onSnapshot(
                doc(db, "users", user.uid),
                (docSnapshot) => {
                  try {
                    dispatch(
                      setCurrentUser({
                        displayName:
                          docSnapshot.data()?.lastName + " " + docSnapshot.data()?.firstName || "",
                        photoURL: docSnapshot.data()?.photoUrl || "",
                        email: user.email || "",
                        emailVerified: user.emailVerified,
                        uid: user.uid,
                      })
                    );
                  } catch (error) {
                    console.error("Error setting user data (Other):", error);
                  }
                },
                (error) => {
                  console.error("Firestore snapshot error (Other):", error);
                }
              );
            }
          } else {
            // Fallback for users without provider data
            unSubDoc = onSnapshot(
              doc(db, "users", user.uid),
              (docSnapshot) => {
                try {
                  dispatch(
                    setCurrentUser({
                      displayName: user.displayName || "",
                      photoURL: user.photoURL || "",
                      email: user.email || "",
                      emailVerified: user.emailVerified,
                      uid: user.uid,
                    })
                  );
                } catch (error) {
                  console.error("Error setting user data (Fallback):", error);
                }
              },
              (error) => {
                console.error("Firestore snapshot error (Fallback):", error);
              }
            );
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
        }
      },
      (error) => {
        console.error("Auth state change error:", error);
        // Don't crash the app on auth errors
        dispatch(setCurrentUser(null));
        setIsSignedIn(false);
      }
    );

    return () => {
      try {
        unSubAuth();
        if (unSubDoc) {
          unSubDoc();
        }
      } catch (error) {
        console.error("Error cleaning up auth listeners:", error);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname, location.search]);

  return (
    <>
      <Analytics />
      <Routes>
        <Route index element={<Home />} />
        <Route path="movie/:id" element={<MovieInfo />} />
        <Route path="tv/:id" element={<TVInfo />} />
        <Route path="movie/:id/watch" element={<MovieWatch />} />
        <Route path="tv/:id/watch" element={<TVWatch />} />
        <Route path="sports" element={<SportsHome />} />
        <Route
          path="sports/:leagueId/:matchId/watch"
          element={<SportsWatch />}
        />
        <Route path="explore" element={<Explore />} />
        <Route path="search" element={<Search />} />
        <Route path="auth" element={<Auth />} />
        <Route path="copyright" element={<Copyright />} />
        <Route
          path="bookmarked"
          element={
            <Protected isSignedIn={isSignedIn}>
              <Bookmarked />
            </Protected>
          }
        />
        <Route
          path="history"
          element={
            <Protected isSignedIn={isSignedIn}>
              <History />
            </Protected>
          }
        />
        <Route
          path="profile"
          element={
            <Protected isSignedIn={isSignedIn}>
              <Profile />
            </Protected>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
