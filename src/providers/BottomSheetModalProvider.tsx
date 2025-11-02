import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider as GorhomProvider,
  useBottomSheetSpringConfigs,
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BlurBackdrop } from "../components/BlurBackdrop";

/** 🎯 Context tipi */
interface BottomSheetContextType {
  openSheet: (
    content: ReactNode,
    snapPoints?: string[],
    modalProps?: Partial<BottomSheetModalProps>
  ) => void;
  closeSheet: () => void;
  presentWithProps: <T extends object>(
    Component: React.ComponentType<T>,
    props: T,
    snapPoints?: string[],
    modalProps?: Partial<BottomSheetModalProps>
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
  const [customModalProps, setCustomModalProps] = useState<
    Partial<BottomSheetModalProps>
  >({});

  // 🎬 Animasyon state
  const progress = useSharedValue(0);

  // ⚡ Modal için optimize edilmiş spring config (gorhom/bottom-sheet native)
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 25,
    overshootClamping: false,
    stiffness: 400,
    mass: 0.4,
  });

  /** ✨ Ultra hızlı minimal animasyon - iOS & Android uyumlu */
  const contentAnimatedStyle = useAnimatedStyle(() => {
    // Opacity: Hızlı fade-in
    const opacity = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, 0.9, 1],
      Extrapolation.CLAMP
    );

    // TranslateY: Minimal hareket (daha subtle)
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [12, 0],
      Extrapolation.CLAMP
    );

    // Scale: Çok minimal zoom
    const scale = interpolate(
      progress.value,
      [0, 1],
      [0.98, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  /** ✅ Sheet açma - Smooth spring animasyon */
  const openSheet = useCallback(
    (
      node: ReactNode,
      snaps?: string[],
      modalProps?: Partial<BottomSheetModalProps>
    ) => {
      if (snaps) setSnapPoints(snaps);
      if (modalProps) setCustomModalProps(modalProps);
      setContent(node);

      requestAnimationFrame(() => {
        // Ultra hızlı spring: Anlık açılış, minimal bounce
        progress.value = withSpring(1, {
          damping: 20,
          stiffness: 300,
          mass: 0.4,
          overshootClamping: false,
        });
        bottomSheetRef.current?.present();
      });
    },
    [progress]
  );

  /** ✅ Sheet kapama - Ultra hızlı */
  const closeSheet = useCallback(() => {
    // Kapanış: Çok hızlı ve keskin
    progress.value = withTiming(
      0,
      {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 1, 1), // easeInQuart - hızlı çıkış
      },
      () => {
        runOnJS(setContent)(null);
        runOnJS(setCustomModalProps)({});
      }
    );
    bottomSheetRef.current?.dismiss();
  }, [progress]);

  /** ✅ Component'i props ile aç */
  const presentWithProps = useCallback(
    <T extends object>(
      Component: React.ComponentType<T>,
      props: T,
      snaps?: string[],
      modalProps?: Partial<BottomSheetModalProps>
    ) => {
      const element = React.createElement(Component, { ...props, closeSheet });
      openSheet(element, snaps, modalProps);
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
            enablePanDownToClose={true}
            enableDismissOnClose={true}
            handleIndicatorStyle={{ backgroundColor: "#999" }}
            backgroundStyle={{
              backgroundColor: "rgba(255,255,255,1)",
              borderRadius: 20,
            }}
            animationConfigs={animationConfigs}
            backdropComponent={(props) => (
              <BlurBackdrop {...props} onPress={closeSheet} />
            )}
            {...customModalProps}
          >
            <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
              {content}
            </Animated.View>
          </BottomSheetModal>
        )}
      </BottomSheetContext.Provider>
    </GorhomProvider>
  );
};
