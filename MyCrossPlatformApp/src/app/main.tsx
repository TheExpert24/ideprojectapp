import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs, Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from './authStore';
import { supabase } from './supabaseClient';

const getNameFromEmail = (email: string): string => {
  if (!email) return 'User';
  const handle = email.split('@')[0];
  const firstPart = handle.split(/[._-]/)[0];
  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
};

export default function Index() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const authUser = useAuth();
  const params = useLocalSearchParams<{ pendingEmail?: string; pendingName?: string }>();

  const pendingEmail = typeof params.pendingEmail === 'string' ? params.pendingEmail : '';
  const pendingName = typeof params.pendingName === 'string' ? params.pendingName : '';

  const user = authUser ?? (pendingEmail ? {
    email: pendingEmail,
    name: pendingName || getNameFromEmail(pendingEmail),
  } : null);

  const displayName = user?.name || (user?.email ? getNameFromEmail(user.email) : 'User');
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Tabs.Screen 
        options={{ 
          title: 'Home',
          headerRight: () => (
            <View style={styles.headerButtonsContainer}>
              {user ? (
                <View style={styles.profileMenuWrapper}>
                  <Pressable
                    style={styles.profileButtonContainer}
                    onPress={() => setShowProfileMenu(prev => !prev)}
                  >
                    <View style={styles.avatarIcon}>
                      <Text style={styles.avatarText}>
                        {avatarLetter}
                      </Text>
                    </View>

                    <Text style={styles.greetingText}>
                      Hi {displayName}
                    </Text>
                  </Pressable>

                    {showProfileMenu && (
                    <View style={styles.profileMenu}>
                      <Pressable
                        style={styles.signOutButton}
                        onPress={async () => {
                          await supabase.auth.signOut();
                          setShowProfileMenu(false);
                          router.replace('/');
                        }}
                      >
                        <Text style={styles.signOutText}>
                          Sign Out
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ) : (
                <>
                  <Pressable
                    style={styles.signInButton}
                    onPress={() => router.push('/signin')}
                  >
                    <Text style={styles.signInText}>
                      Sign In
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.signUpButton}
                    onPress={() => router.push('/signup')}
                  >
                    <Text style={styles.signUpText}>
                      Sign Up
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          ),
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
  profileButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d57e57',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
  },
  greetingText: {
    color: '#111',
    fontSize: 14,
  },
  profileMenuWrapper: {
  position: 'relative',
},
profileMenu: {
  position: 'absolute',
  top: 42,
  right: 0,
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#e5e7eb',
  borderRadius: 8,
  padding: 6,
  minWidth: 100,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 6,
  shadowOffset: {
    width: 0,
    height: 3,
  },
  elevation: 5,
  zIndex: 999,
},

signOutButton: {
  paddingVertical: 10,
  paddingHorizontal: 12,
},

signOutText: {
  color: '#111111',
  fontSize: 14,
},
});
