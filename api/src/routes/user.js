const server = require('express').Router();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { User, Carrito, Product, Orden } = require('../db.js');

// CART

server.post('/:userId/carrito', (req, res)=>{
  const id = req.params.userId  
  const productId = req.params.productId
  
  Carrito.findOrCreate({where:{ userId: id, status:'carrito' }}) // Se setea por default el estado "carrito(está en 0)"

  .then(product =>{
      res.status(201).send(product)
  })
  .catch(err =>{
      console.log(err)
      res.status(400).send(err)
  })

})

server.delete('/:userId/deletecart/:carritoId', (req, res)=>{ //Elimina el carrito completo
  const id = req.params.userId  
  const carritoId = req.params.carritoId
  
  Carrito.destroy({where:{ userId: id, id: carritoId }})

  .then(product =>{
      res.sendStatus(201) // El destroy no permite enviar json, por eso solo enviamos sendStatus
  })
  .catch(err =>{
      console.log(err)
      res.sendStatus(400) // El destroy no permite enviar json, por eso solo enviamos sendStatus
  })

})

server.put('/product/:productId/increment/:carritoId', (req, res)=>{
    const {productId, carritoId} = req.params

    Orden.update({ quantity: Sequelize.literal('quantity + 1')},{where:{
    productId, carritoId
    }})
    .then(order=>{
        res.status(201).send(order)
    })
    .catch(err=>{
        console.log(err)
        res.status(400).send(err)
    })

})



server.delete('/product/:productId/delete/:carritoId', (req, res)=>{ //Elimina un producto de un determinado carrito
  const {productId, carritoId} = req.params
  Carrito.findByPk(carritoId)
  .then((carrito) =>{
      carrito.removeProducts(productId) 
      .then((newOrden)=>{ 
          res.status(201).send({message: 'Se eliminó el producto', newOrden})
      })
  })
  .catch((err) => {
      console.log(err)
      res.status(400).send(err)
 });
  

})


server.put('/product/:productId/decrement/:carritoId', (req, res)=>{
  const {productId, carritoId} = req.params

  Orden.update({ quantity: Sequelize.literal('quantity - 1')},{where:{
  productId, carritoId
  }})
  .then(order=>{
      res.status(201).send(order)
  })
  .catch(err=>{
      console.log(err)
      res.status(400).send(err)
  })

})


//Model.update({ field: sequelize.literal('field + 2') }, { where: { id: model_id } });

server.post('/:productId/orden/:carritoId', (req, res)=>{ //Las tablas intermedias pueden tener: GET, SET, ADD y REMOVE
  const {productId, carritoId} = req.params              

  Carrito.findByPk(carritoId)
  .then((carrito) =>{
      carrito.addProducts(productId) 
      .then((newOrden)=>{ 
          res.status(201).send({message: 'se agrego la orden', newOrden})
      })
  })
  .catch((err) => {
      console.log(err)
      res.status(400).send(err)
 });     
 
})


server.get('/get', (req, res)=>{ //TRAE TODOS LOS CARRITOS
    Carrito.findAll({
        include: Product  //Con el include, uno tablas
    }, { 
        include: Orden
    })
    .then(carrito=>{
        res.status(201).send(carrito)
    })
    .catch(err=>{
        res.status(400).send(err)
    })
})
server.get('/orden/:id', (req, res)=>{ //para traer una sola orden
  const Id = req.params.id
  Carrito.findOne({
    where:{
      
      id:Id,  
    },
    include: Product
  },{
    include: Orden,
  })
  .then(carrito=>{
      res.status(201).send(carrito)
  })
  .catch(err=>{
    console.log(err)
      res.status(400).send(err)
  })
})


server.put('/procesando/:carritoId' , (req,res)=> {

   const carritoId = req.params.carritoId
   
   Carrito.update({status:"procesando"},{
    where:{
           id: carritoId
        }
       })
       .then((carrito)=>{
         res.status(201).send(carrito)
       })
       .catch((err)=> {
         console.log(err)
         res.status(400).send(err)
       })
    
})

