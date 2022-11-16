<template>
  <div ref="wall" class="wl-gallery" :style="{ gap: `${gap}px` }">
    <div
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      class="wl-gallery-column"
      :data-index="columnIndex"
      :style="{ gap: `${gap}px` }"
    >
      <template v-for="itemIndex in column" :key="itemIndex">
        <LoadingIcon
          v-if="!state[items[itemIndex].src]"
          :size="36"
          style="margin: 20px auto"
        />
        <img
          class="wl-gallery-item"
          :src="items[itemIndex].src"
          :title="items[itemIndex].title"
          loading="lazy"
          @load="imageLoad"
          @click="$emit('insert', `![](${items[itemIndex].src})`)"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';

import { LoadingIcon } from './Icons';

import type { PropType } from 'vue';
import type { WalineSearchResult } from '../typings';

type Column = number[];

export default defineComponent({
  name: 'ImageWall',

  components: {
    LoadingIcon,
  },

  props: {
    items: { type: Array as PropType<WalineSearchResult>, default: () => [] },
    columnWidth: { type: Number, default: 300 },
    gap: { type: Number, default: 0 },
  },

  emits: ['insert'],

  setup(props) {
    let resizeObserver: ResizeObserver | null = null;
    const wall = ref<HTMLDivElement | null>(null);
    const state = ref<Record<string, boolean>>({});
    const columns = ref<Column[]>([]);

    const getColumnCount = (): number => {
      const count = Math.floor(
        (wall.value!.getBoundingClientRect().width + props.gap) /
          (props.columnWidth + props.gap)
      );

      return count > 0 ? count : 1;
    };

    const createColumns = (count: number): Column[] =>
      new Array(count).fill(null).map(() => []);

    const fillColumns = async (itemIndex: number): Promise<void> => {
      if (itemIndex >= props.items.length) return;

      await nextTick();

      const columnDivs = Array.from(
        wall.value?.children || []
      ) as HTMLDivElement[];

      const target = columnDivs.reduce((prev, curr) =>
        curr.getBoundingClientRect().height <
        prev.getBoundingClientRect().height
          ? curr
          : prev
      );

      columns.value[Number(target.dataset.index)].push(itemIndex);

      await fillColumns(itemIndex + 1);
    };

    const redraw = async (force = false): Promise<void> => {
      if (columns.value.length === getColumnCount() && !force) return;

      columns.value = createColumns(getColumnCount());

      const scrollY = window.scrollY;

      await fillColumns(0);

      window.scrollTo({ top: scrollY });
    };

    const imageLoad = (e: Event): void => {
      state.value[(e.target as HTMLImageElement).src] = true;
    };

    watch(
      () => [props.items],
      () => {
        state.value = {};
        redraw(true);
      }
    );
    watch(
      () => [props.columnWidth, props.gap],
      () => redraw()
    );

    onMounted(() => {
      redraw(true);
      resizeObserver = new ResizeObserver(() => redraw());

      resizeObserver.observe(wall.value!);
    });

    onBeforeUnmount(() => resizeObserver!.unobserve(wall.value!));

    return {
      columns,
      state,
      wall,
      imageLoad,
    };
  },
});
</script>
