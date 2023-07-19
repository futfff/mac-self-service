
const socket = new WebSocket("ws://localhost:3000");

const App = {
    data () {
        return {
            ready : [],
            geting : []
        }
    },
    methods : {

    },
    async mounted(){
        const res =  await (await fetch('api/orders_for_table/')).json()
        this.ready = res.ready
        this.geting = res.geting
        


        socket.addEventListener("message", (event) => {
            const msg = JSON.parse(event.data)
            switch (msg.type) {
                case 'new':
                    this.geting.push(msg.id)
                    break;
                case 'ready':
                    this.geting = this.geting.filter(t => t !== msg.id)
                    this.ready.push(msg.id)
                    break;
                case 'close':
                    this.ready = this.ready.filter(t => t !== msg.id)
                    break
            }
        });
    }
}

Vue.createApp(App).mount('#app')