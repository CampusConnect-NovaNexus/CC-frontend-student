// "use client"

// import { useState,useEffect,useCallback } from "react"
// import { useFocusEffect } from "@react-navigation/native"
// import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Pressable, Keyboard } from "react-native"
// import { Ionicons } from "@expo/vector-icons"
// import { router, useRouter } from "expo-router"
// import UpVoteBtn from "@/components/UpVoteBtn"
// import {icons} from "@/constants/icons"
// import { fetchGrievances } from "@/service/grievance/fetchGrievances"

// interface Grievance{
//   c_id:string,
//   user_id:string,
//   created_at:string;
//   message:string,
//   upvotes:string[],
//   resolver:string[],
// }

// export default function GrievanceScreen() {
//   const [grievances, setGrievances] = useState()//incoming grievances from fetchGrievances
//   const [comments,setComments]=useState()
//   const [formVisible, setFormVisible] = useState(false)
//   const [newGrievance, setNewGrievance] = useState({ title: "", description: "" })
//   const [grievanceItem, setGrievanceItem] = useState({})
//   const [grievanceVisible,setGrievanceVisible]=useState(false)
//   const router = useRouter()
  
//    useFocusEffect(
//           useCallback(()=>{
//             const fetchData =async()=>{
//               const result=await fetchGrievances();
//               setGrievances(result);
//               console.log("Grievances : ",grievances)
//             }
      
//             fetchData();
//           },[])
//         )
    
//   const postGrievance = () => {
//     if (newGrievance.title && newGrievance.description) {
//       setNewGrievance({ title: "", description: "" })
//       setGrievanceVisible(false)
//     }
//   }
//   const renderGrievanceItem = ( item:Grievance ) => {
//     console.log("Rendering grievance item:", item);
//     return (
//       <TouchableOpacity
//         style={styles.grievanceItem}
//         onPress={async () => {
//           await setGrievanceItem(item);
//           setGrievanceVisible(true);
//         }}
//       >
//         <View style={styles.grievanceHeader}>
//           <Text className="text-xl bg-red-600">{item.message}</Text>
//           <Text className="text-xs">{item.created_at}</Text>
//         </View>
//         <View className="flex-row justify-between items-center">
//           <UpVoteBtn />
//         </View>
//       </TouchableOpacity>
//     );
//   };
  
//   return (
//     <View style={styles.container}>
//       <Text className="mt-20 mb-3 text-4xl ml-5">Recent Issues</Text>
  
//       {grievances?.length === 0 ? (
//         <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
//           No grievances found.
//         </Text>
//       ) : (
//         <FlatList
//           data={grievances}
//           renderItem={renderGrievanceItem}
//           keyExtractor={(item) => item.c_id}
//           contentContainerStyle={styles.listContainer}
//         />
//       )}
  
//       <TouchableOpacity style={styles.addButton} onPress={() => setFormVisible(true)}>
//         <Ionicons name="add" size={24} color="white" />
//       </TouchableOpacity>
  
//       {/* New Grievance Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={formVisible}
//         onRequestClose={() => setFormVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text className={styles.modalTitle}>Submit New Grievance</Text>
  
//             <Text className={styles.inputLabel}>Title</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter grievance title"
//               value={newGrievance.title}
//               onChangeText={(text) => setNewGrievance({ ...newGrievance, title: text })}
//             />
  
//             <Text className={styles.inputLabel}>Description</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               placeholder="Describe your grievance in detail"
//               multiline
//               numberOfLines={4}
//               value={newGrievance.description}
//               onChangeText={(text) => setNewGrievance({ ...newGrievance, description: text })}
//             />
  
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.button, styles.cancelButton]}
//                 onPress={() => setFormVisible(false)}
//               >
//                 <Text className={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.button, styles.submitButton]}
//                 onPress={postGrievance}
//               >
//                 <Text className={styles.buttonText}>Submit</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
  
//       {/* Grievance Detail Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={grievanceVisible}
//         onRequestClose={() => setGrievanceVisible(false)}
//       >
//         {grievanceItem && (
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Pressable onPress={() => setGrievanceVisible(false)} style={{ width: 30 }} className="mb-2">
//                 <Image source={icons.goBack} className="w-8 h-8" />
//               </Pressable>
//               <View style={styles.detailHeader}>
//                 <Text className={styles.detailTitle}>{grievanceItem.message}</Text>
//               </View>
//               <ScrollView style={styles.detailScroll}>
//                 <Text className={styles.detailLabel}>Description:</Text>
//                 <Text className={styles.detailDescription}>{grievanceItem.created_at}</Text>
//                 <Text className="mt-3 mb-2 text-gray-600 font-bold">Comments:</Text>
//               </ScrollView>
//               <View className="mt-4 flex-row justify-between items-center border rounded-xl px-4">
//                 <Pressable>
//                   <Image source={icons.send} className="size-5" tintColor="blue" />
//                 </Pressable>
//               </View>
//             </View>
//           </View>
//         )}
//       </Modal>
//     </View>
//   );

// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     padding: 16,
//     backgroundColor: "#f0f0f0",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 4,
//   },
//   listContainer: {
//     padding: 16,
//   },
//   grievanceItem: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//   },
//   grievanceHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   grievanceTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     flex: 1,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 8,
//   },
//   pendingBadge: {
//     backgroundColor: "#FEF3C7",
//   },
//   progressBadge: {
//     backgroundColor: "#DBEAFE",
//   },
//   resolvedBadge: {
//     backgroundColor: "#D1FAE5",
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   grievanceDescription: {
//     fontSize: 14,
//     color: "#666",
//   },
//   addButton: {
//     position: "absolute",
//     right: 20,
//     bottom: 100,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#6366f1",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: "500",
//     marginBottom: 6,
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 8,
//   },
//   button: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginHorizontal: 4,
//   },
//   cancelButton: {
//     backgroundColor: "#e0e0e0",
//   },
//   submitButton: {
//     backgroundColor: "#6366f1",
//   },
//   closeButton: {
//     backgroundColor: "#6366f1",
//     marginTop: 16,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "500",
//     fontSize: 16,
//   },
//   detailHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   detailTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     flex: 1,
//   },
//   detailScroll: {
//     maxHeight: 400,
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#555",
//     marginTop: 12,
//     marginBottom: 4,
//   },
//   detailDescription: {
//     fontSize: 16,
//     color: "#333",
//     lineHeight: 22,
//   },
//   detailText: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 8,
//   },
// })

"use client";

import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Pressable,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import UpVoteBtn from "@/components/UpVoteBtn";
import { icons } from "@/constants/icons";
import { fetchGrievances } from "@/service/grievance/fetchGrievances";
import { postGrievance } from "@/service/grievance/postGrievance"; 

interface Grievance {
  c_id: string;
  user_id: string;
  created_at: string;
  description: string;
  title: string;
  upvotes: string[];
  resolver: string[];
}

export default function GrievanceScreen() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newGrievance, setNewGrievance] = useState({ title: "", description: "" });
  const [grievanceItem, setGrievanceItem] = useState<Grievance | null>(null);
  const [grievanceVisible, setGrievanceVisible] = useState(false);
  const router = useRouter();

  const loadGrievances = async () => {
    const result = await fetchGrievances();
    console.log("Grievances old : ",grievances);
    if (result) {
      await setGrievances(result.complaints.reverse());
      console.log("Grievances new : ",grievances);
      
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGrievances();
      
    }, [])
  );

  const postNewGrievance = async () => {
    if (newGrievance.title && newGrievance.description) {
      const payload = {
        user_id:"user123",
        title: newGrievance.title,
        description: newGrievance.description,
      };

      const response = await postGrievance(payload);

      if (response?.c_id) {
        setNewGrievance({ title: "", description: "" });
        setFormVisible(false);
        loadGrievances(); // Refresh list
      } else {
        console.warn("Failed to post grievance");
      }
    }
  };

  const renderGrievanceItem = ({ item }: { item: Grievance }) => (
    <TouchableOpacity
      style={styles.grievanceItem}
      onPress={async() => {
        await setGrievanceItem(item);
        setGrievanceVisible(true);
      }}
    >
      <View style={styles.grievanceHeader}>
        <Text style={styles.grievanceText}>{item.title}</Text>
        <Text style={styles.grievanceText}>{item.description}</Text>
        <Text style={styles.grievanceTime}>{item.created_at}</Text>
      </View>
      <View style={styles.voteRow}>
        <UpVoteBtn grievanceId={item.c_id} upvotes={item.upvotes} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent Issues</Text>

      {grievances.length === 0 ? (
        <Text style={styles.emptyText}>No grievances found.</Text>
      ) : (
        <FlatList
          data={grievances}
          renderItem={renderGrievanceItem}
          keyExtractor={(item) => item.c_id}
          extraData={grievances}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => setFormVisible(true)}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* New Grievance Modal */}
      <Modal animationType="slide" transparent visible={formVisible}>
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
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setFormVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={postNewGrievance}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Grievance Detail Modal */}
      <Modal animationType="slide" transparent visible={grievanceVisible}>
        {grievanceItem && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Pressable onPress={() => setGrievanceVisible(false)} style={{ width: 30 }} className="mb-2">
                <Image source={icons.goBack} style={{ width: 30, height: 30 }} />
              </Pressable>
              <Text style={styles.detailTitle}>{grievanceItem.message}</Text>
              <ScrollView style={styles.detailScroll}>
                <Text style={styles.detailLabel}>Posted on:</Text>
                <Text style={styles.detailDescription}>{grievanceItem.created_at}</Text>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:16,
    minHeight:40,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 60,
    marginLeft: 20,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 100,  
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  grievanceItem: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  grievanceHeader: {
    marginBottom: 10,
  },
  grievanceText: {
    fontSize: 16,
    fontWeight: "600",
  },
  grievanceTime: {
    fontSize: 12,
    color: "gray",
  },
  voteRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addButton: {
    position: "absolute",
    bottom: 90,
    right: 30,
    backgroundColor: "#007AFF",
    borderRadius: 50,
    padding: 15,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputLabel: {
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },
  textArea: {
    height: 80,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  detailScroll: {
    marginTop: 10,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  detailDescription: {
    color: "gray",
    marginTop: 5,
  },
});
