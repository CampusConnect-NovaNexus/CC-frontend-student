// components/ZoomModal.tsx
import { Animated, Pressable, View, Text, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';

interface ZoomModalProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function My_modal({ visible, onClose, children }: ZoomModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
        {children}
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
    elevation: 10,
  },
  closeBtn: {
    backgroundColor: '#ef4444',
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
