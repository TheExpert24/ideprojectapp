import React from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs,Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tabs.Screen 
        options={{ 
          title: 'Resources',
          headerRight: () => (
            <View style={styles.headerButtonsContainer}>
              <Pressable style={styles.signInButton}>
                <Text style={styles.signInText}>Sign In</Text>
              </Pressable>
              <Pressable style={styles.signUpButton}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </Pressable>
            </View>
          )
        }} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.navLogo}>General Resources for Daily Life in Dallas</Text>
          <Text style={styles.description}>
            {`\nRebuilding a life means figuring out the everyday stuff: where to buy groceries, how to get around, where to find free resources. This page is built for you. After years away, the everyday world can feel overwhelming. Prices have changed, stores have moved, and entire systems work differently. This page collects verified, Dallas-specific resources to help you navigate daily life without overspending or getting lost in bureaucracy.`}
          </Text>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <Ionicons name="cart-outline" color="#d57e57" size={22} />
            <Text style={styles.subnavLogo}>Affordable Grocery Stores</Text>
        </View>
        <Text style={styles.description}>
                {`Stretching every dollar matters. These stores consistently offer the lowest prices in the Dallas area.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Aldi</Text>
            <Text style={styles.description}>
            {`\nMultiple Dallas locations. Known for the lowest grocery prices in the area with quality store-brand products. Bring your own bags and a quarter for the cart.`}
            </Text>
            <Link href="https://www.aldi.us/store/aldi/storefront" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Save-A-Lot</Text>
            <Text style={styles.description}>
            {`\nDiscount grocery chain with locations in South and East Dallas. Great for basics like bread, canned goods, and produce at reduced prices.`}
            </Text>
            <Link href="https://savealot.com/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Walmart Neighborhood Market</Text>
            <Text style={styles.description}>
            {`\nSmaller-format Walmart stores focused on groceries. Price-match policy and Walmart+ EBT SNAP benefits can stretch your food budget further.`}
            </Text>
            <Link href="https://www.walmart.com/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Family Dollar & Dollar Tree</Text>
            <Text style={styles.description}>
            {`\nGood for household essentials, cleaning supplies, and basic pantry items. Multiple locations across Dallas, especially in underserved neighborhoods.`}
            </Text>
            <Link href="https://www.familydollar.com/combostores" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Fiesta Mart</Text>
            <Text style={styles.description}>
            {`\nAffordable produce and meat with several Dallas locations. Weekly specials often include deeply discounted fruits and vegetables.`}
            </Text>
            <Link href="https://www.fiestamart.com/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <Ionicons name="restaurant-outline" color="#d57e57" size={22} />
            <Text style={styles.subnavLogo}>Food Assistance & Pantries</Text>
        </View>
        <Text style={styles.description}>
                {`No one should go hungry while rebuilding. These organizations provide free food with no judgment.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>North Texas Food Bank</Text>
            <Text style={styles.description}>
            {`\nThe largest hunger relief organization in North Texas, distributing food through a network of 500+ partner agencies. Use their website to find the nearest food pantry to your location.`}
            </Text>
            <Link href="https://ntfb.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Brother Bill's Helping Hand</Text>
            <Text style={styles.description}>
            {`\nLocated at 3906 Elm St, Dallas. Provides food, clothing, and household essentials. Walk-ins welcome during operating hours.`}
            </Text>
            <Link href="https://bbhh.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>{`SNAP Benefits (Lone Star Card)`}</Text>
            <Text style={styles.description}>
            {`\nThe Texas equivalent of food stamps. Apply through Your Texas Benefits or by calling 2-1-1. Processing typically takes 30 days.`}
            </Text>
            <Link href="https://www.hhs.texas.gov/services/food/snap-food-benefits" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>CitySquare</Text>
            <Text style={styles.description}>
            {`\nFaith-based nonprofit fighting poverty in Dallas through food distribution, community health, and workforce development programs.`}
            </Text>
            <Link href="https://texvet.org/resources/citysquare-food-pantry" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <Ionicons name="ticket-outline" color="#d57e57" size={22} />
            <Text style={styles.subnavLogo}>Coupons & Discounts</Text>
        </View>
        <Text style={styles.description}>
                {`Every little bit helps. These programs and tools can reduce your everyday expenses.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>DART Reduced Fare Program</Text>
            <Text style={styles.description}>
            {`\nDallas Area Rapid Transit offers reduced-fare passes for qualifying low-income individuals. A monthly local pass drops from $96 to $48. Apply at any DART customer service location with proof of income.`}
            </Text>
            <Link href="https://www.dart.org/fare/general-fares-and-overview/reduced-fares" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Texas 2-1-1</Text>
            <Text style={styles.description}>
            {`\nDial 2-1-1 from any phone for a free referral service that connects you with local discounts, utility assistance programs, and community resources. Available 24/7.`}
            </Text>
            <Link href="https://www.211texas.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <Ionicons name="book-outline" color="#d57e57" size={22} />
            <Text style={styles.subnavLogo}>Public Libraries</Text>
        </View>
        <Text style={styles.description}>
                {`Libraries are more than books. They offer free internet, printing, job search help, and community programs.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Dallas Public Library System</Text>
            <Text style={styles.description}>
            {`\nThe Dallas Public Library has 30 branches across the city. A free library card gets you access to computers, Wi-Fi, printing, e-books, job databases, and GED study materials. No ID required for a temporary card.`}
            </Text>
            <Link href="https://www.dallaslibrary.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>J. Erik Jonsson Central Library</Text>
            <Text style={styles.description}>
            {`\n1515 Young St, Downtown Dallas. The flagship location with the most resources: computer labs, career center, financial literacy workshops, and community meeting spaces.`}
            </Text>
            <Link href="https://www.dallaslibrary.org/central-library" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Library Workforce Programs</Text>
            <Text style={styles.description}>
            {`\nMany branches host free resume workshops, computer skills classes, and one-on-one career coaching sessions. Check the Dallas Public Library events calendar for schedules.`}
            </Text>
            <Link href="https://www.dallaslibrary.org/services/job-tech-help" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <Ionicons name="leaf-outline" color="#d57e57" size={22} />
            <Text style={styles.subnavLogo}>Parks & Recreation</Text>
        </View>
        <Text style={styles.description}>
                {`Getting outside and being part of a community matters. Dallas has extensive free parks and recreation programs.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Dallas Parks & Recreation</Text>
            <Text style={styles.description}>
            {`\nOver 400 parks and 35,000 acres of open space. Many parks have free walking trails, basketball courts, exercise stations, and picnic areas. Recreation centers offer low-cost fitness programs.`}
            </Text>
            <Link href="https://www.dallasparks.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>White Rock Lake Park</Text>
            <Text style={styles.description}>
            {`\n1,015-acre park around a scenic lake with a 9.3-mile paved trail, fishing piers, and picnic grounds. Completely free. A peaceful place to clear your head.`}
            </Text>
            <Link href="https://www.dallasparks.org/235/White-Rock-Lake" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Klyde Warren Park</Text>
            <Text style={styles.description}>
            {`\nDowntown Dallas park with free fitness classes, outdoor games, food trucks, and regular community events. Check their calendar for free yoga, tai chi, and live music.`}
            </Text>
            <Link href="https://www.klydewarrenpark.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <FontAwesome5 name="cross" size={24} color="#d57e57" />
            <Text style={styles.subnavLogo}>Churches & Faith Communities</Text>
        </View>
        <Text style={styles.description}>
                {`Faith-based organizations often provide wraparound support including meals, clothing, mentoring, and community connection.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Wilshire Baptist Church</Text>
            <Text style={styles.description}>
            {`\n4316 Abrams Rd, Dallas. Active community outreach programs including a food pantry, clothing ministry, and support groups. Welcoming to all regardless of background.`}
            </Text>
            <Link href="https://www.wilshirebc.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Oak Cliff Bible Fellowship</Text>
            <Text style={styles.description}>
            {`\n1808 W Camp Wisdom Rd, Dallas. Led by Dr. Tony Evans, this church runs extensive community development programs including Project Turnaround for individuals re-entering society.`}
            </Text>
            <Link href="https://www.ocbfchurch.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Catholic Charities Dallas</Text>
            <Text style={styles.description}>
            {`\nProvides immigration assistance, financial coaching, food pantry access, and disaster relief services. You do not need to be Catholic to receive help.`}
            </Text>
            <Link href="https://www.ccdallas.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <Ionicons name="subway-outline" color="#d57e57" size={22}/>
            <Text style={styles.subnavLogo}>Public Transit</Text>
        </View>
        <Text style={styles.description}>
                {`Getting around Dallas without a car is possible. Here is how the transit system works.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>{`DART (Dallas Area Rapid Transit)`}</Text>
            <Text style={styles.description}>
            {`\nBus and light rail system covering Dallas and 12 surrounding cities. A single ride is $3, day pass is $6, and monthly local pass is $96 ($48 with reduced fare). The GoPass app lets you buy tickets on your phone.`}
            </Text>
            <Link href="https://www.dart.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>GoPass Mobile App</Text>
            <Text style={styles.description}>
            {`\nPurchase DART tickets, passes, and GoLink rides directly from your phone. Works even without a credit card in some cases. Available on iOS and Android.`}
            </Text>
            <Link href="https://www.dart.org/gopass" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <Ionicons name="heart-outline" color="#d57e57" size={22} />
            <Text style={styles.subnavLogo}>Healthcare & Wellness</Text>
        </View>
        <Text style={styles.description}>
                {`Access to healthcare is critical during reintegration. These resources can help if you do not have insurance.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Parkland Health</Text>
            <Text style={styles.description}>
            {`\nDallas County public hospital system providing healthcare regardless of ability to pay. Financial assistance programs available. Emergency room at 5201 Harry Hines Blvd.`}
            </Text>
            <Link href="https://www.parklandhealth.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Community Health Centers</Text>
            <Text style={styles.description}>
            {`\nFederally qualified health centers across Dallas offer sliding-scale fees based on income. Services include primary care, dental, and behavioral health.`}
            </Text>
            <Link href="https://findahealthcenter.hrsa.gov/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Metrocare Services</Text>
            <Text style={styles.description}>
            {`\nLargest mental health provider in North Texas. Offers counseling, psychiatric services, and crisis intervention on a sliding scale. No one is turned away for inability to pay.`}
            </Text>
            <Link href="https://www.metrocareservices.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <Ionicons name="school-outline" color="#d57e57" size={22} />
            <Text style={styles.subnavLogo}>Education & GED Programs</Text>
        </View>
        <Text style={styles.description}>
                {`Whether you want to finish a GED or explore college, Dallas has accessible programs.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>{`Dallas College (Community College)`}</Text>
            <Text style={styles.description}>
            {`\nSeven campuses across Dallas County offering affordable degree programs, vocational training, and continuing education. Financial aid and tuition waivers available for qualifying students.`}
            </Text>
            <Link href="https://www.dallascollege.edu/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>{`Literacy Instruction for Texas (LIFT)`}</Text>
            <Text style={styles.description}>
            {`\nFree adult education and literacy programs including GED preparation, ESL classes, and basic computer skills at multiple Dallas locations.`}
            </Text>
            <Link href="https://www.idealist.org/en/nonprofit/0b542974dff643f4954ca657f3673c2d-lift-literacy-instruction-for-texas-dallas" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Goodwill Job Training</Text>
            <Text style={styles.description}>
            {`\nFree career training programs in healthcare, IT, and skilled trades through Goodwill Industries of Dallas. Programs include certification prep and job placement assistance.`}
            </Text>
            <Link href="https://www.goodwilldallas.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.ctaContainer}>
            <View style={styles.bottomLine}></View>
        </View>
        <View style={styles.container}>
            <Ionicons name="call-outline" color="#d57e57" size={22} />
            <Text style={styles.subnavLogo}>Phone & Internet Access</Text>
        </View>
        <Text style={styles.description}>
                {`A phone number and internet connection are essential for job applications, housing searches, and staying connected.`}
        </Text>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Lifeline Program</Text>
            <Text style={styles.description}>
            {`\nFederal program providing a $9.25 monthly discount on phone or internet service for qualifying low-income individuals. Apply through your carrier or at LifelineSupport.org.`}
            </Text>
            <Link href="https://www.lifelinesupport.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>{`Affordable Connectivity Program (ACP)`}</Text>
            <Text style={styles.description}>
            {`\nFederal program providing discounted high-speed internet for eligible low-income households. Benefits vary by provider but typically include $30-$75/month subsidies.`}
            </Text>
            <Link href="https://www.fcc.gov/broadbandbenefit" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
        <View style={styles.fullBorder}>
            <Text style={styles.bold}>Dallas Public Library Wi-Fi</Text>
            <Text style={styles.description}>
            {`\nAll 30 library branches offer free Wi-Fi and computer access during operating hours. Some branches also loan Wi-Fi hotspots for home use.`}
            </Text>
            <Link href="https://dallaslibrary.org/" asChild>
                <Pressable style={styles.container}>
                    <Text style={styles.learnmore}> Learn more </Text>
                    <Ionicons name="open-outline" color="#d57e57" size={22}/>
                </Pressable>
            </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  copyright:{
    color:"#5e5e5e",
    textAlign: "center",
  },
  bold:{
    fontWeight:"bold",
    fontSize: 20
  },
  learnmore:{
    color:"#d57e57",
  },

  fullBorder: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid', // Options: 'solid', 'dashed', 'dotted'
    marginBottom: 20,
  },
  container:{
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  bottomLine: {
    width: '105%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  resourcebtn:{
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle:{
    fontSize:23,
    fontWeight: 400
  },
  subdescription:{
    color: "#5e5e5e",
  },

  divider: {
    height: 1,                
    backgroundColor: '#CCC', 
    width: '100%',          
    marginVertical: 15,
  },
  navbar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff",
  },
  navLogo: {
    color: "#000000",
    fontSize: 50,
    fontFamily: "serif",
    textAlign: "left",
  },
  subnavLogo: {
    color: "#000000",
    fontSize: 30,
    fontFamily: "serif",
    textAlign: "left",
  },
  signInButton: {
    backgroundColor: "#d57e57",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  signUpButton:{
    paddingHorizontal:14,
    paddingVertical:6,
    borderRadius: 6,  
    backgroundColor: 'transparent',
  },
  signInText: {
    color: "#FFFFFF",
    fontWeight: "300",
    fontSize: 14,
  },
  signUpText:{
    color:"#000000",
    fontWeight:"300",
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
  },
  heroSection: {
    marginVertical: 24,
  },
  description: {
    color: "#343639",
    fontSize: 16,
    textAlign: "left",
    lineHeight: 24,
    marginBottom: 16,
  },
  subtext: {
    color: "#F3F4F6",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems:'center',
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  ctaButton: {
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpBtn: {
    backgroundColor: "#d57e57",
    justifyContent:'center',
    alignItems: 'center'
  },
  volunteerBtn: {
    borderWidth: 2,      
    borderColor: '#000000',    
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    color: "#000000",
    fontSize: 16,
  },
  ctaText2:{
    color: "#FFFFFF",
    fontSize: 16,
  },
  sectionHeader: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: "#ffffff",
  },
  cardCategory: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardLink: {
    color: "#60A5FA",
    fontSize: 14,
    fontWeight: "500",
  },
  headerButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, 
  },
});
