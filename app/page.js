"use client";

import LandingPage from "@/components/LandingPage";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./layout"; 
import { app } from "@/firebaseConfig";
import Hero from "@/components/Hero";
import React, { useEffect, useState } from "react";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";

export default function Page() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <main>{user ? <Hero /> : <LandingPage />}</main>
    </ChakraProvider>
  );
}
