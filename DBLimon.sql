CREATE DATABASE DBLimon;

USE DBLimon;

CREATE TABLE Categorias(
	CategoriaID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Nombre VARCHAR(25) NOT NULL
);

CREATE TABLE Productos(
	ProductoID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Nombre VARCHAR(25) NOT NULL,
	CategoriaID INT NOT NULL,
	Marca VARCHAR(25) NOT NULL,
	EnfermedadesRelacionadas Varchar(50) NOT NULL,
	PrecioUnitario INT NOT NULL,
	Foto IMAGE,
	CONSTRAINT FK_ProductoCategoria FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID)
);

CREATE TABLE Inventarios(
	InventarioID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	ProductoID INT NOT NULL,
	Cantidad INT NOT NULL,
	CostoUnitario INT NOT NULL,
	CONSTRAINT InventarioProducto FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

CREATE TABLE Personas(
	Cedula INT PRIMARY KEY NOT NULL,
	Nombre VARCHAR(25) NOT NULL,
	Apellido1 VARCHAR(25) NOT NULL,
	Apellido2 VARCHAR(25) NOT NULL,
	Telefono INT NOT NULL,
	Correo VARCHAR(30) NOT NULL
);

CREATE TABLE Cuentas(
	CuentaID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	Usuario VARCHAR(20) NOT NULL,
	Contrasenia VARCHAR(15) NOT NULL,
	Cedula INT NOT NULL,
	Tipo VARCHAR(15) NOT NULL,
	SucursalID INT NOT NULL,
	CONSTRAINT FK_CuentaPersona FOREIGN KEY (Cedula) REFERENCES Personas(Cedula)
);

CREATE TABLE Facturas(
	FacturaID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	SucursalID CHAR(4) NOT NULL,
	Cliente VARCHAR(100) NOT NULL, 
	Fecha DATETIME NOT NULL,
	Impuesto FLOAT NOT NULL,
	SubTotal INT NOT NULL,
	Total INT NOT NULL
);

CREATE TABLE DetallesFacturas(
	DetalleFacturaID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	FacturaID INT NOT NULL,
	ProductoID INT NOT NULL,
	Cantidad INT NOT NULL,
	Descuento FLOAT NOT NULL,
	SubTotal INT NOT NULL,
	CONSTRAINT FK_DetalleFacturaPersona FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID),
	CONSTRAINT FK_DetalleFactura_Factura FOREIGN KEY (FacturaID) REFERENCES Facturas(FacturaID)
);

----------------------------------------------------Cliente--------------------------------------------------------------
GO
CREATE PROCEDURE ConsultaGeneralProductos (@pProducto Varchar(27),@pCategoria Varchar(27),@pPalabras Varchar(52))
AS
	DECLARE	@SEVERALCOLUMNS BIT = 0;
	DECLARE	@CONSULTA NVARCHAR(900) = 'SELECT ProductoID,PROD.Nombre As Producto,CATE.Nombre AS Categoria,PROD.EnfermedadesRelacionadas,PROD.PrecioUnitario FROM DBLimon.dbo.Productos PROD INNER JOIN DBLimon.dbo.Categorias CATE ON CATE.CategoriaID = PROD.CategoriaID '
	IF (NOT @pProducto LIKE '')					-----@pProducto
	BEGIN
		SET @pProducto = '%' + @pProducto + '%';
		SET @SEVERALCOLUMNS = 1;
		SET @CONSULTA = @CONSULTA + 'WHERE UPPER (PROD.Nombre) LIKE UPPER(@pProducto) ';
	END
	IF (NOT @pCategoria LIKE '')				-----@pCategoria
	BEGIN
		IF (@SEVERALCOLUMNS = 0) 
		BEGIN
			SET @SEVERALCOLUMNS = 1;
			SET @CONSULTA = @CONSULTA + 'WHERE ';
		END
		ELSE
		BEGIN 
			SET @CONSULTA = @CONSULTA + 'AND ';
		END
		SET @pCategoria = '%' + @pCategoria + '%';
		SET @SEVERALCOLUMNS = 1;
		SET @CONSULTA = @CONSULTA + 'UPPER (CATE.Nombre) LIKE UPPER(@pCategoria) ';
	END
	IF (NOT @pPalabras LIKE '')		-----@pPalabras
	BEGIN
		IF (@SEVERALCOLUMNS = 0) 
		BEGIN
			SET @SEVERALCOLUMNS = 1;
			SET @CONSULTA = @CONSULTA + 'WHERE ';
		END
		ELSE
		BEGIN 
			SET @CONSULTA = @CONSULTA + 'AND ';
		END
		SET @pPalabras = '%' + @pPalabras + '%';
		SET @SEVERALCOLUMNS = 1;
		SET @CONSULTA = @CONSULTA + 'UPPER (PROD.EnfermedadesRelacionadas) LIKE UPPER(@pPalabras) ';
	  END
	SET @CONSULTA = @CONSULTA + ' ORDER BY Producto ASC;'
	EXEC SP_EXECUTESQL @consulta, N'@pProducto Varchar(27),@pCategoria Varchar(27),@pPalabras Varchar(52)',@pProducto, @pCategoria, @pPalabras
