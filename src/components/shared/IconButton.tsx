import themeColors from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import { Pressable, PressableProps, View } from "react-native";

type IconButtonProps = PressableProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  tintColor?: string;
  iconSize?: number;
  hitSlop?: number;
};

const TailwindIonicons = cssInterop(Ionicons, { className: "style" });

const IconButton = ({
  children,
  icon,
  tintColor,
  iconSize = 24,
  ...props
}: IconButtonProps) => {
  const iconElement = icon ? (
    <View className="w-11 h-11 items-center justify-center">
      <TailwindIonicons
        name={icon}
        size={iconSize}
        color={tintColor ?? themeColors.text.DEFAULT}
      />
    </View>
  ) : null;

  return (
    <Pressable hitSlop={10} accessibilityRole="button" {...props}>
      {children ?? iconElement}
    </Pressable>
  );
};

export default IconButton;
