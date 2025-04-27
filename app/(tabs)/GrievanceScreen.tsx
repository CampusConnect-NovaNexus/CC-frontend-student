"use client";

import { useState, useCallback, useEffect } from "react";
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
import { getStats } from "@/service/grievance/getStats"; 
import { getComment } from "@/service/grievance/getComment";
import { postComment } from "@/service/grievance/postComment";

interface Comment {
  c_id: string,
  c_message: string,
  comment_id: string,
  created_at: string
}
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
  const [stats, setStats] = useState({total_complaints:0,unresolved_complaints:0,resolved_complaints:0});
  const [comments,setComments]=useState<Comment[] | null>(null);
  const [newComment,setNewComment]=useState("");
  const router = useRouter();

  const handlePostComment=async(c_id:string)=>{
    if(newComment.length===0) {
      return;
    }
    try{
        const res=await postComment(c_id,"user123",newComment);
        if(res.c_id){
          setNewComment("");
          fetchComments(res.c_id);
        }
      }catch(err){
        console.log('handlePostComment errro ',err);
        
      }
  }
  const fetchComments=async(c_id:string)=>{
      try {
        const res=await getComment(c_id)
        setComments(res.comments.reverse());
        
      } catch (error) {
        console.log('error in fetchComments of GrievanceScreen : ',error)
      }
     
  }
  const loadGrievances = async () => {
    const result = await fetchGrievances();
    if (result) {
      await setGrievances(result.complaints.reverse());
    }
  };
  const loadStats = async () => {
    const result = await getStats();
    if (result) {
      await setStats(result);
    }
  };

 
  useEffect(()=>{
    loadGrievances();
    loadStats()
  },[])

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
        loadStats();
        loadGrievances(); // Refresh list
      } else {
        console.warn("Failed to post grievance");
      }
    }
  };

  const renderGrievanceItem = ({ item }: { item: Grievance }) => (
    <TouchableOpacity
      className="bg-gray-300 flex-row justify-between rounded-xl p-3 mt-5"
      onPress={async() => {
        await setGrievanceItem(item);
        await fetchComments(item.c_id);
        setGrievanceVisible(true);
        

      }}
    >
      <View className="flex-col w-[80%] overflow-hidden">
        <Text className="text-2xl font-semibold">{item.title}</Text>
        <Text  className="font-extralight mt-2 "  numberOfLines={2} >{item.description}</Text>
        <Text className="items-end justify-end  mt-2 ">{item.created_at}</Text>
      </View>
      <View style={styles.voteRow}>
        <UpVoteBtn c_id={item.c_id} user_id="user123" upVotes={item.upvotes.length} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View className="flex-row justify-around" >
        <View className="w-[30%] bg-yellow-200 rounded-xl  p-3">
            <Text className="text-5xl text-yellow-600 ">
              {stats.total_complaints}
            </Text>
            <Text className="text-white text-xl mt-4 " >Total</Text>
        </View>
        <View className="w-[30%] bg-red-200 rounded-xl  p-3 ">
            <Text className="text-5xl text-red-600 ">
            {stats.unresolved_complaints}
            </Text>
            <Text className="text-white text-xl mt-4 " >Pending</Text>
        </View>
        <View className="w-[30%] bg-green-200 rounded-xl  p-3 ">
            <Text className="text-5xl text-yegreenlow-600 ">
            {stats.resolved_complaints}
            </Text>
            <Text className="text-white text-xl mt-4" >Resolved</Text>
        </View>
      </View>
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
          showsVerticalScrollIndicator={false}
        />
      )}
      <View className="mb-10" ></View>
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
      <Modal animationType="slide" transparent visible={grievanceVisible}
        
      >
        {grievanceItem && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent} className="flex ">
              <Pressable onPress={() => {setGrievanceVisible(false);setNewComment("")}} style={{ width: 30 }} className=" ">
                <Image source={icons.goBack} style={{ width: 30, height: 30 }} />
              </Pressable>
              <Text className="text-3xl ">{grievanceItem.title}</Text>
              <Text className="text-xl ">{grievanceItem.description}</Text>
              <View className="flex-row mt-5 justify-between" >
                <View>
                <Text style={styles.detailLabel}>Posted on:</Text>
                <Text style={styles.detailDescription}>{grievanceItem.created_at.slice(0, 10)}</Text>
                </View>
                <UpVoteBtn c_id={grievanceItem.c_id} user_id="user123" upVotes={grievanceItem.upvotes.length} />
              </View>
              <Text className="text-2xl text-gray-700" >Comments</Text>
              {(comments && comments.length===0)? (<Text>No Comments yet</Text>):(
                <FlatList 
                data={comments}
                keyExtractor={(item) => {
                  return item.comment_id}}
                className="w-30 h-1/3 "
                renderItem={({item})=>(
                  <View>
                    <Text >{item.c_message}</Text>
                    <Text >{item.created_at.slice(0,10)}</Text>
                  </View>
                    
                )}
              />
              )}
              
              <View className="border rounded-full px-4 flex-row items-center justify-between ">

                <TextInput
                  placeholder="Your Comment here . . .  "
                  value={newComment}
                  onChangeText={setNewComment}
                  numberOfLines={2}
                />
                <Pressable className="p-1" 
                  onPress={()=>handlePostComment(grievanceItem.c_id)}
                >
                  <Image
                    className="size-7 "
                    source={icons.send}
                  />
                </Pressable>
              </View>
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
