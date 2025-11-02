import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider as GorhomProvider,
} from "@gorhom/bottom-sheet";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BlurBackdrop } from "../components/BlurBackdrop";

/** 🎯 Context tipi */
interface BottomSheetContextType {
  openSheet: (content: ReactNode, snapPoints?: string[]) => void;
  closeSheet: () => void;
  presentWithProps: <T extends object>(
    Component: React.ComponentType<T>,
    props: T,
    snapPoints?: string[]
  ) => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx)
    throw new Error(
      "useBottomSheet must be used inside BottomSheetModalProvider"
    );
  return ctx;
};

export const BottomSheetModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [content, setContent] = useState<ReactNode>(null);
  const [snapPoints, setSnapPoints] = useState(["40%", "75%"]);

  // 🎬 Animasyon state
  const progress = useSharedValue(0);

  /** ✨ iOS-tarzı soft açılış animasyonu */
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [24, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      progress.value,
      [0, 1],
      [0.985, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        {
          translateY: withTiming(translateY, {
            duration: 360,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          }),
        },
        {
          scale: withTiming(scale, {
            duration: 380,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          }),
        },
      ],
    };
  });

  /** ✅ Sheet açma */
  const openSheet = useCallback(
    (node: ReactNode, snaps?: string[]) => {
      if (snaps) setSnapPoints(snaps);
      setContent(node);

      requestAnimationFrame(() => {
        progress.value = withTiming(1, {
          duration: 360,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        bottomSheetRef.current?.present();
      });
    },
    [progress]
  );

  /** ✅ Sheet kapama */
  const closeSheet = useCallback(() => {
    progress.value = withTiming(
      0,
      { duration: 260, easing: Easing.bezier(0.4, 0, 0.2, 1) },
      // ⛳️ Yeni yaklaşım: doğrudan setState çağrısı (runOnJS gerekmez)
      () => {
        runOnJS(setContent)(null);
      }
    );
    bottomSheetRef.current?.dismiss();
  }, [progress]);

  /** ✅ Component’i props ile aç */
  const presentWithProps = useCallback(
    <T extends object>(
      Component: React.ComponentType<T>,
      props: T,
      snaps?: string[]
    ) => {
      const element = React.createElement(Component, { ...props, closeSheet });
      openSheet(element, snaps);
    },
    [openSheet, closeSheet]
  );

  const contextValue = useMemo(
    () => ({ openSheet, closeSheet, presentWithProps }),
    [openSheet, closeSheet, presentWithProps]
  );

  return (
    <GorhomProvider>
      <BottomSheetContext.Provider value={contextValue}>
        {children}

        {content && (
          <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose
            enableDismissOnClose
            handleIndicatorStyle={{ backgroundColor: "#999" }}
            backgroundStyle={{
              backgroundColor: "rgba(255,255,255,0.97)",
              borderRadius: 20,
            }}
            animationConfigs={{
              duration: 400,
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            }}
            backdropComponent={(props) => (
              <BlurBackdrop {...props} onPress={closeSheet} />
            )}
          >
            <Animated.View style={[{ flex: 1, padding: 20 }, animatedStyle]}>
              <BottomSheetView>{content}</BottomSheetView>
            </Animated.View>
          </BottomSheetModal>
        )}
      </BottomSheetContext.Provider>
    </GorhomProvider>
  );
};
