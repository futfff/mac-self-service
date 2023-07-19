
const socket = new WebSocket("ws://localhost:3000");

const App = {
    data () {
        return {
            orders : []
        }
    },
    methods : {
        async del(id){
            let data = {}
            const order_obj = this.orders.find((obj) => obj.id === id);
            console.log(order_obj)
            if (order_obj.status === 'ready'){
                await fetch(`/api/deleteorder/${id}` , {method  : 'DELETE'})
                this.orders = this.orders.filter(o => o.id !== id)
                data = {
                    type : 'close',
                    id : id
                }
            }else{
                const inx = this.orders.findIndex((obj) => obj.id === id);
                this.orders[inx].status = 'ready'
                await fetch(`/api/readyorder/${id}`)
                data = {
                    type : 'ready',
                    id : id
                }
            }
            await socket.send(JSON.stringify(data))
        }
    },
    async mounted(){
        const res = await fetch('api/orders')
        this.orders = await res.json()
        console.log(this.orders)
        


        socket.addEventListener("message", (event) => {
            const msg = JSON.parse(event.data)
            switch (msg.type) {
                case 'new':
                    this.orders.push(msg.obj)
                    break;
            }
                
        });
    }
}

Vue.createApp(App).mount('#app')