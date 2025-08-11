# React Native Conversion Guide for TriSex.org

## Overview

This guide outlines the process to convert the current TriSex.org web application into a native Android (and iOS) app using React Native.

## Current Architecture

The TriSex.org platform is built with:
- **Frontend**: React with TypeScript, Wouter routing, TanStack Query
- **Backend**: Express.js REST API with PostgreSQL
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Custom session-based auth system
- **Key Features**: Age verification, materials science, cooperative matchmaking, 4D STI tracking

## React Native Conversion Strategy

### Phase 1: Setup React Native Environment

```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create new React Native project
npx react-native@latest init TriSexOrgNative --template react-native-template-typescript

# Install essential dependencies
cd TriSexOrgNative
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @tanstack/react-query
npm install react-native-vector-icons
npm install react-native-svg
npm install react-native-document-picker
npm install react-native-image-picker
npm install react-native-permissions
npm install @react-native-async-storage/async-storage
```

### Phase 2: Component Migration

#### Navigation Migration
- Replace Wouter with React Navigation
- Convert tab navigation to React Navigation Bottom Tabs
- Implement stack navigation for modal flows

```typescript
// Example navigation structure
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Protection" component={ProtectionScreen} />
      <Tab.Screen name="Health" component={HealthScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
    </Tab.Navigator>
  );
}
```

#### UI Component Migration
- Convert shadcn/ui components to React Native equivalents
- Use react-native-paper or NativeBase for component library
- Implement custom components for complex interactions

```typescript
// Example: Convert Button component
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant]]} 
      onPress={onPress}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </TouchableOpacity>
  );
}
```

### Phase 3: Feature Implementation

#### Age Verification System
- Integrate react-native-document-picker for document uploads
- Use react-native-image-picker for photo capture
- Implement native file handling and secure storage

```typescript
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';

export function AgeVerificationNative() {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      // Handle document upload
    } catch (err) {
      // Handle error
    }
  };

  const capturePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      // Handle photo capture
    });
  };
}
```

#### Materials Science Visualization
- Use react-native-svg for scientific diagrams
- Implement native animations with React Native Animated API
- Create interactive charts with react-native-chart-kit

#### 4D STI Tracking
- Integrate device location services
- Implement secure data storage with encrypted databases
- Use push notifications for health reminders

### Phase 4: Platform-Specific Features

#### Android-Specific Features
```typescript
// Android permissions setup
import { PermissionsAndroid } from 'react-native';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'TriSex.org Camera Permission',
        message: 'App needs camera access for age verification documents',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};
```

#### PWA vs Native App Considerations
- PWA advantages: Easier updates, cross-platform, web technologies
- Native advantages: Better performance, device integration, app store distribution
- Hybrid approach: React Native with web views for complex features

### Phase 5: State Management & API Integration

#### TanStack Query Integration
```typescript
// Maintain existing API structure
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Use AsyncStorage for persistence
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});
```

#### Authentication
- Convert session-based auth to token-based for mobile
- Implement secure token storage with Keychain (iOS) / Keystore (Android)
- Add biometric authentication support

### Phase 6: Build & Distribution

#### Android Build Configuration
```gradle
// android/app/build.gradle
android {
    compileSdkVersion 34
    buildToolsVersion "34.0.0"
    
    defaultConfig {
        applicationId "org.trisex.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

#### Release Process
1. Generate signed APK for Google Play Store
2. Implement app signing and security measures
3. Create app store listings with appropriate content ratings
4. Set up continuous integration with GitHub Actions

## Migration Checklist

### Core Features
- [ ] Home page with ⚧️ branding
- [ ] Age verification system with document upload
- [ ] Materials science information pages
- [ ] Cooperative matchmaking interface
- [ ] 4D STI tracking dashboard
- [ ] User authentication and profiles

### Native Features
- [ ] Push notifications for health reminders
- [ ] Offline data synchronization
- [ ] Device camera integration
- [ ] Secure document storage
- [ ] Biometric authentication
- [ ] Location services for STI tracking

### Technical Implementation
- [ ] React Navigation setup
- [ ] API client configuration
- [ ] State management with TanStack Query
- [ ] Component library integration
- [ ] Testing setup (Jest, Detox)
- [ ] Performance optimization

## Development Timeline

### Week 1-2: Environment Setup
- React Native project initialization
- Navigation and routing implementation
- Basic component migration

### Week 3-4: Core Features
- Age verification system
- User authentication
- Materials science pages

### Week 5-6: Advanced Features
- 4D STI tracking
- Cooperative matchmaking
- Push notifications

### Week 7-8: Polish & Testing
- UI/UX refinement
- Performance optimization
- Testing and bug fixes

### Week 9-10: Release Preparation
- App store preparation
- Documentation
- Beta testing

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [TanStack Query React Native](https://tanstack.com/query/latest/docs/react/guides/react-native)
- [Android Development Guidelines](https://developer.android.com/guide)

## Conclusion

Converting TriSex.org to React Native will provide a native mobile experience while preserving the core functionality and values of the platform. The modular architecture and TypeScript foundation make this transition feasible with proper planning and execution.