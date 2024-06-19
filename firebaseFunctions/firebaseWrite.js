import { db } from "@/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function addReviewAndUpdateStats(
  dormId,
  newRating,
  roomRating,
  buildingRating,
  bathroomRating,
  cleanlinessRating,
  amenitiesRating
) {
  console.log(newRating);
  const dormRef = doc(db, "dorms", dormId);
  const dormDoc = await getDoc(dormRef);

  if (dormDoc.exists()) {
    const data = dormDoc.data();
    const currentCount = data.reviewCount || 0;

    // Initialize current averages
    const currentAverageRating = data.averageRating || 0;
    const currentAverageAmenities = data.averageAmenities || 0;
    const currentAverageBathroom = data.averageBathroom || 0;
    const currentAverageBuilding = data.averageBuilding || 0;
    const currentAverageCleanliness = data.averageCleanliness || 0;
    const currentAverageRoom = data.averageRoom || 0;

    // Calculate new averages for each category
    const newAverageRating = Number(
      (
        (currentAverageRating * currentCount + newRating) /
        (currentCount + 1)
      ).toFixed(1)
    );
    const newAverageAmenities = Number(
      (
        (currentAverageAmenities * currentCount + amenitiesRating) /
        (currentCount + 1)
      ).toFixed(1)
    );
    const newAverageBathroom = Number(
      (
        (currentAverageBathroom * currentCount + bathroomRating) /
        (currentCount + 1)
      ).toFixed(1)
    );
    const newAverageBuilding = Number(
      (
        (currentAverageBuilding * currentCount + buildingRating) /
        (currentCount + 1)
      ).toFixed(1)
    );
    const newAverageCleanliness = Number(
      (
        (currentAverageCleanliness * currentCount + cleanlinessRating) /
        (currentCount + 1)
      ).toFixed(1)
    );
    const newAverageRoom = Number(
      (
        (currentAverageRoom * currentCount + roomRating) /
        (currentCount + 1)
      ).toFixed(1)
    );

    // Update dorm document with new averages and incremented review count
    await updateDoc(dormRef, {
      averageRating: newAverageRating,
      averageAmenities: newAverageAmenities,
      averageBathroom: newAverageBathroom,
      averageBuilding: newAverageBuilding,
      averageCleanliness: newAverageCleanliness,
      averageRoom: newAverageRoom,
      reviewCount: currentCount + 1,
    });
  }
}

export async function deleteReviewAndUpdateStats(
  dormId,
  roomRating,
  buildingRating,
  bathroomRating,
  cleanlinessRating,
  amenitiesRating
) {
  const dormRef = doc(db, "dorms", dormId);
  const dormDoc = await getDoc(dormRef);

  if (dormDoc.exists() && dormDoc.data().reviewCount > 1) {
    // Ensure there's more than one review
    const data = dormDoc.data();
    const currentCount = data.reviewCount;

    // Calculate new totals by subtracting the deleted review's ratings
    // New averages are calculated by dividing by (currentCount - 1)
    const newAverageAmenities = (
      (data.averageAmenities * currentCount - amenitiesRating) /
      (currentCount - 1)
    ).toFixed(1);
    const newAverageBathroom = (
      (data.averageBathroom * currentCount - bathroomRating) /
      (currentCount - 1)
    ).toFixed(1);
    const newAverageBuilding = (
      (data.averageBuilding * currentCount - buildingRating) /
      (currentCount - 1)
    ).toFixed(1);
    const newAverageCleanliness = (
      (data.averageCleanliness * currentCount - cleanlinessRating) /
      (currentCount - 1)
    ).toFixed(1);
    const newAverageRoom = (
      (data.averageRoom * currentCount - roomRating) /
      (currentCount - 1)
    ).toFixed(1);
    const newAverageRating = (
      (parseFloat(newAverageAmenities) +
        parseFloat(newAverageBathroom) +
        parseFloat(newAverageBuilding) +
        parseFloat(newAverageCleanliness) +
        parseFloat(newAverageRoom)) /
      5
    ).toFixed(1);

    // Update dorm document with new averages and decremented review count
    await updateDoc(dormRef, {
      averageRating: parseFloat(newAverageRating),
      averageAmenities: parseFloat(newAverageAmenities),
      averageBathroom: parseFloat(newAverageBathroom),
      averageBuilding: parseFloat(newAverageBuilding),
      averageCleanliness: parseFloat(newAverageCleanliness),
      averageRoom: parseFloat(newAverageRoom),
      reviewCount: currentCount - 1,
    });
  } else if (dormDoc.data().reviewCount === 1) {
    // If last review is deleted, reset averages
    await updateDoc(dormRef, {
      averageRating: 0,
      averageAmenities: 0,
      averageBathroom: 0,
      averageBuilding: 0,
      averageCleanliness: 0,
      averageRoom: 0,
      reviewCount: 0,
    });
  }
}
