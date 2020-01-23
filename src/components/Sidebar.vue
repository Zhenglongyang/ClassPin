<template>
    <div class="sidebar">
        <h1 class="ui inverted center aligned header"> Class Pin</h1>
        <connected-user></connected-user>
    </div>
</template>

<script>
    import ConnectedUser from './sidebar/ConnectedUser'

    export default {
        name: 'sidebar',
        components: {
            ConnectedUser
        }
    }
</script>

<style scoped>
    .sidebar{
        position: fixed;
        display: flex;
        flex-flow: column nowrap;
        width: 320px;
        padding: 10px;
        top:0;
        left: 0;
        bottom: 0;
        background-color:#23272A;
        padding-top:50px;

    }

</style>