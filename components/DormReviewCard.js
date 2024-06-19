import {
  Box,
  Image,
  Badge,
  Text,
  HStack,
  VStack,
  Center,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { addDoc, collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { StarRating } from "./DormOverviewCard";
import { getAuth } from "firebase/auth";

export const getRatingColorScheme = (rating) => {
  if (rating >= 4) {
    return "green";
  } else if (rating >= 3) {
    return "yellow";
  } else {
    return "red";
  }
};

const DormReviewCard = ({
  reviewId,
  roomRating,
  amenitiesRating,
  bathroomRating,
  buildingRating,
  cleanlinessRating,
  overallRating,
  photo,
  dormName,
  roomNumber,
  roomType,
  review,
}) => {
  const auth = getAuth();
  const userUid = auth.currentUser?.uid;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dormNameMap = {
    "Chaffin Place": "chaffin-place",
    "Cole Hall": "cole-hall",
    Crawford: "crawford",
    "E. Bronson Ingram": "e.-bronson-ingram",
    East: "east",
    Gillette: "gillette",
    "Hank Ingram": "hank-ingram",
    "Lewis House": "lewis-house",
    "Lupton House": "lupton-house",
    "McTyeire Hall": "mctyeire-hall",
    Memorial: "memorial",
    Moore: "moore",
    "Morgan House": "morgan-house",
    Murray: "murray",
    "Nicholas S. Zeppos": "nicholas-s.-zeppos",
    North: "north",
    Rothschild: "rothschild",
    "Scales House": "scales-house",
    Stambaugh: "stambaugh",
    "Stapelton House": "stapelton-house",
    Sutherland: "sutherland",
    "Tolman Hall": "tolman-hall",
    "Vaughn House": "vaughn-house",
    Warren: "warren",
    West: "west",
  };

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const toast = useToast();

  const addCommentToFirestore = async () => {
    if (comment.trim() === "") return;

    try {
      const commentsRef = collection(
        db,
        "dorms",
        dormNameMap[dormName],
        "reviews",
        reviewId,
        "comments"
      );

      await addDoc(commentsRef, {
        text: comment,
        createdAt: new Date(),
        userId: userUid,
        dormName: dormName,
        roomNumber: roomNumber,
        reviewId: reviewId,
      });

      toast({
        title: "Comment added.",
        description:
          "The comment has been successfully added and statistics updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setComment("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add the comment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchComments = async () => {
    const commentsRef = collection(
      db,
      "dorms",
      dormNameMap[dormName],
      "reviews",
      reviewId,
      "comments"
    );
    const commentsSnapshot = await getDocs(commentsRef);
    const commentsWithUserDetails = await Promise.all(
      commentsSnapshot.docs.map(async (docSnapshot) => {
        const commentData = docSnapshot.data();
        const userRef = doc(db, "users", commentData.userId);
        const userSnapshot = await getDoc(userRef);
        return {
          ...commentData,
          userPhoto: userSnapshot.data().photo,
          userName: userSnapshot.data().name,
        };
      })
    );
    setComments(commentsWithUserDetails);
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, reviewId]);

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        maxW="lg"
        borderColor="gray.200"
        onClick={onOpen}
        cursor="pointer"
      >
        {/* ... existing image code remains unchanged */}
        <Box p={5}>
          <Flex alignItems="center" justifyContent="space-between" mb={2}>
            <Badge
              borderRadius="full"
              px="2"
              colorScheme={getRatingColorScheme(overallRating)}
              mr={2}
            >
              Overall {overallRating}
            </Badge>
            <Badge borderRadius="full" px="2" colorScheme="purple">
              {roomNumber} {roomType}
            </Badge>
          </Flex>
          <Text
            color="black"
            fontWeight={600}
            fontSize="md"
            noOfLines={[1, 2, 3]}
            mt={5}
            mb={5}
          >
            {review}
          </Text>
          {/* Ratings */}
          <Grid templateColumns="repeat(10, 1fr)" mb={2} mt={2}>
            <GridItem colSpan={5} display="flex" alignItems="center">
              <Text as="span" fontSize="sm" color="gray.600">
                Room
              </Text>
            </GridItem>
            <GridItem display="flex" alignItems="center">
              <StarRating rating={roomRating ?? 0} />
            </GridItem>
          </Grid>

          <Grid templateColumns="repeat(10, 1fr)" mb={2} mt={2}>
            <GridItem colSpan={5} display="flex" alignItems="center">
              <Text as="span" fontSize="sm" color="gray.600">
                Amenities
              </Text>
            </GridItem>
            <GridItem display="flex" alignItems="center">
              <StarRating rating={amenitiesRating ?? 0} />
            </GridItem>
          </Grid>

          <Grid templateColumns="repeat(10, 1fr)" mb={2} mt={2}>
            <GridItem colSpan={5} display="flex" alignItems="center">
              <Text as="span" fontSize="sm" color="gray.600">
                Bathroom
              </Text>
            </GridItem>
            <GridItem display="flex" alignItems="center">
              <StarRating rating={bathroomRating ?? 0} />
            </GridItem>
          </Grid>

          <Grid templateColumns="repeat(10, 1fr)" mb={2} mt={2}>
            <GridItem colSpan={5} display="flex" alignItems="center">
              <Text as="span" fontSize="sm" color="gray.600">
                Building
              </Text>
            </GridItem>
            <GridItem display="flex" alignItems="center">
              <StarRating rating={buildingRating ?? 0} />
            </GridItem>
          </Grid>

          <Grid templateColumns="repeat(10, 1fr)" mb={2} mt={2}>
            <GridItem colSpan={5} display="flex" alignItems="center">
              <Text as="span" fontSize="sm" color="gray.600">
                Cleanliness
              </Text>
            </GridItem>
            <GridItem display="flex" alignItems="center">
              <StarRating rating={cleanlinessRating ?? 0} />
            </GridItem>
          </Grid>

          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Center pt={4} px={2}>
              <Image
                src={photo}
                alt={`${dormName} room`}
                boxSize="12em"
                borderRadius={10}
              />{" "}
            </Center>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{dormName} Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              src={photo}
              alt={`${dormName} room`}
              boxSize="full"
              mb={2}
              borderRadius={10}
            />
            <Flex alignItems="center" justifyContent="space-between" mb={2}>
              <Badge
                borderRadius="full"
                px="2"
                colorScheme={getRatingColorScheme(overallRating)}
                mr={2}
              >
                Overall {overallRating}
              </Badge>
              <Badge borderRadius="full" px="2" colorScheme="purple">
                {roomNumber} {roomType}
              </Badge>
            </Flex>
            <Text
              color="black"
              fontWeight={600}
              fontSize="md"
              noOfLines={[1, 2, 3]}
              mt={5}
              mb={5}
            >
              {review}
            </Text>
            {/* Ratings */}
            <Grid templateColumns="repeat(4, 1fr)" mb={2} mt={2}>
              <GridItem colSpan={1} display="flex" alignItems="center">
                <Text as="span" fontSize="sm" color="gray.600">
                  Room
                </Text>
              </GridItem>
              <GridItem display="flex" alignItems="center">
                <StarRating rating={roomRating ?? 0} />
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" mb={2} mt={2}>
              <GridItem colSpan={1} display="flex" alignItems="center">
                <Text as="span" fontSize="sm" color="gray.600">
                  Amenities
                </Text>
              </GridItem>
              <GridItem display="flex" alignItems="center">
                <StarRating rating={amenitiesRating ?? 0} />
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" mb={2} mt={2}>
              <GridItem colSpan={1} display="flex" alignItems="center">
                <Text as="span" fontSize="sm" color="gray.600">
                  Bathroom
                </Text>
              </GridItem>
              <GridItem display="flex" alignItems="center">
                <StarRating rating={bathroomRating ?? 0} />
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" mb={2} mt={2}>
              <GridItem colSpan={1} display="flex" alignItems="center">
                <Text as="span" fontSize="sm" color="gray.600">
                  Building
                </Text>
              </GridItem>
              <GridItem display="flex" alignItems="center">
                <StarRating rating={buildingRating ?? 0} />
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" mb={2} mt={2}>
              <GridItem colSpan={1} display="flex" alignItems="center">
                <Text as="span" fontSize="sm" color="gray.600">
                  Cleanliness
                </Text>
              </GridItem>
              <GridItem display="flex" alignItems="center">
                <StarRating rating={cleanlinessRating ?? 0} />
              </GridItem>
            </Grid>
            <Box mt={6}>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <Box
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p={4}
                    mb={4}
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <HStack spacing={4}>
                        <Image
                          boxSize="40px"
                          borderRadius="full"
                          src={comment.userPhoto}
                          alt={`Profile picture of ${comment.userName}`}
                        />
                        <Text fontSize="md" fontWeight="bold">
                          {comment.userName}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        {comment.createdAt.toDate().toLocaleString()}
                      </Text>
                    </Flex>
                    <Text fontSize="lg" as="p" mt={2}>
                      {comment.text}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text>No comments yet.</Text>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Textarea
              placeholder="Add a comment..."
              mr={3}
              resize="vertical"
              minH="unset"
              w="100%"
              maxW="sm"
              onChange={(e) => setComment(e.target.value)}
            />
            <Button colorScheme="blue" onClick={addCommentToFirestore}>
              Add Comment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DormReviewCard;
