import { Redirect } from "expo-router";

export default function SSOCallback() {
  console.log("SSOCallback route hit");
  return <Redirect href="/(tabs)" />;
}