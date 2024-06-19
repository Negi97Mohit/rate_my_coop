"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import {
  Stack,
  Box,
  Button,
  FormControl,
  FormLabel,
  Flex,
  Heading,
  Input,
  Textarea,
  useToast,
  Text,
  Icon,
  Select,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons"; // For the back arrow icon
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { addReviewAndUpdateStats } from "@/firebaseFunctions/firebaseWrite";
import { getDormNameFromDormID } from "@/utils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// update the stars based on the rating
const StarRating = ({ rating, setRating }) => {
  return (
    <Box>
      {[...Array(5)].map((_, index) => (
        <Icon
          key={index}
          as={FaStar}
          cursor="pointer"
          color={index < rating ? "yellow.400" : "gray.300"}
          onClick={() => setRating(index + 1)}
          _hover={{ color: "yellow.600" }}
          margin="0.6rem"
          boxSize="2rem"
        />
      ))}
    </Box>
  );
};

// Validation function for the room number.
// The reason why there can be a letter at the end is becausesuites have room numbers like "123A"
// requires at least one number, and at most one letter (and letter has to be at the end)
function isValidRoomNumber(roomNumber) {
  if (!roomNumber) {
    return true;
  }
  const regex = /^\d{1,}[a-zA-Z]?$/;
  if (regex.test(roomNumber)) {
    const letterCount = (roomNumber.match(/[a-zA-Z]/g) || []).length;
    return letterCount <= 1; // Ensure there's at most one letter
  }
  return false;
}

// to handle the form submission
const WriteReview = () => {
  const router = useRouter();
  const [dormId, setDormId] = useState("");
  const toast = useToast();

  const [dormName, setDormName] = useState("");
  const [review, setReview] = useState("");
  const [roomRating, setRoomRating] = useState(0);
  const [buildingRating, setBuildingRating] = useState(0);
  const [bathroomRating, setBathroomRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [amenitiesRating, setAmenitiesRating] = useState(0);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [photos, setPhotos] = useState([]);

  const auth = getAuth();
  const userUid = auth.currentUser?.uid;

  useEffect(() => {
    const dormId = new URLSearchParams(window.location.search).get("dormId");
    if (dormId) {
      setDormId(dormId);
      const dormName = getDormNameFromDormID(dormId);
      setDormName(dormName);
    }
  }, []);

  const handlePhotoUpload = (e) => {
    const selectedPhotos = e.target.files;
    setPhotos([...photos, ...selectedPhotos]);
  };

  const handleBackClick = () => {
    router.push(`/reviewPage?dormId=${encodeURIComponent(dormId)}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidRoomNumber(roomNumber)) {
      alert("Invalid room number. Please enter a valid room number.");
      return;
    }

    const newOverallRating =
      [
        roomRating,
        buildingRating,
        bathroomRating,
        cleanlinessRating,
        amenitiesRating,
      ].reduce((acc, curr) => acc + curr, 0) / 5;

    try {
      // Upload photos to Firebase Storage and get their URLs
      const photoURLs = await Promise.all(
        photos.map(async (photo) => {
          const storage = getStorage();
          const photoRef = ref(
            storage,
            `dorms/${dormId}/reviews/${photo.name}`
          );
          const snapshot = await uploadBytes(photoRef, photo);
          const downloadURL = await getDownloadURL(snapshot.ref);
          return downloadURL;
        })
      );

      const reviewData = {
        dormName,
        roomNumber,
        roomType,
        review,
        ratings: {
          roomRating,
          buildingRating,
          bathroomRating,
          cleanlinessRating,
          amenitiesRating,
        },
        overallRating: newOverallRating,
        photos: photoURLs,
        createdAt: new Date(),
        userId: userUid,
      };

      await addDoc(collection(db, "dorms", dormId, "reviews"), reviewData);
      await addReviewAndUpdateStats(
        dormId,
        newOverallRating,
        roomRating,
        buildingRating,
        bathroomRating,
        cleanlinessRating,
        amenitiesRating
      );
      toast({
        title: "Review added.",
        description:
          "The review has been successfully added and statistics updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(`/reviewPage?dormId=${dormId}`);
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not add the review. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} maxW="xl" mx="auto">
      <Flex
        flexDirection="column"
        align="center"
        justify="center"
        py={{ base: 5 }}
        px={{ base: 4 }}
      >
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Back to review page"
          variant="outline"
          position="absolute"
          top={20}
          left={2}
          onClick={handleBackClick}
        />
        <Heading as="h1" size="xl" mb={6}>
          Write a Review
        </Heading>
        <Stack spacing={4} width="100%" maxW="300px" align="center">
          <form onSubmit={handleSubmit}>
            <Text fontSize="lg" mb={2} fontWeight={500}>
              Dorm: <strong>{dormName}</strong>
            </Text>

            <FormControl mb={4}>
              <FormLabel htmlFor="room-number" fontSize="lg">
                Room Number:
              </FormLabel>
              <Input
                id="room-number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Enter Room Number"
                width="300px"
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel htmlFor="room-type" fontSize="lg">
                Room Type:
              </FormLabel>
              <Select
                id="room-type"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                required
                width="300px"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
                <option value="suite">Suite</option>
              </Select>
            </FormControl>

            {[
              ["Room Rating", roomRating, setRoomRating],
              ["Building Rating", buildingRating, setBuildingRating],
              ["Bathroom Rating", bathroomRating, setBathroomRating],
              ["Cleanliness Rating", cleanlinessRating, setCleanlinessRating],
              ["Amenities Rating", amenitiesRating, setAmenitiesRating],
            ].map(([label, value, setter], index) => (
              <FormControl isRequired key={index} mb={4}>
                <FormLabel fontSize="lg">{label}</FormLabel>
                <StarRating rating={value} setRating={setter} />
              </FormControl>
            ))}

            <FormControl isRequired mb={4}>
              <FormLabel htmlFor="review" fontSize="lg">
                Your Review
              </FormLabel>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience..."
              />
            </FormControl>

            {/* File input for uploading photos */}
            <FormControl mb={4} isRequired>
              <FormLabel htmlFor="photos" fontSize="lg">
                Upload Photos:
              </FormLabel>
              <Input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </FormControl>

            {photos.length > 0 && (
              <FormControl mb={4}>
                <FormLabel>Uploaded Photos:</FormLabel>
                <ul>
                  {photos.map((photo, index) => (
                    <li key={index}>{photo.name}</li>
                  ))}
                </ul>
              </FormControl>
            )}
            <Center>
              <Button
                color={"white"}
                bg={"brand.200"}
                href={"#"}
                top={5}
                _hover={{
                  bg: "brand.500",
                }}
                type="submit"
              >
                Submit Review
              </Button>
            </Center>
          </form>
        </Stack>
      </Flex>
    </Box>
  );
};

export default WriteReview;
