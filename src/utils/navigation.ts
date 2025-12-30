import colors from "@/utils/colors";

export const HEADER_TITLE_STYLE = {
  fontFamily: "Montserrat_600SemiBold",
  fontSize: 20,
  color: colors.text.DEFAULT,
} as const;

export const DEFAULT_HEADER_OPTIONS = {
  headerTitleStyle: HEADER_TITLE_STYLE,
  headerStyle: {
    backgroundColor: colors.brand.subtle,
  },
  headerTintColor: colors.text.DEFAULT,
} as const;
