import {
  Text,
  Center,
  Box,
  Stack,
  HStack,
  Heading,
  AspectRatio,
  Image,
} from "native-base";

export default function Card({
  alignItems,
  additionalChildren,
  title,
  description,
  smallDescription,
  someInfo,
  children,
  image,
  maxW,
  maxH,
  addSpace,
}) {
  return (
    <Box alignItems={alignItems} mb={4}>
      <Box
        maxW={maxW}
        maxH={maxH}
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth={1}
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {image && (
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image
                source={{
                  uri: image,
                }}
                alt="image"
              />
            </AspectRatio>
            <Center
              bg="violet.500"
              _dark={{
                bg: "violet.400",
              }}
              _text={{
                color: "warmGray.50",
                fontWeight: "700",
                fontSize: "xs",
              }}
              position="absolute"
              bottom="0"
              px="3"
              py="1.5"
            >
              PHOTOS
            </Center>
          </Box>
        )}
        <Stack p="4" space={addSpace ? 3 : 2}>
          <Stack space={2}>
            <Heading
              size="md"
              _light={{
                color: "#949DFF",
              }}
              _dark={{
                color: "violet.400",
              }}
            >
              {title}
            </Heading>
            {description && (
              <Text
                fontSize="xs"
                _light={{
                  color: "#949dff",
                }}
                _dark={{
                  color: "violet.400",
                }}
                fontWeight="500"
              >
                {description}
              </Text>
            )}
          </Stack>
          {smallDescription && (
            <Text fontWeight="400" color="coolGray.800">
              {smallDescription}
            </Text>
          )}
          <HStack alignItems="center" space={4} justifyContent="space-between">
            {additionalChildren && (
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                fontWeight="400"
              >
                {additionalChildren}
              </Text>
            )}
          </HStack>
          {children}
          {someInfo && (
            <HStack
              alignItems="center"
              space={4}
              justifyContent="space-between"
            >
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                fontWeight="400"
              >
                {someInfo}
              </Text>
            </HStack>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
