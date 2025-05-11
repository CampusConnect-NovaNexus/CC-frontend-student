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

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { fetchUser } from "@/service/fetchUserById";

const fetchUserProfile=async(user_id:string)=>{
    const response=fetchUser(user_id);    
}
const userProfileScreen = (user_id: string) => {
  useEffect(()=>{
    fetchUserProfile(user_id);
  },[])

    


  return (
    <View style={{ flex: 1, backgroundColor: "#f9fcf9" }}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      )}

      {/* Header Image and Profile */}
      <View style={{ height: 220, marginTop: 10 }}>
        <ImageBackground
          source={images.banner}
          style={{ width: "100%", height: 300 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            top: 100,
            left: "50%",
            marginLeft: -55,
            backgroundColor: "white",
            borderRadius: 999,
            height: 110,
            width: 110,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Image
            source={icons.profile}
            style={{ height: 100, width: 100, borderRadius: 999 }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#d97706",
              padding: 8,
              borderRadius: 999,
            }}
          >
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: "#fdfcf9",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Handle */}
        <View
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            paddingTop: 12,
          }}
        >
          <View
            style={{
              width: "33%",
              height: 5,
              backgroundColor: "#d1d5db",
              borderRadius: 9999,
            }}
          />
        </View>

        {/* User Info */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: "#1f2937" }}>
            {user?.name || "User"}
          </Text>
          <Text style={{ fontSize: 16, color: "#6b7280", marginTop: 4 }}>
            {address}
          </Text>
        </View>

        {/* Social Links */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "white",
              padding: 16,
              borderRadius: 16,
              shadowColor: "#d1d5db",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151" }}>
              My Socials
            </Text>
            <TouchableOpacity
              
              style={{
                backgroundColor: "#d97706",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 999,
              }}
            >
              
            </TouchableOpacity>
          </View>

          {/* Icons */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
              marginTop: 16,
              backgroundColor: "white",
              padding: 16,
              borderRadius: 16,
              shadowColor: "#d1d5db",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {instagramLink ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={icons.instagram}
                  style={{ width: 32, height: 32 }}
                />
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  Instagram
                </Text>
              </View>
            ) : null}
            {linkedinLink ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={icons.linkedin}
                  style={{ width: 32, height: 32 }}
                />
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  LinkedIn
                </Text>
              </View>
            ) : null}
            {youtubeLink ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={icons.youTube}
                  style={{ width: 32, height: 32 }}
                />
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  YouTube
                </Text>
              </View>
            ) : null}
            {githubLink ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={icons.github}
                  style={{ width: 32, height: 32 }}
                />
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  GitHub
                </Text>
              </View>
            ) : null}
            {twitterLink ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={icons.twitter}
                  style={{ width: 32, height: 32 }}
                />
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  Twitter
                </Text>
              </View>
            ) : null}
            {leetCodeLink ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={icons.leetcode}
                  style={{ width: 32, height: 32 }}
                />
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  LeetCode
                </Text>
              </View>
            ) : null}
            {codeForcesLink ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={icons.codeforces}
                  style={{ width: 32, height: 32 }}
                />
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  CodeForces
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* About Me */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "white",
              padding: 16,
              borderRadius: 16,
              shadowColor: "#d1d5db",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151" }}>
              About Me
            </Text>
            <TouchableOpacity 
              style={{ padding: 4 }}
              
            >
            </TouchableOpacity>
          </View>

          {/* About Text */}
          <View
            style={{
              marginTop: 16,
              backgroundColor: "white",
              padding: 16,
              borderRadius: 16,
              shadowColor: "#d1d5db",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ color: "#4b5563", lineHeight: 22 }}>{about}</Text>
          </View>
        </View>

        {/* Contact Me */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 16,
              shadowColor: "#d1d5db",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 12,
              }}
            >
              Contact Me
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: 10,
                  borderRadius: 999,
                  marginRight: 12,
                }}
              >
                <Ionicons name="call" size={20} color="#0891b2" />
              </View>
              <Text style={{ color: "#4b5563", fontSize: 16 }}>
                {phoneNumber}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: 10,
                  borderRadius: 999,
                  marginRight: 12,
                }}
              >
                <Ionicons name="mail" size={20} color="#0891b2" />
              </View>
              <Text style={{ color: "#4b5563", fontSize: 16 }}>{email}</Text>
            </View>
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <TouchableOpacity
            onPress={()=>router.push({
              pathname: '/postsOfUser',
              params: {
                user_id:user?.id
              },
            })}
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 16,
              shadowColor: "#d1d5db",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="document-text" size={24} color="#d97706" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151" }}>
                Your Posts
              </Text>
            </View>
            <View style={{ 
              backgroundColor: "#f3f4f6", 
              borderRadius: 999,
              padding: 8,
            }}>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </View>
          </TouchableOpacity>
        </View>
        
      </ScrollView>

     

      
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});

export default userProfileScreen;
