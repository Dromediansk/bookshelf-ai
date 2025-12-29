import { Platform, Pressable, Text } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import themeColors from "@/utils/colors";

type DateFieldProps = {
  date: Date;
  setDate: (date: Date) => void;
  label: string;
};

const DateField = ({ date, setDate, label }: DateFieldProps) => {
  return (
    <>
      <Text className="mb-2 text-sm font-sansMedium text-text">{label}</Text>
      {Platform.OS === "ios" ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="compact"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
          maximumDate={new Date()}
          accentColor={themeColors.brand.DEFAULT}
        />
      ) : (
        <Pressable
          onPress={() => {
            DateTimePickerAndroid.open({
              value: date,
              mode: "date",
              onChange: (event, selectedDate) => {
                if (event.type === "set" && selectedDate) {
                  setDate(selectedDate);
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
          accessibilityLabel={`Select ${label.toLowerCase()}`}
        >
          <Text className="text-base font-sans text-text">
            {date.toLocaleDateString()}
          </Text>
        </Pressable>
      )}
    </>
  );
};

export default DateField;
