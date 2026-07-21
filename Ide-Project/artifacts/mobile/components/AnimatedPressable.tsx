import React, { useRef } from "react";
import { Animated, Pressable, PressableProps, ViewStyle } from "react-native";

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  scale?: number;
  style?: ViewStyle | ViewStyle[];
}

export function AnimatedPressable({ children, scale = 0.97, style, ...props }: AnimatedPressableProps) {
  const anim = useRef(new Animated.Value(1)).current;

  const onPressIn = (e: any) => {
    Animated.spring(anim, { toValue: scale, useNativeDriver: true, friction: 5 }).start();
    props.onPressIn?.(e);
  };

  const onPressOut = (e: any) => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
    props.onPressOut?.(e);
  };

  return (
    <Animated.View style={[{ transform: [{ scale: anim }] }, style]}>
      <Pressable {...props} onPressIn={onPressIn} onPressOut={onPressOut} style={{ flex: 1 }}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
