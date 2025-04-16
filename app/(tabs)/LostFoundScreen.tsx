"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

// Mock data for lost and found items
const initialItems = [
  {
    id: "1",
    name: "Blue Water Bottle",
    category: "Personal Item",
    location: "Main Library, 2nd Floor",
    date: "2025-04-15",
    description: "Blue metal water bottle with university logo",
    image: "https://via.placeholder.com/150",
    status: "lost",
    contact: "John Doe (john.doe@university.edu)",
  },
  {
    id: "2",
    name: "Calculator (TI-84)",
    category: "Electronics",
    location: "Science Building, Room 103",
    date: "2025-04-14",
    description: 'Texas Instruments graphing calculator, has initials "MJ" on the back',
    image: "https://via.placeholder.com/150",
    status: "found",
    contact: "Lost & Found Office",
  },
  {
    id: "3",
    name: "Student ID Card",
    category: "ID/Cards",
    location: "Student Center",
    date: "2025-04-13",
    description: "Student ID card for Sarah Johnson",
    image: "https://via.placeholder.com/150",
    status: "found",
    contact: "Admin Office",
  },
]

export default function LostFoundScreen() {
  const [items, setItems] = useState(initialItems)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
    image: "https://via.placeholder.com/150",
    status: "lost",
  })
  const [image, setImage] = useState(null)

  const filteredItems = activeTab === "all" ? items : items.filter((item) => item.status === activeTab)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      setNewItem({ ...newItem, image: result.assets[0].uri })
    }
  }

  const addItem = () => {
    if (newItem.name && newItem.location) {
      const item = {
        id: Date.now().toString(),
        ...newItem,
        date: new Date().toISOString().split("T")[0],
        contact: "Your Contact Info",
      }
      setItems([item, ...items])
      setNewItem({
        name: "",
        category: "",
        location: "",
        description: "",
        image: "https://via.placeholder.com/150",
        status: "lost",
      })
      setImage(null)
      setModalVisible(false)
    }
  }

  const viewItemDetails = (item) => {
    setSelectedItem(item)
    setDetailModalVisible(true)
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.itemCard} onPress={() => viewItemDetails(item)}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemLocation}>{item.location}</Text>
          <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>
          <View style={[styles.statusTag, item.status === "lost" ? styles.lostTag : styles.foundTag]}>
            <Text style={styles.statusText}>{item.status === "lost" ? "Lost" : "Found"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "lost" && styles.activeTab]}
          onPress={() => setActiveTab("lost")}
        >
          <Text style={[styles.tabText, activeTab === "lost" && styles.activeTabText]}>Lost</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "found" && styles.activeTab]}
          onPress={() => setActiveTab("found")}
        >
          <Text style={[styles.tabText, activeTab === "found" && styles.activeTabText]}>Found</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {newItem.status === "lost" ? "Report Lost Item" : "Report Found Item"}
              </Text>

              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, newItem.status === "lost" && styles.activeToggle]}
                  onPress={() => setNewItem({ ...newItem, status: "lost" })}
                >
                  <Text style={styles.toggleText}>Lost Item</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, newItem.status === "found" && styles.activeToggle]}
                  onPress={() => setNewItem({ ...newItem, status: "found" })}
                >
                  <Text style={styles.toggleText}>Found Item</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Item Name</Text>
              <TextInput
                style={styles.input}
                placeholder="What did you lose/find?"
                value={newItem.name}
                onChangeText={(text) => setNewItem({ ...newItem, name: text })}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Electronics, Clothing, etc."
                value={newItem.category}
                onChangeText={(text) => setNewItem({ ...newItem, category: text })}
              />

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Where was it lost/found?"
                value={newItem.location}
                onChangeText={(text) => setNewItem({ ...newItem, location: text })}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the item in detail"
                multiline
                numberOfLines={4}
                value={newItem.description}
                onChangeText={(text) => setNewItem({ ...newItem, description: text })}
              />

              <Text style={styles.inputLabel}>Item Photo</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <Ionicons name="camera" size={24} color="#6366f1" />
                    <Text style={styles.imagePickerText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={addItem}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Item Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        {selectedItem && (
          <View style={styles.modalContainer}>
            <View style={styles.detailModalContent}>
              <ScrollView>
                <Image source={{ uri: selectedItem.image }} style={styles.detailImage} />

                <View
                  style={[styles.detailStatusTag, selectedItem.status === "lost" ? styles.lostTag : styles.foundTag]}
                >
                  <Text style={styles.statusText}>{selectedItem.status === "lost" ? "Lost" : "Found"}</Text>
                </View>

                <Text style={styles.detailTitle}>{selectedItem.name}</Text>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={styles.detailText}>{selectedItem.category}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailText}>{selectedItem.location}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailText}>{new Date(selectedItem.date).toLocaleDateString()}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Description:</Text>
                  <Text style={styles.detailText}>{selectedItem.description}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Contact:</Text>
                  <Text style={styles.detailText}>{selectedItem.contact}</Text>
                </View>

                <TouchableOpacity style={[styles.button, styles.contactButton]}>
                  <Text style={styles.buttonText}>
                    {selectedItem.status === "lost" ? "I Found This" : "This is Mine"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              <TouchableOpacity style={styles.closeButton} onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 8,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#6366f1",
  },
  tabText: {
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "white",
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  itemInfo: {
    padding: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  statusTag: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  lostTag: {
    backgroundColor: "#FEE2E2",
  },
  foundTag: {
    backgroundColor: "#D1FAE5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "90%",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6366f1",
  },
  activeToggle: {
    backgroundColor: "#6366f1",
  },
  toggleText: {
    fontWeight: "500",
    color: "#6366f1",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    width: "100%",
    height: 150,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagePickerPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    marginTop: 8,
    color: "#6366f1",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  submitButton: {
    backgroundColor: "#6366f1",
  },
  contactButton: {
    backgroundColor: "#6366f1",
    marginTop: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  detailModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 0,
    overflow: "hidden",
    maxHeight: "90%",
  },
  detailImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  detailStatusTag: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 16,
    paddingBottom: 8,
  },
  detailSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
})
