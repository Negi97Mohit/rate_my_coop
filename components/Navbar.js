import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/firebaseConfig";

export default function Navbar() {
  const router = useRouter();
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

  const signOutUser = () => {
    getAuth(app)
      .signOut()
      .then(() => {
        setUser(null);
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 3 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <NextLink href="/homePage" passHref>
            <Text
              as="a" // Make the Text component behave like an anchor tag
              textAlign={{ base: "center", md: "left" }}
              fontFamily={"heading"}
              color={"brand.100"}
              cursor="pointer"
              fontWeight={700}
            >
              <Text as={"span"} color={"brand.200"}>
              RM
              </Text>
              Co-op
            </Text>
          </NextLink>
        </Flex>

        <div>
          {user && (
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={"flex-end"}
              direction={"row"}
              spacing={6}
            >
              <NextLink href="/accountPage" passHref>
                <img
                  as="a"
                  src={user.photoURL}
                  alt="User"
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                  cursor="pointer"
                  referrerpolicy="no-referrer"
                />
              </NextLink>
              <button onClick={signOutUser}>Sign Out</button>
            </Stack>
          )}
        </div>
      </Flex>
    </Box>
  );
}
