<template>
    <div class="channels__container">
        <h2 class="ui inverted center aligned header">Channels<i class="plus square outline icon add_channel" @click="openChannelModal"></i></h2>

        <div class="ui raised padded segment channels__list">
            <ul>
                <p v-for="error in errors" v-bind:key="error"> {{error}} </p>
                <li class= "channels__item"  v-for="channel in channels"  v-bind:key="channel.id" 
                :class="{'is_active' : setChannelActive(channel)} "
                @click="changeChannel(channel)"># {{channel.name}}
                <div class="ui label purple channel__count" v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id">{{getNotification(channel)}}</div>
                </li>
                
            </ul>
        </div>
        <!-- Channel adding window -->
        <div class="ui basic modal" id="channelModal">
            <div class="ui icon header">
                Add a Channel
            </div>
                <div class="content">
                    <div class="ui inverted form" :class="{'error' : hasErrors}">
                        <div class="field">
                            <label for="new_channel">Channel's Name</label>
                            <input type="text" name="new_channel" v-model="new_channel" id= "new_channel">
                        </div>

                        <div class="ui error message" v-if="hasErrors">
                            <p v-for="error in errors" v-bind:key="error">{{error}}</p>

                        </div>
                    </div>
                </div>

                <div class="actions">
                    <div class="ui red cancel inverted button">
                        <i class="remove icon"></i>Cancel
                    </div>
                    <div class="ui green inverted button" @click="addChannel">
                        <i class="checkmark icon"></i>Add
                    </div>                   
                </div>
            </div>
    </div>

</template>


<script>
    import firebase from "firebase"
    import {mapGetters} from "vuex"

    export default {
        name:'channels',

        data(){
            return{
                channels:[],
                new_channel :'',
                channelsRef: firebase.database().ref('channels'),    
                messageRef: firebase.database().ref('messages'),    
                errors:[],
                firstLoad:true,
                notifCount: [],
                channel:null
            }
        },

        computed:{

            ...mapGetters(['currentChannel','isPrivate']),

            hasErrors(){
                return this.errors.length>0
            }
        },

        watch:{
            isPrivate(){
                if(this.isPrivate){
                    this.resetNotifications()
                }
            }
        },
        
        mounted(){
            this.addListeners()
        },

        methods:{

            //Child Event Listener
            addListeners(){
                this.channelsRef.on('child_added',snap =>{
                    this.channels.push(snap.val())

                    if(this.firstLoad && this.channels.length>0){
                        this.$store.dispatch("setCurrentChannel",this.channels[0])
                        this.channel = this.channels[0]
                    }

                    this.firstLoad=false

                    //Notification listener

                    this.addCountListener(snap.key)
                }) 
            },

            addCountListener(channelId){
                this.messageRef.child(channelId).on('value', snap => {
                    this.handleNotifications(channelId, this.currentChannel.id,this.notifCount,snap)
                })
            },

            handleNotifications(channelId,currentChannelId,notifCount,snap){
                let lastTotal = 0

                /*notifCount = [{
                                id:***,
                                total:***,
                                lastKnownTotal:***,
                                notif:***,
                                }]*/
                let index = notifCount.findIndex(el => el.id === channelId)                                        
                
                if(index!==-1){
                    if(channelId != currentChannelId){
                        lastTotal = notifCount[index].total
                        if(snap.numChildren() - lastTotal>0){
                            notifCount[index].notif = snap.numChildren() - lastTotal
                        }
                    }

                    notifCount[index].lastKnownTotal = snap.numChildren()

                }else{
                    notifCount.push({
                        id: channelId,
                        total: snap.numChildren(),
                        lastKnownTotal:  snap.numChildren(),
                        notif:0
                    })
                }
            },
            
            getNotification(channel){
                let notif = 0

                this.notifCount.forEach(el =>{
                    if(el.id === channel.id){
                        notif = el.notif
                    }
                })

                return notif

            },
  
   

            //Removes listener
            detachListener(){
                this.channelsRef.off()
            },

            //opens the channel creation window
            openChannelModal(){
                $("#channelModal").modal('show')
            },

            //method to add channel
            addChannel(){
                let key = this.channelsRef.push().key
                let newChannel = {
                    id:key,
                    name:this.new_channel,
                   // creationDate: firebase.firestore.Timestamp, //WILL NEED TO BE ACTIVATED EVENTUALLY
                    //creator: this.currentUser,                                                                                                                                                                                                                                                                                                                                                                                                                                              
                    //owner: this.currentUser
                }

                this.channelsRef.child(key).update(newChannel).then(()=>{
                    this.new_channel=''
                    $("#channelModal").modal('hide')

                }).catch(error=>{
                    this.errors.push(error.message)
                })
            },

            //setter for current selected channel
            setChannelActive(channel){
                return channel.id === this.currentChannel.id
            },
            
            //changes the current channel to a selected one.
            changeChannel(channel){
                this.resetNotifications()
                this.$store.dispatch('setPrivate', false)
                this.$store.dispatch('setCurrentChannel',channel)
                this.channel = channel
            },

            resetNotifications(){
                let index = this.notifCount.findIndex(el => el.id === this.channel.id)
                if(index !== -1)
                {
                    this.notifCount[index].total = this.notifCount[index].lastKnownTotal
                    this.notifCount[index].notif = 0
                }
                
            },
            
        },
        //Logic before proceeding to destroying comp.
        beforeDestroy(){
            this.detachListener()
            this.channels.forEach(el=>{
                this.messagesRef.child(el.id).off()
            })
        }
    }
</script>

<style scoped>
  .channels__list {
        min-height: 100px;
        max-height: 300px!important;
        overflow-y: auto!important;
        background-color: #23272A;
    }
    .channels__container ul{
        margin: 0;
        padding: 0;
    }
    .channels__item{
        height: 30px;
        margin: 8px;
        list-style: none;
        color: aliceblue;
        background-color: #23272A;
        cursor: pointer;
        line-height: 30px;       
        border-radius: 2px;
        padding-left: 12px;
        font-weight: bold;
        font-size: 1.1em;
    }
    .channel__count{
        float:right;
    }
    .is_active{
        background-color: #8a8a8a;
    }
    .channels__item:hover{
        background-color: #8a8a8a;
    }
    .add_channel{
        cursor: pointer;
        color: #8BC34A;
    }
    .add_channel:hover{
        color: #689F38;
    } 
</style>