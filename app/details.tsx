import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TYPE_COLORS: Record<string, string> = {
  grass: "#C8E6C3",
  poison: "#C8E6C3",
  fire: "#F5D5B8",
  water: "#B8D4F5",
  bug: "#D4E8C2",
  normal: "#E8E8D8",
  electric: "#F5EDB8",
  ground: "#E8D8B8",
  fairy: "#F5C8D8",
  fighting: "#F5C8C8",
  psychic: "#F5C8D8",
  rock: "#D8D0C0",
  ghost: "#C8C0D8",
  ice: "#C8E8F5",
  dragon: "#C8C8F5",
  dark: "#C8C0C8",
  steel: "#D0D8D8",
  flying: "#D0D8F0",
  default: "#E8EAE0",
};

const FORM_LABELS = ["Face", "Dos", "✨ Face", "✨ Dos"];

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGif, setSelectedGif] = useState(0);

  useEffect(() => {
    if (id) loadPokemon(id);
  }, [id]);

  async function loadPokemon(pokemonId: string) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      setPokemon(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.loader}>
        <Text>Pokémon introuvable.</Text>
      </View>
    );
  }

  const primaryType = pokemon.types?.[0]?.type?.name ?? "default";
  const cardBg = TYPE_COLORS[primaryType] ?? TYPE_COLORS.default;
  const officialArt =
    pokemon.sprites?.other?.["official-artwork"]?.front_default;

  const animated =
    pokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.animated;
  const gif = [
    animated?.front_default ?? officialArt,
    animated?.back_default ?? officialArt,
    animated?.front_shiny ?? officialArt,
    animated?.back_shiny ?? officialArt,
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.pokeName}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>
          <Text style={styles.pokeId}>
            {String(pokemon.id).padStart(3, "0")}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* GIF principal affiché */}
        <View style={[styles.heroCard, { backgroundColor: cardBg }]}>
          <Image
            source={{ uri: gif[selectedGif] }}
            style={styles.heroImage}
            resizeMode="contain" // ✅ important pour les GIFs
          />
        </View>

        {/* Thumbnails sélectionnables */}
        <View style={styles.content}>
          <View style={styles.formRow}>
            {gif.map((uri, i) => (
              <Pressable key={i} onPress={() => setSelectedGif(i)}>
                <View
                  style={[
                    styles.formThumb,
                    { backgroundColor: cardBg },
                    selectedGif === i && styles.formThumbActive, // ✅ bordure si sélectionné
                  ]}
                >
                  <Image
                    source={{ uri }}
                    style={styles.formImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.formLabel}>{FORM_LABELS[i]}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 2,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  backArrow: { fontSize: 22, color: "#333" },
  titleBlock: { alignItems: "center" },
  pokeName: { fontSize: 20, fontWeight: "800", color: "#1A1A1A" },
  pokeId: { fontSize: 13, color: "#888", marginTop: 2 },
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: { width: 180, height: 180 },
  content: { padding: 20, alignItems: "center" },
  formRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  formThumb: {
    width: 75,
    height: 90,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  formThumbActive: {
    borderColor: "#1A1A1A",
  },
  formImage: { width: 52, height: 52 },
  formLabel: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
    fontWeight: "600",
  },
});
