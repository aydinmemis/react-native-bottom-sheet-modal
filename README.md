# @aydinmemis/react-native-bottom-sheet-modal

Beautifully animated, lightweight, and type-safe **Bottom Sheet Modal Provider** built with [@gorhom/bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet) and [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/).

This package provides a **global bottom sheet context** for your app — allowing you to open modals dynamically with smooth, iOS-style animations and Reanimated-powered transitions.

---

[![npm version](https://img.shields.io/npm/v/@aydinmemis/react-native-bottom-sheet-modal.svg?color=blue)](https://www.npmjs.com/package/@aydinmemis/react-native-bottom-sheet-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-%3E%3D0.73-green.svg)](https://reactnative.dev/)
[![GitHub](https://img.shields.io/badge/source-github-black?logo=github)](https://github.com/aydinmemis/react-native-bottom-sheet-modal)
[![Homepage](https://img.shields.io/badge/homepage-online-blue)](https://github.com/aydinmemis/react-native-bottom-sheet-modal#readme)

---

## ✨ Features

- 🎬 Smooth, native-feel **Reanimated 4 transitions**
- 🧩 **Context-based API** — open sheets from anywhere in your app
- 💡 Works with **@gorhom/bottom-sheet v5+**
- 🌙 Blurred backdrop with adaptive opacity
- 📱 Fully compatible with both iOS & Android

---

## ⚙️ Installation

```bash
npm install @aydinmemis/react-native-bottom-sheet-modal
# or
yarn add @aydinmemis/react-native-bottom-sheet-modal
```

---

### 📦 Peer Dependencies

Make sure the following dependencies are also installed in your project:

```bash
npm install react react-native react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet
```

If using Expo:

```bash
npx expo install react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet expo-blur
```

---

## 🚀 Usage

```tsx
import React from "react";
import { Button, View, Text } from "react-native";
import {
  BottomSheetModalProvider,
  useBottomSheet,
} from "@aydinmemis/react-native-bottom-sheet-modal";

const ProductSheet = ({ name, stock, closeSheet }: any) => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 18, fontWeight: "600" }}>{name}</Text>
    <Text>Stock: {stock} units</Text>
    <Button title="Close" onPress={closeSheet} />
  </View>
);

const HomeScreen = () => {
  const { presentWithProps } = useBottomSheet();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Open Bottom Sheet"
        onPress={() =>
          presentWithProps(ProductSheet, { name: "MacBook Air", stock: 12 })
        }
      />
    </View>
  );
};

export default function App() {
  return (
    <BottomSheetModalProvider>
      <HomeScreen />
    </BottomSheetModalProvider>
  );
}
```

---

## 🪄 Props and API

### `useBottomSheet()`

Hook for interacting with the modal globally.

| Function                                          | Description                              |
| ------------------------------------------------- | ---------------------------------------- |
| `openSheet(content, snapPoints?)`                 | Opens a custom ReactNode in the sheet    |
| `closeSheet()`                                    | Closes the active sheet                  |
| `presentWithProps(Component, props, snapPoints?)` | Opens a component with props dynamically |

---

## 🧠 How it works

Under the hood:

- Uses a single global `BottomSheetModal` reference.
- Animations powered by Reanimated 4.
- Smooth blur backdrop and easing curves.
- Lightweight and non-intrusive — no Redux, no extra providers.

---

## 📄 License

MIT © [Aydın Memiş](https://github.com/aydinmemis)

---

# 🇹🇷 Türkçe

[@gorhom/bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet) ve [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) kullanılarak oluşturulmuş, **hafif, animasyonlu ve tip güvenli** bir Bottom Sheet modal sağlayıcısıdır.

Bu paket, uygulamanızda her yerden erişilebilen **global bir Bottom Sheet context** sunar — böylece istediğiniz ekrandan dinamik olarak alt modallar açabilirsiniz.

---

## ✨ Özellikler

- 🎬 Yumuşak ve doğal **Reanimated 4 geçişleri**
- 🧩 **Context tabanlı API** — uygulamanın herhangi bir yerinden açılabilir
- 💡 **@gorhom/bottom-sheet v5+** ile uyumlu
- 🌙 Adaptif bulanık arka plan efekti
- 📱 iOS ve Android ile tam uyumlu

---

## ⚙️ Kurulum

```bash
npm install @aydinmemis/react-native-bottom-sheet-modal
# veya
yarn add @aydinmemis/react-native-bottom-sheet-modal
```

### Gerekli Paketler (Peer Dependencies)

```bash
npm install react react-native react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet
```

Expo kullanıyorsanız:

```bash
npx expo install react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet expo-blur
```

---

## 🚀 Kullanım

```tsx
import React from "react";
import { Button, View, Text } from "react-native";
import {
  BottomSheetModalProvider,
  useBottomSheet,
} from "@aydinmemis/react-native-bottom-sheet-modal";

const ProductSheet = ({ name, stock, closeSheet }: any) => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 18, fontWeight: "600" }}>{name}</Text>
    <Text>Stok: {stock} adet</Text>
    <Button title="Kapat" onPress={closeSheet} />
  </View>
);

const HomeScreen = () => {
  const { presentWithProps } = useBottomSheet();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Bottom Sheet Aç"
        onPress={() =>
          presentWithProps(ProductSheet, { name: "MacBook Air", stock: 12 })
        }
      />
    </View>
  );
};

export default function App() {
  return (
    <BottomSheetModalProvider>
      <HomeScreen />
    </BottomSheetModalProvider>
  );
}
```

---

## 🧠 Nasıl Çalışır?

- Global bir `BottomSheetModal` referansı kullanır
- Animasyonlar **Reanimated 4** ile güçlendirilmiştir
- Arka plan efekti ve geçişler iOS benzeri yumuşaklıkta
- Hafif ve bağımsız — Redux veya ek Provider gerekmez

---

## 📄 Lisans

MIT © [Aydın Memiş](https://github.com/aydinmemis)

---

**📍 Repository:** [https://github.com/aydinmemis/react-native-bottom-sheet-modal](https://github.com/aydinmemis/react-native-bottom-sheet-modal)
**🌐 Homepage:** [https://github.com/aydinmemis/react-native-bottom-sheet-modal#readme](https://github.com/aydinmemis/react-native-bottom-sheet-modal#readme)
