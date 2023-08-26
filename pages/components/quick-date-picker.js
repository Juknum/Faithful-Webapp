/* global Vue, axios */
export default {
  name: 'quick-date-picker',
  props: {
    months: {
      required: true,
    },
    value: {
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: () => false
    },
    flat: {
      type: Boolean,
      required: false,
      default: () => false
    },
    labels: {
      required: false,
      default: () => ({ year: 'Year', month: 'Month', day: 'Day' })
    },
    block: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  template: `
<v-card
  v-bind="$attrs"
  :disabled="disabled"
  :color="flat ? '' : 'rgba(0,0,0,0.165)'"
  :flat="flat"
  :class="['qd-datepicker', flat ? '' : 'pt-2 px-4 pb-4']"
  :style="style"
>
	<div class="font-weight-medium text--secondary mb-2" v-text="labels.year" />
	<v-text-field
    class="mt-0"
    placeholder="Regular"
    flat hide-details dense
    type="number" :value="year"
    :max="this_year" min="0"
    v-on:input="(e) => newYear(e)"
  ></v-text-field>
	<div class="font-weight-medium text--secondary my-2" v-text="labels.month" />
	<v-row class="qd-months" dense>
		<v-col cols="2" v-for='i in 12'>
			<v-btn :key="'qd-month-' + i" class="qd-month pa-0" block :color="i-1 == month ? 'primary' : ''"
        :disabled="disabled" elevation="0" small @click="() => newMonth(i)" >
        {{ upper_months[i-1] }}
      </v-btn>
		</v-col>
	</v-row>
	<div class="font-weight-medium text--secondary my-2" v-text="labels.day" />
	<div class="qd-days">
		<v-btn
      v-for='i in 31' :key="'qd-day-' + i" class="qd-day px-0"
      :color="i == day ? 'primary' : ''" rounded :text="i !== day"
      :elevation="i == day ? 2 : 0" @click="() => newDay(i)"
      :disabled="disabled || i > days_in_month" >{{ i }}</v-btn>
	</div>
</v-card>
	  `,
  data() {
    return {
      date: new Date(new Date(this.value).setHours(0, 0, 0, 0)),
    }
  },
  computed: {
    style: function () { return this.block ? "width: 100%" : "width: 290px; max-width: 100%" },
    day: function () { return this.date.getDate() },
    month: function () { return this.date.getMonth() },
    year: function () { return this.date.getFullYear() },
    date_str: function () { return this.date.toDateString() },
    this_year: () => new Date().getFullYear(),
    days_in_month: function () { return this.daysInMonth(this.year, this.month + 1) },
    upper_months: function () { return this.months.map(name => name[0].toUpperCase() + name.slice(1)) }
  },
  methods: {
    checkAndMaxDate: function (year, month) {
      const newDate = new Date(year, month - 1, this.day)
      if (newDate.getDate() != this.day) {
        const days_in_new_month = this.daysInMonth(year, month)
        const new_day = Math.min(this.day, days_in_new_month)
        const corrected_date = new Date(new Date(year, month - 1, new_day).setHours(0, 0, 0, 0))
        this.date = corrected_date
      }
    },
    newDay: function (i) {
      this.date.setDate(i)
      this.date = new Date(this.date)
    },
    newMonth: function (m) {
      this.checkAndMaxDate(this.year, m)
      this.date.setMonth(m - 1)
      this.date = new Date(this.date)
    },
    newYear: function (e) {
      let parsed = Number.parseInt(e)
      let new_year = this.year
      if (!Number.isNaN(parsed)) new_year = parsed

      this.checkAndMaxDate(new_year, this.month + 1)
      this.date.setFullYear(new_year)
      this.date = new Date(this.date)
    },
    daysInMonth: function (year, month_i) {
      return new Date(year, month_i, 0).getDate()
    },
  },
  watch: {
    value: {
      handler(n, o) {
        if (new Date(n).getTime() !== new Date(o).getTime())
          this.date = new Date(n)
      },
      immediate: true,
      deep: true
    },
    date: function () {
      this.$emit('input', this.date)
    }
  }
}
