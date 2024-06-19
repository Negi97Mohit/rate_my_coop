// utils.js

// Function to convert a dorm name into a dorm ID
export function getDormIdFromDormName(dormName) {
  return dormName.replace(/\s+/g, "-").toLowerCase();
}

// Function to convert a dorm ID back into a dorm name
export function getDormNameFromDormID(dormId) {
  return dormId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
