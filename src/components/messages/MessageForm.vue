<template>
    <div class="message__form">
        <div class="ui inverted form">
            <div class="two fields">

                <div class="field">
                    <textarea name="message" id="message" v-model.trim="message" rows="3" placeholder="Message"></textarea>
                </div>

                <div class="field">
                    <button class="ui green button" @click.prevent="sendMessage">Send</button>
                    <button class="ui labeled icon button"><i class="upload icon"></i>Upload Files</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import{mapGetters} from 'vuex'
    import firebase from 'firebase'
    
    export default {
        name:'message-form', 
        data(){
            return{
                message:'',
                errors:[]
            }
        },

        computed:{
            ...mapGetters(['currentChannel','currentUser'])
        },

        methods:{
            sendMessage(){
                let newMessage = {
                    content: this.message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    user :{
                        name: this.currentUser.displayName,
                        avatar:this.currentUser.photoURL,
                        id:this.currentUser.uid
                    }
                }
                this.$parent.messageRef.child(this.currentChannel.id).push().set(newMessage).then(()=>{

                }).catch(error=>{
                    this.errors.push(error.message)
                })

                this.message=""
            }
            
            

        }
    }
</script>

<style scoped>
    .message__form{
            position: fixed;
            bottom: 0;
            background-color:#232323;
            padding: 10px;
            padding-top: 20px;
            height: 210px;
            left: 300px;
            right: 0;
    }
    .messages__form.big{
        height: 350px;
    }
    .shortcut{
        color:white;
    }
</style>