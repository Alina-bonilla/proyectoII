
//************************************** CREACION DEL SERVIDOR EXPRESS ****************************************
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.get('/', (request, response) => {
  response.json({ info: request.body })
})


//************************************** PRODUCTO ****************************************
//----------------------------- ESPECIFICO ------------------------------
app.get('/productoE/:id', (request, response) => {
    sql.connect(config).then(pool => {
      return pool.request()
      .input('pProductoID', sql.Int, request.params.id)
      .execute('dbo.ConsultaEspecificaProductoXID')  
    }).then(result =>{       
      response.json(result.recordset)
      sql.close();        
    }).catch(err=>{
      console.log(err);
      sql.close();
    })
  });

app.get('/L/productoE/:id', (request, response) => {
    sql.connect(config2).then(pool => {
      return pool.request()
      .input('pProductoID', sql.Int, request.params.id)
      .execute('dbo.ConsultaEspecificaProductoXID')  
    }).then(result =>{       
      response.json(result.recordset)
      sql.close();        
    }).catch(err=>{
      console.log(err);
      sql.close();
    })
  });  
//----------------------------- GENERAL ------------------------------
app.get('/productoG/:pProducto/:pCategoria/:pPalabras', (request, response) => {
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pProducto', sql.VarChar(27), request.params.Name)
    .input('pCategoria', sql.VarChar(27), request.params.Category)
    .input('pPalabras', sql.VarChar(52), request.params.DeliveryMethod)
    .execute('dbo.ConsultaGeneralProductos')  
  }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});

app.get('/L/productoG/:pProducto/:pCategoria/:pPalabras', (request, response) => {
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pProducto', sql.VarChar(27), request.params.Name)
    .input('pCategoria', sql.VarChar(27), request.params.Category)
    .input('pPalabras', sql.VarChar(52), request.params.DeliveryMethod)
    .execute('dbo.ConsultaGeneralProductos')  
  }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});
//**************************************CANT. PRODUCTOS X CATEGORIA****************************************
app.get('/productosCategoria', (request, response) => {
    sql.connect(config).then(pool => {
      return pool.request()
      .execute('dbo.CantidadProductosXCategoria')  
    }).then(result =>{       
      response.json(result.recordset)
      sql.close();        
    }).catch(err=>{
      console.log(err);
      sql.close();
    })
  });

app.get('/L/productosCategoria', (request, response) => {
    sql.connect(config2).then(pool => {
      return pool.request()
      .execute('dbo.CantidadProductosXCategoria')  
    }).then(result =>{       
      response.json(result.recordset)
      sql.close();        
    }).catch(err=>{
      console.log(err);
      sql.close();
    })
  });
//************************************** FARMACEUTICO ****************************************
//----------------------------- INSERTAR PRODUCTO ------------------------------
app.get('/insertarProducto/:Categoria/:Marca/:Nombre/:Enfermedades/:Precio/:Foto', (request, response) => {
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pCategoriaID', sql.Int, request.params.Categoria)
    .input('pMarca', sql.VarChar(25), request.params.Marca)
    .input('pNombre', sql.VarChar(25), request.params.Nombre)
    .input('pEnfermedadesRelacionadas', sql.VarChar(50), request.params.Enfermedades)
    .input('pPrecioUnitario', sql.Int, request.params.Precio)
    .input('pFoto', sql.Image, request.params.Foto)
    .execute('dbo.InsertarProducto')  
  }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});

app.get('/L/insertarProducto/:Categoria/:Marca/:Nombre/:Enfermedades/:Precio/:Foto', (request, response) => {
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pCategoriaID', sql.Int, request.params.Categoria)
    .input('pMarca', sql.VarChar(25), request.params.Marca)
    .input('pNombre', sql.VarChar(25), request.params.Nombre)
    .input('pEnfermedadesRelacionadas', sql.VarChar(50), request.params.Enfermedades)
    .input('pPrecioUnitario', sql.Int, request.params.Precio)
    .input('pFoto', sql.Image, request.params.Foto)
    .execute('dbo.InsertarProducto')  
  }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});
//----------------------------- INSERTAR CATEGORIA ------------------------------
app.get('/insertarCategoria/:Nombre', (request, response) => {
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pNombre', sql.VarChar(25), request.params.Nombre)
    .execute('dbo.InsertarCategoria')  
  }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});

app.get('/L/insertarCategoria/:Nombre', (request, response) => {
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pNombre', sql.VarChar(25), request.params.Nombre)
    .execute('dbo.InsertarCategoria')  
  }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});
