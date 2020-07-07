<template>
  <div id="app">
    <table>
      <thead>
        <tr>
          <th class="header big-font black" colspan="13">
              <span>DAILY EVENT TABLE - BATCH {{ batch }}</span>
          </th>
          <th><cell-separator></cell-separator></th>
          <th class="big-font red">
            <span>EVENT HASHING</span>
          </th>
        </tr>
        <tr>
          <th v-for="(item, index) in header" :key="'head_' + index" class="header dark-blue">
            {{ item }}
          </th>
          <th><cell-separator></cell-separator></th>
          <th><cell-separator></cell-separator></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, rowIndex) in records" :key="'rec_' + rowIndex" class="row">
          <td v-for="(item, index) in record" :key="'val_' + index" class="record original dark-blue text mono" v-html="item">
          </td>
          <td><cell-separator></cell-separator></td>
          <td class="record dark-blue">
            <div class="text hash">
              {{ record | recordAsString | encode }}
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="13"><cell-separator></cell-separator></td>
          <td><cell-separator></cell-separator></td>
          <td class="final-hash">
            <div class="text note no-lateral-padding">
              <span>Block HASH for each 100 events</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="13"><cell-separator></cell-separator></td>
          <td><cell-separator></cell-separator></td>
          <td class="yellow final-hash">
            <div class="text hash">
              {{ finalHash }}
            </div>
          </td>
        </tr>

      </tbody>
    </table>
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
 * app div
 */
#app {
  font-size: 8pt;
  font-family: Arial, Helvetica, Sans-serif;
}

/**
 * Table
 */

table {
    padding: 50px;
    border-spacing: 0;
}

.header {
    font-weight: bold;
    word-wrap: break-word;
    border-bottom: 1px black solid;
}

td, th {
    padding: 5px 10px;
}

.dark-blue {
    background-color: #038cfc;
}

.record.original {
    text-align: right;
    white-space: nowrap;
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

.final-hash {
    background-color: lightBlue;
    padding: 5px 0;
    text-align: center;
}

.final-hash.yellow {
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

.big-font {
    font-size: 24pt;
    font-family: Arial, Helvetica, Sans-serif;
    font-weight: bold;
    text-align: center;
}

h4.big-font {
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

.light-blue {
    background-color: lightBlue;
}

.yellow {
    background-color: yellow;
}

.mono {
    font-family: "Lucida Console", Monaco, Courier, monospace;
}

.text_left {
    text-align: left;
}

div.no-lateral-padding {
    padding-right: 0;
    padding-left: 0;
}
</style>
