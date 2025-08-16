import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Addbutn from '../components/addbutn';
import { addTodo, deleteAllComplete, deleteTodo, getTodos, initDB, Todo, toggleTodo } from '../database/TodoDatabase';
import { useCustomFonts } from '../hooks/useFonts';

export default function Index() {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [toastText, setToastText] = useState<string>('');
    const [toastVisible, setToastVisible] = useState<boolean>(false);
    const toastOpacity = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      (async () => {
        await initDB();
        getTodos(setTodos);
      })();
    }, []);
  
    const loadTodos = () => {
      getTodos(setTodos);
    };

    const showToast = (text: string) => {
      setToastText(text);
      setToastVisible(true);
      Animated.sequence([
        Animated.timing(toastOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setToastVisible(false);
      });
    };
  
    const handleAdd = () => {
      if (!newTodo.trim()) return;
      addTodo(newTodo, () => {
        setNewTodo('');
        loadTodos();
        showToast('Hopped!');
      });
    };
  
    const handleToggle = (id: number, completed: boolean) => {
      toggleTodo(id, !completed, loadTodos);
    };
  
    const handleDelete = (id: number) => {
      deleteTodo(id, loadTodos);
      showToast('Task Tossed!');
    };

    const handleDeleteAll = () => {
      deleteAllComplete(() => {
        loadTodos();
        showToast('Tasks Tossed!');
      })
    }
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }
  
  return (
    
    <View>
      <Text style={styles.head}>          
        Your HopList
      </Text>
      <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 8, marginHorizontal: 20,}} />

      <TextInput
          style={styles.input}
          onChangeText={setNewTodo}
          value={newTodo}
          placeholder="Add to your HopList"
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />

      <Addbutn 
      onPress={handleAdd}
      />

      <Pressable onPress={() => handleDeleteAll()}>
        <Text style={styles.deleteButton}>✕</Text>
      </Pressable>
      <FlatList
        data={todos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isCompleted = item.completed === 1;
          return (
            <View style={styles.todoItem}>
              <Pressable style={styles.todoLeft} onPress={() => handleToggle(item.id, isCompleted)}>
                <View style={[styles.toggle, isCompleted && { backgroundColor: '#5FC8C8' }]} />
                <Text style={[styles.todoText, isCompleted && styles.todoTextCompleted]}>{item.title}</Text>
              </Pressable>
              <Pressable onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButton}>✕</Text>
              </Pressable>
            </View>
          );
        }}
      />

      {toastVisible && (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{toastText}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    fontFamily: 'Fredoka-SemiBold',
    padding: 10,
    fontSize: 25,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0.2,
    padding: 10,
    borderRadius: 20,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 0.2,
    borderRadius: 14,
    marginHorizontal: 12,
    marginTop: 12,
  },
  todoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  toggle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#5FC8C8',
    marginRight: 8,
  },
  todoText: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 16,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888'
  },
  deleteButton: {
    fontSize: 18,
    color: '#E57373',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  toast: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  toastText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
  }
})