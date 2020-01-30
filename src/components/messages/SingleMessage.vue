<template>
    <div class="comment comment__container">
        <a class="avatar">
            <img :src="message.user.avatar">
        </a>

        <div class="content">
            <a  class="author">{{message.user.name}}</a>
            <div class="metadata">
                <span class="date comment__date">{{message.timestamp | fromNow}}</span>
            </div>
            <div class="text">{{ message.content }}</div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import moment from 'moment'

    export default {
        name:'single-message',
        props: ['message'],
        
        computed:{
            ...mapGetters(['currentUser'])
        },
        methods:{

        },

        filters: {
            fromNow(value){
                return moment(value).calendar()
            }
        }

    }
</script>

<style scoped>

    .comment__container pre{
        font-size: 0.9em;
        background-color: #232323;
        box-shadow: 3px 6px 9px 0px #a2a2a2;
    }   
    .comment__self{
        border-left: 10px solid orange;
        padding-left: 8px;
    }
    .comment__image{
        min-height: 100px;
        margin-top: 16px;
    }
    .comment__date{
        color: #767676;
    }    
</style>