//----------------------------- MODIFICAR INVENTARIO ------------------------------
app.get('/modificarInventario/:Producto/:Cantidad/:Costo', (request, response) => {
  sql.connect(config).then(pool => {
    return pool.request()  
    .input('pProductoID', sql.Int, request.params.Producto)
    .input('pCantidad', sql.Int, request.params.Cantidad)
    .input('pCostoUnitario', sql.Int, request.params.Costo)    
    .execute("dbo.ModificarInventario")
   }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});

app.get('/L/modificarInventario/:Producto/:Cantidad/:Costo', (request, response) => {
  sql.connect(config2).then(pool => {
    return pool.request()  
    .input('pProductoID', sql.Int, request.params.Producto)
    .input('pCantidad', sql.Int, request.params.Cantidad)
    .input('pCostoUnitario', sql.Int, request.params.Costo)    
    .execute("dbo.ModificarInventario")
   }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});
//----------------------------- VALIDAR INVENTARIO ------------------------------
app.get('/validarInventario/:Producto/:Cantidad', (request, response) => {
  sql.connect(config).then(pool => {
    return pool.request()  
    .input('pProductoID', sql.Int, request.params.Producto)
    .input('pCantidad', sql.Int, request.params.Cantidad)
    .execute("dbo.ValidarInventario")
   }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});

app.get('/L/validarInventario/:Producto/:Cantidad', (request, response) => {
  sql.connect(config2).then(pool => {
    return pool.request()  
    .input('pProductoID', sql.Int, request.params.Producto)
    .input('pCantidad', sql.Int, request.params.Cantidad)
    .execute("dbo.ValidarInventario")
   }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});
//----------------------------- FACTURAR ------------------------------
app.get('/facturar/:impuesto/:cliente/:id', (request, response) => {
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pImpuesto', sql.Float, request.params.impuesto)
    .input('pCliente', sql.VarChar(100), request.params.cliente)
    .input('ID', sql.Int, request.params.id)
    .execute('dbo.Facturar')  
  }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});

app.get('/L/facturar/:impuesto/:cliente/:id', (request, response) => {
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pImpuesto', sql.Float, request.params.impuesto)
    .input('pCliente', sql.VarChar(100), request.params.cliente)
    .input('ID', sql.Int, request.params.id)
    .execute('dbo.Facturar')  
  }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  })
});

//----------------------------- DETALLE FACTURAR ------------------------------
app.get('/detalleFactura/:factura/:producto/:cantidad/:descuento', (request, response) => {       
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pFacturaID', sql.Int, request.params.factura)
    .input('pProductoID', sql.Int, request.params.producto)
    .input('pCantidad', sql.Int, request.params.cantidad)
    .input('pDescuento', sql.Float, request.params.descuento)
    .execute('dbo.AgregarDetalleFactura')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    })    
});

app.get('/L/detalleFactura/:factura/:producto/:cantidad/:descuento', (request, response) => {       
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pFacturaID', sql.Int, request.params.factura)
    .input('pProductoID', sql.Int, request.params.producto)
    .input('pCantidad', sql.Int, request.params.cantidad)
    .input('pDescuento', sql.Float, request.params.descuento)
    .execute('dbo.AgregarDetalleFactura')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    })    
});


//******************************************************************************
app.listen(port, () => {
  console.log(`Servidor alojado en el puerto: ${port}.`)
  console.log(config)
})
//************************************** CONEXION ****************************************
const sql = require('mssql');
const { pid } = require('process');
const { isDate } = require('util');
const config = {
    user: 'sa',
    password : '1234',
    server: 'TROYANO1802',//'USUARIO',
    database: 'DBSanJose',
    "options": {
      "encrypt": true,
      "enableArithAbort": true
      }
  }

  const config2 = {
      user: 'sa',
      password : '1234',
      server: 'TROYANO1802',//"TROYANO1802\\MSSQLSERVER01",
      database: 'DBLimon',
      "options": {
        "encrypt": true,
        "enableArithAbort": true
        }
    }
//************************************** PRODUCTO ****************************************
//----------------------------- ESPECIFICO ------------------------------
async function ConsultaEspecificaProductoXID (){        
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pProductoID', sql.Int, request.params.id)
    .execute('dbo.ConsultaEspecificaProductoXID')
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}

async function ConsultaEspecificaProductoXID (){        
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pProductoID', sql.Int, request.params.id)
    .execute('dbo.ConsultaEspecificaProductoXID')
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}
//----------------------------- GENERAL ------------------------------
async function ConsultaGeneralProductos (){        
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pProducto', sql.VarChar(27), request.params.Name)
    .input('pCategoria', sql.VarChar(27), request.params.Category)
    .input('pPalabras', sql.VarChar(52), request.params.DeliveryMethod)
    .execute('dbo.ConsultaGeneralProductos')
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}

async function ConsultaGeneralProductos (){        
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pProducto', sql.VarChar(27), request.params.Name)
    .input('pCategoria', sql.VarChar(27), request.params.Category)
    .input('pPalabras', sql.VarChar(52), request.params.DeliveryMethod)
    .execute('dbo.ConsultaGeneralProductos')
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}
//**************************************CANT. PRODUCTOS X CATEGORIA****************************************
async function CantidadProductosXCategoria (){        
    sql.connect(config).then(pool => {
      return pool.request()
      .execute('dbo.CantidadProductosXCategoria')
      }).then(result =>{
        console.log(result.recordset)
        sql.close();      
      }).catch(err=>{
        console.log(err);
        sql.close();
      });     
  }

