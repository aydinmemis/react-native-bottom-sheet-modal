import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

export function BlurBackdrop({
  animatedIndex,
  style,
  onPress,
}: BottomSheetBackdropProps & { onPress?: () => void }) {
  // animatedIndex.value : -1 (kapalı), 0 (ilk snap), 1 (tam açık)
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [-1, 0, 1],
      [0, 0.4, 0.7], // ✅ açılışta 0.4 koyu, yukarıda daha koyu
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      animatedIndex.value,
      [-1, 0, 1],
      [1, 1.02, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle, style]}>
        <View style={styles.overlay} />
        <View style={styles.gradientLayer} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)", // temel koyuluk
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.3))",
  },
});
