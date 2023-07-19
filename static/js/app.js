const socket = new WebSocket("ws://localhost:3000");


socket.addEventListener("open", (event) => {
    socket.page = 'admin'
});


socket.addEventListener("message", (event) => {
});



const ru = {
    open_left : 'в зале',
    open_right : 'с собой',
    menu_type_burgers : 'бургеры',
    menu_type_snacks : 'закуски',
    menu_type_desserts : 'десерты',
    menu_type_drinks : 'напитки',
}
const en = {
    open_left : 'in the hall',
    open_right : 'with you',
    menu_type_burgers : 'burgers',
    menu_type_snacks : 'snacks',
    menu_type_desserts : 'desserts',
    menu_type_drinks : 'drinks',
}


const App = {
    data() {
        return{
            leng : ru,
            leng_str : '',
            order_obj  : {
                placement : 'hall',
            },
            menu : {},
            order : {
                foods  : {},
                price : 0,
                count : 0
            },
            order_foods : {}

        }
    },
    methods: {
        async change_leng(leng) {
            switch (leng) {
                case 'en':
                  this.leng = en;
                  this.leng_str = 'en'
                  break;
                case 'ru':
                  this.leng = ru;
                  this.leng_str = 'ru'
                  break;
              }
        },
        async change_placement(type){
            if (this.order_obj.placement === ''){
                switch (type){
                    case 'hall':
                        this.order_obj.placement = ''
                        break
                    case 'go':
                        this.order_obj.placement = 'go'
                        break
                }
                }
        },
        async change_menu(type){
            const ans = await fetch(`/api/food/${type}`)
            let data = await ans.json()
            data.forEach(e => {
                if (this.leng_str === 'en'){
                    e.name = e.en_name
                    for (let key in e.food){
                        if (e.food.hasOwnProperty(key)) {
                            e.food[key].name = e.food[key].en_name;
                          }
                    }
                }else{
                    e.name = e.ru_name
                    for (let key in e.food){
                        if (e.food.hasOwnProperty(key)) {
                            e.food[key].name = e.food[key].ru_name;
                          }
                    }
                }
                
            });
            this.menu = data
        },
        async add_to_order(ID){
            const food = await (await fetch(`/api/get_food/${ID}`)).json()
            if (ID in this.order.foods){
                this.order.foods[ID].count += 1
                this.order_foods[ID].count += 1 
                this.order.foods[ID].total_price += food.price
            }else{
                food.name = this.leng_str === 'en' ? food.en_name : food.ru_name
                food.count = 1
                food.total_price = food.price
                this.order.foods[ID] = food
                this.order_foods[ID] = {food_id : ID , count : 1}
            }
            this.order.price += food.price
            this.order.count += 1
        },
        async add_count(ID , status){
            if (status === 'add'){
                this.order.foods[ID].count += 1
                this.order.count += 1
                this.order_foods[ID].count += 1 
                this.order.price += this.order.foods[ID].price
                this.order.foods[ID].total_price += this.order.foods[ID].price
            }else{
                this.order_foods[ID].count -= 1 
                this.order.foods[ID].count -= 1
                this.order.count -= 1
                this.order.price -= this.order.foods[ID].price
                this.order.foods[ID].total_price -= this.order.foods[ID].price
                if (this.order.foods[ID].count === 0){
                    delete this.order.foods[ID]
                    delete this.order_foods[ID]
                }else{
                    
                }
            }
        },
        async create_order(){
            this.order_obj.price = this.order.price 
            const data = {
                order : this.order_obj,
                foods : this.order_foods
            }
            if (Object.keys(this.order_foods).length !== 0){
                const res = await fetch('/api/order' , {
                    method : 'POST',    
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(data)
                })
                if (res.ok) {
                    const responseJson = await res.json();
                    const orderId = responseJson.id;
                    const data = {
                        type : 'new',
                        id : responseJson.id,
                        obj : responseJson
                    }
                    await socket.send(JSON.stringify(data))
                    window.location.href = `http://localhost:3000/order/${orderId}`;
                }
            }
        }
    },
    async mounted(){

    }
}

Vue.createApp(App).mount('#app')

const order_area = document.getElementById('order');
const order_up = document.getElementById('order_up');
const order_up_2 = document.getElementById('order_header')
let order_up_status = 'up';

function up(){
    if (order_up_status === 'up') {
        order_area.style.top = 'calc(100% - 700px)';
        order_up.innerHTML = '<i class="bi bi-chevron-compact-down"></i>';
        order_up_status = 'down';
      } else {
        order_area.style.top = 'calc(100% - 100px)';
        order_up.innerHTML = '<i class="bi bi-chevron-compact-up"></i>';
        order_up_status = 'up';
      }
}

order_up.addEventListener('click', up);


