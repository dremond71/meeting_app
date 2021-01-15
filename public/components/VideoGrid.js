import GridRow from './GridRow.js';

export default {
    name: 'VideoGrid',
    components: {
        GridRow
    },
    template: `
<div>
  <div id="video-grid">
   <GridRow v-for="rowData in rowDataList"  v-bind:key="rowData.id"  v-bind:rowData="rowData"/>
  </div>
</div>`,
computed: {
    rowDataList () {
       
        // array in store
        const originalArray =  this.$store.getters.connected;

        // need to break a long array into separate arrays of max length of 3.
        const rowDataArray = [];
        let tempArray=[];
        let rowIdCounter=1;
        for( let i=0; i < originalArray.length; i++){

          tempArray.push( originalArray[i]);

           if ( (tempArray.length == 3) || (i == originalArray.length - 1) ){
            rowDataArray.push( { id: rowIdCounter++, content: tempArray});
            tempArray=[];
           }
           
        }
        return rowDataArray;
  }
}
}