import {
  Box,
  Image,
  Badge,
  Flex,
  IconButton,
  useToast,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  db,
} from "@/firebaseConfig";
import { StarRating } from "./DormOverviewCard";
import { getRatingColorScheme } from "./DormReviewCard";
import { deleteReviewAndUpdateStats } from "@/firebaseFunctions/firebaseWrite";

const YourReviewsCard = ({
  starRating,
  photo,
  dormName,
  roomNumber,
  reviewID,
  handleDeleteReview,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
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

  const handleDelete = async () => {
    onClose();
    const dormDocument = dormNameMap[dormName];
    try {
      const reviewRef = doc(db, "dorms", dormDocument, "reviews", reviewID);
      const reviewSnap = await getDoc(reviewRef);
      if (reviewSnap.exists()) {
        const {
          roomRating,
          buildingRating,
          bathroomRating,
          cleanlinessRating,
          amenitiesRating,
        } = reviewSnap.data().ratings;
        await deleteReviewAndUpdateStats(
          dormDocument,
          roomRating,
          buildingRating,
          bathroomRating,
          cleanlinessRating,
          amenitiesRating
        );
        // Now, delete the review
        await deleteDoc(doc(db, "dorms", dormDocument, "reviews", reviewID));
        handleDeleteReview(reviewID);
        toast({
          title: "Review deleted.",
          description:
            "The review has been successfully deleted and statistics updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Review does not exist.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete the review. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" maxW="sm">
      <Image src={photo} alt={`${dormName} room`} />
      <Box p={5}>
        <Flex alignItems="center" justifyContent="space-between" mb={2}>
          <Badge
            borderRadius="full"
            px="2"
            colorScheme={getRatingColorScheme(starRating)}
            mr={2}
          >
            Overall {starRating}
          </Badge>
          <Badge borderRadius="full" px="2" colorScheme="purple">
            {dormName} {roomNumber}
          </Badge>
        </Flex>
        <Flex alignItems="center">
          <StarRating rating={starRating} />
          <Spacer />
          <IconButton
            aria-label="Delete review"
            icon={<FiTrash2 />}
            colorScheme="red"
            variant="ghost"
            onClick={onOpen}
            _hover={{ color: "red.500" }}
          />
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent marginY="auto" maxW="32rem" mx="auto">
            <ModalHeader>Delete Review</ModalHeader>
            <ModalBody>Are you sure you want to delete this review?</ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleDelete}>
                Yes, Delete
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default YourReviewsCard;
