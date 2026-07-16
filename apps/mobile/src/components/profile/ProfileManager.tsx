import { useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Profile = { _id: string; displayName: string; ageBand: "6-8" | "9-10" | "11-12" };
const listMine = makeFunctionReference<"query", Record<string, never>, Profile[]>(
  "profiles:listMine",
);
const createMine = makeFunctionReference<
  "mutation",
  { displayName: string; ageBand: Profile["ageBand"] },
  string
>("profiles:createMine");

export function ProfileManager() {
  const profiles = useQuery(listMine, {});
  const create = useMutation(createMine);
  const [name, setName] = useState("");
  const [ageBand, setAgeBand] = useState<Profile["ageBand"]>("6-8");
  const [saving, setSaving] = useState(false);

  async function addProfile() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await create({ displayName: name.trim(), ageBand });
      setName("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Child profiles</Text>
      {profiles?.map((profile) => (
        <View key={profile._id} style={styles.profile}>
          <Text style={styles.profileName}>{profile.displayName}</Text>
          <Text style={styles.age}>Age {profile.ageBand}</Text>
        </View>
      ))}
      <TextInput
        accessibilityLabel="Child display name"
        placeholder="Child display name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <View style={styles.ages}>
        {(["6-8", "9-10", "11-12"] as const).map((age) => (
          <Pressable
            key={age}
            onPress={() => setAgeBand(age)}
            style={[styles.ageChoice, ageBand === age && styles.ageSelected]}
          >
            <Text style={ageBand === age ? styles.ageSelectedText : styles.ageChoiceText}>
              {age}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        disabled={saving || !name.trim()}
        onPress={addProfile}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{saving ? "Saving…" : "Add child profile"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "white", borderRadius: 22, padding: 18, gap: 12 },
  heading: { color: "#2a1c35", fontSize: 20, fontWeight: "900" },
  profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f0ff",
    padding: 12,
    borderRadius: 14,
  },
  profileName: { color: "#2a1c35", fontWeight: "800" },
  age: { color: "#76677f" },
  input: {
    borderWidth: 1,
    borderColor: "#d8cfdf",
    borderRadius: 14,
    padding: 13,
    color: "#2a1c35",
  },
  ages: { flexDirection: "row", gap: 8 },
  ageChoice: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: "#d8cfdf" },
  ageSelected: { backgroundColor: "#6d4aff", borderColor: "#6d4aff" },
  ageChoiceText: { textAlign: "center", color: "#65566f", fontWeight: "800" },
  ageSelectedText: { textAlign: "center", color: "white", fontWeight: "900" },
  button: { backgroundColor: "#6d4aff", borderRadius: 99, padding: 14 },
  buttonText: { textAlign: "center", color: "white", fontWeight: "900" },
});
