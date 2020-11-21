class Vehiculo{
    public id:number;
    public marca:string;
    public modelo:string;
    public precio:number;

    constructor(id:number, marca:string, modelo:string, precio:number)
    {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
    }
}

class Auto extends Vehiculo{
    public cantidadPuertas:number;

    constructor(id:number, marca:string, modelo:string, precio:number, cantidadPuertas:number)
    {
        super(id, marca, modelo, precio);
        this.cantidadPuertas = cantidadPuertas;
    }

    toVehiculo():Vehiculo
    {
        return new Vehiculo(this.id, this.marca, this.modelo, this.precio);
    }
}

class Camioneta extends Vehiculo
{
    public cuatroXcuatro:boolean;

    constructor(id:number, marca:string, modelo:string, precio:number, cuatroXcuatro:boolean)
    {
        super(id, marca, modelo, precio);
        this.cuatroXcuatro = cuatroXcuatro;
    }

    toVehiculo():Vehiculo
    {
        return new Vehiculo(this.id, this.marca, this.modelo, this.precio);
    }
}

class App{
    public table:HTMLTableElement;
    public txtMarca:HTMLInputElement;
    public txtModelo:HTMLInputElement;
    public txtPrecio:HTMLInputElement;
    public txtPuertas:HTMLInputElement;
    public cb4:HTMLInputElement;
    public selTipo:HTMLSelectElement;
    
    public listaVehiculos:Vehiculo[] = [];

    public $(element:string):HTMLElement
    {
        return document.getElementById(element);
    }

    constructor()
    {
        this.table = <HTMLTableElement>this.$("tabBodyVehiculos");
        this.txtMarca = <HTMLInputElement>this.$("txtMarca");
        this.txtModelo = <HTMLInputElement>this.$("txtModelo");
        this.txtPrecio = <HTMLInputElement>this.$("txtPrecio");
        this.txtPuertas = <HTMLInputElement>this.$("txtPuertas");
        this.cb4 = <HTMLInputElement>this.$("cb4");
        this.selTipo = <HTMLSelectElement>this.$("selTipo");
    }

    public mostrarAlta():void{
        if(this.$("divContainer").hidden == true)
        {
            this.$("divContainer").hidden = false;
            this.$("body").classList.add("disabled")
        }else{
            this.$("divContainer").hidden = true;
            this.$("body").classList.remove("disabled")
        }        
    }

    public cambiarTipo():void{
        this.$("lbl4").hidden = !this.$("lbl4").hidden;
        this.$("cb4").hidden = !this.$("cb4").hidden;
        this.$("lblPuertas").hidden = !this.$("lblPuertas").hidden;
        this.$("txtPuertas").hidden = !this.$("txtPuertas").hidden;
    }

    public agregarVehiculo():void{    
        let validEntry:boolean = true;    
        if(this.checkValue(this.txtMarca, false) && this.checkValue(this.txtModelo, false) && this.checkValue(this.txtPrecio, true))
        {
            if(this.getTipo() == "auto")
            {
                validEntry = this.checkValue(this.txtPuertas, true);
            }
            if(validEntry)
            {
                //Campo ID
                let curVehiculo:Vehiculo = new Vehiculo(0, "", "", 0);
                let id:number = 0;
                let marca:string;
                let modelo:string;
                let precio:number;
                if(this.listaVehiculos.length != 0)
                {
                    curVehiculo = this.listaVehiculos.reduce((acc, cur)=>
                    {
                        if(cur.id > acc.id)
                        {
                            acc = cur;
                        }
                        return acc;
                    }, new Vehiculo(0, "", "", 0));
                    id = curVehiculo.id + 1;
                }
                
                marca = this.txtMarca.value;
                modelo = this.txtModelo.value;
                precio = parseInt(this.txtPrecio.value);

                this.addRow(id.toString(), marca, modelo, precio.toString());

                if(this.getTipo() == "auto")
                {
                    let auto:Auto = new Auto(id, marca, modelo, precio, parseInt(this.txtPuertas.value))
                    this.listaVehiculos.push(auto);
                }else{
                    let camioneta:Camioneta = new Camioneta(id, marca, modelo, precio, this.cb4.checked);
                    this.listaVehiculos.push(camioneta);
                }

                this.mostrarAlta();
                this.limpiarInputs();
            }
        }
    }

