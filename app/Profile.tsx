import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import Forum from "@/components/Forum";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

const ProfileScreen = () => {
  const { logout, user } = useAuth();
  const [addSocialsVisible, setAddSocialsVisible] = useState(false);
  const [address, setAddress] = useState<String>("Bhadohi, Uttar Pradesh, India");
  const [email, setEmail] = useState<String>("b23cs019@gmail.com");
  const [instagramLink, setInstagramLink] = useState<String>("http://");
  const [linkedinLink, setLinkedinLink] = useState<String>("");
  const [youtubeLink, setYoutubeLink] = useState<String>("http://");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If the user is authenticated, set the email from user object
    if (user?.email) {
      setEmail(user.email);
    }
    
    // Load any previously saved profile data from AsyncStorage
    const loadUserData = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem('@user_address');
        if (savedAddress) setAddress(savedAddress);
        
        const savedInstagram = await AsyncStorage.getItem('@user_instagram');
        if (savedInstagram) setInstagramLink(savedInstagram);
        
        const savedLinkedin = await AsyncStorage.getItem('@user_linkedin');
        if (savedLinkedin) setLinkedinLink(savedLinkedin);
        
        const savedYoutube = await AsyncStorage.getItem('@user_youtube');
        if (savedYoutube) setYoutubeLink(savedYoutube);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    
    loadUserData();
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
              // Router redirect is handled by the AuthGuard in _layout.tsx
            } catch (error) {
              Alert.alert("Error", "Failed to logout. Please try again.");
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const saveSocials = async () => {
    try {
      await AsyncStorage.setItem('@user_address', address.toString());
      await AsyncStorage.setItem('@user_instagram', instagramLink.toString());
      await AsyncStorage.setItem('@user_linkedin', linkedinLink.toString());
      await AsyncStorage.setItem('@user_youtube', youtubeLink.toString());
      
      setAddSocialsVisible(false);
      Alert.alert("Success", "Your profile information has been updated.");
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert("Error", "Failed to save your profile information.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#fdfcf9]">
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      )}
      
      <View className="w-full h-60">
        <ImageBackground
          source={images.profile_background}
          className="w-full h-full"
          resizeMode="cover"
        >
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-30">
            <Text className="text-white text-xl font-bold">
              {user?.name || "User"}
            </Text>
            <Text className="text-white">{email}</Text>
            <Text className="text-white text-sm">{address}</Text>
          </View>
        </ImageBackground>
      </View>

      <View className="p-4 flex-row justify-between items-center">
        <Text className="text-lg font-bold">Social Profiles</Text>
        <TouchableOpacity
          onPress={() => setAddSocialsVisible(true)}
          className="bg-gray-200 p-2 rounded-full"
        >
          <Ionicons name="pencil" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <View className="mx-4 bg-white rounded-lg shadow p-4 mb-5">
        <View className="flex-row items-center mb-3">
          <Ionicons name="logo-instagram" size={24} color="#E1306C" />
          <Text className="ml-3 text-gray-700">{instagramLink}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
          <Text className="ml-3 text-gray-700">
            {linkedinLink || "Not connected"}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="logo-youtube" size={24} color="#FF0000" />
          <Text className="ml-3 text-gray-700">{youtubeLink}</Text>
        </View>
      </View>

      {/* Logout button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mx-4 bg-red-500 rounded-lg p-4 mb-5 flex-row justify-center items-center"
      >
        <Ionicons name="log-out-outline" size={24} color="white" className="mr-2" />
        <Text className="text-white text-lg font-bold ml-2">Logout</Text>
      </TouchableOpacity>

      {/* Social profiles modal */}
      <Modal
        visible={addSocialsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddSocialsVisible(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold">Edit Profile</Text>
              <TouchableOpacity onPress={() => setAddSocialsVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text className="font-semibold mb-1">Address</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4"
              value={address.toString()}
              onChangeText={(text) => setAddress(text)}
              placeholder="Your address"
            />

            <Text className="font-semibold mb-1">Instagram</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4"
              value={instagramLink.toString()}
              onChangeText={(text) => setInstagramLink(text)}
              placeholder="Instagram profile link"
            />

            <Text className="font-semibold mb-1">LinkedIn</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4"
              value={linkedinLink.toString()}
              onChangeText={(text) => setLinkedinLink(text)}
              placeholder="LinkedIn profile link"
            />

            <Text className="font-semibold mb-1">YouTube</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4"
              value={youtubeLink.toString()}
              onChangeText={(text) => setYoutubeLink(text)}
              placeholder="YouTube channel link"
            />

            <TouchableOpacity
              onPress={saveSocials}
              className="bg-blue-500 p-3 rounded-lg mb-2"
            >
              <Text className="text-white text-center font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ProfileScreen;