server.put('/cancelada/:carritoId' , (req,res)=> {

  const carritoId = req.params.carritoId
  
  Carrito.update({status:"cancelada"},{
   where:{
          id: carritoId
       }
      })
      .then((carrito)=>{
        res.status(201).send(carrito)
      })
      .catch((err)=> {
        console.log(err)
        res.status(400).send(err)
      })
   
})
server.put('/creada/:carritoId' , (req,res)=> {

  const carritoId = req.params.carritoId
  
  Carrito.update({status:"creada"},{
   where:{
          id: carritoId
       }
      })
      .then((carrito)=>{
        res.status(201).send(carrito)
      })
      .catch((err)=> {
        console.log(err)
        res.status(400).send(err)
      })
   
})




// Update queries also accept the where option, just like the read queries shown above.

// // Change everyone without a last name to "Doe"
// await User.update({ lastName: "Doe" }, {
//   where: {
//     lastName: null
//   }
// });



server.get('/:userId/carritos', (req, res)=>{
  
  const {userId} = req.params

  Carrito.findOne({
    where:{
      userId,  
      status:"carrito"
    },
    include: Product
  },{
    include: Orden,
  })

  .then(carrito =>{
    res.status(201).send(carrito)
  })
  .catch(err =>{
    res.status(400).send(err)
  })
})





//------------------------------------------------>









//This will add methods getUsers, setUsers, addUsers to Project, and getProjects
//, setProjects and addProject to User.



//Register (creación de usuario) ---> funcionando
server.post("/", (req, res) => {
  const { email, password, name} = req.body;
  User.create({ 
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    })
  .then(user => {return res.status(201).json(user)})
  .catch(error => {
    console.log(error)
    res.status(400).json(error)})
});

//Delete user ---->funcionando
server.delete('/:id', (req,res)=>{    //DELETE a /users/:id
  const id = req.params.id;
	User.destroy({
		where: { id: id }
	}).then((id) => {
		res.status(200).send("Usuario " + id + " eliminado")//  Agregué status//REVISAR CONSOLOGUEO, NO ACTUALIZA ID
	}).catch(function (err) {
		console.log("delete failed with error: " + err);
		// handle error;
	});
    
});

//para traer todos los usuarios  ---->funcionando
server.get('/usuarios', (req, res, next) => { // GET a /users/usuarios
	User.findAll()
		.then(users => {
			res.status(201).send(users);
		})
		.catch(next);
});

// server.get('/usuario/:id', (req, res)=>{ // GET a /users/usuario/:id (TRAE 1 SOLO USUARIO)
//                                         TRAEMOS 1 USUARIO, PARA LUEGO UPDATEARLO
//   const {id} = req.params

//   User.findOne({where:{
//     id
//   }})
//   .then(user=>{
//     res.status(201).send(user)
//   })
//   .catch(err=>{
//     res.status(400).send(err)
//   })
// })

//Update user
//PUT /users/:id//update ---->funcionando
server.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.send({
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        password:updatedUser.password,
        isAdmin: updatedUser.isAdmin,
      })
      console.log("Usuario actualizado");
      alert('Usuario actualizado');
    } else {
      res.status(404).send({ message: 'El usuario no se pudo actualizar' });
    }
  });

  //logeo sign up
  server.post('/signin', async (req, res) => {
    const signinUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (signinUser) {
      res.send({
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
      });
    } else {
      res.status(401).send({ message: 'Invalid Email or Password.' });
    }
  });

// crear admin
server.post('/createadmin', async (req, res) => {
    try {
      const user = new User({
        name: 'admin',
        email: 'admin@example.com',
        password: '1234',
        isAdmin: true,
      });
      const newUser = await user.save();
      res.send(newUser);
    } catch (error) {
      res.send({ message: error.message });
    }
  });
  
module.exports = server;

