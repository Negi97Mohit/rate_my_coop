import { React, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { onSnapshot, doc, average } from "firebase/firestore";
import {
  Input,
  InputGroup,
  Flex,
  Text,
  Box,
  Center,
  Select,
  Button,
  extendTheme,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

export const StarRating = ({ rating }) => {
  // Total number of stars
  const totalStars = 5;

  // Calculate the full, half and empty stars
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStars;

  return (
    <div style={{ display: "flex", alignItems: "center", margin: "auto" }}>
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <FaStar
            key={`full-${index}`}
            color="#A8996E"
            style={{ marginRight: "6px" }}
          />
        ))}
      {halfStars > 0 && (
        <FaStar key="half" color="#A8996E" style={{ marginRight: "6px" }} />
      )}
      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <FaStar
            key={`empty-${index}`}
            color="#e4e5e9"
            style={{ marginRight: "6px" }}
          />
        ))}
    </div>
  );
};

function DormOverviewCard({ dormId }) {
  const [averages, setAverages] = useState({
    overallAverageRating: null,
    averageAmenitiesRating: null,
    averageBathroomRating: null,
    averageBuildingRating: null,
    averageCleanlinessRating: null,
    averageRoomRating: null,
  });

  useEffect(() => {
    if (dormId) {
      const dormRef = doc(db, "dorms", dormId);
      const unsubscribe = onSnapshot(
        dormRef,
        (doc) => {
          if (doc.exists()) {
            setAverages({
              overallAverageRating: doc.data().averageRating,
              averageAmenitiesRating: doc.data().averageAmenities,
              averageBathroomRating: doc.data().averageBathroom,
              averageBuildingRating: doc.data().averageBuilding,
              averageCleanlinessRating: doc.data().averageCleanliness,
              averageRoomRating: doc.data().averageRoom,
            });
          } else {
            console.log("No such document!");
          }
        },
        (error) => {
          console.error("Error getting document:", error);
        }
      );

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [dormId]);
  const isDataLoaded = averages.overallAverageRating !== null;

  return (
    <>
      {isDataLoaded && averages.overallAverageRating > 0 && (
        <Center>
          <Box
            borderWidth="0px"
            borderRadius="lg"
            overflow="hidden"
            maxW="lg"
            w="300px"
            m={7}
            mr={2.5}
            mt={2.5}
            p={5}
          >
            <Text
              as="div"
              fontWeight={700}
              fontSize="1.25rem"
              textAlign="left"
            >
              {" "}
              {/* Left align text */}
              Overall Rating
            </Text>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "2.5rem",
                  justifyContent: "left",
                }}
              >
                {" "}
                {/* Left align flex content */}
                <FaStar
                  key="half"
                  color="#A8996E"
                  style={{ marginRight: "20px", width: "40px", height: "40px" }}
                />
                <Text fontWeight={900}>
                 {averages.overallAverageRating}
                </Text>
              </span>
            <Text
              as="div"
              fontWeight={700}
              fontSize="1.25rem"
              mt={2}
              textAlign="left"
            >
              {" "}
              {/* Center align text */}
              Rating Breakdown
            </Text>
            <Box as="div" textAlign="left" mt={4}>

              <Grid templateColumns='repeat(5, 1fr)' mb={2} mt={2}>
                <GridItem colSpan={3} display="flex" alignItems="center">
                  <Text>
                    Room
                  </Text>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <StarRating rating={averages.averageRoomRating ?? 0} />
                </GridItem>
              </Grid>

              <Grid templateColumns='repeat(5, 1fr)' mb={2} mt={2}>
                <GridItem colSpan={3} display="flex" alignItems="center">
                  <Text>
                    Amenities
                  </Text>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <StarRating rating={averages.averageAmenitiesRating ?? 0} />
                </GridItem>
              </Grid>

              <Grid templateColumns='repeat(5, 1fr)' mb={2} mt={2}>
                <GridItem colSpan={3} display="flex" alignItems="center">
                  <Text>
                    Bathroom
                  </Text>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <StarRating rating={averages.averageBathroomRating ?? 0} />
                </GridItem>
              </Grid>

              <Grid templateColumns='repeat(5, 1fr)' mb={2} mt={2}>
                <GridItem colSpan={3} display="flex" alignItems="center">
                  <Text>
                    Building
                  </Text>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <StarRating rating={averages.averageBuildingRating ?? 0} />
                </GridItem>
              </Grid>

              <Grid templateColumns='repeat(5, 1fr)' mb={2} mt={2}>
                <GridItem colSpan={3} display="flex" alignItems="center">
                  <Text>
                    Cleanliness
                  </Text>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <StarRating rating={averages.averageCleanlinessRating ?? 0} />
                </GridItem>
              </Grid>

            </Box>
          </Box>
        </Center>
      )}
    </>
  );
}

export default DormOverviewCard;
