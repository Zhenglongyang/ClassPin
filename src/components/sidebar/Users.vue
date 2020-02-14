<template>
    <div class="users__container">
        <h2 class="ui inverted center aligned header">Users</h2>   
        <div class="ui feed" v-for="user in users" v-bind:key="user.uid">
            <div class="event">
                <div class="label">
                    <img :src="user.avatar" alt= "Avatar">
                </div>
                <div class="content">
                    <span class="ui empty circular label connection__label" :class="{'olive' : isOnline(user), 'red':!isOnline(user) }"></span>
                    {{user.name}}
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import firebase from "firebase"
import {mapGetters} from 'vuex'


export default {
    name:'users',

    data(){
        return{
            users:[],
            userRef: firebase.database().ref('users'),    
            connectedRef: firebase.database().ref('.info/connected'),
            presenceRef: firebase.database().ref('presence')
        }
    },

    computed:{
        ...mapGetters(['currentUser'])
    },
    
    mounted (){
        this.addListeners()  
    },

    methods:{
        addListeners(){
            this.userRef.on('child_added',snap=>{
                if(this.currentUser.uid !== snap.key){
                    let user = snap.val()
                    user['uid'] = snap.key
                    user['status'] = 'offline'
                    this.users.push(user)
                }

            })
            

            //check user status, if online or offline
            this.presenceRef.on("child_added",snap=>{
                if(this.currentUser.uid !== snap.key)
                {
                    this.addStatusToUser(snap.key)
                }
            })

            this.presenceRef.on("child_removed",snap=>{
                if(this.currentUser.uid !== snap.key)
                {
                    this.addStatusToUser(snap.key,false)
                }
            })

            this.connectedRef.on('value',snap=>{
                if(snap.val() == true){
                    let ref= this.presenceRef.child(this.currentUser.uid) 
                    ref.set(true)
                    ref.onDisconnect().remove(err =>{
                        if(err !== null)
                            console.log(err)
                    })
                }
            })
            
        },

        //Method to Handle Users presence
        addStatusToUser(userId, connected = true){
            let index = this.users.findIndex(user => user.uid === userId)
            //if there is a result, if not findindex returns -1
            if(index !== -1){
                connected === true ? this.users[index].status = 'online' : this.users[index].status = "offline"
            }
        },

        isOnline(user){
            return user.status =='online'
        },

        detachListeners(){
            this.usersRef.off()
            this.presenceRef.off()
            this.connectedRef.off()
        },

    },

    beforeDestroy(){
        this.detachListeners()
    }

}
</script>

<style scoped>

.users__container{
        overflow-y: auto;
    }
    .users__container .feed{
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        color: aliceblue;
    }
    .users__container .feed:hover{
        background: #8a8a8a;
    }
    .users__container .feed.is_active{
        background: #8a8a8a;
    }
    .connection__label{
        float:left!important;
        margin-right: 12px!important;
        margin-top: 5px;

        
    }
    .channel__count{
        float:right;
    }

</style>