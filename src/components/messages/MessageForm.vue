<template>
    <div class="message__form">

        <div class="ui inverted form">
            <div class="two fields">

                <div class="field">
                   <textarea name="message" id="message" v-model.trim="message" rows="3" placeholder="Message" @keyup.enter.exact="sendMessage"></textarea>
                </div>

                <div class="field">
                    <button class="ui green button" @click.prevent="sendMessage">Send</button>
                    <button class="ui labeled icon button" @click.prevent="openFileModal"><i class="upload icon"></i>Upload Image</button>
                </div>
            </div>
        </div>

        <!-- Progress bar for Uploading Files-->
        <div class="ui small orange inverted progress" data-total = "100" id="uploadedFile">

            <div class="bar">
                <div class="progress"></div>
            </div>

            <div class="label">{{uploadLabel}}</div>

        </div>
        <!--File Modal-->
        <file-modal ref = "file_modal"></file-modal>
    </div>
    

 
</template>


<script>
    import{mapGetters} from 'vuex'
    import firebase from 'firebase'
    import FileModal from './FileModal'
    import uuidV4 from 'uuid/V4'

    export default {
        name:'message-form', 
        components: {
            FileModal,
        },

        
        data(){
            return{
                message:'',
                errors:[],
                storageRef: firebase.storage().ref(),
                uploadTask: null,
                uploadState: null,
            }
        },

        computed:{
            ...mapGetters(['currentChannel','currentUser','isPrivate']),
            uploadLabel(){
                switch(this.uploadState){
                    case 'uploading': return "Uploading file..."
                        break;
                    case 'error': return "There's been an error"
                        break;
                    case 'done': return "File has been sent"
                        break;
                              
                }
            }
        },

        methods:{
            sendMessage(){

                if(this.currentChannel!==null){
                    if(this.message.length>0){
                        this.$parent.getMessageRef().child(this.currentChannel.id).push().set(this.createMessage()).then(()=>{
                            
                        }).catch(error=>{
                            this.errors.push(error.message)
                        })

                        this.message=""
                    }

                }
            },

            createMessage(fileUrl = null){
                let message =  {
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    user :{
                        name: this.currentUser.displayName,
                        avatar:this.currentUser.photoURL,
                        id:this.currentUser.uid
                    }
                }

                //Determines the attribute to add within the message if its 'content' or 'image'
                if(fileUrl == null){
                    message['content'] = this.message
                }
                else{
                    message['image'] = fileUrl
                }
                
                return message
            },
            uploadFile(file, metadata){
                if(file === null) return false

                let pathToUpload = this.currentChannel.id
                let ref = this.$parent.getMessageRef()
                let filePath = this.getPath() + '/' + uuidV4() + '.jpg'
                
                //upload of file to firebase storage
                this.uploadTask = this.storageRef.child(filePath).put(file,metadata)
                this.uploadState = "uploading"

                this.uploadTask.on('state_changed', snap=>{
                    //upload in progress
                    let percent = (snap.bytesTransferred/ snap.totalBytes) *100
                    $("#uploadedFile").progress("set percent",percent)
                }, error =>{
                    //error
                    this.error.push(erro.message)
                    this.uploadState = 'error'
                    this.uploadTask = null
                },() =>{
                    //on complete
                    this.uploadState = 'done'
                    this.$refs.file_modal.resetForm()

            
                    //retrieve image url of the file
                    this.uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
                                        this.sendFileMessage(downloadURL,ref,pathToUpload)
                                    });
            
                })

            },

            sendFileMessage(fileUrl,ref,pathToUpload){             
                ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then( () =>{
                    this.$nextTick( ()=>{
                        $("html, body").scrollTop($(document).height())
                    })
                }).catch(error => {
                    this.errors.push(error.message)
                })
             
            },

            getPath(){
                if(this.isPrivate){
                    return 'tchat/private/' + this.currentChannel.id
                }
                else{
                    return 'tchat/public'
                }
            },

            openFileModal(){
                $("#fileModal").modal("show")
            }


        },

        beforeDestroy(){
            if(this.uploadTask !== null){
                this.uploadTask.cancel()
                this.uploadTask = null
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
            height: 150px;
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