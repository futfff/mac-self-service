import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const get_foods = async (req , res) => {
    let menu = []
    switch (req.params.type){
        case 'burger':
            menu = [
                {
                    en_name : 'beef',
                    ru_name : 'говядина',
                    food : await prisma.food.findMany({where: {type: 'beef_burger'}})
                },
                {
                    en_name : 'chicken',
                    ru_name : 'курица',
                    food : await prisma.food.findMany({where: {type: 'chi_burger'}})
                }
            ]
            break;
        case 'snack':
            menu = [
                {
                    en_name : 'snacks',
                    ru_name : 'закуски',
                    food : await prisma.food.findMany({where: {type: 'snack'}})
                }
            ]
            break;
        case 'dessert':
            menu = [
                {
                    en_name : 'desserts',
                    ru_name : 'десерты',
                    food : await prisma.food.findMany({where: {type: 'dessert'}})
                }
            ]
            break;
        case 'drink':
            menu = [
                {
                    en_name : 'cold drinks',
                    ru_name : 'холодные напитки',
                    food : await prisma.food.findMany({where: {type: 'cold_drink'}})
                },
                 {
                    en_name : 'hot drinks',
                    ru_name : 'горячие напитки',
                    food : await prisma.food.findMany({where: {type: 'hot_drink'}})
                }
            ]
            break;

    }
    res.status(200).json(menu)
}

export const get_food = async (req , res) => {
    const food = await prisma.food.findUnique({where: {id: parseInt(req.params.id)}});
    res.status(200).json(food)
}

export const create_order = async (req , res)  => {
    const newOrder = await prisma.order.create({
        data: {
          ...req.body.order,
          con: {
            create: Object.values(req.body.foods).map((food) => ({
              count: food.count,
              food: { connect: { id: food.food_id } },
            })),
          },
        },
        include: {
            con: {
              include: {
                food: true,
              }
            }
          }
      });
      res.status(200).json(newOrder)
}

export const get_orders = async (req , res) => {
    res.status(200).json(
        await prisma.order.findMany({
            include: {
              con: {
                include: {
                  food: true,
                }
              }
            }
          })
        )
}

export const del = async (req , res) => {

    await prisma.orderFood.deleteMany({
        where: {
          order_id: parseInt(req.params.id),
        },
      });

    await prisma.Order.delete({
        where: {
        id: parseInt(req.params.id),
        },
    });
    res.json({})
}   

export const ready = async (req , res) => {

  await prisma.Order.update({
      where: {
      id: parseInt(req.params.id),
      },
      data : {
        status : 'ready'
      }
  });
  res.json({})
}   

export const get_orders_for_table = async (req, res) => {
  try {
    const data = {};
    data.ready = (await prisma.order.findMany({
      where: {
        status: 'ready',
      },
      select: {
        id: true,
      },
    })).map((order) => order.id);

    data.geting = (await prisma.order.findMany({
      where: {
        status: 'geting',
      },
      select: {
        id: true,
      },
    })).map((order) => order.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
};
