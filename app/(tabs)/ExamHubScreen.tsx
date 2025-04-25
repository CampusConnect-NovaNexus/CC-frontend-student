"use client"
import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Mock data for subjects
const initialSubjects = [
  {
    id: "1",
    name: "Calculus I",
    code: "MATH101",
    progress: 65,
    nextExam: "2025-05-10",
    materials: [
      { id: "1", title: "Limits and Continuity", type: "notes" },
      { id: "2", title: "Derivatives Practice", type: "quiz" },
      { id: "3", title: "Integration Techniques", type: "video" },
    ],
  },
  {
    id: "2",
    name: "Introduction to Programming",
    code: "CS101",
    progress: 80,
    nextExam: "2025-05-15",
    materials: [
      { id: "1", title: "Variables and Data Types", type: "notes" },
      { id: "2", title: "Control Structures", type: "quiz" },
      { id: "3", title: "Functions and Methods", type: "video" },
    ],
  },
  {
    id: "3",
    name: "General Physics",
    code: "PHYS101",
    progress: 40,
    nextExam: "2025-05-08",
    materials: [
      { id: "1", title: "Newton's Laws of Motion", type: "notes" },
      { id: "2", title: "Kinematics Problems", type: "quiz" },
      { id: "3", title: "Work and Energy", type: "video" },
    ],
  },
]

// Mock data for upcoming exams
const upcomingExams = [
  {
    id: "1",
    subject: "General Physics",
    date: "2025-05-08",
    time: "10:00 AM - 12:00 PM",
    location: "Science Building, Room 201",
    topics: ["Mechanics", "Thermodynamics", "Waves"],
  },
  {
    id: "2",
    subject: "Calculus I",
    date: "2025-05-10",
    time: "2:00 PM - 4:00 PM",
    location: "Math Building, Room 105",
    topics: ["Limits", "Derivatives", "Integration"],
  },
  {
    id: "3",
    subject: "Introduction to Programming",
    date: "2025-05-15",
    time: "9:00 AM - 11:00 AM",
    location: "Computer Science Building, Lab 3",
    topics: ["Control Structures", "Functions", "Arrays and Lists"],
  },
]

// Mock data for study groups
const studyGroups = [
  {
    id: "1",
    name: "Calculus Study Group",
    members: 5,
    nextMeeting: "2025-04-18",
    time: "4:00 PM",
    location: "Library, Study Room 2",
  },
  {
    id: "2",
    name: "CS101 Coding Practice",
    members: 8,
    nextMeeting: "2025-04-20",
    time: "6:00 PM",
    location: "Computer Lab 1",
  },
]

