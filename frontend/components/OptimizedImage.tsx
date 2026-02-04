import React, { useState } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';

interface OptimizedImageProps {
  source: { uri: string };
  style?: any;
  placeholder?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  source, 
  style, 
  placeholder = true 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={[style, styles.container]}>
      {loading && placeholder && (
        <View style={[style, styles.placeholder]}>
          <ActivityIndicator size="small" color="#FF6B6B" />
        </View>
      )}
      <Image
        source={source}
        style={[style, { opacity: loading ? 0 : 1 }]}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        resizeMode="cover"
      />
      {error && (
        <View style={[style, styles.errorContainer]}>
          <View style={styles.errorPlaceholder} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  placeholder: {
    position: 'absolute',
    backgroundColor: '#2a2a3e',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorPlaceholder: {
    backgroundColor: '#333',
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});