async function CantidadProductosXCategoria (){        
    sql.connect(config2).then(pool => {
      return pool.request()
      .execute('dbo.CantidadProductosXCategoria')
      }).then(result =>{
        console.log(result.recordset)
        sql.close();      
      }).catch(err=>{
        console.log(err);
        sql.close();
      });     
  }


  //************************************** FARMACEUTICO ****************************************
//----------------------------- INSERTAR PRODUCTO ------------------------------
async function InsertarProducto (){        
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pCategoriaID', sql.Int, request.params.Categoria)
    .input('pMarca', sql.VarChar(25), request.params.Marca)
    .input('pNombre', sql.VarChar(25), request.params.Nombre)
    .input('pEnfermedadesRelacionadas', sql.VarChar(50), request.params.Enfermedades)
    .input('pPrecioUnitario', sql.Int, request.params.Precio)
    .input('pFoto', sql.Image, request.params.Foto)
    .execute('dbo.InsertarProducto')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });   
}
async function InsertarProducto (){  
    sql.connect(config2).then(pool => {
    return pool.request()
    .input('pCategoriaID', sql.Int, request.params.Categoria)
    .input('pMarca', sql.VarChar(25), request.params.Marca)
    .input('pNombre', sql.VarChar(25), request.params.Nombre)
    .input('pEnfermedadesRelacionadas', sql.VarChar(50), request.params.Enfermedades)
    .input('pPrecioUnitario', sql.Int, request.params.Precio)
    .input('pFoto', sql.Image, request.params.Foto)
    .execute('dbo.InsertarProducto')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}
//----------------------------- INSERTAR CATEGORIA ------------------------------
async function InsertarCategoria (){        
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pNombre', sql.VarChar(25), request.params.Nombre)
    .execute('dbo.InsertarCategoria')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}

async function InsertarCategoria (){ 
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pNombre', sql.VarChar(25), request.params.Nombre)
    .execute('dbo.InsertarCategoria')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    }); 
}
//----------------------------- MODIFICAR INVENTARIO ------------------------------
async function ModificarInventario (){        
  sql.connect(config).then(pool => {  
    return pool.request()  
    .input('pProductoID', sql.Int, request.params.Producto)
    .input('pCantidad', sql.Int, request.params.Cantidad)
    .input('pCostoUnitario', sql.Int, request.params.Costo)    
    .execute("dbo.ModificarInventario")
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}

async function ModificarInventario (){        
  sql.connect(config2).then(pool => {  
    return pool.request()  
    .input('pProductoID', sql.Int, request.params.Producto)
    .input('pCantidad', sql.Int, request.params.Cantidad)
    .input('pCostoUnitario', sql.Int, request.params.Costo)    
    .execute("dbo.ModificarInventario")
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}
//----------------------------- VALIDAR INVENTARIO ------------------------------
async function ModificarInventario (){        
  sql.connect(config).then(pool => {
    return pool.request()  
    .input('pProductoID', sql.Int, request.params.Producto)
    .input('pCantidad', sql.Int, request.params.Cantidad)
    .execute("dbo.ValidarInventario")
   }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  });
}

async function ModificarInventario (){        
  sql.connect(config2).then(pool => {
    return pool.request()  
    .input('pProductoID', sql.Int, request.params.Producto)
    .input('pCantidad', sql.Int, request.params.Cantidad)
    .execute("dbo.ValidarInventario")
   }).then(result =>{       
    response.json(result.recordset)
    sql.close();        
  }).catch(err=>{
    console.log(err);
    sql.close();
  });
}
//----------------------------- FACTURAR ------------------------------
async function Facturar (){        
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pImpuesto', sql.Float, request.params.impuesto)
    .input('pCliente', sql.VarChar(100), request.params.cliente)
    .input('ID', sql.Int, request.params.id)
    .execute('dbo.Facturar')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}

async function Facturar (){        
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pImpuesto', sql.Float, request.params.impuesto)
    .input('pCliente', sql.VarChar(100), request.params.cliente) 
    .input('ID', sql.Int, request.params.id)
    .execute('dbo.Facturar')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}
//----------------------------- DETALLE FACTURAR ------------------------------
async function AgregarDetalleFactura (){        
  sql.connect(config).then(pool => {
    return pool.request()
    .input('pFacturaID', sql.Int, request.params.factura)
    .input('pProductoID', sql.Int, request.params.producto)
    .input('pCantidad', sql.Int, request.params.cantidad)
    .input('pDescuento', sql.Float, request.params.descuento)
    .execute('dbo.AgregarDetalleFactura')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}

async function AgregarDetalleFactura (){        
  sql.connect(config2).then(pool => {
    return pool.request()
    .input('pFacturaID', sql.Int, request.params.factura)
    .input('pProductoID', sql.Int, request.params.producto)
    .input('pCantidad', sql.Int, request.params.cantidad)
    .input('pDescuento', sql.Float, request.params.descuento)
    .execute('dbo.AgregarDetalleFactura')  
    }).then(result =>{
      console.log(result.recordset)
      sql.close();      
    }).catch(err=>{
      console.log(err);
      sql.close();
    });     
}