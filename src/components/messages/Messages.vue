<template>
    <div class= "messages__container">
        <div class="messages__content">
            <h2 class="ui inverted center aligned header">Channel's Name</h2>
            <div class="ui segment">
                <div class="ui comments">
                      <span v-for="message in messages" v-bind:key="message.content">{{message.content}}</span>
                </div>
            </div>
        </div>

        <!-- Send form-->
        <message-form></message-form>
    </div>
</template>

<script>
    import MessageForm from './MessageForm'
    import firebase from 'firebase'
    import {mapGetters} from 'vuex'
    
    export default {
        name: 'messages',
        components:{
            MessageForm,
        },

        data() {
            return{
                messageRef: firebase.database().ref('messages'),
                messages:[]
            } 
        },

        computed : {
           ...mapGetters(['currentChannel','currentUser'])
        },

        watch : {
            currentChannel() {
                this.addListeners()
            }

        },
        methods:{
            addListeners (){
 
                this.messageRef.child(this.currentChannel.id).on("child_added",snap=>{
                    this.messages.push(snap.val())
                })
            },
            detachListeners(){

            },
        },

        
        beforeDestroy(){
            this.detachListeners()
        }

    }
</script>

<style scoped>
    .messages__container{
        position: relative;        
        background-color: #232323;        
        padding: 10px 30px 210px 30px; 
        margin-left: 300px;
        min-height: 100%;
    }
    .messages__container .comments{
        font-size: 1.2em;
    }  
</style>