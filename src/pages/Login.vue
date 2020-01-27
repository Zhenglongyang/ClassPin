<template>
<div class="background">
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
                <i class="mail icon"></i>
                <input type="email" name="email" placeholder="Email" v-model.trim="email">
            </div>
            </div>

            <div class="field">
            <div class="ui left icon input">
                <i class="lock icon"></i>
                <input type="password" name="password" placeholder="Password" v-model.trim="password">
            </div>
            </div>

            <div class="ui fluid large orange button" @click.prevent="login" :class="{'loading':isLoading}">Login</div>
        </div>

        <div class = "ui error message" v-if="hasErrors">
            
            <p v-for="error in errors" v-bind:key="error"> {{error}} </p>
        </div>


        <div class="ui error message"></div>

        </form>

        <div class="ui message">
            Need an account? <router-link to="/register">Register</router-link>
        </div>
    </div>
    </div>
</div>
</template>


<script>
    import firebase from 'firebase'

    export default {
        name:"login",
    
        data (){    
            return{
                email: '',
                password: '',
                errors : [],
                isLoading:false

            }
        },

        computed: {
            //check if there is error
            hasErrors () {
                return this.errors.length >0
            }

        },

        methods:{

            //call this to log in
            login(){
                this.errors = [] // reset errors on each login attempts
                if(this.isFormValid())
                {
                    this.isLoading = true

                    //sign in event
                    firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(user=>{
                        
                        user = firebase.auth().currentUser //for some reason user is not retrieved properly with firebase, it requires to explicitely call currentuser and bind it again.
                        
                        this.$store.dispatch('setUser',user)
                        this.$router.push('/')                        

                    }).catch(error=>{
                        this.errors.push(error.message)
                        this.isLoading=false
                    })
                }

                
            },


            //check if form is valid. email and password needs to be not null
            isFormValid(){
                if(this.email.length>0 && this.password.length>0)
                    return true
                else
                    return false
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