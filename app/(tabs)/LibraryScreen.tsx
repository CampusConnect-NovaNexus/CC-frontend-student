"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native"
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
      <TouchableOpacity style={styles.bookCard} onPress={() => viewBookDetails(item)}>
        <View style={styles.bookInfo}>
          <Text className={styles.bookTitle}>{item.title}</Text>
          <Text className={styles.bookAuthor}>by {item.author}</Text>
          <Text className={styles.bookCategory}>{item.category}</Text>
          <View style={styles.bookStatusContainer}>
            <Text className={[styles.bookStatus, item.available > 0 ? styles.availableText : styles.unavailableText]}>
              {item.available > 0 ? `${item.available} Available` : "Checked Out"}
            </Text>
            {item.available === 0 && item.dueDate && (
              <Text className={styles.dueDateText}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
            )}
          </View>
        </View>
        <View style={styles.bookLocation}>
          <Ionicons name="location" size={16} color="#6366f1" />
          <Text className={styles.locationText}>{item.location}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderBorrowedBookItem = ({ item }) => {
    const dueDate = new Date(item.dueDate)
    const today = new Date()
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
    const isOverdue = daysLeft < 0

    return (
      <View style={styles.borrowedBookCard}>
        <View style={styles.borrowedBookInfo}>
          <Text className={styles.bookTitle}>{item.title}</Text>
          <Text className={styles.bookAuthor}>by {item.author}</Text>
          <View style={styles.borrowedDetails}>
            <Text className={styles.borrowedLabel}>Borrowed:</Text>
            <Text className={styles.borrowedValue}>{new Date(item.borrowDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.borrowedDetails}>
            <Text className={styles.borrowedLabel}>Due:</Text>
            <Text
              className={[styles.borrowedValue, isOverdue ? styles.overdueText : daysLeft <= 3 ? styles.dueSoonText : null]}
            >
              {new Date(item.dueDate).toLocaleDateString()}
              {isOverdue ? " (Overdue)" : daysLeft <= 3 ? ` (${daysLeft} days left)` : ""}
            </Text>
          </View>
        </View>
        <View style={styles.borrowedActions}>
          <TouchableOpacity
            style={[styles.renewButton, item.renewals >= item.maxRenewals && styles.disabledButton]}
            onPress={() => renewBook(item.id)}
            disabled={item.renewals >= item.maxRenewals}
          >
            <Text className={styles.renewButtonText}>Renew</Text>
          </TouchableOpacity>
          <Text className={styles.renewalsText}>
            {item.renewals}/{item.maxRenewals} renewals used
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "search" && styles.activeTab]}
          onPress={() => setActiveTab("search")}
        >
          <Ionicons name="search" size={20} color={activeTab === "search" ? "white" : "#6366f1"} />
          <Text className={[styles.tabText, activeTab === "search" && styles.activeTabText]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "borrowed" && styles.activeTab]}
          onPress={() => setActiveTab("borrowed")}
        >
          <Ionicons name="book" size={20} color={activeTab === "borrowed" ? "white" : "#6366f1"} />
          <Text className={[styles.tabText, activeTab === "borrowed" && styles.activeTabText]}>My Books</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "search" ? (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title, author, or subject..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text className={styles.loadingText}>Searching library catalog...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredBooks}
              renderItem={renderBookItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="book-outline" size={48} color="#ccc" />
                  <Text className={styles.emptyText}>No books found</Text>
                </View>
              }
            />
          )}
        </>
      ) : (
        <FlatList
          data={borrowedBooks}
          renderItem={renderBorrowedBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={48} color="#ccc" />
              <Text className={styles.emptyText}>You have no borrowed books</Text>
            </View>
          }
        />
      )}

      {/* Book Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        {selectedBook && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text className={styles.detailTitle}>{selectedBook.title}</Text>
                <Text className={styles.detailAuthor}>by {selectedBook.author}</Text>

                <View style={styles.detailSection}>
                  <Text className={styles.detailLabel}>ISBN:</Text>
                  <Text className={styles.detailText}>{selectedBook.isbn}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text className={styles.detailLabel}>Category:</Text>
                  <Text className={styles.detailText}>{selectedBook.category}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text className={styles.detailLabel}>Location:</Text>
                  <Text className={styles.detailText}>{selectedBook.location}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text className={styles.detailLabel}>Status:</Text>
                  <Text
                    className={[
                      styles.detailText,
                      selectedBook.available > 0 ? styles.availableText : styles.unavailableText,
                    ]}
                  >
                    {selectedBook.available > 0
                      ? `${selectedBook.available} copies available`
                      : "Currently unavailable"}
                  </Text>
                  {selectedBook.available === 0 && selectedBook.dueDate && (
                    <Text className={styles.detailText}>
                      Expected return: {new Date(selectedBook.dueDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>

                <View style={styles.mapContainer}>
                  <Text className={styles.mapTitle}>Library Map</Text>
                  <View style={styles.map}>
                    <View style={styles.mapFloor}>
                      <Text className={styles.mapFloorText}>Floor 2</Text>
                      <View style={styles.mapSections}>
                        <View
                          style={[
                            styles.mapSection,
                            selectedBook.location.includes("Section A") && styles.highlightedSection,
                          ]}
                        >
                          <Text className={styles.mapSectionText}>A</Text>
                        </View>
                        <View
                          style={[
                            styles.mapSection,
                            selectedBook.location.includes("Section B") && styles.highlightedSection,
                          ]}
                        >
                          <Text className={styles.mapSectionText}>B</Text>
                        </View>
                        <View
                          style={[
                            styles.mapSection,
                            selectedBook.location.includes("Section C") && styles.highlightedSection,
                          ]}
                        >
                          <Text className={styles.mapSectionText}>C</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {selectedBook.available > 0 && (
                  <TouchableOpacity style={[styles.button, styles.reserveButton]}>
                    <Text className={styles.buttonText}>Reserve Book</Text>
                  </TouchableOpacity>
                )}
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
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
  },
  bookCard: {
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
  bookInfo: {
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  bookCategory: {
    fontSize: 12,
    color: "#6366f1",
    marginBottom: 8,
  },
  bookStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  availableText: {
    color: "#10B981",
  },
  unavailableText: {
    color: "#EF4444",
  },
  dueDateText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  bookLocation: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  borrowedBookCard: {
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
  borrowedBookInfo: {
    marginBottom: 12,
  },
  borrowedDetails: {
    flexDirection: "row",
    marginTop: 4,
  },
  borrowedLabel: {
    fontSize: 14,
    color: "#666",
    width: 70,
  },
  borrowedValue: {
    fontSize: 14,
    color: "#333",
  },
  overdueText: {
    color: "#EF4444",
    fontWeight: "500",
  },
  dueSoonText: {
    color: "#F59E0B",
    fontWeight: "500",
  },
  borrowedActions: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    alignItems: "center",
  },
  renewButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
  },
  renewButtonText: {
    color: "white",
    fontWeight: "500",
  },
  renewalsText: {
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
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
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailAuthor: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 16,
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
  mapContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  map: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  mapFloor: {
    padding: 12,
  },
  mapFloorText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  mapSections: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mapSection: {
    width: "30%",
    height: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  highlightedSection: {
    backgroundColor: "#6366f1",
  },
  mapSectionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  reserveButton: {
    backgroundColor: "#6366f1",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
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
