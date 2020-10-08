const server = require('express').Router();
const { Category } = require('../db.js');

server.post('/create', (req, res)=>{
    const {name, description} = req.body
    Category.findOrCreate({where:{name, description}})
    .then(()=>{
        res.status(201).send('Categoria agregada exitosamente')
    })
    .catch(err=>{
        res.status(400).json(err)
    })
})

server.put('/update/:id', (req, res)=>{
    const  id = req.params.id
    const {name, description} = req.body
    Category.update({name, description}, {where: {id}})
    .then(()=>{
        res.status(201).send('Modificado Correctamente')
    })
    .catch(()=>{
        res.status(404).send('Hubo un error')
    })
})





module.exports = server