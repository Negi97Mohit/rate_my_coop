import React from "react";
import { Input, InputGroup, Flex, Center, Select, Button } from "@chakra-ui/react";

function RoomSearch({
    onSearch,
    searchQuery,
    onTagChange,
    selectedTag,
}) {
  return (
    <Flex justifyContent="center" mt={2}>
      <Center>
        <InputGroup>
          <Input
            type="text"
            placeholder="Search for a specific room!"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            w="600px"
            data-testid="search-input"
          />
        </InputGroup>

        <Select
          ml={2}
          onChange={(e) => onTagChange(e.target.value)}
          data-testid="RoomType"
          value={selectedTag}
        >
          <option value="">Room Type</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="triple">Triple</option>
          <option value="suite">Suite</option>
        </Select>
      </Center>
    </Flex>
  );
}

export default RoomSearch;
