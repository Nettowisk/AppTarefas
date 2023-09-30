import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, Modal, TouchableHighlight, TextInput, Alert, LogBox } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import { useFonts, Jost_400Regular } from '@expo-google-fonts/jost';
import * as SplashScreen from 'expo-splash-screen';
import React, {useState, useCallback, useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function App() {

  LogBox.ignoreAllLogs();

  const [fontsLoaded] = useFonts({
    Jost_400Regular
  });
  const image = require('./Resources/bg.jpg');
  const [tarefas, setarTarefas] = useState([]);

  const [modal,setModal] = useState(false);

  const [tarefaAtual,setTarefaAtual] = useState('');

  const onLayoutRootView = useCallback(async()=>{
    if(fontsLoaded){
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(()=>{
    (async()=>{
      try{
        let tarefasAtual = await AsyncStorage.getItem('tarefas');
        if(tarefasAtual == null)
          setarTarefas([]);
        else
          setarTarefas(JSON.parse(tarefasAtual));
      }catch(error){}
    })();
  },[])

  if(!fontsLoaded){
    return null;
  }

  function deletarTarefas(id){
    let newTarefas = tarefas.filter(function(val){
      return val.id != id;
    });
    setarTarefas(newTarefas);
    (async()=>{
      try{
        await AsyncStorage.setItem('tarefas', JSON.stringify(newTarefas));
      }catch(error){}
    })();
    alert('Tarefa deletada');
  }

  function addTarefa(){
    setModal(!modal);
    let id = 0;
    if(tarefas.length > 0){
      id = tarefas[tarefas.length-1].id+1;
    }
    let tarefa = {id:id, tarefa:tarefaAtual};
    setarTarefas([...tarefas,tarefa]);
    (async()=>{
      try{
        await AsyncStorage.setItem('tarefas', JSON.stringify(...tarefas,tarefa));
      }catch(error){}
    })();
    alert('Uma tarefa foi adicionada.');
  }

  return (
    <ScrollView onLayout={onLayoutRootView}>
      <StatusBar style='light' animated />
      <Modal
      animationType='fade'
      transparent={true}
      visible={modal}
      onRequestClose={()=>{
        Alert.alert('Modalkkk');
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modal}>
          <TextInput onChangeText={text=>setTarefaAtual(text)} autoFocus={true}></TextInput>
          <TouchableHighlight
          style={styles.button}
          onPress={()=>{addTarefa()}}>
            <Text style={styles.textoBotao}>Adicionar Tarefas</Text>
          </TouchableHighlight>
        </View>
      </View>
      </Modal>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.coverView}>
          <Text style={styles.textHeader}>Lista de Tarefas</Text>
        </View>
      </ImageBackground>

      {
        tarefas.map(function(val)
        {
       return (
       <View style={styles.tarefaSingle}>
        <View style={{flex:1,width:'100%'}}>
          <Text style={styles.texto}>{val.tarefa}</Text>
        </View>
        <View style={{alignItems:'flex-end',flex:1,padding:10}}>
          <TouchableOpacity onPress={()=> deletarTarefas(val.id)}><Feather name="minus-circle" size={24} color="black" /></TouchableOpacity>
        </View>
      </View>);
        }
      )}

      <TouchableOpacity
      onPress={()=>setModal(true)}
      style={styles.buttonAddTarefa}><Text style={styles.textoBotao}>Adicionar Tarefa</Text></TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
image: {
  width:'100%',
  height:100,
  resizeMode:'cover'
},
coverView: {
  width:'100%',
  height:100,
  backgroundColor:'rgba(0,0,0,0.6)'
},
textHeader: {
  textAlign:'center',
  color:'white',
  fontSize:27,
  marginTop:35,
  fontFamily:'Jost_400Regular'
},
tarefaSingle: {
  marginTop: 30,
  width:'100%',
  borderBottomWidth:3,
  borderBottomColor:'black',
  flexDirection:'row',
  paddingBottom:18
},
texto: {
  fontFamily:'Jost_400Regular',
  fontSize:15
},
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.3)'
},
modal: {
  margin: 20,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 35,
  alignItems: 'center',
  hadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  zIndex:5
},
button: {
  borderRadius: 20,
  padding: 10,
  elevation: 2,
  backgroundColor:'#069'
},
textoBotao: {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
  fontFamily:'Jost_400Regular',
},
buttonAddTarefa: {
  width:200,
  padding:8,
  backgroundColor:'grey',
  marginTop:20
}
});
