import { Platform, Pressable, Text } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import themeColors from "@/utils/colors";

type CreationDateFieldProps = {
  createdAt: Date;
  setCreatedAt: (date: Date) => void;
};

const CreationDateField = ({
  createdAt,
  setCreatedAt,
}: CreationDateFieldProps) => {
  return (
    <>
      <Text className="mb-2 text-sm font-sansMedium text-text">
        Creation Date
      </Text>
      {Platform.OS === "ios" ? (
        <DateTimePicker
          value={createdAt}
          mode="date"
          display="compact"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setCreatedAt(selectedDate);
            }
          }}
          maximumDate={new Date()}
          accentColor={themeColors.brand.DEFAULT}
        />
      ) : (
        <Pressable
          onPress={() => {
            DateTimePickerAndroid.open({
              value: createdAt,
              mode: "date",
              onChange: (event, selectedDate) => {
                if (event.type === "set" && selectedDate) {
                  setCreatedAt(selectedDate);
                }
              },
              maximumDate: new Date(),
              negativeButton: {
                label: "Cancel",
                textColor: themeColors.text.muted,
              },
              positiveButton: {
                label: "OK",
                textColor: themeColors.brand.DEFAULT,
              },
            });
          }}
          className="rounded-control border border-border bg-surface px-card py-field"
          accessibilityRole="button"
          accessibilityLabel="Select creation date"
        >
          <Text className="text-base font-sans text-text">
            {createdAt.toLocaleDateString()}
          </Text>
        </Pressable>
      )}
    </>
  );
};

export default CreationDateField;
