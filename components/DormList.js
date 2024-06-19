import { Flex } from "@chakra-ui/react";
import DormCard from "./DormCard";

const DormList = ({ dorms }) => {
  return (
    <Flex
      wrap="wrap"
      justifyContent="center"
      alignItems="center"
      gap="4"
      py={10}
    >
      {dorms.map((dorm) => (
        <DormCard key={dorm.id} dorm={dorm} />
      ))}
    </Flex>
  );
};

export default DormList;
