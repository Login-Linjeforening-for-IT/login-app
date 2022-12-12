import GreenLight, { GrayLight, Check, Month } from '../shared/eventComponents/otherComponents';  // Components used to display event
import Card, { CompareDates, CheckBox, CheckedBox } from '../shared/sharedComponents';  // Components used to display event
import CategorySquare from '../shared/eventComponents/categorySquare';  // Left side square on eventcard
import AsyncStorage from '@react-native-async-storage/async-storage'; // Localstorage
import React, { useEffect, useState, useRef } from 'react';         // React imports
import { StatusBar } from 'expo-status-bar';                        // Status bar
import { GS } from '../styles/globalStyles';                        // Global styles
import { ES } from '../styles/eventStyles';                         // Event styles
import { MS } from '../styles/menuStyles';                          // Menu styles
import { T } from '../styles/text';                                 // Text styles
import {                                                            // React native components
  Text, 
  View, 
  Image, 
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const GLOBAL = require('../styles/themes/dark');                    // Theme

export default function EventScreen({ navigation }) {
  //Declaring screens you can navigate to from this screen
  const listingPage = () => {navigation.navigate('ListingScreen')}  // Job screen
  const homePage = () => {navigation.navigate('HomeScreen')}        // Home screen
  const aboutPage = () => {navigation.navigate('AboutScreen')}      // About screen
  const profilePage = () => {navigation.navigate('ProfileScreen')}  // Profile screen

  // --- FETCHING DATA ---
  const getData=()=>{                                               // Fetches data from API
    fetch('https://api.login.no/events')                            // PRODUCTION
    // fetch('https://tekkom:rottejakt45@api.login.no:8443/events') // TESTING
    .then(response=>response.json())                                // Formatting the response
    .then(data=>setEvents(data))                                    // Setting the response
  }

  const [search, toggleSearch] = useState({status: 0})              // Search bar visibility boolean
  const toggleSearchBar = () => {                                   // Toggle search bar visiblity
    toggleSearch({
      ...search,
      status: !search.status
    });
  }

  // --- ARRAY DECLARATION ---
  const [events, setEvents] = useState([]);                         // Stores events from api
  const [renderedArray, setRenderedArray] = useState([]);           // Events currently displayed
  const [clickedEvents, setClickedEvents] = useState([]);           // Stores clicked events
  const [clickedCategory, setClickedCategory] = useState([]);       // Stores clicked categories
  const [category] = useState([                                     // All categories to filter
    {id: '1', category: 'PÅMELDT'},  
    {id: '2', category: 'TEKKOM'}, 
    {id: '3', category: 'SOCIAL'},
    {id: '4', category: 'CTF'},
    {id: '5', category: 'KARRIEREDAG'}, 
    {id: '6', category: 'FADDERUKA'},
    {id: '7', category: 'BEDPRES'},
    {id: '8', category: 'LOGIN'},
  ]);

  const [filter, setFilter] = useState({input: null});               // Filter text input declaration
  const textInputRef = useRef(null);                                 // Reference to clear input
  const filterInput = (val) => {                                     // Filter text input updating
      setFilter({ 
      ...filter,
      input: val,
      });
  }

  // --- FILTER FUNCTION DECLARATION ---
  const filterBoth = () => {        // Filters first by category, then by text
    let filtered = renderedArray.filter(event => clickedCategory.some(category => category.category === event.category));
    filtered = filtered.filter(event => event.eventname.toLowerCase().includes(filter.input.toLowerCase()));
    setRenderedArray([...filtered]);
  }
  
  const filterText = () => {        //  Only text is filtered
    let textFiltered = renderedArray.filter(event => event.eventname.toLowerCase().includes(filter.input.toLowerCase()));
    setRenderedArray([...textFiltered]);
  }

  const filterCategories = () => {  //  Only categories are filtered
    const categoryFiltered = renderedArray.filter(event => clickedCategory.some(category => category.category === event.category));    
    setRenderedArray([...categoryFiltered])
  }
  
  // --- PARENT FILTER FUNCTION ---
  const Filter = () => {            // Function for deciding what to filter
    if (filter.input != null) {
      if (clickedCategory != null){
        if(clickedCategory.length > 0 && filter.input.length > 0){
          filterBoth()
        }else{filter.input.length > 0 ? filterText() : setRenderedArray([...events])}
      }
    } else {
      clickedCategory.length > 0 ? filterCategories() : null
    }
  }
    
  const fetchState = async() => { //Fetches clicked events
    let foundState = await AsyncStorage.getItem('clickedEvents');
    if (foundState != null) {
      let parsed = JSON.parse(foundState)
      setClickedEvents(parsed)
    } 
  }

  // --- FETCHING STORED EVENTS IF NO WIFI
  const fetchStoredEvents = async() => { //Uses cache if no wifi
    let tempArray = await AsyncStorage.getItem('cachedArray')   //  Fetches cache
    if(tempArray != null){
      let parsed = JSON.parse(tempArray)
      setRenderedArray([...parsed])
    }
  }

  // --- STORING FIRSTCOMING CLICKED EVENT ---
  if (clickedEvents.length > 0) { // Checks if there are any stored clicked events
    (async() => {
      let storedID = 0;

      for (let i = 0; i < clickedEvents.length; i++) { // Finds the firstcoming event
        if (CompareDates((clickedEvents)[i].startt, (clickedEvents)[storedID].startt) == true) {
          storedID = i
        }
      } //  Stores the firstcoming event
      await AsyncStorage.setItem("clickedEvents", JSON.stringify(clickedEvents))
      await AsyncStorage.setItem("firstEvent", JSON.stringify((clickedEvents)[storedID]))
    })();
  }else{
    (async() => { //Sets it to "" if there are no clicked events
      await AsyncStorage.setItem("firstEvent", "")
      await AsyncStorage.setItem("clickedEvents", "")
    })();
  }

  // --- FETCHING EVENTS TO RENDER ---
  function renderArray() {
    if (renderedArray.length == 0) {
      if (events.length > 0) {
        setRenderedArray([...events]) // Sends the array to be rendered
          (async () => {
            await AsyncStorage.setItem('cachedArray', JSON.stringify(events));
          });
      } else {
        fetchStoredEvents(); // Fetches cache if no wifi
      }
    }
  }

  // --- LOADING FILTERED DATA ---
  useEffect(() => { // Renders when the state of the filter changes
    if (filter.input != null || clickedCategory.length > 0) {
      if(filter.input != null)  if (filter.input.length > 0) Filter();
      Filter();
      
    }
    console.log('these are events' + events)
    if(filter.input != null && clickedCategory.length == 0 ) if(filter.input.length == 0) setRenderedArray([...events])

  }, [filter, clickedCategory]); // Listens to changes in these arrays

  // --- LOADING DATA ---
  useEffect(() => { //  Renders when the screen is loaded
    getData();
    fetchState();
  },[])

  useEffect(() => { //Fetches the API every 10 seconds
    const interval = setInterval(() => {
      getData();
    }, 10000);
    return () => clearInterval(interval)
  }, []);

  renderArray();
  return(
    <View>
      <StatusBar style="light" /> 
      {/* ========================= DISPLAY TOP MENU ========================= */}
      <View style={MS.topMenu}>
        <TouchableOpacity onPress={() => aboutPage()}>
          <Image style={MS.tMenuIcon} source={require('../assets/login-text.png')} />
        </TouchableOpacity>

        <Text style={MS.screenTitle}>Events</Text>
        
        {renderedArray != null ? 
          renderArray.length > 0 ? 
          <TouchableOpacity onPress={() => toggleSearchBar()}>
            {search.status ? 
              <Image style={MS.searchIcon} source={require('../assets/filter-orange.png')} />
            :
              <Image style={MS.searchIcon} source={require('../assets/filter.png')} />
            }
          </TouchableOpacity>
        :null:null}

          <TouchableOpacity onPress={() => profilePage()}>
            <Image style={MS.tMenuIconWithExtra} source={require('../assets/loginperson.png')} />
          </TouchableOpacity>
      </View>

      {/* ========================= DISPLAY CONTENT ========================= */}
      <View style={GS.content}>
        {/* ----- RENDERS FILTER ----- */}
        {search.status ? 
          <View>
              <View style={ES.absoluteView}>
                  <TextInput 
                      ref={textInputRef}
                      style={ES.filterText}
                      maxLength={40}
                      placeholder='Søk..'
                      placeholderTextColor={GLOBAL.DARK.TITLETEXTCOLOR}
                      textAlign='center'
                      onChangeText={(val) => filterInput(val)}
                  />
                  <TouchableOpacity onPress={() => setClickedCategory([]) + filterInput(null) + textInputRef.current.clear()}>
                      <Image style={ES.filterResetIcon} source={require('../assets/reset.png')} />
                  </TouchableOpacity>
              </View>
              
              <View style={ES.filterView}>
                  <FlatList
                          scrollEnabled={false}
                          showsVerticalScrollIndicator={false}
                          numColumns={3}
                          keyExtractor={(item) => item.id}
                          data={category}
                          renderItem={({item}) => (
                              <View style={ES.categoryView}>
                                  {clickedCategory.includes(item) ?
                                      <TouchableOpacity onPress={() => setClickedCategory(clickedCategory.filter((x) => x.id !== item.id))}>
                                          <Text style={T.filterCategoryText}>{item.category}</Text>
                                          <CheckedBox/>
                                      </TouchableOpacity>
                                  :
                                      <TouchableOpacity onPress={() => setClickedCategory([...clickedCategory, item])}>
                                          <Text style={T.filterCategoryText}>{item.category}</Text>
                                          <CheckBox/>
                                      </TouchableOpacity>
                                  }
                                  
                                  
                              </View>
                          )}
                  /><Text/>
              </View>
          </View>
        :null}

        {/* ----- RENDERS EVENTS ----- */}
        {renderedArray != null ? 
          renderedArray.length > 0 ?
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={1}
              keyExtractor={(item) => item.eventID}
              data={renderedArray}
              renderItem={({item}) => (
                <View> 
                  <TouchableOpacity onPress={() => navigation.navigate('SpecificEventScreen', item)}>
                      <Card style={ES.eventCard}>
                        <View style={ES.eventBack}>
                          <View>
                              {CategorySquare(item.category)}
                              <Text style={ES.eventCardDayText}>{item.startt[8]}{item.startt[9]}</Text>
                              {Month(item.startt[5] + item.startt[6])}
                          </View>
                            <View style={ES.view2}>
                            
                              <View style = {ES.title}><Text style={ES.title}>{item.eventname}</Text></View>
                              <View style = {ES.loc}><Text style={ES.loc}>{item.startt[11]}{item.startt[12]}:{item.startt[14]}{item.startt[15]} {item.roomno}. {item.campus}</Text></View>
                            </View>
                            <View style={ES.view3}>
                              {clickedEvents.some(event => event.eventID === item.eventID) ? 
                                <TouchableOpacity onPress={() => setClickedEvents(clickedEvents.filter((x) => x.eventID !== item.eventID))}>
                                  <View style = {ES.greenLight}><GreenLight/></View>
                                  <View style = {ES.checkContent}><Check/></View>
                                </TouchableOpacity>
                              :
                                <TouchableOpacity onPress={() => setClickedEvents([...clickedEvents, item])}>
                                  <View style = {ES.greenLight}><GrayLight/></View>
                                  <View style = {ES.checkContent}><Check/></View>
                                </TouchableOpacity>
                              }
                            </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                </View>
              )}
            />
          : 
            <View>
              <View style={{height : '50%'}}/>
              <Text style={T.centeredOppositeColor}>Ingen treff</Text>
            </View>
        : 
          <View style={{alignSelf: 'center', maxWidth: '80%'}}>
            <View style={{height : '58%'}}/>
            <Text style={T.centeredBold20}>Sjekk nettverkstilkoblingen din og prøv igjen. Kontakt TEKKOM dersom problemet vedvarer.</Text>
          </View>
        }
      </View>    

      {/* ========================= DISPLAY BOTTOM MENU ========================= */}
        <View style={MS.bMenu}>
        <TouchableOpacity onPress={() => homePage()}>
              <Image style={MS.bMenuIcon} source={require('../assets/house777.png')} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={MS.bMenuIcon} source={require('../assets/calendar-orange.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => listingPage()}>
              <Image style={MS.bMenuIcon} source={require('../assets/business.png')} />
            </TouchableOpacity>
        </View>     
    </View>
        
  )
};