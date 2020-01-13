<template>
    <div class="ui middle aligned center aligned grid login__container">
    <div class="column">
        <h2 class="ui orange header">
        <div class="content">
            Class Pin
        </div>
        </h2>
        <form class="ui large form" :class="{'error': hasErrors}">
        <div class="ui stacked segment">
            <div class="field">
            <div class="ui left icon input">
                <i class="user icon"></i>
                <input type="text" name="name" placeholder="Username" v-model="name">
            </div>
            </div>

            <div class="field">
            <div class="ui left icon input">
                <i class="mail icon"></i>
                <input type="email" name="email" placeholder="Email" v-model.trim="email">
            </div>
            </div>

            <div class="field">
            <div class="ui left icon input">
                <i class="lock icon"></i>
                <input type="password" name="password" placeholder="Password" v-model="password">
            </div>
            </div>

            <div class="field">
            <div class="ui left icon input">
                <i class="lock icon"></i>
                <input type="password" name="password_confirmation" placeholder="Repeat your password" v-model="password_confirmation">
            </div>
            </div>

            <div class="ui fluid large orange button" @click.prevent="register" :class="{'loading':isLoading}">Register</div>
        </div>

        <div class = "ui error message" v-if="hasErrors">
            
            <p v-for="error in errors" v-bind:key="error"> {{error}} </p>
        </div>


        <div class="ui error message"></div>

        </form>

        <div class="ui message"><router-link to="/login">Already have an account?</router-link>
        </div>
    </div>
    </div>
</template>

<script>
    import md5 from 'md5'
    import firebase from 'firebase'


    export default {
        name: 'register',
        data () {
            return {
                name:'',
                email:'',
                password:'',
                password_confirmation:'',
                userRef: firebase.database().ref('users'), //users is an entry in the Database change this value if Db architecture changes
                errors : [],
                isLoading: false
            }
        },
        
        computed: {
            hasErrors () {
                return this.errors.length >0
            }

        },


        methods: {

            register (){
                this.errors = []

                if(this.isFormValid()){
                    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(user => {
                     
                        user = firebase.auth().currentUser;
                        this.isLoading = true
                        //Show email and pass
                        //console.log("User Registered " + this.email  + " User pass: " + this.password)

                        user.updateProfile({
                            displayName: this.name,
                            photoURL: "https://gravatar.com/avatar"+md5(this.email)+"?d=identicon"
                        }).then( ()=>{
                                    this.saveUserToUserRef(user).then(()=>{
                                        //note that the firebase DB requires to have permissions to read/write otherwise will prompt permission error
                                        this.$store.dispatch("setUser",user)
                                        this.$router.push('/')
                                    })
                                },error=>{
                                    console.log(error)
                                    this.errors.push(error.message)
                                    this.isLoading = false
                                }
                            )

                        }).catch(error=>{
                            console.log(error)
                            this.errors.push(error.message)
                            this.isLoading = false
                        })
                }
           
            },

            saveUserToUserRef(user){
                return this.userRef.child(user.uid).set({
                    name: user.displayName,
                    avatar: user.photoURL
                })
            },

            isEmpty () {
                if(this.name.length == 0 || this.email.length == 0 ||this.password.length == 0 || this.password_confirmation.length == 0)
                    return true
                else
                    return false
            },

            passwordIsValid (){
                if(this.password.length<6 || this.password_confirmation<6)
                    return false
                if(this.password !== this.password_confirmation)
                    return false
                return true
            },

            isFormValid(){
                if(this.isEmpty()){
                    this.errors.push('Please fill in all the fields')
                    return false
                }
                if(!this.passwordIsValid()){
                    this.errors.push("Password is not valid. Passwords must be more than 6 characters")
                    return false
                }
                return true
            }

            
        }
    }
</script>

<style scoped>
    .login__container{
        margin-top: 40px;
    }
    .column{
        max-width: 450px;
    }
</style>