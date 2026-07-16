import { ref } from "vue";

// A ref exported from another module (a store / composable singleton).
export const fontSize = ref(0);
export const theme = ref({ background: "#000000" });
