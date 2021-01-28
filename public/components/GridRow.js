import MyWidget from './MyWidget.js';

export default {
    name: 'GridRow',
    components: {
        MyWidget
    },
    template: `
    <div class="w3-row-padding">
    <MyWidget v-for="item in connectedItems"  v-bind:key="item.id"  v-bind:connectedItem="item"  v-bind:carouselMode="isCarouselMode"/>
    </div>
`, 
props: ['rowData'],
computed: {
    connectedItems () {
       // console.log(`rowData.id:${this.rowData.id}, rowData.content:${JSON.stringify(this.rowData.content,null,2)}`);
        return this.rowData.content;
    },
    isCarouselMode() {
        return false;
    }
}
}