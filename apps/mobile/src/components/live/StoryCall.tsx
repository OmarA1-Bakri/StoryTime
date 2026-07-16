import { AudioSession, LiveKitRoom, VideoTrack, useTracks } from "@livekit/react-native";
import { Track } from "livekit-client";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import type { LiveKitCredentials } from "../../lib/livekitCredentials";

type StoryCallProps = {
  credentials: LiveKitCredentials;
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (message: string) => void;
};

export function StoryCall({ credentials, onConnected, onDisconnected, onError }: StoryCallProps) {
  useEffect(() => {
    void AudioSession.startAudioSession();
    return () => {
      void AudioSession.stopAudioSession();
    };
  }, []);

  return (
    <LiveKitRoom
      serverUrl={credentials.serverUrl}
      token={credentials.token}
      connect
      audio
      video
      onConnected={onConnected}
      onDisconnected={onDisconnected}
      onError={(error) => onError(error.message)}
    >
      <StoryCallStage />
    </LiveKitRoom>
  );
}

function StoryCallStage() {
  const tracks = useTracks([Track.Source.Camera]);
  return (
    <View style={styles.stage}>
      <View style={styles.grid}>
        {tracks.length === 0 ? (
          <View style={styles.empty}>
            <ActivityIndicator color="#ffbf47" />
            <Text style={styles.muted}>Connecting cameras…</Text>
          </View>
        ) : (
          tracks.slice(0, 2).map((track) => (
            <View key={`${track.participant.identity}-${track.source}`} style={styles.tile}>
              <VideoTrack trackRef={track} style={styles.video} objectFit="cover" />
              <Text style={styles.name}>
                {track.participant.name || track.participant.identity}
              </Text>
            </View>
          ))
        )}
      </View>
      <View style={styles.storyCanvas}>
        <Text style={styles.eyebrow}>LIVE STORY ROOM</Text>
        <Text style={styles.title}>The adventure starts here</Text>
        <Text style={styles.copy}>
          Both adults connect first. Story setup and recording start only after the protected
          handoff.
        </Text>
      </View>
      <Pressable accessibilityRole="button" style={styles.baton} disabled>
        <Text style={styles.batonText}>Story baton unlocks after setup</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, backgroundColor: "#100b17", padding: 16, gap: 16 },
  grid: { flex: 1, flexDirection: "row", gap: 10 },
  tile: { flex: 1, overflow: "hidden", borderRadius: 22, backgroundColor: "#231a31" },
  video: { flex: 1 },
  name: {
    position: "absolute",
    left: 10,
    bottom: 10,
    color: "white",
    fontWeight: "800",
    backgroundColor: "rgba(0,0,0,.45)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 99,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#231a31",
    borderRadius: 22,
  },
  muted: { color: "#c8bdd2" },
  storyCanvas: { backgroundColor: "#fff7e8", borderRadius: 24, padding: 20, gap: 7 },
  eyebrow: { color: "#6d4aff", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  title: { color: "#2a1c35", fontSize: 24, fontWeight: "900" },
  copy: { color: "#65566f", fontSize: 15, lineHeight: 21 },
  baton: { backgroundColor: "#6d4aff", borderRadius: 99, padding: 16, opacity: 0.65 },
  batonText: { color: "white", fontWeight: "900", textAlign: "center" },
});
