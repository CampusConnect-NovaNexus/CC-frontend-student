import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import Toast from "react-native-toast-message";
import { useTheme } from "@/context/ThemeContext";
import { icons } from "@/constants/icons";
import { useFocusEffect } from "expo-router";
import { addSocials } from "@/service/auth/addSocials";
import { images } from "@/constants/images";
import Forum from "@/components/Forum";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { userDetails } from "@/service/auth/userDetails";
import { getUserPoints } from "@/service/auth/GetUserPoints";
const ProfileScreen = () => {
  const { logout, user } = useAuth();
  const [addSocialsVisible, setAddSocialsVisible] = useState(false);
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
  const [phoneNumber, setPhoneNumber] = useState<String>("+91 9237947387");
  const [about, setAbout] = useState<String>(
    "Curious and driven Computer Science student at NIT Meghalaya, passionate about coding, problem-solving, and exploring emerging tech. Enthusiastic team player, always eager to learn and contribute to impactful projects."
  );
  const [editedAbout, setEditedAbout] = useState<String>("");
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const router=useRouter()
  const userPoints=async()=>{
    const data=await getUserPoints(user?.id)
    // console.log("User Points in profile",data)
    setPoints(data)
  }
  // useEffect(() => {
  //   // If the user is authenticated, set the email from user object
  //   if (user?.email) {
  //     setEmail(user.email);
  //   }

  //   // Load any previously saved profile data from AsyncStorage
  //   const loadUserData = async () => {
  //     try {
  //       const savedAddress = await AsyncStorage.getItem("@user_address");
  //       if (savedAddress) setAddress(savedAddress);

  //       const savedInstagram = await AsyncStorage.getItem("@user_instagram");
  //       if (savedInstagram) setInstagramLink(savedInstagram);

  //       const savedLinkedin = await AsyncStorage.getItem("@user_linkedin");
  //       if (savedLinkedin) setLinkedinLink(savedLinkedin);

  //       const savedYoutube = await AsyncStorage.getItem("@user_youtube");
  //       if (savedYoutube) setYoutubeLink(savedYoutube);
        
  //       const savedAbout = await AsyncStorage.getItem("@user_about");
  //       if (savedAbout) setAbout(savedAbout);
  //     } catch (error) {
  //       console.error("Error loading profile data:", error);
  //     }
  //   };
  //   userPoints()

  //   loadUserData();
  // }, [user]);
 const updateSocials = async () => {
  if (!user?.id) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'User not logged in.',
      position: 'bottom'
    });
    return;
  }

  const body = {
    user_id: user.id,
    links: {
      aboutMe: about.toString(),
      contactNo: parseInt(phoneNumber.replace(/[^0-9]/g, ""), 10),
      instagram: instagramLink.toString(),
      youtube: youtubeLink.toString(),
      github: githubLink.toString(),
      x: twitterLink.toString(),
      leetcode: leetCodeLink.toString(),
      codeforces: codeForcesLink.toString(),
    },
  };

  try {
    await addSocials(body);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Social links updated successfully.',
      position: 'bottom'
    });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Failed to update social links.',
      position: 'bottom'
    });
  }
};
const loadUserProfile = async () => {
  const res=await userDetails(user?.id)
  console.log("user details",res)
}
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
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
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Failed to logout. Please try again.',
              position: 'bottom'
            });
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const saveSocials = async () => {
    try {
      await AsyncStorage.setItem("@user_address", address.toString());
      await AsyncStorage.setItem("@user_instagram", instagramLink.toString());
      await AsyncStorage.setItem("@user_linkedin", linkedinLink.toString());
      await AsyncStorage.setItem("@user_youtube", youtubeLink.toString());

      setAddSocialsVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your profile information has been updated.',
        position: 'bottom'
      });
    } catch (error) {
      console.error("Error saving profile data:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save your profile information.',
        position: 'bottom'
      });
    }
  };
  
  const saveAbout = async () => {
    try {
      await AsyncStorage.setItem("@user_about", editedAbout.toString());
      setAbout(editedAbout);
      setEditAboutVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your about information has been updated.',
        position: 'bottom'
      });
    } catch (error) {
      console.error("Error saving about data:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save your about information.',
        position: 'bottom'
      });
    }
  };
  useFocusEffect(
    useCallback(() => {
        try {
          userPoints()
          loadUserProfile()
        } catch (error) {
          console.error("Error fetching user points:", error);
        }
      
    }, [user])
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
              onPress={() => setAddSocialsVisible(true)}
              style={{
                backgroundColor: "#d97706",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Add</Text>
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
        {/* Logout button */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#ef4444",
              padding: 16,
              borderRadius: 16,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={addSocialsVisible}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingBottom: 30,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                paddingTop: 12,
                marginBottom: 8,
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

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "700", color: "#1f2937" }}
              >
                Add Social Links
              </Text>
              <TouchableOpacity
                onPress={() => setAddSocialsVisible(false)}
                style={{ padding: 8 }}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ paddingHorizontal: 20 }}>
              {/* Input fields */}
              {[
                {
                  label: "Instagram",
                  value: instagramLink,
                  setter: setInstagramLink,
                  icon: "logo-instagram",
                },
                {
                  label: "LinkedIn",
                  value: linkedinLink,
                  setter: setLinkedinLink,
                  icon: "logo-linkedin",
                },
                {
                  label: "YouTube",
                  value: youtubeLink,
                  setter: setYoutubeLink,
                  icon: "logo-youtube",
                },
                {
                  label: "GitHub",
                  value: githubLink,
                  setter: setGithubLink,
                  icon: "logo-github",
                },
                {
                  label: "Twitter",
                  value: twitterLink,
                  setter: setTwitterLink,
                  icon: "logo-twitter",
                },
                {
                  label: "LeetCode",
                  value: leetCodeLink,
                  setter: setLeetCodeLink,
                  icon: "code-slash",
                },
                {
                  label: "Codeforces",
                  value: codeForcesLink,
                  setter: setCodeForcesLink,
                  icon: "code",
                },
              ].map((field, idx) => (
                <View key={idx} style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    {field.label}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#d1d5db",
                      borderRadius: 12,
                      paddingHorizontal: 12,
                    }}
                  >
                    <Ionicons
                      name={field.icon}
                      size={20}
                      color="#6b7280"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      value={field.value.toString()}
                      onChangeText={field.setter}
                      placeholder={`Enter ${field.label} link`}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        fontSize: 16,
                        color: "#4b5563",
                      }}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={{
                  backgroundColor: "#d97706",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  marginTop: 16,
                  marginBottom: 24,
                }}
                onPress={updateSocials}
              >
                <Text
                  style={{ color: "white", fontWeight: "700", fontSize: 16 }}
                >
                  Save Changes
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      
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

export default ProfileScreen;
