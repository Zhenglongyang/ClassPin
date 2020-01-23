<template>
    <div class="tchat__container">   
     <sidebar></sidebar>
     <message></message>
    </div>
</template>

<script>
    import Sidebar from '../components/Sidebar'
    import Message from '../components/Message'
    
    export default {
        name: 'tchat',
        components: {
            Sidebar,
            Message
        }
    }
</script>

<style scoped>
    .tchat__container{
        height: 100%;
   
    }

</style>