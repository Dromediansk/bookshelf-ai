import { BookStatus } from "@/types/book";
import { DefaultTheme } from "@react-navigation/native";
import { Text, View } from "react-native";

const labelByStatus: Record<BookStatus, string> = {
  reading: "Reading",
  "to-read": "To Read",
  finished: "Finished",
} as const;

type StatusStyle = {
  pillBg: string;
  pillBorder: string;
  pillText: string;
  dividerBorder: string;
};

type BookSectionHeaderProps = {
  section: { status: BookStatus };
};

const styleByStatus: Record<BookStatus, StatusStyle> = {
  reading: {
    pillBg: "bg-info-bg",
    pillBorder: "border-info-border",
    pillText: "text-info-text",
    dividerBorder: "border-info-border",
  },
  "to-read": {
    pillBg: "bg-warning-bg",
    pillBorder: "border-warning-border",
    pillText: "text-warning-text",
    dividerBorder: "border-warning-border",
  },
  finished: {
    pillBg: "bg-success-bg",
    pillBorder: "border-success-border",
    pillText: "text-success-text",
    dividerBorder: "border-success-border",
  },
} as const;

const BookSectionHeader = ({ section }: BookSectionHeaderProps) => {
  const style = styleByStatus[section.status];

  return (
    <View
      className="pb-2 pt-4"
      style={{ backgroundColor: DefaultTheme.colors.background }}
    >
      <View className="flex-row items-center">
        <View
          className={`rounded-full border px-3 py-1 ${style.pillBg} ${style.pillBorder}`}
        >
          <Text className={`text-xs font-sansMedium ${style.pillText}`}>
            {labelByStatus[section.status]}
          </Text>
        </View>
        <View className={`ml-3 flex-1 border-t ${style.dividerBorder}`} />
      </View>
    </View>
  );
};

export default BookSectionHeader;
