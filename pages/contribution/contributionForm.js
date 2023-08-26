const userSelect = () => import("./userSelect.js")
const quickDatePicker = () => import("../components/quick-date-picker.js")

export default {
    name: 'contribution-form',
    components: {
        'user-select': userSelect,
        'quick-date-picker': quickDatePicker
    },
    props: {
        contributors: {
          required: true,
          type: Array
        },
        value: {
            required: true
        },
        disabled: {
            type: Boolean,
            required: false,
            default: () => false
        },
        multiple: {
            type: Boolean,
            required: true
        }
    },
    template: `
<v-form :disabled="disabled">
    <v-row :no-gutters="multiple">
        <v-col cols="12" :sm="multiple ? false : 6">
            <quick-date-picker
                :block="!multiple"
                flat
                :disabled="disabled"
                v-model="content.date"
                :months="moment.monthsShort()"
                :labels="$root.lang().datepicker"
                style="margin-left: auto; margin-right: auto"
            />
        </v-col>
        <v-col cols="12" :sm="multiple ? false : 6">
            <div class="font-weight-medium text--secondary my-2">{{ $root.lang('database.subtitles.pack') }}</div>
            <v-select
            class="mt-0 pt-0 mb-2"
            hide-details
            required
            :items="content.packs"
            v-model="content.pack"></v-select>
            <div class="font-weight-medium text--secondary my-2">{{ $root.lang('database.labels.texture_id') }}</div>
            <div class="d-flex align-center mb-2">
                <v-text-field
                    required
                    dense
                    type="number"
                    hide-details
                    class="mr-2 my-0 pt-0"
                    min="0"
                    v-model="content.texture" />
                <v-btn icon v-on:click="() => { content.texture = String(Number.parseInt(content.texture, 10) + 1) }">
                    <v-icon>mdi-chevron-up</v-icon>
                </v-btn>
                <v-btn icon v-on:click="() => { content.texture = String(Math.max(Number.parseInt(content.texture - 1, 10), 0)) }">
                    <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
            </div>
            <div class="font-weight-medium text--secondary mb-2">{{ $root.lang().database.titles.contributors }}</div>
            <user-select dense :contributors="contributors" v-model="content.authors" class="my-0" limit="3"></user-select>
        </v-col>
    </v-row>
</v-form>
`,
    data() {
        return {
          content: this.value
        }
    },
    watch: {
        value: {
            handler(n, o) {
                if (n !== undefined && JSON.stringify(n) !== JSON.stringify(o))
                    this.content = n
            },
            immediate: true,
            deep: true
        },
        content: {
            handler(n) {
                this.$emit('input', n)
            },
            deep: true
        }
    }
}