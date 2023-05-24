import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Description } from "./Description";
import DeleteModal from "../components/DeleteModal";

export default function Home({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const addTodoHandler = () => {
    if (title.trim() === "" || description.trim() === "") {
      return;
    }
    let id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
    const addedTodo = { id, title, description, done: false };
    setTodos((prevTodo) => {
      const updatedTodos = [...prevTodo, addedTodo];
      AsyncStorage.setItem("todos", JSON.stringify(updatedTodos))
        .then(() => console.log("Todos saved successfully"))
        .catch((error) => console.log("Error saving todos:", error));
      return updatedTodos;
    });
    setTitle(""), setDescription("");
  };

  const completeTodoHandler = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done: !todo.done };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setSelectedTodo(null);
    setShowDeleteModal(false);
  };

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem("todos");
      if (storedTodos !== null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.log("Error loading todos:", error);
    }
  };

  const filterTodosHandler = () => {
    if (filter === "All") {
      setFilteredTodos(todos);
    } else if (filter === "Active") {
      const activeTodos = todos.filter((todo) => !todo.done);
      setFilteredTodos(activeTodos);
    } else if (filter === "Done") {
      const doneTodos = todos.filter((todo) => todo.done);
      setFilteredTodos(doneTodos);
    }
  };

  const deleteTodoHandler = (todo) => {
    setSelectedTodo(todo);
    setShowDeleteModal(true);
  };

  const onDeleteConfirm = () => {
    if (!selectedTodo) {
      return;
    }

    const updatedTodos = todos.filter((todo) => todo.id !== selectedTodo.id);
    setTodos(updatedTodos);
    setSelectedTodo(null);
    setShowDeleteModal(false);

    AsyncStorage.setItem("todos", JSON.stringify(updatedTodos))
      .then(() => {
        console.log("Todo deleted successfully");
      })
      .catch((error) => {
        console.log("Error deleting todo:", error);
      });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    filterTodosHandler();
  }, [todos, filter]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TODO APP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter todo title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter todo description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TouchableOpacity style={styles.submitBtn} onPress={addTodoHandler}>
        <Text style={styles.text}>Add Todo</Text>
      </TouchableOpacity>
      <View style={styles.dividerLine} />
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === "All" ? styles.activeFilterBtn : null,
          ]}
          onPress={() => setFilter("All")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "All" ? styles.activeFilterText : null,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === "Active" ? styles.activeFilterBtn : null,
          ]}
          onPress={() => setFilter("Active")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "Active" ? styles.activeFilterText : null,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === "Done" ? styles.activeFilterBtn : null,
          ]}
          onPress={() => setFilter("Done")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "Done" ? styles.activeFilterText : null,
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.todosContainer}>
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.todoContainer}
              onPress={() => completeTodoHandler(item.id)}
            >
              <Text style={[styles.todoTitle, item.done && styles.doneTodo]}>
                {item.title}
              </Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  navigation.navigate("Description", {
                    title: item.title,
                    description: item.description,
                  })
                }
              >
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTodoHandler(item)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        <DeleteModal
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onDelete={onDeleteConfirm}
        />
      </View>
    </SafeAreaView>
  );
}
