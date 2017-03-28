class RungeKutta4 {
    constructor(_sigma = 10, _rho = 28, _beta = (2)) {
        this._sigma = _sigma;
        this._rho = _rho;
        this._beta = _beta;

        this.calculateIComponent = (x, y) => {
            calculateIComponent['x:' + x + 'y' + y + 's' + this._sigma] =
                calculateIComponent['x:' + x + 'y' + y + 's' + this._sigma] || ((-this._sigma * x) + (this._sigma * y));
            return calculateIComponent['x:' + x + 'y' + y + 's' + this._sigma];
        }

        this.calculateJComponent = (x, y, z) => {
            calculateJComponent['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho] =
                calculateJComponent['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho] || ((this._rho * x) - y - (x * z));
            return calculateJComponent['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho];
        }

        this.calculateKComponent = (x, y, z) => {
            calculateKComponent['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta] =
                calculateKComponent['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta] || ((x * y) - (this._beta * z))
            return calculateKComponent['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta];
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
        Object.assign(this, { X1, Y1, Z1, h });
        for (let n = _iterations_start; n < _iterations; n++) {
            let tmp = this.method();
            if (isNaN(tmp.x) || isNaN(tmp.y) || isNaN(tmp.z)) { 
                return arr;
            }
            arr.push(tmp);
            //console.log(Math.abs(x_prev - tmp.x), Math.abs(y_prev - tmp.y), Math.abs(z_prev - tmp.z), this.h)

           /* if (arr.length > 2) {
                let v = arr[arr.length - 1],
                    pv = arr[arr.length - 2],
                    ppv = arr[arr.length - 3];

                if (Math.abs(v.x - pv.x) + Math.abs(v.y - pv.y) + Math.abs(v.z - pv.z) > Math.abs(pv.x - ppv.x) + Math.abs(pv.y - ppv.y) + Math.abs(pv.z - ppv.z)) {
                    this.h = this.h / (4/3);
                } else if (Math.abs(v.x - pv.x) + Math.abs(v.y - pv.y) + Math.abs(v.z - pv.z) < Math.abs(pv.x - ppv.x) + Math.abs(pv.y - ppv.y) + Math.abs(pv.z - ppv.z)) {
                    this.h = this.h * (4/3);
                }
            }*/
        }
        return arr; //.slice(_iterations_start);
    }

    setMethod(method) {
        this.method = method.bind(this) || this.method;
    }
}


/*var lol = new RungeKutta4(10, 24, -(8/3));
console.log(lol);

console.log(lol.calculate(-8, 8, 27, 0.1, 0.1, 2500, 0))*/
