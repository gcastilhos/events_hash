<template>
  <div id="app">
    <div class="table">
      <div class="head">
        <div class="cell header big_font black">
            <span>DAILY EVENT TABLE - BATCH {{ batch }}</span>
        </div>
        <cell-separator></cell-separator>
        <div class="cell big_font red">
          <span>EVENT HASHING</span>
        </div>
      </div>
      <div class="head">
        <div class="cell header dark_blue">
          <div v-for="(item, index) in header" :key="'head_' + index" class="cell">
            {{ item }}
          </div>
        </div>
        <cell-separator></cell-separator>
        <cell-separator></cell-separator>
      </div>
      <div v-for="(record, rowIndex) in records" :key="'rec_' + rowIndex" class="row">
        <div class="cell record original dark_blue">
          <div v-for="(item, index) in record" :key="'val_' + index" class="cell text mono" v-html="padding(item, index)">
          </div>
        </div>
        <cell-separator></cell-separator>
        <div class="cell record dark_blue">
          <div class="text hash">
            {{ record | recordAsString | encode }}
          </div>
        </div>
      </div>
      <div class="row">
        <cell-separator></cell-separator>
        <cell-separator></cell-separator>
        <div class="cell final_hash">
          <div class="row">
            <div class="cell no_lateral_padding">
              <div class="text light_blue note">
                 <span>Block HASH for each 100 events</span>
              </div>
            </div>
            </div>
            <div class="row yellow">
              <div class="cell">
                <div class="text hash">
                  {{ finalHash }}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import CellSeparator from './components/CellSeparator.vue'
import VueRouter from 'vue-router';
import sha256 from 'sha256';
import axios from 'axios';
Vue.use(VueRouter);

var router = new VueRouter({
  mode: 'history',
  routes: []
});

var encode = function(text) {
  if (text !== '') {
    return sha256(text);
  }
  return text;
};

export default {
  router,
  data: function () {
    return {
      records: [],
      header: [],
      finalHash: '',
      batch: 1,
      padSize: [6, 12, 18, 4, 15, 15, 10, 5, 6, 6, 5, 5, 5, 5]
    }
  },
  components: {
    'cell-separator': CellSeparator
  },
  filters: {
    encode,
    recordAsString: function(record) {
      return record.join("|");
    },
  },
  methods: {
    padding: function(value, index) {
      var text = value;
      for (var i = 0; i < this.padSize[index] - value.toString().length; ++i) {
        text = "&nbsp;" + text;
      }
      return text;
    },
    getData: async function(batch) {
      let response = await axios.get("./data/records_" + batch + ".json");
      let data = response.data;
      this.records.splice(data.data.length);
      data.data.forEach((rec, index) => this.$set(this.records, index, rec.slice(1)));
      this.header.splice(data.columns.length - 1);
      this.header = data.columns.slice(1);
      this.encodeAll();
    },
    encodeAll: function() {
      var finalHash = '';
      this.records.forEach((rec) => {
        finalHash += encode(rec);
      });
      this.finalHash = encode(finalHash);
    },
  },
  mounted: function() {
    this.batch = this.$route.query.batch !== undefined ? this.$route.query.batch : 1;
    this.getData(this.batch);
  },
  created: function() {
    setInterval(function() {
      this.batch = this.batch === 100 ? 1 : this.batch + 1;
      this.getData(this.batch);
    }.bind(this), 60000);
  }
}
</script>

<style>
/**
 * Table-like DIVs
 */

div {
    font-size: 8pt;
    font-family: Arial, Helvetica, Sans-serif;
}

div.table {
    display: table;
    padding: 50px;
    table-layout: fixed;
}

div.head {
    display: table-header-group;
}

div.head div.cell.header {
    font-weight: bold;
    word-wrap: break-word;
    border-bottom: 1px black solid;
}

div.row {
    display: table-row;
}


div.body {
    display: table-row-group;
}

div.cell {
    display: table-cell;
    padding: 5px 10px;
}

.dark_blue {
    background-color: #038cfc;
}

div.cell.record.original {
    width: 600px;
    white-space: nowrap;
}

div.cell.separator {
    width:75px;
}

/**
 *
 */

div#totals.table {
    padding: 0;
}

div#totals.table .row .cell {
    font-size: 12pt;
}

/**
 * Hash specific styles
 */

.text {
    font-family: "Lucida Console", Monaco, Courier, monospace;
}

div.text.hash {
    background-color: lightGrey;
    border: 1px black solid;
    padding: 2px;
    text-align: center;
}

div.final_hash {
    background-color: lightBlue;
    padding: 0;
    text-align: center;
}

div.final_hash div.row.yellow div.cell {
    padding: 10px;
}

div.note {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    border: 1px black solid;
    padding: 2px;
    background-color: white;
}

/**
 * Generic styles
 */

.big_font {
    font-size: 24pt;
    font-family: Arial, Helvetica, Sans-serif;
    font-weight: bold;
    text-align: center;
}

h4.big_font {
    font-size: 18pt;
    margin-top:20px;
    margin-bottom: 20px;
}

h5 {
    font-size: 16pt;
    font-weight: bold;
    margin: 5px 0;
    text-align: center;
}

.red {
    color: red;
}

.grey {
    background-color: #e8ebf5;
}

.border_lightBlue {
    border: 1px solid lightBlue;
}

.light_blue {
    background-color: lightBlue;
}

.yellow {
    background-color: yellow;
}

.header {
    font-weight: bold;
}

.mono {
    font-family: "Lucida Console", Monaco, Courier, monospace;
}

.no_space_break {
    white-space: nowrap;
}

.text_left {
    text-align: left;
}

.colspan {
    column-span: all;
}

.red_border {
    border: 1px red solid;
}

.red_bottom_border {
    border-bottom: 1px red solid;
}

.red_left_border {
    border-left: 1px red solid;
}

.red_right_border {
    border-right: 1px red solid;
}

.bottom_border {
    border-bottom: 1px black solid;
}

div.no_lateral_padding {
    padding-right: 0;
    padding-left: 0;
}

/**
 * Events categorization
 */

table.categ, table.totals {
    border-collapse: separate;
}

table.categ {
    border-spacing: 0px 7px;
}

table.totals {
    border-spacing: 5px;
}

table.categ td, table.totals td, table.categ th {
    padding: 5px;
    white-space: nowrap;
}

table.categ tr.red_line {
    outline-width: 2px;
    outline-color: red;
    outline-style: outset;
}

table.totals th {
    padding: 5px;
}
</style>
