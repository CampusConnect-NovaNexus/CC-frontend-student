"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Mock data for grievances
const initialGrievances = [
  {
    id: "1",
    title: "Cafeteria Food Quality",
    status: "Pending",
    description: "The quality of food in the cafeteria has deteriorated significantly in the last month.",
  },
  {
    id: "2",
    title: "Classroom AC Issues",
    status: "In Progress",
    description:
      "The air conditioning in Room 302 is not working properly, making it difficult to concentrate during lectures.",
  },
  {
    id: "3",
    title: "Wi-Fi Connectivity",
    status: "Resolved",
    description: "The Wi-Fi in the dormitory is very slow and frequently disconnects.",
  },
  {
    id: "4",
    title: "Cafeteria Food Quality",
    status: "Pending",
    description: "The quality of food in the cafeteria has deteriorated significantly in the last month.",
  },
  {
    id: "5",
    title: "Classroom AC Issues",
    status: "In Progress",
    description:
      "The air conditioning in Room 302 is not working properly, making it difficult to concentrate during lectures.",
  },
  {
    id: "6",
    title: "Wi-Fi Connectivity",
    status: "Resolved",
    description: "The Wi-Fi in the dormitory is very slow and frequently disconnects.",
  },
  {
    id: "7",
    title: "Cafeteria Food Quality",
    status: "Pending",
    description: "The quality of food in the cafeteria has deteriorated significantly in the last month.",
  },
  {
    id: "8",
    title: "Classroom AC Issues",
    status: "In Progress",
    description:
      "The air conditioning in Room 302 is not working properly, making it difficult to concentrate during lectures.",
  },
  {
    id: "9",
    title: "Wi-Fi Connectivity",
    status: "Resolved",
    description: "The Wi-Fi in the dormitory is very slow and frequently disconnects.",
  },
  {
    id: "10",
    title: "Cafeteria Food Quality",
    status: "Pending",
    description: "The quality of food in the cafeteria has deteriorated significantly in the last month.",
  },
  {
    id: "11",
    title: "Classroom AC Issues",
    status: "In Progress",
    description:
      "The air conditioning in Room 302 is not working properly, making it difficult to concentrate during lectures.",
  },
  {
    id: "12",
    title: "Wi-Fi Connectivity",
    status: "Resolved",
    description: "The Wi-Fi in the dormitory is very slow and frequently disconnects.",
  },
]

export default function GrievanceScreen() {
  const [grievances, setGrievances] = useState(initialGrievances)
  const [modalVisible, setModalVisible] = useState(false)
  const [newGrievance, setNewGrievance] = useState({ title: "", description: "" })
  const [viewGrievance, setViewGrievance] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)

  const addGrievance = () => {
    if (newGrievance.title && newGrievance.description) {
      const grievance = {
        id: Date.now().toString(),
        title: newGrievance.title,
        description: newGrievance.description,
        status: "Pending",
      }
      setGrievances([grievance, ...grievances])
      setNewGrievance({ title: "", description: "" })
      setModalVisible(false)
    }
  }

  const viewGrievanceDetails = (item) => {
    setViewGrievance(item)
    setDetailModalVisible(true)
  }

  const renderGrievanceItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.grievanceItem} onPress={() => viewGrievanceDetails(item)}>
        <View style={styles.grievanceHeader}>
          <Text style={styles.grievanceTitle}>{item.title}</Text>
          <View
            style={[
              styles.statusBadge,
              item.status === "Pending"
                ? styles.pendingBadge
                : item.status === "In Progress"
                  ? styles.progressBadge
                  : styles.resolvedBadge,
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.grievanceDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Grievance Portal</Text>
        <Text style={styles.headerSubtitle}>Submit and track your grievances</Text>
      </View>

      <FlatList
        data={grievances}
        renderItem={renderGrievanceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* New Grievance Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit New Grievance</Text>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter grievance title"
              value={newGrievance.title}
              onChangeText={(text) => setNewGrievance({ ...newGrievance, title: text })}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your grievance in detail"
              multiline
              numberOfLines={4}
              value={newGrievance.description}
              onChangeText={(text) => setNewGrievance({ ...newGrievance, description: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={addGrievance}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Grievance Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        {viewGrievance && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailTitle}>{viewGrievance.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    viewGrievance.status === "Pending"
                      ? styles.pendingBadge
                      : viewGrievance.status === "In Progress"
                        ? styles.progressBadge
                        : styles.resolvedBadge,
                  ]}
                >
                  <Text style={styles.statusText}>{viewGrievance.status}</Text>
                </View>
              </View>

              <ScrollView style={styles.detailScroll}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailDescription}>{viewGrievance.description}</Text>

                <Text style={styles.detailLabel}>Grievance ID:</Text>
                <Text style={styles.detailText}>#{viewGrievance.id}</Text>

                <Text style={styles.detailLabel}>Submitted on:</Text>
                <Text style={styles.detailText}>April 16, 2025</Text>

                {viewGrievance.status === "Resolved" && (
                  <>
                    <Text style={styles.detailLabel}>Resolution:</Text>
                    <Text style={styles.detailText}>
                      This issue has been addressed by the facilities management team. The Wi-Fi routers have been
                      upgraded and connection stability should be improved.
                    </Text>
                  </>
                )}
              </ScrollView>

              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setDetailModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
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
  header: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  grievanceItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  grievanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  grievanceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  pendingBadge: {
    backgroundColor: "#FEF3C7",
  },
  progressBadge: {
    backgroundColor: "#DBEAFE",
  },
  resolvedBadge: {
    backgroundColor: "#D1FAE5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  grievanceDescription: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
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
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  closeButton: {
    backgroundColor: "#6366f1",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  detailScroll: {
    maxHeight: 400,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginTop: 12,
    marginBottom: 4,
  },
  detailDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
})
