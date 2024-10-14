import React, { useState, useEffect } from 'react';
import { Button, Overlay, Icon, Input } from '@rneui/themed';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query,
  doc, getDocs, updateDoc, addDoc, deleteDoc
} from "firebase/firestore";
import { firebaseConfig } from './Secrets';

console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function ListMaker1000Final () {

  // STATE VARIABLES AND THEIR UPDATERS
  const [todos, setTodos] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  async function loadInitList() {
    const initList = [];
    const collRef = collection(db, 'todos');
    const q = query(collRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach((docSnapshot)=>{
      let todo = docSnapshot.data();
      console.log(todo);
      todo.key = docSnapshot.id;
      initList.push(todo);
    });
    setTodos(initList);
  }

  useEffect(()=>{
    loadInitList();
  }, []);

  // DATA MODEL FUNCTIONS (CRUD)
  const createTodo = async (todoText) => {
    let newTodo = {
      text: todoText,
    }
    let todoCollRef = collection(db, 'todos');
    let todoSnap = await addDoc(todoCollRef, newTodo);
    newTodo.key = todoSnap.id;
    setTodos(todos.concat(newTodo));
  }

  const updateTodo = async (todo, newText) => {
    let docToUpdate = doc(db, 'todos', todo.key);
    await updateDoc(docToUpdate, {
      text: newText
    });

    let newTodo = {...todo, text: newText};
    let newTodos = todos.map(elem=>elem.key===todo.key?newTodo: elem);
    setTodos(newTodos);
  }

  const deleteTodo = async (todo) => {
    let docToDelete = doc(db, 'todos', todo.key);
    await deleteDoc(docToDelete);

    let newTodos = todos.filter((item)=>item.key != todo.key);
    setTodos(newTodos);
  }
  // END DATA MODEL

  // CUSTOM COMPONENT FOR DISPLAYING A SINGLE LIST ITEM
  function TodoListItem({item}) {
    return (
      <View style={styles.listItemView}>
        <View style={styles.li1}>
          <Text style={styles.listItemText}>{item.text}</Text>
        </View>
        <TouchableOpacity
          style={styles.li2}
          onPress={()=>{
            setSelectedItem(item);
            setInputText(item.text);
            setOverlayVisible(true);
          }}
        >
          <Icon
            name="edit"
            type="font-awesome"
            color="black"
            size={25}
            iconStyle={{ marginRight: 10 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.li3}
          onPress={()=>{
            deleteTodo(item);
          }}
        >
          <Icon
            name="trash"
            type="font-awesome"
            color="black"
            size={25}
            iconStyle={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // MAIN UI
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          ListMaker 1000
        </Text>
      </View>
      <View style={styles.body}>
        <FlatList
          data={todos}
          renderItem={({item})=>{
            return (
              <TodoListItem item={item}/>
            );
          }}
        />
      </View>
      <View style={styles.footer}>
        <Button
          size='lg'
          color='#AAAACC'
          onPress={()=>{setOverlayVisible(true)}}
        >
          <Icon name='add' color='#444477' size={32}/>
        </Button>
      </View>

      {/* OVERLAY COMPONENT: SHOWN ON TOP WHEN visible==true */}
      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={()=>setOverlayVisible(false)}
        overlayStyle={styles.overlayView}
      >
        <Input
          placeholder='New Todo Item'
          value={inputText}
          onChangeText={(newText)=>setInputText(newText)}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-around', width:'80%'}}>
          <Button
            title="Cancel"
            onPress={()=>{
              setSelectedItem(undefined);
              setInputText('');
              setOverlayVisible(false)
            }}
          />
          <Button
            title={selectedItem ? "Update Todo" : "Add Todo"}
            onPress={()=>{
              if (selectedItem) {
                updateTodo(selectedItem, inputText);
              } else {
                createTodo(inputText);
              }
              setSelectedItem(undefined);
              setInputText('');
              setOverlayVisible(false);
            }}
          />
        </View>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flex: 0.1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: '20%',
    paddingBottom: '5%',
    backgroundColor: '#AAAACC'
  },
  headerText: {
    fontSize: 44,
    color: '#444477'
  },
  body: {
    flex: 0.5,
    width: '100%',
    paddingLeft: '5%',
    paddingTop: '5%'
  },
  listItemView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '1%',
  },
  li1: {
    flex: 0.8,
    paddingRight: '3%'
  },
  li2: {
    flex: 0.1,
    backgroundColor: 'white'
  },
  li3: {
    flex: 0.1,
    backgroundColor: 'white'
  },
  listItemText: {
    fontSize: 24
  },
  footer: {
    flex: 0.2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlayView: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%'
  }
});

export default ListMaker1000Final;