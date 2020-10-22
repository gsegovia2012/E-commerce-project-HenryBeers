import React, { useState, useEffect } from "react";
import CrudCategory from '../CrudCategory/CrudCategory'
import CrudBeer from '../CrudBeer/CrudBeer'
import { Link } from 'react-router-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import Profile from '../Profile/Profile'
import Ordenes from '../Ordenes/ordenes'
import Orden from '../Orden/orden'
import { useDispatch, useSelector } from "react-redux"; 

const Admin = ({history}) => {
    const usuario = useSelector(store => store.user.user)
    useEffect(() => {
        if (!usuario.isAdmin) {
          history.push('/')
        }
      }, [usuario])

    return (
        <BrowserRouter>
            <div style={{ width: "15%", height: "100px", backgroundColor: "gray", color: "white", borderRadius: "10px", marginTop: "10px", marginLeft: "10px" }} >
                <div style={{ padding: "15px 15px 15px 15px", color:"white" }} >
                    <div>
                        <Link to='/admin/crud/products'> <h6 style={{color:"white", textAlign:"center" }}>Products</h6> </Link>
                    </div>
                    <div>
                        <Link to='/admin/categories'> <h6 style={{color:"white", textAlign:"center" }}>Categories</h6> </Link>
                    </div>
                    <div>
                        <Link to='/admin/ordenes'> <h6 style={{color:"white", textAlign:"center" }}>Ordenes</h6> </Link>
                    </div>
                </div>
            </div>
            <div>


                <Route
                    exact path='/admin/crud/products'
                    render={() => <CrudBeer />}
                />

                <Route
                    exact path='/admin/categories'
                    render={() => <CrudCategory />}
                />
                  <Route
                    exact path='/admin/ordenes'
                    render={() => <Ordenes />}
                />

                <Route
                 exact path='/orden/:id'
                 component={Orden}
                />

                <Route
                 exact path='/admin'
                component={Profile}
                />

            </div>
        </BrowserRouter>
    )
}

export default Admin