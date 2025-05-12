import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { getGrievanceOfUser } from "@/service/grievance/getGrievanceByUserId";
import { getUsersPost } from "@/service/socials/getPostsByUserId";
import { useLocalSearchParams } from "expo-router";
import { deleteGrievance } from "@/service/grievance/deleteGrievance";
import { deletePost } from "@/service/socials/deletePost";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { key: "LF", label: "Lost-Found" },
  { key: "GR", label: "Grievances" },
  { key: "IS", label: "IntraSocial" },
];

const PostsOfUser = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("LF"); // Default to Lost-Found
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [dataType, setDataType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { user_id } = useLocalSearchParams<{ user_id: string }>();

  // Load Lost-Found data on initial render
  React.useEffect(() => {
    fetchData("LF");
  }, []);

  const onRefresh = useCallback(() => {
    if (selectedCategory) fetchData(selectedCategory, true);
  }, [selectedCategory]);

  const fetchData = async (category: string, isRefresh = false) => {
    if (!category) {
      Toast.show({
        type: "error",
        text1: "Please select a category",
        position: "top",
      });
      return;
    }

    if (!isRefresh) setLoading(true);
    if (isRefresh) setRefreshing(true);

    try {
      if (category === "GR") {
        const result = await getGrievanceOfUser(user_id);
        if (!result?.complaint || result.complaint.length === 0) {
          setData([]);
          Toast.show({
            type: "info",
            text1: "No grievances found",
            position: "bottom",
          });
        } else {
          setData(result.complaint);
        }
        setDataType("GR");
      }
      else if (category === "IS") {
        const result = await getUsersPost(user_id);
        if (!result?.post || result.post.length === 0) {
          setData([]);
          Toast.show({
            type: "info",
            text1: "No posts found",
            position: 'bottom',
          });
        } else {
          setData(result.post);
        }
        setDataType("IS");
      } else if (category === "LF") {
        // Set the data type first to ensure UI updates immediately
        setDataType("LF");
        
        try {
          // You can replace this with actual API call when available
          // For now, just show a placeholder
          setData([
            {
              id: 'lf-placeholder',
              title: 'Lost & Found',
              description: 'This section will display your lost and found items.',
              status: 'placeholder'
            }
          ]);
        } catch (error) {
          setData([]);
          Toast.show({
            type: "info",
            text1: "Lost-Found items will appear here",
            position: "top",
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching data",
        position: "top",
      });
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const confirmDelete = (itemId: string, itemType: string, deleteFunction: (id: string) => Promise<void>) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete this ${itemType}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteFunction(itemId),
          style: "destructive"
        }
      ]
    );
  };

  const deleteMyGrievance = async (c_id: string) => {
    try {
      setLoading(true);
      await deleteGrievance(c_id);
      
      // Update local state immediately
      setData(prevData => prevData.filter(item => item.c_id !== c_id));
      
      Toast.show({
        type: "success",
        text1: "Grievance Deleted",
        position: 'top'
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to delete grievance",
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const deleteMyPost = async (post_id: string) => {
    try {
      setLoading(true);
      await deletePost(post_id, user_id);
      
      // Update local state immediately
      setData(prevData => prevData.filter(item => item.post_id !== post_id));
      
      Toast.show({
        type: "success",
        text1: "Post Deleted",
        position: 'top'
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to delete post",
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };
  const renderPosts = ({ item }: any) => {
    if (dataType === "GR") {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Pressable
              style={styles.deleteButton}
              onPress={() => confirmDelete(item.c_id, "grievance", deleteMyGrievance)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </Pressable>
          </View>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardMeta}>
              <Ionicons name="thumbs-up-outline" size={14} color="#007AFF" /> {item.upvotes.length || 0}
            </Text>
            <Text style={styles.cardMeta}>
              <Ionicons name="pricetag-outline" size={14} color="#007AFF" /> {item.category}
            </Text>
          </View>
        </View>
      );
    } else if (dataType === "IS") {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Pressable
              style={styles.deleteButton}
              onPress={() => confirmDelete(item.post_id, "post", deleteMyPost)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </Pressable>
          </View>
          <Text style={styles.cardDescription}>{item.description}</Text>
          {item.post_image_url && (
            <Image 
              source={{ uri: item.post_image_url }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
          {item.item_image && (
            <Image 
              source={{ uri: item.item_image }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.cardFooter}>
            <Text style={styles.cardMeta}>
              <Ionicons name="time-outline" size={14} color="#007AFF" /> {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      );
    } else if (dataType === "LF") {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title || "Lost & Found Item"}</Text>
            {item.status !== 'placeholder' && (
              <Pressable
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id, "lost-found item", () => {})}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </Pressable>
            )}
          </View>
          <Text style={styles.cardDescription}>{item.description || "No description available"}</Text>
          {item.image_url && (
            <Image 
              source={{ uri: item.image_url }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.cardFooter}>
            <Text style={styles.cardMeta}>
              <Ionicons name="information-circle-outline" size={14} color="#007AFF" /> {item.status || "Status: Unknown"}
            </Text>
            {item.date && (
              <Text style={styles.cardMeta}>
                <Ionicons name="calendar-outline" size={14} color="#007AFF" /> {item.date}
              </Text>
            )}
          </View>
        </View>
      );
    }

    return null;
  };

  const handleCategoryPress = useCallback((key: string) => {
    if (key === selectedCategory) return;
    setSelectedCategory(key);
    fetchData(key);
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Your Posts</Text>

      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => handleCategoryPress(cat.key)}
            style={[
              styles.categoryButton,
              selectedCategory === cat.key && styles.categoryButtonActive
            ]}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat.key && styles.categoryButtonTextActive
              ]}
            >
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        selectedCategory && (
          <FlatList
            data={data}
            keyExtractor={(item) => item.post_id || item.c_id || item.id || String(Math.random())}
            renderItem={renderPosts}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={50} color="#CCCCCC" />
                <Text style={styles.emptyText}>No items found</Text>
              </View>
            }
            extraData={[data, dataType]}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
    paddingTop: 48,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
    minWidth: 100,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontWeight: '600',
    color: '#4A4A4A',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    flex: 1,
  },
  cardDescription: {
    fontSize: 16,
    color: '#3A3A3C',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardMeta: {
    fontSize: 14,
    color: '#8E8E93',
  },
  deleteButton: {
    padding: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default PostsOfUser;
