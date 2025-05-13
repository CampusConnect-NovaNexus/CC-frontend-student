import React, { useState, useEffect, useCallback } from "react";
import {
  View,
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
} from "react-native";
import Toast from "react-native-toast-message";
import { useTheme } from "@/context/ThemeContext";
import { icons } from "@/constants/icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { addSocials } from "@/service/auth/addSocials";
import { images } from "@/constants/images";
import Forum from "@/components/Forum";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { userDetails } from "@/service/auth/userDetails";
import { getUserPoints } from "@/service/auth/GetUserPoints";
const userProfileScreen = () => {
  const { user_id } = useLocalSearchParams<{ user_id: string }>();
  // const { logout, user } = useAuth();

  const [editAboutVisible, setEditAboutVisible] = useState(false);
  const [address, setAddress] = useState<String>(
    "Bhadohi, Uttar Pradesh, India"
  );
  const [email, setEmail] = useState<String>("b23cs019@gmail.com");
  const [instagramLink, setInstagramLink] = useState<String>("");
  const [linkedinLink, setLinkedinLink] = useState<String>("");
  const [youtubeLink, setYoutubeLink] = useState<String>("");
  const [githubLink, setGithubLink] = useState<String>("");
  const [twitterLink, setTwitterLink] = useState<String>("");
  const [leetCodeLink, setLeetCodeLink] = useState<String>("");
  const [codeForcesLink, setCodeForcesLink] = useState<String>("");
  const [phoneNumber, setPhoneNumber] = useState<String>("");
  const [about, setAbout] = useState<String>("");
  const [editedAbout, setEditedAbout] = useState<String>("");
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const router=useRouter()
  // We're now getting points directly from the user profile API
  // This function is kept for backward compatibility
  const userPoints=async()=>{
    try {
      const data = await getUserPoints(user_id);
      if (data) {
        setPoints(data);
      }
    } catch (error) {
      console.error("Error fetching user points:", error);
    }
  }
  
 
const loadUserProfile = async () => {
  try {
    const res = await userDetails(user_id);
    console.log("user details", res);
    
    // Create a formatted user object from the direct API response
    const userData = {
      id: res.id,
      name: res.name,
      email: res.email,
      roles: res.roles,
      points: res.points,
      links: {
        aboutMe: res.aboutMe,
        contactNo: res.contactNo,
        instagram: res.instaLink,
        youtube: res.youtubeLink,
        github: res.githubLink,
        x: res.XLink,
        leetcode: res.leetcodeLink,
        codeforces: res.codeforcesLink
      }
    };
    
    setUserData(userData);
    
    // Update user information from the response
    if (res.email) setEmail(res.email);
    
    // Update social links if available
    if (res.aboutMe) setAbout(res.aboutMe);
    if (res.contactNo) setPhoneNumber(res.contactNo.toString());
    if (res.instaLink) setInstagramLink(res.instaLink);
    if (res.youtubeLink) setYoutubeLink(res.youtubeLink);
    if (res.githubLink) setGithubLink(res.githubLink);
    if (res.XLink) setTwitterLink(res.XLink);
    if (res.leetcodeLink) setLeetCodeLink(res.leetcodeLink);
    if (res.codeforcesLink) setCodeForcesLink(res.codeforcesLink);
    
    // Update points
    if (res.points) {
      setPoints(res.points);
    }
  } catch (error) {
    console.error("Error loading user profile:", error);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Failed to load user profile',
      position: 'bottom'
    });
  }
}
 
  
  
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          await loadUserProfile();
        } catch (error) {
          console.error("Error fetching user data:", error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to load user data',
            position: 'bottom'
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }, [user_id])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fcf9" }}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      )}

      {/* Header Image and Profile */}
      <View style={{ height: 220, marginTop: 10 }}>
      <View className="absolute flex-row justify-center gap-2 -right-16 z-20 border-2 bg-white border-amber-600 w-hit h-fit m-10 mx-20 p-2"
        style={{
          elevation:5,
          borderRadius : 30
        }}>
        <Image
          source={icons.coin}
          className="h-7 w-7 object-cover rounded-full"
        />
        {/* Fetch user points here */}
        <Text className="text-black text-lg font-semibold self-end">{points}</Text>
      </View>
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
          
          {/* Camera Icon */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: '#6366f1',
            padding: 8,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: 'white',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
          

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
            {userData?.name || "User"}
          </Text>
          <Text style={{ fontSize: 16, color: "#6b7280", marginTop: 4 }}>
            {userData?.address || address}
          </Text>
          {userData?.roles && userData.roles.length > 0 && (
            <Text style={{ fontSize: 14, color: "#6b7280", marginTop: 2, fontStyle: 'italic' }}>
              {userData.roles[0]}
            </Text>
          )}
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
              Socials
            </Text>
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
            {/* Instagram */}
            <View style={{ alignItems: "center", opacity: instagramLink ? 1 : 0.4 }}>
              <Image
                source={icons.instagram}
                style={{ 
                  width: 32, 
                  height: 32,
                  opacity: instagramLink ? 1 : 0.5
                }}
              />
              <Text style={{ 
                fontSize: 12, 
                color: instagramLink ? "#6b7280" : "#a0a0a0", 
                marginTop: 4 
              }}>
                Instagram
              </Text>
            </View>
            
            {/* LinkedIn */}
            <View style={{ alignItems: "center", opacity: linkedinLink ? 1 : 0.4 }}>
              <Image
                source={icons.linkedin}
                style={{ 
                  width: 32, 
                  height: 32,
                  opacity: linkedinLink ? 1 : 0.5
                }}
              />
              <Text style={{ 
                fontSize: 12, 
                color: linkedinLink ? "#6b7280" : "#a0a0a0", 
                marginTop: 4 
              }}>
                LinkedIn
              </Text>
            </View>
            
            {/* YouTube */}
            <View style={{ alignItems: "center", opacity: youtubeLink ? 1 : 0.4 }}>
              <Image
                source={icons.youTube}
                style={{ 
                  width: 32, 
                  height: 32,
                  opacity: youtubeLink ? 1 : 0.5
                }}
              />
              <Text style={{ 
                fontSize: 12, 
                color: youtubeLink ? "#6b7280" : "#a0a0a0", 
                marginTop: 4 
              }}>
                YouTube
              </Text>
            </View>
            
            {/* GitHub */}
            <View style={{ alignItems: "center", opacity: githubLink ? 1 : 0.4 }}>
              <Image
                source={icons.github}
                style={{ 
                  width: 32, 
                  height: 32,
                  opacity: githubLink ? 1 : 0.5
                }}
              />
              <Text style={{ 
                fontSize: 12, 
                color: githubLink ? "#6b7280" : "#a0a0a0", 
                marginTop: 4 
              }}>
                GitHub
              </Text>
            </View>
            
            {/* Twitter */}
            <View style={{ alignItems: "center", opacity: twitterLink ? 1 : 0.4 }}>
              <Image
                source={icons.twitter}
                style={{ 
                  width: 32, 
                  height: 32,
                  opacity: twitterLink ? 1 : 0.5
                }}
              />
              <Text style={{ 
                fontSize: 12, 
                color: twitterLink ? "#6b7280" : "#a0a0a0", 
                marginTop: 4 
              }}>
                Twitter
              </Text>
            </View>
            
            {/* LeetCode */}
            <View style={{ alignItems: "center", opacity: leetCodeLink ? 1 : 0.4 }}>
              <Image
                source={icons.leetcode}
                style={{ 
                  width: 32, 
                  height: 32,
                  opacity: leetCodeLink ? 1 : 0.5
                }}
              />
              <Text style={{ 
                fontSize: 12, 
                color: leetCodeLink ? "#6b7280" : "#a0a0a0", 
                marginTop: 4 
              }}>
                LeetCode
              </Text>
            </View>
            
            {/* CodeForces */}
            <View style={{ alignItems: "center", opacity: codeForcesLink ? 1 : 0.4 }}>
              <Image
                source={icons.codeforces}
                style={{ 
                  width: 32, 
                  height: 32,
                  opacity: codeForcesLink ? 1 : 0.5
                }}
              />
              <Text style={{ 
                fontSize: 12, 
                color: codeForcesLink ? "#6b7280" : "#a0a0a0", 
                marginTop: 4 
              }}>
                CodeForces
              </Text>
            </View>
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
              onPress={() => {
                setEditedAbout(about);
                setEditAboutVisible(true);
              }}
            >
              <Ionicons name="pencil" size={20} color="#d97706" />
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
                {userData?.links?.contactNo || phoneNumber || "Not provided"}
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
              <Text style={{ color: "#4b5563", fontSize: 16 }}>{userData?.email || email || "Not provided"}</Text>
            </View>
          </View>
        </View>
        

        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <TouchableOpacity
            onPress={()=>router.push(`/postsOfUser?user_id=${user_id}`)}
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
        {/* Logout button */}
       
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
