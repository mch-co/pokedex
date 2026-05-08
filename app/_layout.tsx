import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="details"
        options={{
          headerShown: false,
          presentation: "formSheet",
          sheetAllowedDetents: [0.55],
          headerBackButtonDisplayMode: "minimal",
          sheetCornerRadius: 25,
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
