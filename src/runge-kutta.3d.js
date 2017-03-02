class RungeKutta4 {
    constructor(_sigma = 10, _rho = 28, _beta = (2)) {
        this._sigma = _sigma;
        this._rho = _rho;
        this._beta = _beta;

        this.calculateIComponent = (x, y) => {
            this.calculateIComponent['x:' + x + 'y' + y + 's' + this._sigma] = 
                this.calculateIComponent['x:' + x + 'y' + y + 's' + this._sigma] || ((-this._sigma * x) + (this._sigma * y));
            return this.calculateIComponent['x:' + x + 'y' + y + 's' + this._sigma];
        }

        this.calculateJComponent = (x, y, z) => {
            this.calculateJComponent['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho] = 
                this.calculateJComponent['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho] || ((this._rho * x) - y - (x * z));
            return this.calculateJComponent['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho];
        }

        this.calculateKComponent = (x, y, z) => {
            this.calculateKComponent['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta] = 
                this.calculateKComponent['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta] || ((x * y) - (this._beta * z))
            return this.calculateKComponent['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta];
        }
    }

    setIComponent(func) {
        this.calculateIComponent = func.bind(this) || this.calculateIComponent;
    }

    setJComponent(func) {
        this.calculateJComponent = func.bind(this) || this.calculateJComponent;
    }

    setKComponent(func) {
        this.calculateKComponent = func.bind(this) || this.calculateKComponent;
    }

    calculate(X1 = 20, Y1 = 20, Z1 = 20, T1 = 0.1, h = 0.1, _iterations = 2500, _iterations_start = 0) {
        let arr = [];
        Object.assign(this, { X1, Y1, Z1 });
        for (let n = _iterations_start; n < _iterations; n++) {

            let
                I1 = 0,
                I2 = 0,
                I3 = 0,
                I4 = 0,
                J1 = 0,
                J2 = 0,
                J3 = 0,
                J4 = 0,
                K1 = 0,
                K2 = 0,
                K3 = 0,
                K4 = 0;
            //приближение 1-го порядка
            I1 = this.calculateIComponent(X1, Y1);
            J1 = this.calculateJComponent(X1, Y1, Z1);
            K1 = this.calculateKComponent(X1, Y1, Z1);

            //приближение 2-го порядка
            I2 = this.calculateIComponent(X1 + (h / 2) * I1, Y1 + (h / 2) * J1);
            J2 = this.calculateJComponent(X1 + (h / 2) *
                I1, Y1 + (h / 2) * J1, Z1 + (h / 2) * K1);
            K2 = this.calculateKComponent(X1 + (h / 2) *
                I1, Y1 + (h / 2) * J1, Z1 + (h / 2) * K1);

            //приближение 3-го порядка
            I3 = this.calculateIComponent(X1 + (h / 2) * I2, Y1 + (h / 2) * J2);
            J3 = this.calculateJComponent(X1 + (h / 2) *
                I2, Y1 + (h / 2) * J2, Z1 + (h / 2) * K1);
            K3 = this.calculateKComponent(X1 + (h / 2) *
                I2, X1 + (h / 2) * J2, Z1 + (h / 2) * K1);

            //приближение 4-го порядка
            I4 = this.calculateIComponent(X1 + (h / 2) * I3, Y1 + (h / 2) * J3);
            J4 = this.calculateJComponent(X1 + (h / 2) *
                I3, Y1 + (h / 2) * J3, Z1 + (h / 2) * K1);
            K4 = this.calculateKComponent(X1 + (h / 2) *
                I3, X1 + (h / 2) * J3, Z1 + (h / 2) * K1);

            //Расширение ряда Тейлора в 3-х размерностях
            X1 = X1 + (h / 6) * (I1 + 2 * I2 + 2 * I3 + I4);
            Y1 = Y1 + (h / 6) * (J1 + 2 * J2 + 2 * J3 + J4);
            Z1 = Z1 + (h / 6) * (K1 + 2 * K2 + 2 * K3 + J4);
            arr.push({ x: X1, y: Y1, z: Z1 });
        }
        return arr; //.slice(_iterations_start);
    }
}


/*var lol = new RungeKutta4(10, 24, -(8/3));
console.log(lol);

console.log(lol.calculate(-8, 8, 27, 0.1, 0.1, 2500, 0))*/