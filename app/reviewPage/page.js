// app/reviewPage/page.js
"use client";
import { Box, Flex, Heading, Button, Text, SimpleGrid } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collectionGroup, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getDormNameFromDormID } from "@/utils";
import DormReviewCard from "@/components/DormReviewCard";
import RoomSearch from "../../components/RoomSearch";
import DormOverviewCard from "@/components/DormOverviewCard";

const ReviewPage = () => {
  const router = useRouter();
  const [dormName, setDormName] = useState("");
  const [dormId, setDormId] = useState("");
  const [user, setUser] = useState(null); // State to keep track of the user's auth status
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomType, setRoomType] = useState("");

  useEffect(() => {
    // Set up a listener for authentication state changes
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // currentUser is null if no user is logged in
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch the dormName from the URL parameters
    const dormId = new URLSearchParams(window.location.search).get("dormId");

    // Fetch reviews from DormName collection
    const fetchReviews = async (dormName) => {
      if (dormName) {
        let reviewsQuery;
        // If searchQuery is not empty, prepare the start and end points for the query to match strings starting with searchQuery
        if (searchQuery) {
          const startAtQuery = searchQuery;
          const endAtQuery = searchQuery.replace(/.$/, (c) =>
            String.fromCharCode(c.charCodeAt(0) + 1)
          );

          // Query documents where `dormName` matches and `roomNumber` starts with `searchQuery`
          reviewsQuery = query(
            collectionGroup(db, "reviews"),
            where("dormName", "==", dormName),
            where("roomNumber", ">=", startAtQuery),
            where("roomNumber", "<", endAtQuery)
          );
        } else {
          // If searchQuery is empty, only filter by dormName
          reviewsQuery = query(
            collectionGroup(db, "reviews"),
            where("dormName", "==", dormName)
          );
        }

        if (roomType) {
          reviewsQuery = query(reviewsQuery, where("roomType", "==", roomType));
        }
        const querySnapshot = await getDocs(reviewsQuery);
        const reviewsArray = [];
        querySnapshot.forEach((doc) => {
          reviewsArray.push({ id: doc.id, ...doc.data() });
        });
        console.log(reviewsArray);
        setReviews(reviewsArray);
      }
    };
    if (dormId) {
      setDormId(dormId);
      const dormName = getDormNameFromDormID(dormId);
      setDormName(dormName);
      fetchReviews(dormName);
    }
  }, [searchQuery, roomType]);

  const handleWriteReview = () => {
    if (user) {
      // Check if a user is logged in
      router.push(`/writeReview?dormId=${dormId}`);
    } else {
      alert("You must be logged in to write a review.");
    }
  };

  console.log(searchQuery);

  return (
    <Box py={10} px={4}>
      <Flex flexDirection="column" align="center" justify="center" mb={5}>
        <Heading
          fontWeight={500}
          fontSize={{ base: "xl", sm: "3xl", md: "5xl" }}
          lineHeight={"110%"}
        >
          <Text as="span" color="black" fontWeight={600}>
            {dormName}
          </Text>
          <Text as="span" color="black" fontWeight={600}>
            {" "}
            Reviews
          </Text>
        </Heading>
        <Button
          onClick={handleWriteReview}
          mt={6}
          mb={4}
          fontSize={"sm"}
          fontWeight={600}
          color={"white"}
          bg={"brand.200"}
          _hover={{ bg: "brand.500" }}
        >
          Write Review
        </Button>
      </Flex>

      <RoomSearch
        onSearch={(query) => setSearchQuery(query)}
        onTagChange={(room) => setRoomType(room)}
        selectedTag={roomType}
      />

      <Flex direction={{ base: "column", lg: "row" }} mt={5}>
        <Box minWidth={{ base: "100%", lg: "300px" }} pr={{ lg: 8 }} mt={-7}>
          <DormOverviewCard dormId={dormId} />
        </Box>

        <Box flex={1}>
          <SimpleGrid columns={[1, null, 2, 3]} spacing="20px">
            {reviews.map((review) => (
              <DormReviewCard
                key={review.id}
                reviewId={review.id}
                roomRating={review.ratings.roomRating}
                amenitiesRating={review.ratings.amenitiesRating}
                bathroomRating={review.ratings.bathroomRating}
                buildingRating={review.ratings.buildingRating}
                cleanlinessRating={review.ratings.cleanlinessRating}
                overallRating={review.overallRating}
                photo={review.photos[0]}
                dormName={review.dormName}
                roomNumber={review.roomNumber}
                roomType={review.roomType}
                review={review.review}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default ReviewPage;