export default function ExamHubScreen() {
  const [subjects, setSubjects] = useState(initialSubjects)
  const [activeTab, setActiveTab] = useState("subjects")
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [subjectModalVisible, setSubjectModalVisible] = useState(false)
  const [examModalVisible, setExamModalVisible] = useState(false)
  const [selectedExam, setSelectedExam] = useState(null)
  const [noteModalVisible, setNoteModalVisible] = useState(false)
  const [noteText, setNoteText] = useState("")

  const viewSubjectDetails = (subject) => {
    setSelectedSubject(subject)
    setSubjectModalVisible(true)
  }

  const viewExamDetails = (exam) => {
    setSelectedExam(exam)
    setExamModalVisible(true)
  }

  const openNoteModal = () => {
    setNoteModalVisible(true)
  }

  const saveNote = () => {
    // Here you would save the note to your data store
    setNoteModalVisible(false)
    setNoteText("")
  }

  const renderSubjectItem = ({ item }) => {
    const daysUntilExam = Math.ceil((new Date(item.nextExam) - new Date()) / (1000 * 60 * 60 * 24))

    return (
      <TouchableOpacity style={styles.subjectCard} onPress={() => viewSubjectDetails(item)}>
        <View style={styles.subjectHeader}>
          <View>
            <Text className={styles.subjectName}>{item.name}</Text>
            <Text className={styles.subjectCode}>{item.code}</Text>
          </View>
          <View style={styles.examCountdown}>
            <Text className={[styles.countdownText, daysUntilExam <= 3 ? styles.urgentText : null]}>
              {daysUntilExam} days until exam
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <Text className={styles.progressText}>{item.progress}% Complete</Text>
        </View>

        <View style={styles.materialsPreview}>
          <Text className={styles.materialsTitle}>Study Materials:</Text>
          {item.materials.slice(0, 2).map((material) => (
            <View key={material.id} style={styles.materialItem}>
              <Ionicons
                name={
                  material.type === "notes" ? "document-text" : material.type === "quiz" ? "help-circle" : "play-circle"
                }
                size={16}
                color="#6366f1"
              />
              <Text className={styles.materialText}>{material.title}</Text>
            </View>
          ))}
          {item.materials.length > 2 && <Text className={styles.moreText}>+{item.materials.length - 2} more</Text>}
        </View>
      </TouchableOpacity>
    )
  }

  const renderExamItem = ({ item }) => {
    const examDate = new Date(item.date)
    const today = new Date()
    const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24))

    return (
      <TouchableOpacity style={styles.examCard} onPress={() => viewExamDetails(item)}>
        <View style={styles.examHeader}>
          <Text className={styles.examSubject}>{item.subject}</Text>
          <View style={[styles.examBadge, daysUntil <= 3 ? styles.urgentBadge : styles.upcomingBadge]}>
            <Text className={styles.examBadgeText}>{daysUntil <= 3 ? "Soon" : "Upcoming"}</Text>
          </View>
        </View>

        <View style={styles.examDetails}>
          <View style={styles.examDetail}>
            <Ionicons name="calendar" size={16} color="#6366f1" />
            <Text className={styles.examDetailText}>
              {new Date(item.date).toLocaleDateString()} ({daysUntil} days)
            </Text>
          </View>
          <View style={styles.examDetail}>
            <Ionicons name="time" size={16} color="#6366f1" />
            <Text className={styles.examDetailText}>{item.time}</Text>
          </View>
          <View style={styles.examDetail}>
            <Ionicons name="location" size={16} color="#6366f1" />
            <Text className={styles.examDetailText}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderStudyGroupItem = ({ item }) => {
    return (
      <View style={styles.groupCard}>
        <Text className={styles.groupName}>{item.name}</Text>
        <View style={styles.groupDetails}>
          <View style={styles.groupDetail}>
            <Ionicons name="people" size={16} color="#6366f1" />
            <Text className={styles.groupDetailText}>{item.members} members</Text>
          </View>
          <View style={styles.groupDetail}>
            <Ionicons name="calendar" size={16} color="#6366f1" />
            <Text className={styles.groupDetailText}>
              {new Date(item.nextMeeting).toLocaleDateString()} at {item.time}
            </Text>
          </View>
          <View style={styles.groupDetail}>
            <Ionicons name="location" size={16} color="#6366f1" />
            <Text className={styles.groupDetailText}>{item.location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text className={styles.joinButtonText}>Join Group</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "subjects" && styles.activeTab]}
          onPress={() => setActiveTab("subjects")}
        >
          <Ionicons name="book" size={20} color={activeTab === "subjects" ? "white" : "#6366f1"} />
          <Text className={[styles.tabText, activeTab === "subjects" && styles.activeTabText]}>Subjects</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "exams" && styles.activeTab]}
          onPress={() => setActiveTab("exams")}
        >
          <Ionicons name="calendar" size={20} color={activeTab === "exams" ? "white" : "#6366f1"} />
          <Text className={[styles.tabText, activeTab === "exams" && styles.activeTabText]}>Exams</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "groups" && styles.activeTab]}
          onPress={() => setActiveTab("groups")}
        >
          <Ionicons name="people" size={20} color={activeTab === "groups" ? "white" : "#6366f1"} />
          <Text className={[styles.tabText, activeTab === "groups" && styles.activeTabText]}>Groups</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "subjects" && (
        <FlatList
          data={subjects}
          renderItem={renderSubjectItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {activeTab === "exams" && (
        <FlatList
          data={upcomingExams}
          renderItem={renderExamItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {activeTab === "groups" && (
        <FlatList
          data={studyGroups}
          renderItem={renderStudyGroupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            <TouchableOpacity style={styles.createGroupButton}>
              <Ionicons name="add-circle" size={20} color="white" />
              <Text className={styles.createGroupText}>Create Study Group</Text>
            </TouchableOpacity>
          }
        />
      )}

      <TouchableOpacity style={styles.floatingButton} onPress={openNoteModal}>
        <Ionicons name="create" size={24} color="white" />
      </TouchableOpacity>

      {/* Subject Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={subjectModalVisible}
        onRequestClose={() => setSubjectModalVisible(false)}
      >
        {selectedSubject && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text className={styles.modalTitle}>{selectedSubject.name}</Text>
                <Text className={styles.modalSubtitle}>{selectedSubject.code}</Text>

                <View style={styles.sectionTitle}>
                  <Ionicons name="stats-chart" size={20} color="#6366f1" />
                  <Text className={styles.sectionTitleText}>Progress</Text>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${selectedSubject.progress}%` }]} />
                  </View>
                  <Text className={styles.progressText}>{selectedSubject.progress}% Complete</Text>
                </View>

                <View style={styles.sectionTitle}>
                  <Ionicons name="calendar" size={20} color="#6366f1" />
                  <Text className={styles.sectionTitleText}>Next Exam</Text>
                </View>

                <View style={styles.examInfo}>
                  <Text className={styles.examDate}>{new Date(selectedSubject.nextExam).toLocaleDateString()}</Text>
                  <TouchableOpacity style={styles.prepareButton}>
                    <Text className={styles.prepareButtonText}>Prepare for Exam</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.sectionTitle}>
                  <Ionicons name="book" size={20} color="#6366f1" />
                  <Text className={styles.sectionTitleText}>Study Materials</Text>
                </View>

                {selectedSubject.materials.map((material) => (
                  <TouchableOpacity key={material.id} style={styles.materialCard}>
                    <View style={styles.materialIcon}>
                      <Ionicons
                        name={
                          material.type === "notes"
                            ? "document-text"
                            : material.type === "quiz"
                              ? "help-circle"
                              : "play-circle"
                        }
                        size={24}
                        color="#6366f1"
                      />
                    </View>
                    <View style={styles.materialInfo}>
                      <Text className={styles.materialTitle}>{material.title}</Text>
                      <Text className={styles.materialType}>
                        {material.type === "notes"
                          ? "Study Notes"
                          : material.type === "quiz"
                            ? "Practice Quiz"
                            : "Video Lecture"}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.addMaterialButton}>
                  <Ionicons name="add" size={20} color="#6366f1" />
                  <Text className={styles.addMaterialText}>Add Study Material</Text>
                </TouchableOpacity>
              </ScrollView>

              <TouchableOpacity style={styles.closeButton} onPress={() => setSubjectModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

      {/* Exam Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={examModalVisible}
        onRequestClose={() => setExamModalVisible(false)}
      >
        {selectedExam && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text className={styles.modalTitle}>{selectedExam.subject} Exam</Text>

                <View style={styles.examDetailCard}>
                  <View style={styles.examDetailItem}>
                    <Ionicons name="calendar" size={20} color="#6366f1" />
                    <View>
                      <Text className={styles.detailLabel}>Date</Text>
                      <Text className={styles.detailValue}>{new Date(selectedExam.date).toLocaleDateString()}</Text>
                    </View>
                  </View>

                  <View style={styles.examDetailItem}>
                    <Ionicons name="time" size={20} color="#6366f1" />
                    <View>
                      <Text className={styles.detailLabel}>Time</Text>
                      <Text className={styles.detailValue}>{selectedExam.time}</Text>
                    </View>
                  </View>

                  <View style={styles.examDetailItem}>
                    <Ionicons name="location" size={20} color="#6366f1" />
                    <View>
                      <Text className={styles.detailLabel}>Location</Text>
                      <Text className={styles.detailValue}>{selectedExam.location}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sectionTitle}>
                  <Ionicons name="list" size={20} color="#6366f1" />
                  <Text className={styles.sectionTitleText}>Topics Covered</Text>
                </View>

                <View style={styles.topicsList}>
                  {selectedExam.topics.map((topic, index) => (
                    <View key={index} style={styles.topicItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text className={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={[styles.actionButton, styles.studyButton]}>
                    <Ionicons name="book" size={20} color="white" />
                    <Text className={styles.actionButtonText}>Study Now</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionButton, styles.reminderButton]}>
                    <Ionicons name="notifications" size={20} color="white" />
                    <Text className={styles.actionButtonText}>Set Reminder</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.closeButton} onPress={() => setExamModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

      {/* Quick Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={noteModalVisible}
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text className={styles.modalTitle}>Quick Study Note</Text>

            <TextInput
              style={styles.noteInput}
              placeholder="Write your study note here..."
              multiline
              numberOfLines={8}
              value={noteText}
              onChangeText={setNoteText}
            />

            <View style={styles.noteActions}>
              <TouchableOpacity
                style={[styles.noteButton, styles.cancelButton]}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text className={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.noteButton, styles.saveButton]} onPress={saveNote}>
                <Text className={styles.saveButtonText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#f0f0f0",
  },
  activeTab: {
    backgroundColor: "#6366f1",
  },
  tabText: {
    fontWeight: "500",
    color: "#6366f1",
    marginLeft: 8,
  },
  activeTabText: {
    color: "white",
  },
  listContainer: {
    padding: 16,
  },
  subjectCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 14,
    color: "#666",
  },
  examCountdown: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countdownText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  urgentText: {
    color: "#EF4444",
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  materialsPreview: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  materialsTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  materialText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  moreText: {
    fontSize: 12,
    color: "#6366f1",
    marginTop: 4,
  },
  examCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  examHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  examSubject: {
    fontSize: 18,
    fontWeight: "bold",
  },
  examBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentBadge: {
    backgroundColor: "#FEE2E2",
  },
  upcomingBadge: {
    backgroundColor: "#DBEAFE",
  },
  examBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  examDetails: {
    marginTop: 8,
  },
  examDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  examDetailText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  groupCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  groupDetails: {
    marginBottom: 16,
  },
  groupDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  groupDetailText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  joinButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  joinButtonText: {
    color: "white",
    fontWeight: "500",
  },
  createGroupButton: {
    flexDirection: "row",
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  createGroupText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
  },
  floatingButton: {
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  examInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  examDate: {
    fontSize: 16,
    fontWeight: "500",
  },
  prepareButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  prepareButtonText: {
    color: "white",
    fontWeight: "500",
  },
  materialCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  materialIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    marginRight: 12,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  materialType: {
    fontSize: 14,
    color: "#666",
  },
  addMaterialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  addMaterialText: {
    color: "#6366f1",
    fontWeight: "500",
    marginLeft: 8,
  },
  examDetailCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  examDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  topicsList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  topicText: {
    fontSize: 16,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  studyButton: {
    backgroundColor: "#6366f1",
  },
  reminderButton: {
    backgroundColor: "#10B981",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
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
  noteInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 200,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  noteActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  saveButton: {
    backgroundColor: "#6366f1",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
})
