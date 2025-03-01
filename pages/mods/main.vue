<template>
	<v-container>
		<div class="text-h4 py-4">Mods</div>
		<div class="my-2 text-h5">New</div>
		<v-row>
			<v-col cols="10">
				<v-file-input
					dense outlined
					v-model="files"
					accept=".jar"
					label="Upload JAR file(s)"
					hint="Automatically extracts the textures from the JAR file"
					persistent-hint
					multiple
					chips
					:counter="files.length > 0"
					:show-size="files.length > 0"
					prepend-icon=""
				>
					<template v-slot:selection="{ index, text }">
						<v-chip
							v-if="index < 3"
							:color="pageColor"
							dark
							label
							small
						>
							{{ text }}
						</v-chip>

						<span
							v-else-if="index === 3"
							class="text-overline mx-2"
						>
							+{{ files.length - 3 }} File(s)
						</span>
					</template>
				</v-file-input>
			</v-col>
			<v-col cols="2">
				<v-btn 
					:color="pageColor"
					@click="uploadMod"
				>
					Upload
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import axios from "axios";

export default {
	name: "mods-page",
	components: {},
	data() {
		return {
			pageColor: "purple",
			files: [] as File[],
		};
	},
	methods: {
		uploadMod() {
			const formData = new FormData();
			this.files.forEach((file) => {
				formData.append("files", file, file.name);
			});

			axios
				.post(`${this.$root.apiURL}/mods/upload`, formData, this.$root.apiOptions)
				.then((response) => {
					console.log(response);
				}).catch((error) => {
					console.error(error);
				});
		}
	}
}

</script>