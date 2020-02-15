<template>
    <div class="sidebar">
        <!--<h1 class="ui inverted center aligned header">Class Pin</h1>-->
        
        <!-- User Panel -->
        <connected-user></connected-user>

        <!-- Channel List-->
        <channels></channels>
        <div class="ui divider"></div>
        
        <!-- Other Users List-->
        <users></users>

    </div>
</template>

<script>
    import ConnectedUser from './ConnectedUser'
    import Channels from './Channels'
    import Users from './Users'

    export default {
        name: 'sidebar',
        components: {
            ConnectedUser,
            Channels,
            Users
        }
    }
</script>

<style scoped>
    .sidebar{
        position: fixed;
        display: flex;
        flex-flow: column nowrap;
        width: 300px;
        padding: 10px;
        top: 0;
        left: 0;
        bottom: 0;
        background-color: #23272A;
        padding-top: 130px;
    }

</style>