<script setup lang="ts">
import { computed, ref } from "vue";

interface BarItem {
  type: "hunk-bar";
  lines: number;
}
interface LineItem {
  type: "line";
  text: string;
}

// Discriminated union over the `type` tag: "hunk-bar" | "section".
type ViewItem = BarItem | { type: "section"; lines: LineItem[] };

const rows = ref<(LineItem | BarItem)[]>([]);

// Groups consecutive non-bar rows into a "section", leaving "hunk-bar" items inline.
const items = computed<ViewItem[]>(() => {
  const out: ViewItem[] = [];
  let current: LineItem[] = [];
  for (const row of rows.value) {
    if (row.type === "hunk-bar") {
      if (current.length > 0) {
        out.push({ type: "section", lines: current });
        current = [];
      }
      out.push(row);
    } else {
      current.push(row);
    }
  }
  if (current.length > 0) out.push({ type: "section", lines: current });
  return out;
});
</script>

<template>
  <div>
    <template v-for="(item, i) in items" :key="i">
      <button v-if="item.type === 'hunk-bar'">{{ item.lines }}</button>

      <!--
        In this v-else branch `item` is narrowed to `{ type: "section" }`. vize
        re-emits the ancestor guard `item.type === 'hunk-bar'` inside the nested
        v-for below, so against the narrowed type it compiles the comparison
        "section" === "hunk-bar", which corsa flags as TS2367 ("no overlap").
        vue-tsc emits proper nested if/else and never re-compares, so it is clean.
        Inspect with: vize check src/App.vue --show-virtual-ts
      -->
      <div v-else class="_section">
        <div v-for="(row, j) in item.lines" :key="j" class="_line">
          {{ row.text }}
        </div>
      </div>
    </template>
  </div>
</template>

<!--
  Same SFC as the bug/template-narrowing branch with the <style> padding removed.
  Only the file size differs, yet `vize check` now reports "No type errors".

  corsa still emits the TS2367 into the generated virtual TS; `vize check` drops it
  because the diagnostic's canon byte offset exceeds this (now-shorter) source file
  length, so vize maps it past the end of the source and discards it. Confirm the
  dropped error is real:

    vize check src/App.vue                                  # -> No type errors found!
    vize check src/App.vue --show-virtual-ts                # re-emitted item.type guard
    node_modules/.bin/tsgo -p node_modules/.vize/canon/tsconfig.json   # -> TS2367
-->
