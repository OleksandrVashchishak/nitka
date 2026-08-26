import {
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from "@expo-google-fonts/fraunces";
import { GreatVibes_400Regular } from "@expo-google-fonts/great-vibes";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { MarckScript_400Regular } from "@expo-google-fonts/marck-script";
import { useFonts } from "expo-font";

export function useAppFonts() {
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    GreatVibes_400Regular,
    MarckScript_400Regular,
  });
  return { loaded: loaded || !!error, error };
}
