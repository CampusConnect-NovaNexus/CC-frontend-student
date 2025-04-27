import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Mock data for library books
const initialBooks = [
  {
    id: "1",
    title: "Data Structures and Algorithms",
    author: "Robert Sedgewick",
    isbn: "978-0321573513",
    available: 3,
    location: "Floor 2, Section C",
    category: "Computer Science",
    dueDate: null,
  },
  {
    id: "2",
    title: "Introduction to Psychology",
    author: "James W. Kalat",
    isbn: "978-1305271555",
    available: 0,
    location: "Floor 1, Section A",
    category: "Psychology",
    dueDate: "2025-04-30",
  },
  {
    id: "3",
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    isbn: "978-0134042282",
    available: 2,
    location: "Floor 3, Section B",
    category: "Chemistry",
    dueDate: null,
  },
  {
    id: "4",
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    isbn: "978-1285741550",
    available: 1,
    location: "Floor 2, Section A",
    category: "Mathematics",
    dueDate: null,
  },
]

// Mock data for borrowed books
const initialBorrowedBooks = [
  {
    id: "1",
    title: "Introduction to Psychology",
    author: "James W. Kalat",
    borrowDate: "2025-04-01",
    dueDate: "2025-04-30",
    renewals: 0,
    maxRenewals: 2,
  },
]

export default function LibraryScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState(initialBooks)
  const [borrowedBooks, setBorrowedBooks] = useState(initialBorrowedBooks)
  const [filteredBooks, setFilteredBooks] = useState(books)
  const [activeTab, setActiveTab] = useState("search")
  const [selectedBook, setSelectedBook] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books)
    } else {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredBooks(filtered)
    }
  }, [searchQuery, books])

  const handleSearch = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const viewBookDetails = (book) => {
    setSelectedBook(book)
    setDetailModalVisible(true)
  }

  const renewBook = (bookId) => {
    setBorrowedBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id === bookId && book.renewals < book.maxRenewals) {
          // Add 14 days to due date
          const dueDate = new Date(book.dueDate)
          dueDate.setDate(dueDate.getDate() + 14)
          return {
            ...book,
            renewals: book.renewals + 1,
            dueDate: dueDate.toISOString().split("T")[0],
          }
        }
        return book
      }),
    )
  }

  const renderBookItem = ({ item }) => {
    return (
      <TouchableOpacity
        style="bg-white p-4 m-2 rounded-lg shadow-md"
        onPress={() => viewBookDetails(item)}
      >
        <View>
          <Text className="text-lg font-bold">{item.title}</Text>
          <Text className="text-gray-500">{item.author}</Text>
          <Text className="text-sm text-gray-400">{item.category}</Text>
        </View>
        <View className="mt-2">
          <Text className="text-sm">{item.available > 0 ? `Available: ${item.available}` : "Out of Stock"}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      {/* Search Bar */}
      <View className="flex-row items-center bg-white p-2 rounded-lg shadow-md mb-4">
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          className="ml-2 flex-1 text-lg"
          placeholder="Search for books"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Tab Navigation */}
      <View className="flex-row justify-around mb-4">
        <TouchableOpacity
          className={`py-2 px-4 rounded-lg ${activeTab === "search" ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
          onPress={() => setActiveTab("search")}
        >
          <Text>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-2 px-4 rounded-lg ${activeTab === "borrowed" ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
          onPress={() => setActiveTab("borrowed")}
        >
          <Text>Borrowed</Text>
        </TouchableOpacity>
      </View>

      {/* Books List */}
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
      />

      {/* Book Details Modal */}
      {selectedBook && (
        <Modal
          visible={detailModalVisible}
          onRequestClose={() => setDetailModalVisible(false)}
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-50">
            <View className="bg-white p-6 rounded-lg w-4/5">
              <Text className="text-2xl font-bold">{selectedBook.title}</Text>
              <Text className="text-lg text-gray-700">Author: {selectedBook.author}</Text>
              <Text className="text-lg text-gray-500">Category: {selectedBook.category}</Text>
              <Text className="mt-2">Location: {selectedBook.location}</Text>
              <Text className="mt-2">Available: {selectedBook.available}</Text>
              <TouchableOpacity
                className="mt-4 p-2 bg-blue-500 rounded-lg"
                onPress={() => setDetailModalVisible(false)}
              >
                <Text className="text-white text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  )
}
