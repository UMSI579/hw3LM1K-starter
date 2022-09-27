import React, { useState } from 'react';
import { Button, Overlay, Icon, Input } from '@rneui/themed';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, DynamicColorIOS } from 'react-native';

function ListMaker1000Final () {

  // INITIAL VALUES FOR TESTING
  const initTodos = [
    { text: 'Get milk', priority: 1, key: 1},
    { text: 'Drop off dry cleaning', priority: 2, key: 2},
    { text: 'Finish 669 homework', priority: 3, key: 3}
  ];

  // STATE VARIABLES AND THEIR UPDATERS
  const [todos, setTodos] = useState(initTodos);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState(1);
  const [selectedItem, setSelectedItem] = useState('');

  // DATA MODEL FUNCTIONS (CRUD)
  const createTodo = (todoText, todoPriority) => {
    let newTodo = {
      text: todoText,
      priority: todoPriority,
      key: Date.now()
    }
    let newTodos = todos.concat(newTodo);
    setTodos(newTodos);
  }

  const updateTodo = (todo, newText, newPriority) => { 
    let newTodo = { ...todo, text: newText, priority: newPriority };
    let newTodos = todos.map(item=> item.key===todo.key ? newTodo : item);
    setTodos(newTodos);
  }

  const deleteTodo = (todo) => {    
    let newTodos = todos.filter((item)=>item.key != todo.key);
    setTodos(newTodos);
  }
  // END DATA MODEL

  // CUSTOM COMPONENT FOR DISPLAYING A SINGLE LIST ITEM
  function TodoListItem({item}) {
    return (
      <View style={styles.listItemView}>
        <TouchableOpacity 
          style={styles.li1}
          onPress={()=>{
            setSelectedItem(item);
            setInputText(item.text);
            setPriority(item.priority);
            setOverlayVisible(true);
          }}  
        >
          <Text style={styles.listItemText}>{item.text}</Text>
          <Text style={{fontSize: 24, padding: 12}}>
            {item.priority===1 ? '!' : (item.priority===2 ? '!!' : '!!!' )}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity 
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
        </TouchableOpacity> */}
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
        <View style={styles.olInput}>
          <View style={styles.olText}>
            <Input
              placeholder='New Todo Item'
              value={inputText}
              onChangeText={(newText)=>setInputText(newText)}
            />
          </View>
          <View style={styles.olButtons}>
            <TouchableOpacity style={styles.priorityButton} onPress={()=>setPriority(1)}>
              <Text style={[
                priority===1 ? {color: colors.dark} : {color: colors.light}
              ]}>!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.priorityButton} onPress={()=>setPriority(2)}>
              <Text style={[
                priority===2 ? {color: colors.dark} : {color: colors.light}
              ]}>!!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.priorityButton} onPress={()=>setPriority(3)}>
              <Text style={[
                priority===3 ? {color: colors.dark} : {color: colors.light}
              ]}>!!!</Text>
            </TouchableOpacity>
          </View>
        </View>
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
                updateTodo(selectedItem, inputText, priority);
              } else {
                createTodo(inputText, priority);
              }
              setSelectedItem(undefined);
              setPriority(1);
              setInputText('');
              setOverlayVisible(false);
            }}
          />
        </View>
      </Overlay>
    </View>
  );
};

const colors = {
  light: '#AAAACC',
  dark: '#444477'
}

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
    backgroundColor: colors.light
  },
  headerText: {
    fontSize: 44,
    color: colors.dark
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  olInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  olText: {
    flex: 0.7,
    flexDirection: 'row'
  },  
  olButtons: {
    flex: 0.3, 
    flexDirection: 'row'
  },
  priorityButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.light
  },
  priorityButtonSelected: {
    color: colors.dark
  }
});

//export default ListMaker1000Start;
// export default ListMaker1000Create;
// export default ListMaker1000Delete;
export default ListMaker1000Final;
//export default ContextDemo;