    public addRow(id:string, marca:string, modelo:string, precio:string):void{
        let row:HTMLTableRowElement = this.table.insertRow();

        let cell:HTMLTableCellElement = row.insertCell();
        cell.innerText = id;
        cell = row.insertCell();
        cell.innerText = marca;
        cell = row.insertCell();
        cell.innerText = modelo;
        cell = row.insertCell();
        cell.innerText = precio;
        cell = row.insertCell();
        let btnDelete:HTMLInputElement = <HTMLInputElement>document.createElement("button");
        btnDelete.addEventListener("click", ()=>{
            this.eliminarRow(row);
        });
        btnDelete.classList.add("button", "btnBad");
        btnDelete.innerText = "Eliminar";
        cell.appendChild(btnDelete);
    }

    public checkValue(element:HTMLInputElement, checkNum:boolean):boolean{
        if(element.value == "" || (checkNum && isNaN(parseInt(element.value))))
        {
            element.className = "inputError";
            return false;
        }else{
            return true;
        }
    }

    public eliminarRow(row:HTMLTableRowElement)
    {
        let index:number = row.rowIndex - 1;
        this.listaVehiculos.splice(index, 1);
        this.table.deleteRow(index);
    }

    public clearTable():void{
        //Loops the entire HTML table and clears it
        this.listaVehiculos.forEach(()=>{
            try{
                this.table.deleteRow(0); //If it returns an error, there're no more entries to delete
            }catch(err){

            }
        });
    }

    public getTipo():string
    {
        return this.selTipo.value;
    }

    public calcularPromedio():void{
        let txtPromedio:HTMLInputElement = <HTMLInputElement>this.$("txtPromedio");
        let accVehiculo:Vehiculo = this.listaVehiculos.reduce((acc, cur)=>{
            acc.precio = acc.precio + cur.precio;
            return acc;
        }, new Vehiculo(0, "", "", 0));

        let promedio:number = accVehiculo.precio / this.listaVehiculos.length;
        if(isNaN(promedio))
        {
            txtPromedio.value = "";
        }else{
            txtPromedio.value = promedio.toString();
        }
    }

    public filtrarVehiculos():void{
        let selFiltrar:HTMLSelectElement = <HTMLSelectElement>this.$("selFiltrar");
        let vehiculosFiltrados:Vehiculo[];
        if(selFiltrar.value == "auto")
        {
            vehiculosFiltrados = this.listaVehiculos.filter((item)=>{
                return this.isAuto(item);
            });
        }else if(selFiltrar.value == "camioneta"){
            vehiculosFiltrados = this.listaVehiculos.filter((item)=>{
                return !this.isAuto(item);
            });
        }else{
            vehiculosFiltrados = this.listaVehiculos;
        }
        this.clearTable();
        vehiculosFiltrados.forEach((item)=>{
            this.addRow(item.id.toString(), item.marca, item.modelo, item.precio.toString());
        });
    }

    public limpiarInputs():void{
        this.txtMarca.value = "";
        this.txtModelo.value = "";
        this.txtPrecio.value = "";
        this.txtPuertas.value = "";
        this.txtMarca.className = "textBox";
        this.txtModelo.className = "textBox";
        this.txtPrecio.className = "textBox";
        this.txtPuertas.className = "textBox";
    }

    isAuto(vehiculo: Auto | Camioneta | Vehiculo): vehiculo is Auto {
        return (<Auto>vehiculo).cantidadPuertas !== undefined;
    }
}

window.addEventListener("load", onLoad);
var app:App;

function onLoad():void{
    app = new App();
    app.$("btnAlta").addEventListener("click", cambiarAlta);
    app.$("btnCerrar").addEventListener("click", cambiarAlta);
    app.$("btnClose").addEventListener("click", cambiarAlta);
    app.$("selTipo").addEventListener("change", ()=>{
        app.cambiarTipo();
    });
    app.$("btnAgregar").addEventListener("click", ()=>{
        app.agregarVehiculo();
    });
    app.$("btnPromedio").addEventListener("click", ()=>{
        app.calcularPromedio();
    })
    app.$("selFiltrar").addEventListener("change", ()=>{
        app.filtrarVehiculos();
    });
}

function cambiarAlta():void{
    app.mostrarAlta();
}
