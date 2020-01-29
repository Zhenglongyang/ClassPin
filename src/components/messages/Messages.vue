<template>
    <div class= "messages__container">
        <div class="messages__content">
            <h2 class="ui inverted center aligned header">Channel's Name</h2>
            <div class="ui segment">
                <div class="ui comments">
                    <transition-group tag="div" name="list">
                       <single-message :message="message" v-for="message in messages" v-bind:key="message.content"></single-message>
                    </transition-group>
                </div>
            </div>
        </div>

        <!-- Send form-->
        <message-form></message-form>
    </div>
</template>

<script>
    import MessageForm from './MessageForm'
    import SingleMessage from './SingleMessage'
    import firebase from 'firebase'
    import {mapGetters} from 'vuex'
    
    export default {
        name: 'messages',
        components:{
            MessageForm,
            SingleMessage
        },

        data() {
            return{
                messageRef: firebase.database().ref('messages'),
                messages:[],
                channel: null
            } 
        },

        computed : {
           ...mapGetters(['currentChannel','currentUser'])
        },

        watch : {
            currentChannel() {
                this.messages=[]//resets the messages
                this.detachListeners()//detaches the message listener if there is no channel
                this.addListeners()//add a new listener
                this.channel = this.currentChannel//set a channel
            }

        },
        methods:{

            addListeners (){
     
                this.messageRef.child(this.currentChannel.id).on("child_added",snap=>{
                    let message = snap.val() //useless?
                    message['id'] = snap.key //useless
                    this.messages.push(message)
                })
            },
            detachListeners(){
                if(this.channel != null){
                    this.messageRef.child(this.channel.id).off("child_added")
                }
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

    .list-enter-active{
        transition: all 0.3s
    }
    
    .list-enter, .list-leave-to{
        opacity: 0;
        transform: translateX(30px);
    }
</style>