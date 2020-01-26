<template>
    <div class="channels__container">
        <h2 class="ui inverted center aligned header">Channels<i class="plus square outline icon add_channel" @click="openChannelModal"></i></h2>

        <div class="ui raised padded segment channels__list">
            <ul>
                <p v-for="error in errors" v-bind:key="error"> {{error}} </p>
                <li class= "channels__item"  v-for="channel in channels"  v-bind:key="channel.id">{{channel.name}}</li>
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

    export default {
        name:'channels',

        data(){
            return{
                currentUser: firebase.auth().currentUser,
                channels:[],
                new_channel :'',
                channelsRef: firebase.database().ref('channels'),    
                errors:[]
            }
        },

        computed:{

            hasErrors(){
                return this.errors.length>0
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
                }) 
            },
            
            //Logic before proceeding to destroying comp.
            beforeDestroy(){
                this.detachListener()
            },

            //Removes listener
            detachListener(){
                this.channelsRef.off()
            },
        
            openChannelModal(){
                $("#channelModal").modal('show')
            },

 
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
            }
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
        background-color: #ca67ff;
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
        background-color: #9740c5;
    }
    .channels__item:hover{
        background-color: #9740c5;
    }
    .add_channel{
        cursor: pointer;
        color: #8BC34A;
    }
    .add_channel:hover{
        color: #689F38;
    } 
</style>