"use client"

import { useState,useEffect } from "react"
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Pressable, Keyboard } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router, useRouter } from "expo-router"
import UpVoteBtn from "@/components/UpVoteBtn"
import {icons} from "@/constants/icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
// Mock data for grievances
const initialComments = [
  { id: "1", name: "Aarav Sharma", comment: "The cafeteria food quality has dropped recently." },
  { id: "17", name: "Nikhil Thakur", comment: "Labs lack proper ventilation." },
  { id: "18", name: "Simran Kaur", comment: "The auditorium AC stops working mid-events." },
  { id: "19", name: "Deepak Kulkarni", comment: "Hostel gate security is too lenient after 10 PM." },
  { id: "20", name: "Neha Raut", comment: "There's not enough space for parking near the hostel." }
];


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
    id: "",
    title: "Wi-Fi Connectivity",
    status: "Resolved",
    description: "The Wi-Fi in the dormitory is very slow and frequently disconnects.",
  },
]
interface Grievance{

}
export default function GrievanceScreen() {
  const keyboardHeight = useSharedValue(0);
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height, { duration: 250 });
    });

    const hideSub = Keyboard.addListener('keyboardWillHide', () => {
      keyboardHeight.value = withTiming(0, { duration: 250 });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: keyboardHeight.value,
    };
  });

  const [grievances, setGrievances] = useState(initialGrievances)
  const [comments,setComments]=useState(initialComments)
  const [total,setTotal]= useState(grievances.length)
  const [resolved,setResolved]= useState(0)
  const [pending,setPending]= useState(0)
  const [inProgress,setInProgress]= useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [newGrievance, setNewGrievance] = useState({ title: "", description: "" })
  const [viewGrievance, setViewGrievance] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [myComment,setMyComment]=useState("");
  const router = useRouter()
  
  useEffect(() => {
    let totalCount = grievances.length;
    let pendingCount = 0;
    let resolvedCount = 0;
    let inProgressCount = 0;
  
    grievances.forEach((item) => {
      switch (item.status) {
        case "Pending":
          pendingCount++;
          break;
        case "Resolved":
          resolvedCount++;
          break;
        case "In Progress":
          inProgressCount++;
          break;
      }
    });
  
    setTotal(totalCount);
    setPending(pendingCount);
    setResolved(resolvedCount);
    setInProgress(inProgressCount);
  }, [grievances]);


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
  const addComment=()=>{
    const name :string| null="Shashank Umar";
    if(name && myComment){
      const newComment={
        id:Date.now().toString(),
        name:name,
        comment:myComment,
      }
      setComments([newComment,...comments])
      setMyComment("");

    }
  }
  const viewGrievanceDetails = (item) => {
    setViewGrievance(item)
    setDetailModalVisible(true)
  }

  const renderGrievanceItem = ({ item }) => {

    

    if (item.status === "Resolved") return null;
    return (
      <View>
        
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
          <View className="flex-row justify-between  items-center " >
            <Text className="overflow-hidden w-[70%] text-gray-600 " numberOfLines={2}>
              {item.description}
            </Text>
            <UpVoteBtn  />
          </View>
          
        </TouchableOpacity>
      </View>
    )
  }

  return (
    
    <View style={styles.container}>
      <View className="flex-row flex-wrap justify-around items-center mt-5 mx-2 p-2 ">
        <View className="flex-col w-[30%] " >
          <Text className="text-4xl text-red-500" >{total}</Text>
          <Text className="font-thin " >Total </Text>
          <Text className="font-bold text-xl" >Complaints</Text>
        </View>
        <View className="flex-col w-[30%] " >
          <Text className="text-4xl text-green-500" >{resolved}</Text>
          <Text className="font-thin " >Total </Text>
          <Text className="font-bold text-xl" >Resolved</Text>
        </View>
        <View className="flex-col w-[30%] " >
          <Text className="text-4xl text-yellow-500" >{pending + inProgress}</Text>
          <Text className="font-thin " >Total </Text>
          <Text className="font-bold text-xl " >Pending</Text>
        </View>
      </View>
      <Text className="mt-20 mb-3 text-4xl ml-5 " >Recent Issues</Text>
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
          <View style={styles.modalContainer} className="" >
            
            <View style={styles.modalContent}>
            <Pressable onPress={()=>setDetailModalVisible(false)}  className="mb-2"  style={{width:30}} >
              <Image
                source={icons.goBack}
                className="w-8 h-8 "
              />
            </Pressable>
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

                <Text style={styles.detailLabel}>Submitted on:</Text>
                <Text style={styles.detailText}>April 16, 2025</Text>

                <Text className="mt-3 mb-2 text-gray-600 font-bold" >Comments:</Text>
                {comments.map((item) => (
                  <View key={item.id} style={{ marginBottom: 16 }}>
                    <Text className="text-gray-800">{item.name}</Text>
                    <Text style={{ fontSize: 12 }}>{item.comment}</Text>
                  </View>
                ))}
              </ScrollView>
              
              <View className="mt-4 flex-row justify-between items-center border rounded-xl px-4 ">
                <TextInput
                  placeholder="Your Comment here . . ."
                  value={myComment}
                  multiline
                  numberOfLines={3}
                  onChangeText={(text)=>setMyComment(text)}
                />
                <Pressable onPress={()=>addComment()} >
                <Image
                  source={icons.send}
                  className="size-5"
                  tintColor="blue"
                />
                </Pressable>
              </View>
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
