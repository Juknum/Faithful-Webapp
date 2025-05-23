<template>
	<div :class="['json-object-editor', { 'json-editor-bordered': !root, 'json-editor-root': root }]">
		<div class="json-editor-header" @click="toggled = !toggled">
			<span v-if="!root" class="json-editor-toggle">{{ toggled ? "-" : "+" }}</span>
			<span v-if="!root" class="json-editor-title">object</span>
		</div>
		<div v-show="toggled" class="json-editor-content">
			<div v-for="(val, index) in values" :key="val + index" class="d-flex">
				<div class="json-object-key">
					<span class="json-editor-delete" @click="() => deleteItem(index)">delete</span>
					<input
						class="json-editor-input json-object-key-input"
						type="string"
						v-model="keys[index]"
						placeholder="key"
						@keydown="resize(index)"
						:ref="`input-${index}`"
					/>
					<div :ref="`hide-${index}`" class="json-editor-hide">{{ keys[index] }}</div>
				</div>
				<json-editor class="flex-grow-1" v-model="values[index]" :parent="value" />
			</div>
			<json-add-editor @clicked="onClickChild" />
		</div>
	</div>
</template>

<script>
// fixes circular dependency error
const JSONEditor = () => import("./index.vue");
import JSONAddEditor from "./json-add-editor.vue";

export default {
	name: "json-object-editor",
	components: {
		JSONEditor,
		JSONAddEditor,
	},
	props: {
		value: {
			required: true,
		},
		parent: {
			required: false,
			default: undefined,
		},
		root: {
			required: false,
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			keys: [],
			values: [],
			toggled: true,
		};
	},
	methods: {
		resize(index) {
			const [input] = this.$refs[`input-${index}`];
			const [text] = this.$refs[`hide-${index}`];

			this.$nextTick(() => {
				const width = text.offsetWidth;
				input.style.width = `${width + 10}px`;
			});
		},
		deleteItem(index) {
			this.keys.splice(index, 1);
			this.values.splice(index, 1);
		},
		extractKeysAndValues() {
			this.keys = Object.keys(this.value);
			this.values = Object.values(this.value);
		},
		onClickChild(obj) {
			this.keys.push("");
			this.values.push(obj);
		},
		/**
		 * Constructs object with key and values
		 * @returns {Object} final object constructed
		 */
		construct() {
			if (this.keys.length !== this.values.length)
				throw new Error("Keys and values length different");
			const result = {};

			this.keys.forEach((k, i) => {
				result[k] = this.values[i];
			});

			return result;
		},
	},
	watch: {
		value: {
			handler(n, o) {
				if (o === undefined) return;
				if (Object.equals(n, o)) return;
				if (typeof n === "object") this.extractKeysAndValues();
			},
			immediate: true,
			deep: true,
		},
		keys: {
			handler(n, o) {
				this.$nextTick(() => {
					for (let i = 0; i < this.keys.length; ++i) {
						this.resize(i);
					}
				});

				if (o === undefined) return;
				if (Object.equals(n, o)) return;
				if (this.keys.length !== this.values.length) return;
				this.$emit("input", this.construct());
			},
			deep: true,
		},
		values: {
			handler(n, o) {
				if (o === undefined) return;
				if (Object.equals(n, o)) return;
				if (this.keys.length !== this.values.length) return;
				this.$emit("input", this.construct());
			},
			deep: true,
		},
	},
	created() {},
	beforeMount() {
		if (typeof this.value !== "object") throw new Error("Value not an object");
		this.extractKeysAndValues();
	},
};
</script>
