"use client";
import React from "react";
import { Button, Center, Image, VStack, Text } from "@chakra-ui/react";
import { Google } from "react-bootstrap-icons";
import { useToast } from "@chakra-ui/react";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  db,
} from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();
  const toast = useToast();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      if (user.email) {
        console.log("Authenticated successfully");
        localStorage.setItem("userEmail", user.email);
      } else {
        toast({
          title: "Unauthorized email domain.",
          description: "You must use a Vanderbilt email to log in.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });
        console.error("You must use a Vanderbilt email to log in.");
        auth.signOut();
      }

      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        photo: user.photoURL,
        email: user.email,
      });

      router.push("/homePage");
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: `Error signing in: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Center h="80vh">
      <VStack spacing={4} p={8} bg="white" boxShadow="md" borderRadius="lg">
        <Google />
        <Text fontSize="xl" fontWeight="bold">
          Sign in with Google
        </Text>
        <Button onClick={handleSignIn} bg={"brand.200"} leftIcon={<Google />}>
          Sign In
        </Button>
      </VStack>
    </Center>
  );
};

export default SignInPage;
