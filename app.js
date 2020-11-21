var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Vehiculo = /** @class */ (function () {
    function Vehiculo(id, marca, modelo, precio) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
    }
    return Vehiculo;
}());
var Auto = /** @class */ (function (_super) {
    __extends(Auto, _super);
    function Auto(id, marca, modelo, precio, cantidadPuertas) {
        var _this = _super.call(this, id, marca, modelo, precio) || this;
        _this.cantidadPuertas = cantidadPuertas;
        return _this;
    }
    Auto.prototype.toVehiculo = function () {
        return new Vehiculo(this.id, this.marca, this.modelo, this.precio);
    };
    return Auto;
}(Vehiculo));
var Camioneta = /** @class */ (function (_super) {
    __extends(Camioneta, _super);
    function Camioneta(id, marca, modelo, precio, cuatroXcuatro) {
        var _this = _super.call(this, id, marca, modelo, precio) || this;
        _this.cuatroXcuatro = cuatroXcuatro;
        _this.tipo = "camioneta";
        return _this;
    }
    Camioneta.prototype.toVehiculo = function () {
        return new Vehiculo(this.id, this.marca, this.modelo, this.precio);
    };
    return Camioneta;
}(Vehiculo));
var App = /** @class */ (function () {
    function App() {
        this.listaVehiculos = [];
        this.table = this.$("tabBodyVehiculos");
        this.txtMarca = this.$("txtMarca");
        this.txtModelo = this.$("txtModelo");
        this.txtPrecio = this.$("txtPrecio");
        this.txtPuertas = this.$("txtPuertas");
        this.cb4 = this.$("cb4");
        this.selTipo = this.$("selTipo");
    }
    App.prototype.$ = function (element) {
        return document.getElementById(element);
    };
    App.prototype.mostrarAlta = function () {
        if (this.$("divContainer").hidden == true) {
            this.$("divContainer").hidden = false;
            this.$("body").classList.add("disabled");
        }
        else {
            this.$("divContainer").hidden = true;
            this.$("body").classList.remove("disabled");
        }
    };
    App.prototype.cambiarTipo = function () {
        this.$("lbl4").hidden = !this.$("lbl4").hidden;
        this.$("cb4").hidden = !this.$("cb4").hidden;
        this.$("lblPuertas").hidden = !this.$("lblPuertas").hidden;
        this.$("txtPuertas").hidden = !this.$("txtPuertas").hidden;
    };
    App.prototype.agregarVehiculo = function () {
        var validEntry = true;
        if (this.checkValue(this.txtMarca, false) && this.checkValue(this.txtModelo, false) && this.checkValue(this.txtPrecio, true)) {
            if (this.getTipo() == "auto") {
                validEntry = this.checkValue(this.txtPuertas, true);
            }
            if (validEntry) {
                //Campo ID
                var curVehiculo = new Vehiculo(0, "", "", 0);
                var id = 0;
                var marca = void 0;
                var modelo = void 0;
                var precio = void 0;
                if (this.listaVehiculos.length != 0) {
                    curVehiculo = this.listaVehiculos.reduce(function (acc, cur) {
                        if (cur.id > acc.id) {
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
                if (this.getTipo() == "auto") {
                    var auto = new Auto(id, marca, modelo, precio, parseInt(this.txtPuertas.value));
                    this.listaVehiculos.push(auto);
                }
                else {
                    var camioneta = new Camioneta(id, marca, modelo, precio, this.cb4.checked);
                    this.listaVehiculos.push(camioneta);
                }
                this.mostrarAlta();
                this.limpiarInputs();
            }
        }
    };
    App.prototype.addRow = function (id, marca, modelo, precio) {
        var _this = this;
        var row = this.table.insertRow();
        var cell = row.insertCell();
        cell.innerText = id;
        cell = row.insertCell();
        cell.innerText = marca;
        cell = row.insertCell();
        cell.innerText = modelo;
        cell = row.insertCell();
        cell.innerText = precio;
        cell = row.insertCell();
        var btnDelete = document.createElement("button");
        btnDelete.addEventListener("click", function () {
            _this.eliminarRow(row);
        });
        btnDelete.classList.add("button", "btnBad");
        btnDelete.innerText = "Eliminar";
        cell.appendChild(btnDelete);
    };
    App.prototype.checkValue = function (element, checkNum) {
        if (element.value == "" || (checkNum && isNaN(parseInt(element.value)))) {
            element.className = "inputError";
            return false;
        }
        else {
            return true;
        }
    };
    App.prototype.eliminarRow = function (row) {
        var index = row.rowIndex - 1;
        this.listaVehiculos.splice(index, 1);
        this.table.deleteRow(index);
    };
    App.prototype.clearTable = function () {
        var _this = this;
        //Loops the entire HTML table and clears it
        this.listaVehiculos.forEach(function () {
            try {
                _this.table.deleteRow(0); //If it returns an error, there're no more entries to delete
            }
            catch (err) {
            }
        });
    };
    App.prototype.getTipo = function () {
        return this.selTipo.value;
    };
    App.prototype.calcularPromedio = function () {
        var txtPromedio = this.$("txtPromedio");
        var accVehiculo = this.listaVehiculos.reduce(function (acc, cur) {
            acc.precio = acc.precio + cur.precio;
            return acc;
        }, new Vehiculo(0, "", "", 0));
        var promedio = accVehiculo.precio / this.listaVehiculos.length;
        if (isNaN(promedio)) {
            txtPromedio.value = "";
        }
        else {
            txtPromedio.value = promedio.toString();
        }
    };
    App.prototype.filtrarVehiculos = function () {
        var _this = this;
        var selFiltrar = this.$("selFiltrar");
        var vehiculosFiltrados;
        if (selFiltrar.value == "auto") {
            vehiculosFiltrados = this.listaVehiculos.filter(function (item) {
                return _this.isAuto(item);
            });
        }
        else if (selFiltrar.value == "camioneta") {
            vehiculosFiltrados = this.listaVehiculos.filter(function (item) {
                return !_this.isAuto(item);
            });
        }
        else {
            vehiculosFiltrados = this.listaVehiculos;
        }
        this.clearTable();
        vehiculosFiltrados.forEach(function (item) {
            _this.addRow(item.id.toString(), item.marca, item.modelo, item.precio.toString());
        });
    };
    App.prototype.limpiarInputs = function () {
        this.txtMarca.value = "";
        this.txtModelo.value = "";
        this.txtPrecio.value = "";
        this.txtPuertas.value = "";
        this.txtMarca.className = "textBox";
        this.txtModelo.className = "textBox";
        this.txtPrecio.className = "textBox";
        this.txtPuertas.className = "textBox";
    };
    App.prototype.isAuto = function (vehiculo) {
        return vehiculo.cantidadPuertas !== undefined;
    };
    return App;
}());
window.addEventListener("load", onLoad);
var app;
function onLoad() {
    app = new App();
    app.$("btnAlta").addEventListener("click", cambiarAlta);
    app.$("btnCerrar").addEventListener("click", cambiarAlta);
    app.$("btnClose").addEventListener("click", cambiarAlta);
    app.$("selTipo").addEventListener("change", function () {
        app.cambiarTipo();
    });
    app.$("btnAgregar").addEventListener("click", function () {
        app.agregarVehiculo();
    });
    app.$("btnPromedio").addEventListener("click", function () {
        app.calcularPromedio();
    });
    app.$("selFiltrar").addEventListener("change", function () {
        app.filtrarVehiculos();
    });
}
function cambiarAlta() {
    app.mostrarAlta();
}