;

GO
CREATE PROCEDURE ConsultaEspecificaProductoXID (@pProductoID INT)
AS
	SELECT 
		PROD.ProductoID,
		PROD.Nombre As Producto,
		CATE.Nombre AS Categoria,
		PROD.EnfermedadesRelacionadas,
		PROD.Marca,
		PROD.PrecioUnitario ,
		PROD.Foto
	FROM DBLimon.dbo.Productos PROD 
	INNER JOIN DBLimon.dbo.Categorias CATE ON CATE.CategoriaID = PROD.CategoriaID
	WHERE PROD.ProductoID = @pProductoID
	ORDER BY PROD.Nombre
;

GO
CREATE PROCEDURE CantidadProductosXCategoria
AS
	SELECT Cate.CategoriaID,Cate.Nombre As Categoria,Count(PROD.ProductoID) AS CantidadProductos 
	FROM DBLimon.dbo.Categorias CATE
	LEFT JOIN DBLimon.dbo.Productos PROD ON CATE.CategoriaID = PROD.CategoriaID
	GROUP BY Cate.CategoriaID,Cate.Nombre
	ORDER BY Cate.Nombre
;
----------------------------------------------------Farmaseutico---------------------------------------------------------
GO
CREATE PROCEDURE InsertarProducto (@pCategoriaID INT,@pMarca VARCHAR(25),@pNombre Varchar(25),@pEnfermedadesRelacionadas Varchar(50),@pPrecioUnitario INT,@pFoto IMAGE)
AS
	INSERT INTO DBLimon.dbo.Productos (CategoriaID,Marca,Nombre,EnfermedadesRelacionadas,PrecioUnitario,Foto)
	VALUES (@pCategoriaID,@pMarca,@pNombre,@pEnfermedadesRelacionadas,@pPrecioUnitario,@pFoto);
;

GO
CREATE PROCEDURE InsertarCategoria (@pNombre VARCHAR(25))
AS
	INSERT INTO DBLimon.dbo.Categorias(Nombre)
	VALUES (@pNombre);
;

GO
CREATE PROCEDURE ModificarInventario (@pProductoID INT,@pCantidad INT,@pCostoUnitario INT)
AS
	IF  EXISTS (SELECT * FROM DBLimon.dbo.Productos where ProductoID = @pProductoID)
	BEGIN
		IF  EXISTS (SELECT * FROM DBLimon.dbo.Inventarios where ProductoID = @pProductoID)
		BEGIN
			DECLARE	@SEVERALCOLUMNS BIT = 0;
			DECLARE	@CONSULTA NVARCHAR(700);
			SET @CONSULTA = 'UPDATE DBLimon.dbo.Inventarios
			SET '
			IF @pCantidad > -1
			BEGIN
				SET @SEVERALCOLUMNS = 1
				SET @CONSULTA = @CONSULTA + 'Cantidad = @pCantidad'
			END
			IF @pCostoUnitario > -1
			BEGIN
				IF @SEVERALCOLUMNS = 1 
				BEGIN
					SET @CONSULTA = @CONSULTA + ', '
				END
				SET @CONSULTA = @CONSULTA + 'CostoUnitario = @pCostoUnitario'
			END
			SET @CONSULTA = @CONSULTA + ' WHERE ProductoID = @pProductoID;'
			EXEC SP_EXECUTESQL @consulta, N'@pProductoID INT,@pCantidad INT,@pCostoUnitario INT',@pProductoID, @pCantidad, @pCostoUnitario
		END
		ELSE
		BEGIN
			IF @pCantidad > -1 AND @pCostoUnitario > -1
			BEGIN
				INSERT INTO DBLimon.dbo.Inventarios ([ProductoID], [Cantidad], [CostoUnitario])
				VALUES (@pProductoID,@pCantidad,@pCostoUnitario)
			END
		END
	END
