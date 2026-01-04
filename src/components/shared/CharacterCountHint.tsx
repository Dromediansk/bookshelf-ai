import { Text } from "react-native";

type CharacterCountHintProps = {
  current: number;
  max: number;
};

const CharacterCountHint = ({ current, max }: CharacterCountHintProps) => {
  return (
    <Text className="mt-2 text-right text-xs font-sans text-text-subtle">
      {current}/{max}
    </Text>
  );
};

export default CharacterCountHint;
