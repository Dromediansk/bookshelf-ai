import { Text, View } from "react-native";

import type { BookStatus } from "@/types/book";

type StatusBadgeProps = {
  status: BookStatus;
};

const STATUS_META: Record<
  BookStatus,
  {
    label: string;
    containerClassName: string;
    textClassName: string;
  }
> = {
  "to-read": {
    label: "To Read",
    containerClassName: "border border-warning-border bg-warning-bg",
    textClassName: "text-warning-text",
  },
  reading: {
    label: "Reading",
    containerClassName: "border border-info-border bg-info-bg",
    textClassName: "text-info-text",
  },
  read: {
    label: "Read",
    containerClassName: "border border-success-border bg-success-bg",
    textClassName: "text-success-text",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = STATUS_META[status];

  return (
    <View className={`rounded-full px-2 py-1 ${meta.containerClassName}`}>
      <Text className={`text-xs font-sansMedium ${meta.textClassName}`}>
        {meta.label}
      </Text>
    </View>
  );
}
