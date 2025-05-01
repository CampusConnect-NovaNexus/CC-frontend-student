import React, { useState } from "react";
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
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import Forum from "@/components/Forum";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const router = useRouter();
  const [addSocialsVisible, setAddSocialsVisible] = useState(false);
  const [address, setAddress] = useState<String>(
    "Bhadohi, Uttar Pradesh, India"
  );
  const [email, setEmail] = useState<String>("b23cs019@gmail.com");
  const [instagramLink, setInstagramLink] = useState<String>("http://");
  const [linkedinLink, setLinkedinLink] = useState<String>("");
  const [youtubeLink, setYoutubeLink] = useState<String>("http://");
  const [githubLink, setGithubLink] = useState<String>("http");
  const [twitterLink, setTwitterLink] = useState<String>("");
  const [leetCodeLink, setLeetCodeLink] = useState<String>("");
  const [codeForcesLink, setCodeForcesLink] = useState<String>("http ");
  const [phoneNumber, setPhoneNumber] = useState<String>("+91 9898281290");
  const [about, setAbout] = useState<String>(
    "Passionate about technology and innovation, I'm currently pursuing my degree in Computer Science. I enjoy solving complex problems and building applications that make a difference."
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fcf9' }}>
      {/* Header Image and Profile */}
      <View style={{ height: 220, marginTop: 10 }}>
        <Image
          source={images.banner}
          className="object-contain"
        />
        <View style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          marginLeft: -55,
          backgroundColor: 'white',
          borderRadius: 999,
          height: 110,
          width: 110,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5
        }}>
          <Image
            source={icons.profile}
            style={{ height: 100, width: 100, borderRadius: 999 }}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#d97706',
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
        style={{ flex: 1, backgroundColor: '#fdfcf9', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Handle */}
        <View style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 12,
        }}>
          <View style={{
            width: '33%',
            height: 5,
            backgroundColor: '#d1d5db',
            borderRadius: 9999
          }} />
        </View>

        {/* User Info */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#1f2937' }}>Shashank Umar</Text>
          <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 4 }}>{address}</Text>
        </View>

        {/* Social Links */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 16,
            shadowColor: '#d1d5db',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151' }}>
              My Socials
            </Text>
            <TouchableOpacity
              onPress={() => setAddSocialsVisible(true)}
              style={{
                backgroundColor: '#d97706',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 999
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Icons */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 16,
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 16,
            shadowColor: '#d1d5db',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}>
            {instagramLink ? (
              <View style={{ alignItems: 'center' }}>
                <Image source={icons.instagram} style={{ width: 32, height: 32 }} />
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Instagram</Text>
              </View>
            ) : null}
            {linkedinLink ? (
              <View style={{ alignItems: 'center' }}>
                <Image source={icons.linkedin} style={{ width: 32, height: 32 }} />
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>LinkedIn</Text>
              </View>
            ) : null}
            {youtubeLink ? (
              <View style={{ alignItems: 'center' }}>
                <Image source={icons.youTube} style={{ width: 32, height: 32 }} />
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>YouTube</Text>
              </View>
            ) : null}
            {githubLink ? (
              <View style={{ alignItems: 'center' }}>
                <Image source={icons.github} style={{ width: 32, height: 32 }} />
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>GitHub</Text>
              </View>
            ) : null}
            {twitterLink ? (
              <View style={{ alignItems: 'center' }}>
                <Image source={icons.twitter} style={{ width: 32, height: 32 }} />
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Twitter</Text>
              </View>
            ) : null}
            {leetCodeLink ? (
              <View style={{ alignItems: 'center' }}>
                <Image source={icons.leetcode} style={{ width: 32, height: 32 }} />
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>LeetCode</Text>
              </View>
            ) : null}
            {codeForcesLink ? (
              <View style={{ alignItems: 'center' }}>
                <Image source={icons.codeforces} style={{ width: 32, height: 32 }} />
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>CodeForces</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* About Me */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          {/* About Text */}
          <View style={{
            marginTop: 16,
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 16,
            shadowColor: '#d1d5db',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', padding: 4}}>
                About Me
              </Text>
              <TouchableOpacity style={{ padding: 4 }}>
                <Ionicons name="pencil" size={20} color="#d97706" />
              </TouchableOpacity>
            </View>
            <Text style={{ color: '#4b5563', lineHeight: 22, paddingLeft: 6}}>{about}</Text>
          </View>
        </View>

        {/* Contact Me */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <View style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 16,
            shadowColor: '#d1d5db',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
              Contact Me
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                backgroundColor: '#f3f4f6',
                padding: 10,
                borderRadius: 999,
                marginRight: 12
              }}>
                <Ionicons name="call" size={20} color="#0891b2" />
              </View> 
              <Text style={{ color: '#4b5563', fontSize: 16 }}>{phoneNumber}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                backgroundColor: '#f3f4f6',
                padding: 10,
                borderRadius: 999,
                marginRight: 12
              }}>
                <Ionicons name="mail" size={20} color="#0891b2" />
              </View>
              <Text style={{ color: '#4b5563', fontSize: 16 }}>{email}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={addSocialsVisible} animationType="slide" transparent={true}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.06)',
          justifyContent: 'flex-end'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingBottom: 30,
            maxHeight: '80%'
          }}>
            <View style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              paddingTop: 12,
              marginBottom: 8
            }}>
              <View style={{
                width: '33%',
                height: 5,
                backgroundColor: '#d1d5db',
                borderRadius: 9999
              }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1f2937' }}>
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
                  icon: "logo-instagram"
                },
                {
                  label: "LinkedIn",
                  value: linkedinLink,
                  setter: setLinkedinLink,
                  icon: "logo-linkedin"
                },
                {
                  label: "YouTube",
                  value: youtubeLink,
                  setter: setYoutubeLink,
                  icon: "logo-youtube"
                },
                {
                  label: "GitHub",
                  value: githubLink,
                  setter: setGithubLink,
                  icon: "logo-github"
                },
                {
                  label: "Twitter",
                  value: twitterLink,
                  setter: setTwitterLink,
                  icon: "logo-twitter"
                },
                {
                  label: "LeetCode",
                  value: leetCodeLink,
                  setter: setLeetCodeLink,
                  icon: "code-slash"
                },
                {
                  label: "Codeforces",
                  value: codeForcesLink,
                  setter: setCodeForcesLink,
                  icon: "code"
                },
              ].map((field, idx) => (
                <View key={idx} style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                    {field.label}
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 12,
                    paddingHorizontal: 12
                  }}>
                    <Ionicons name={field.icon} size={20} color="#6b7280" style={{ marginRight: 8 }} />
                    <TextInput
                      value={field.value}
                      onChangeText={field.setter}
                      placeholder={`Enter ${field.label} link`}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        fontSize: 16,
                        color: '#4b5563'
                      }}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={{
                  backgroundColor: '#d97706',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginTop: 16,
                  marginBottom: 24
                }}
                onPress={() => setAddSocialsVisible(false)}
              >
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
