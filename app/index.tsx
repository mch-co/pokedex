import { router } from "expo-router";
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

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=20";

interface Pokemon {
  id: number;
  name: string;
  imageurl: string;
  types: string[];
}

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

function getCardColor(types: string[]): string {
  if (!types || types.length === 0) return TYPE_COLORS.default;
  return TYPE_COLORS[types[0]] ?? TYPE_COLORS.default;
}

export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPokemon();
  }, []);

  async function fetchPokemon() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const pokemonData = await Promise.all(
        data.results.map(async (pokemon: any, index: number) => {
          const id = index + 1;
          const details = await getPokemonDetails(id);
          return {
            id,
            name: pokemon.name,
            imageurl:
              details?.sprites?.other?.["official-artwork"]?.front_default ??
              details?.sprites?.front_default ??
              "",
            types: details?.types?.map((t: any) => t.type.name) ?? [],
          };
        }),
      );
      setPokemons(pokemonData);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    } finally {
      setLoading(false);
    }
  }

  async function getPokemonDetails(id: number) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return await response.json();
    } catch {
      return null;
    }
  }

  const filtered = pokemons.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
        <Text style={styles.subtitle}>
          Recherchez un Pokémon par nom ou en utilisant son{"\n"}numéro du
          Pokédex National.
        </Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.loaderText}>Loading Pokémons...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {filtered.map((pokemon) => (
              <Pressable
                key={pokemon.id}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: getCardColor(pokemon.types) },
                  pressed && styles.cardPressed,
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/details",
                    params: { id: pokemon.id },
                  })
                }
              >
                <Image
                  source={{ uri: pokemon.imageurl }}
                  style={styles.image}
                />
                <Text style={styles.pokemonName}>{pokemon.name}</Text>
                <Text style={styles.pokemonId}>
                  {String(pokemon.id).padStart(3, "0")}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  filterBtn: {
    backgroundColor: "#2D2D2D",
    borderRadius: 10,
    padding: 6,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  filterIcon: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "47%",
    height: 160,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 14,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  image: {
    width: 100,
    height: 100,
    position: "absolute",
    top: 10,
  },
  pokemonName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    textTransform: "capitalize",
  },
  pokemonId: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loaderText: {
    color: "#888",
    fontSize: 14,
  },
});