;

GO
CREATE PROCEDURE ValidarInventario (@pProductoID INT, @pCantidad INT)
AS 
BEGIN
    IF EXISTS (SELECT * FROM DBLimon.DBO.Inventarios WHERE ProductoID = @pProductoID AND Cantidad >= @pCantidad) 
	BEGIN
	SELECT 1
        RETURN 1
    END
	SELECT 0
	RETURN 0
END;

GO
CREATE PROCEDURE Facturar (@pImpuesto FLOAT,@pCliente VARCHAR(100),@ID INT OUTPUT)
AS
	INSERT INTO DBLimon.DBO.Facturas (SucursalID,Cliente,Fecha,Impuesto,Subtotal,Total)
    VALUES ('Limo',@pCliente, GETUTCDATE(),@pImpuesto,0,0)
	SELECT @ID = scope_identity()
	RETURN @ID
;
GO
CREATE PROCEDURE AgregarDetalleFactura(@pFacturaID INT, @pProductoID INT,@pCantidad INT,@pDescuento FLOAT)
AS
	IF EXISTS (SELECT InventarioID FROM DBLimon.DBO.Inventarios WHERE ProductoID = @pProductoID AND Cantidad >= @pCantidad)
	BEGIN
		DECLARE @PrecioUnitario	INT;
		SELECT @PrecioUnitario = PrecioUnitario FROM DBLimon.DBO.Productos WHERE ProductoID = @pProductoID
		DECLARE @SubTotal INT = @PrecioUnitario * @pCantidad
		DECLARE @MontoDescuento INT =  @SubTotal * (@pDescuento * 0.01 );
		SET @SubTotal = @SubTotal - @MontoDescuento

		INSERT INTO DBLimon.DBO.DetallesFacturas (FacturaID,ProductoID,Cantidad,Descuento,SubTotal)
		VALUES (@pFacturaID,@pProductoID,@pCantidad,@pDescuento,@SubTotal)

		DECLARE @nSubTotalFactura INT;
		SELECT @nSubTotalFactura = SubTotal FROM DBLimon.DBO.Facturas WHERE FacturaID = @pFacturaID
		SET @nSubTotalFactura = @nSubTotalFactura + @SubTotal
	
		UPDATE DBLimon.DBO.Facturas 
		SET SubTotal = @nSubTotalFactura, Total = (@nSubTotalFactura + (@nSubTotalFactura * (Impuesto*0.01)))
		WHERE FacturaID = @pFacturaID
		
		UPDATE DBLimon.DBO.Inventarios 
		SET Cantidad -= @pCantidad
		WHERE ProductoID = @pProductoID
	END
;

