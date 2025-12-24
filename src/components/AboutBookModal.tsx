import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type AboutBookModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  author: string;
  description?: string | null;
};

export const AboutBookModal = ({
  visible,
  onClose,
  title,
  author,
  description,
}: AboutBookModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-text/30 px-2 py-2"
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close about modal"
      >
        <Pressable
          className="mt-16 rounded-card border border-border bg-surface px-card py-card"
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="none"
        >
          <View className="flex-row items-center justify-between gap-3">
            <Text
              className="flex-1 text-base font-sansSemibold text-brand"
              numberOfLines={1}
            >
              About the book
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={10}
            >
              <Ionicons name="close" size={22} />
            </Pressable>
          </View>

          <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-base font-sansSemibold text-text">
                {title}
              </Text>
              <Text className="mt-1 text-sm font-sans text-text-muted">
                {author}
              </Text>
            </View>

            <View className="border-l-4 border-brand pl-3">
              <Text className="text-sm font-sans text-text-muted">
                {description?.trim()
                  ? description
                  : "No description available for this book yet."}
              </Text>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
