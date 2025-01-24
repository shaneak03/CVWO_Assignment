import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase";

type UserState = {
  isLoggedIn: boolean;
  userId: string | null;
  logout: () => void;
};

const UserContext = createContext<UserState>({
  isLoggedIn: false,
  userId: null,
  logout: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userState, setUserState] = useState<UserState>({
    isLoggedIn: false,
    userId: null,
    logout: () => {
      supabase.auth.signOut().then(() => {
        setUserState((prevState) => ({
          ...prevState,
          isLoggedIn: false,
          userId: null,
        }));
      });
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        console.error("No session found");
        setUserState((prevState) => ({
          ...prevState,
          isLoggedIn: false,
          userId: null,
        }));
      } else {
        setUserState((prevState) => ({
          ...prevState,
          isLoggedIn: true,
          userId: data.session.user.id,
        }));
      }
    };

    checkUser();

    // Listen for log in / log out
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUserState((prevState) => ({
          ...prevState,
          isLoggedIn: true,
          userId: session.user.id,
        }));
      } else {
        setUserState((prevState) => ({
          ...prevState,
          isLoggedIn: false,
          userId: null,
        }));
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};