GO
CREATE PROCEDURE ConsultarFacturaGeneral (@pFacturaID INT,@pCliente VARCHAR(102), @pProducto VARCHAR(25),@Fecha DATE)
AS	
	DECLARE	@SEVERALCOLUMNS BIT = 0;
	DECLARE	@CONSULTA NVARCHAR(1000) = 'SELECT FAC.FacturaID,FAC.Cliente,PROD.Nombre AS Producto,FAC.Fecha FROM DBLimon.DBO.Facturas FAC INNER JOIN DBLimon.DBO.DetallesFacturas DFA ON DFA.FacturaID = FAC.FacturaID INNER JOIN DBLimon.DBO.Productos PROD ON PROD.ProductoID = DFA.ProductoID '
	IF (NOT @pFacturaID = 0)									-----@pName
	BEGIN
		SET @SEVERALCOLUMNS = 1;
		SET @CONSULTA = @CONSULTA + 'WHERE FAC.FacturaID = @pFacturaID ';
	END
	IF (NOT @pCliente LIKE '')								-----@pCliente
	BEGIN
		IF (@SEVERALCOLUMNS = 0) 
		BEGIN
			SET @SEVERALCOLUMNS = 1;
			SET @CONSULTA = @CONSULTA + 'WHERE ';
		END
		ELSE
		BEGIN 
			SET @CONSULTA = @CONSULTA + 'AND ';
		END
		SET @pCliente = '%' + @pCliente + '%';
		SET @SEVERALCOLUMNS = 1;
		SET @CONSULTA = @CONSULTA + 'UPPER (FAC.Cliente) LIKE UPPER(@pCliente) ';
	END
	IF (NOT @pProducto LIKE '')						-----@pProducto
	BEGIN
		IF (@SEVERALCOLUMNS = 0) 
		BEGIN
			SET @SEVERALCOLUMNS = 1;
			SET @CONSULTA = @CONSULTA + 'WHERE ';
		END
		ELSE
		BEGIN 
			SET @CONSULTA = @CONSULTA + 'AND ';
		END
		SET @pProducto = '%' + @pProducto + '%';
		SET @SEVERALCOLUMNS = 1;
		SET @CONSULTA = @CONSULTA + 'UPPER (PROD.Nombre) LIKE UPPER(@pProducto)  ';
	END
	IF (NOT @Fecha = '1900-01-01')						-----@Fecha
	BEGIN
		IF (@SEVERALCOLUMNS = 0) 
		BEGIN
			SET @SEVERALCOLUMNS = 1;
			SET @CONSULTA = @CONSULTA + 'WHERE ';
		END
		ELSE
		BEGIN 
			SET @CONSULTA = @CONSULTA + 'AND ';
		END
		SET @SEVERALCOLUMNS = 1;
		SET @CONSULTA = @CONSULTA + 'FAC.Fecha = @Fecha ';
	END
	SET @CONSULTA = @CONSULTA + ' ORDER BY FAC.FacturaID ASC;'
	EXEC SP_EXECUTESQL @consulta, N'@pFacturaID INT,@pCliente VARCHAR(102), @pProducto VARCHAR(25),@Fecha DATE',@pFacturaID,@pCliente,@pProducto,@Fecha
;

GO
CREATE PROCEDURE ConsultarFacturaEspecifica (@pFacturaID INT)
AS
	SELECT FAC.FacturaID,FAC.Cliente,FAC.Fecha,PROD.Nombre AS Producto, DFA.Cantidad,PROD.PrecioUnitario,DFA.Descuento,DFA.SubTotal,FAC.Impuesto,FAC.Total FROM DBLimon.DBO.Facturas FAC
	INNER JOIN DBLimon.DBO.DetallesFacturas DFA ON DFA.FacturaID = FAC.FacturaID
	INNER JOIN DBLimon.DBO.Productos PROD ON PROD.ProductoID = DFA.ProductoID
	WHERE FAC.FacturaID = @pFacturaID
;

-------------------------------------------------------Execute-----------------------------------------------------------------------
EXECUTE DBO.InsertarCategoria 'Inyecciones';
EXECUTE DBO.InsertarCategoria 'Unguento';
EXECUTE DBO.InsertarCategoria 'Cuidado personal';
EXECUTE DBO.InsertarProducto 2,'Zepol','Zepol','Resfrios',2650,NULL;
EXECUTE DBO.InsertarProducto 2,'Vick','Vaporub','Resfrios',3450,NULL;
EXECUTE DBO.InsertarProducto 3,'Lacofa','Aceite Camibar','Cicatrizante',2300,NULL;

EXECUTE DBO.ModificarInventario 1,50,1780;
EXECUTE DBO.ModificarInventario 2,65,2430;
EXECUTE DBO.ModificarInventario 3,40,1200;

EXECUTE DBO.Facturar 13.0,'Felipe Lopez Gonzales',0;
EXECUTE DBO.Facturar 13.0,'Tatiana Simson Sanabria',0;
EXECUTE DBO.Facturar 15.5,'Steven Smith',0;


EXECUTE DBO.AgregarDetalleFactura 3,1,5,12.0;
EXECUTE DBO.AgregarDetalleFactura 3,2,7,0.0;
EXECUTE DBO.AgregarDetalleFactura 3,3,2,0.0;

EXECUTE DBO.AgregarDetalleFactura 2,1,15,8.0;
EXECUTE DBO.AgregarDetalleFactura 2,2,5,0.0;
EXECUTE DBO.AgregarDetalleFactura 2,3,20,1.0;

EXECUTE DBO.AgregarDetalleFactura 1,1,10,1.8;
EXECUTE DBO.AgregarDetalleFactura 1,2,30,2.0;
EXECUTE DBO.AgregarDetalleFactura 1,3,5,0.0;