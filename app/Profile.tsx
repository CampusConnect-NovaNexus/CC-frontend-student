import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";

const HomeScreen = () => {
  const router = useRouter();
  const [addSocialsVisible, setAddSocialsVisible] = useState(false);
  const [instagramLink, setInstagramLink] = useState<String>("http://");
  const [linkedinLink, setLinkedinLink] = useState<String>("");
  const [youtubeLink, setYoutubeLink] = useState<String>("http://");
  const [githubLink, setGithubLink] = useState<String>("http");
  const [twitterLink, setTwitterLink] = useState<String>("");
  const [leetCodeLink, setLeetCodeLink] = useState<String>("");
  const [codeForcesLink, setCodeForcesLink] = useState<String>("http ");
  const [about, setAbout] = useState<String>("Lorem is a bad b Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, autemfuga quos sit quasi modi... ");

  return (
    <ScrollView className="flex flex-col bg-yellow-100">
      {/* Header Image and Profile */}
      <View className="mt-10 h-[220px]">
        <Image
          source={images.main_bg}
          className="w-full h-[150px] object-cover object-center"
        />
        <View className="bg-white rounded-full h-[110px] aspect-square items-center justify-center absolute top-[100px] left-2 shadow-md">
          <Image
            source={icons.profile}
            className="rounded-full h-[100px] aspect-square"
          />
        </View>
      </View>

      {/* User Info */}
      <View className="flex-col mx-4 mt-6">
        <Text className="text-4xl font-bold">Shashank Umar</Text>
        <Text className="text-md text-gray-600 mt-2">
          Bhadohi, Uttar Pradesh, India
        </Text>

        {/* Social Links */}
        <View className="mt-10">
          <View className="flex-row justify-between items-center">
            <Text className="text-3xl font-semibold text-gray-800">
              Your Social Links
            </Text>
            <Pressable
              onPress={() => setAddSocialsVisible(true)}
              className="bg-blue-500 px-3 py-1 rounded-full"
            >
              <Text className="text-white font-semibold">Add</Text>
            </Pressable>
          </View>

          {/* Icons */}
          <View className="flex-row flex-wrap gap-4 mt-4">
            {instagramLink ? (
              <Image source={icons.instagram} className="size-6" />
            ) : null}
            {linkedinLink ? (
              <Image source={icons.linkedin} className="size-6" />
            ) : null}
            {youtubeLink ? (
              <Image source={icons.youTube} className="size-6" />
            ) : null}
            {githubLink ? (
              <Image source={icons.github} className="size-6" />
            ) : null}
            {twitterLink ? (
              <Image source={icons.twitter} className="size-6" />
            ) : null}
            {leetCodeLink ? (
              <Image source={icons.leetcode} className="size-6" />
            ) : null}
            {codeForcesLink ? (
              <Image source={icons.codeforces} className="size-6" />
            ) : null}
          </View>
        </View>
        <View className="rounded-xl mt-10 flex-row justify-between items-center mt-20 ">
          <Text className="text-3xl font-semibold">Your About</Text>
          <Pressable>
            <Image source={icons.pencil} className="size-6" />
          </Pressable>
        </View>

        {/* About Text */}
        <ScrollView className="max-h-32 mt-4 p-2 bg-white rounded-lg shadow-sm">
          <Text className="text-gray-800">
            {about}
          </Text>
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal visible={addSocialsVisible} animationType="slide">
        <ScrollView className="flex-1 p-4 bg-white">
          <View className="items-end">
            <Pressable
              onPress={() => setAddSocialsVisible(false)}
              className="p-2 bg-red-400 rounded-full"
            >
              <Image source={icons.cross} className="size-6" />
            </Pressable>
          </View>
          <Text className="text-2xl font-bold mb-4 text-center">
            Add Social Links
          </Text>

          {/* Input fields */}
          {[
            {
              label: "Instagram",
              value: instagramLink,
              setter: setInstagramLink,
            },
            { label: "LinkedIn", value: linkedinLink, setter: setLinkedinLink },
            { label: "YouTube", value: youtubeLink, setter: setYoutubeLink },
            { label: "GitHub", value: githubLink, setter: setGithubLink },
            { label: "Twitter", value: twitterLink, setter: setTwitterLink },
            { label: "LeetCode", value: leetCodeLink, setter: setLeetCodeLink },
            {
              label: "Codeforces",
              value: codeForcesLink,
              setter: setCodeForcesLink,
            },
          ].map((field, idx) => (
            <View key={idx} className="mb-4">
              <Text className="text-lg font-semibold mb-2">{field.label}</Text>
              <TextInput
                value={field.value}
                onChangeText={field.setter}
                placeholder={`Enter ${field.label} link`}
                className="border border-gray-300 p-2 rounded-lg"
              />
            </View>
          ))}
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default HomeScreen;
