import React, { useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { 
  Pressable, 
  View, 
  Text, 
  StyleSheet, 
  Dimensions 
} from 'react-native';

export default function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (routePath: string) => {
    setIsMenuOpen(false);
    router.push(routePath);
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      
      {/* 1. BASELINE TABS CORE STRUCTURE */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#d57e57',
          tabBarInactiveTintColor: '#737373', 
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
          tabBarStyle: { height: 65, paddingBottom: 10, paddingTop: -1, backgroundColor: '#FFFFFF' },
          headerLeft: () => (
            <Pressable 
              onPress={() => setIsMenuOpen(true)} 
              style={{ marginLeft: 15, padding: 5, cursor: 'pointer' } as any}
            >
              <Ionicons name="menu" size={26} color="#737373" />
            </Pressable>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerTitle: '', 
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} color={color} size={22} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            headerTitle: '',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "chatbox" : "chatbox-outline"} color={color} size={22} />
            ),
          }}
        />
        <Tabs.Screen
          name="resources"
          options={{
            title: 'Resources',
            headerTitle: '',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "book" : "book-outline"} color={color} size={22} />
            ),
          }}
        />
        <Tabs.Screen
          name="help"
          options={{
            title: 'Help',
            headerTitle: '',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "bulb-outline" : "bulb"} color={color} size={22} />
            ),
          }}
        />

        {/* Filters extra files out of bottom tab panel visually */}
        <Tabs.Screen name="authStore" options={{ href: null }} />
        <Tabs.Screen name="supabaseClient" options={{ href: null }} />
        <Tabs.Screen name="signup" options={{ href: null }} />
        <Tabs.Screen name="signin" options={{ href: null }} />
        <Tabs.Screen name="main" options={{ href: null }} />
        <Tabs.Screen name="otheresources" options={{ href: null }} />
      </Tabs>

      {/* 2. ABSOLUTE WEB/MOBILE SIDEPANEL OVERLAY (Triggers directly on screen top-layer) */}
      {isMenuOpen && (
        <View style={styles.fullscreenOverlay}>
          <Pressable style={styles.dismissArea} onPress={() => setIsMenuOpen(false)} />
          
          <View style={styles.drawerSidebar}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}> IDE Project</Text>
              <Text style={styles.drawerSubtitle}>Navigation Menu</Text>
            </View>
            
            <View style={styles.menuList}>
              <Pressable style={styles.menuItem} onPress={() => handleNavigation('/')}>
                <Ionicons name="home-outline" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Home Screen</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => handleNavigation('/messages')}>
                <Ionicons name="chatbox-outline" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Messages</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => handleNavigation('/otheresources')}>
                <Ionicons name="book-outline" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Other Resources</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => handleNavigation('/help')}>
                <Ionicons name="bulb-outline" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Help Center</Text>
              </Pressable>

              <View style={styles.menuDivider} />

              <Pressable style={styles.menuItem} onPress={() => handleNavigation('/signin')}>
                <Ionicons name="log-in-outline" size={20} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Account Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
    zIndex: 99999, // Places it cleanly over the native web container header
  },
  dismissArea: {
    flex: 1,
  },
  drawerSidebar: {
    width: 280,
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingTop: 60,
    boxShadow: '4px 0px 10px rgba(0,0,0,0.1)', // Modern SDK 57 complaint style prop
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 15,
  },
  drawerTitle: {
    fontSize: 22,
    color: '#000000',
  },
  drawerSubtitle: {
    fontSize: 13,
    color: '#737373',
    marginTop: 4,
  },
  menuList: {
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 15,
  },
});
