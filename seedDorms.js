// THIS FILE IS ONLY FOR SETTING THE INITIAL DORMS IN FIRESTORE AND RETRIEVAL FOR HOMEPAGE

import { db } from "./firebaseConfig.js"; // Make sure the path is correct and include the file extension
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getDormIdFromDormName } from "./utils.js";

const dorms = [
  {
    name: "Nicholas S. Zeppos",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Rothschild",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "E. Bronson Ingram",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Moore",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Warren",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Tolman Hall",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Stapleton House",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Vaughn House",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Scales House",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Morgan House",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "highland",
  },
  {
    name: "McTyeire Hall",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Lupton House",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Lewis House",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "highland",
  },
  {
    name: "Cole Hall",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "main",
  },
  {
    name: "Chaffin Place",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "highland",
  },
  {
    name: "Crawford",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
  {
    name: "East",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
  {
    name: "Gillette",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
  {
    name: "Hank Ingram",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
  {
    name: "Memorial",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
  {
    name: "Murray",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
  {
    name: "North",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
  {
    name: "Stambaugh",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
  {
    name: "Sutherland",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
  {
    name: "West",
    imageUrl: "https://via.placeholder.com/150",
    averageRating: 0,
    reviewCount: 0,
    location: "Commons",
  },
];

async function seedDorms() {
  try {
    for (const dorm of dorms) {
      const dormId = getDormIdFromDormName(dorm.name);
      // Create a reference for a new doc in 'dorms' collection with a generated id
      const dormRef = doc(db, "dorms", dormId);

      // Set the dorm data with the initial fields
      await setDoc(dormRef, {
        name: dorm.name,
        imageUrl: dorm.imageUrl,
        averageRating: dorm.averageRating,
        reviewCount: dorm.reviewCount,
        location: dorm.location,
      });

      console.log(`Added dorm: ${dorm.name} with ID: ${dormRef.id}`);
    }
    console.log("All dorms have been added to Firestore.");
  } catch (error) {
    console.error("Error adding dorms to Firestore:", error);
  }
}

seedDorms();
