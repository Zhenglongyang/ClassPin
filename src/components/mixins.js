export default{
    methods: {
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
        }
        
    }
}