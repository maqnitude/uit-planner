import React, { useRef } from 'react';
import { Button, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

interface TimetableCaptureProps {
  children: React.ReactNode;
}

export const TimetableCapture: React.FC<TimetableCaptureProps> = ({ children }) => {
  const viewShotRef = useRef<ViewShot>(null);

  const onCapture = () => {
    if (viewShotRef.current && viewShotRef.current.capture) {
      viewShotRef.current.capture().then((uri: string) => {
        console.log('Image saved to', uri);
        CameraRoll.saveAsset(uri, { type: 'photo' })
          .then(() => console.log('Image saved to photo gallery'))
          .catch((error: Error) => console.error('Error saving image to photo gallery: ', error));
      });
    }
  };

  return (
    <ViewShot ref={viewShotRef} options={{ fileName: 'timetable', format: 'jpg', quality: 0.8 }} style={styles.container}>
      {children}
      <Button title="Save Timetable" onPress={onCapture} />
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
