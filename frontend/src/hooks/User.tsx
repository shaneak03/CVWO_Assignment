import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase";

type UserState = {
  isLoggedIn: boolean;
  userId: string | null;
};

const UserContext = createContext<UserState>({
  isLoggedIn: false,
  userId: null,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userState, setUserState] = useState<UserState>({
    isLoggedIn: false,
    userId: null,
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        setUserState({ isLoggedIn: false, userId: null });
        console.error("No session found");
      } else {
        setUserState({ isLoggedIn: true, userId: data.session.user.id });
      }
    };
    checkUser();

    // Listen for log in / log out
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUserState({ isLoggedIn: true, userId: session.user.id });
      } else {
        setUserState({ isLoggedIn: false, userId: null });
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