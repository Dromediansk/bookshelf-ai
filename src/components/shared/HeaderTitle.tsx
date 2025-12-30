import { Pressable, Text } from "react-native";

import { HEADER_TITLE_STYLE } from "@/utils/navigation";

type HeaderTitleProps = {
  title: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export const HeaderTitle = ({
  title,
  onPress,
  accessibilityLabel,
}: HeaderTitleProps) => {
  const text = (
    <Text numberOfLines={1} style={[HEADER_TITLE_STYLE, { flexShrink: 1 }]}>
      {title}
    </Text>
  );

  if (!onPress) return text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      style={{ flexShrink: 1 }}
    >
      {text}
    </Pressable>
  );
};

export default HeaderTitle;
