import React from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from 'expo-router';

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: 'The IDE Project',
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
          <Text style={[styles.navLogo, { fontFamily: "serif" }]}>Ide Project</Text>
          <Text style={styles.description}>
            {`\nThe Ide Project, led by youth\nchangemakers, connects exonerees\nnationwide with verified reentry support\norganizations, housing resources, job\ntraining programs, and community\nadvocacy. Get help after wrongful\nconviction.`}
          </Text>
        </View>
        <View style={styles.ctaContainer}>
              <Pressable style={[styles.ctaButton, styles.helpBtn]}>
                <Text style={styles.ctaText2}>  I Need Help  </Text>
              </Pressable>
              <Pressable style={[styles.ctaButton, styles.volunteerBtn]}>
                <Text style={styles.ctaText}>  I Want to Help  </Text>
              </Pressable>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    textAlign: "center",
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
    textAlign: "center",
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
