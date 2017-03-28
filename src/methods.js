var systemsMap = {
    sys1: {
        m: lorents,
        calculateIComponent: calculateIComponentLorents,
        calculateJComponent: calculateJComponentLorents,
        calculateKComponent: calculateKComponentLorents,
        calculateIComponentLHP: calculateIComponentLorentsLHP,
        calculateJComponentLHP: calculateJComponentLorentsLHP,
        calculateKComponentLHP: calculateKComponentLorentsLHP,
    },
    sys2: {
        m: rossler,
        calculateIComponent: calculateIComponentRossler,
        calculateJComponent: calculateJComponentRossler,
        calculateKComponent: calculateKComponentRossler,
        calculateIComponentLHP: calculateIComponentRosslerLHP,
        calculateJComponentLHP: calculateJComponentRosslerLHP,
        calculateKComponentLHP: calculateKComponentRosslerLHP,
    },
    sys3: {
        m: pendulum,
        calculateIComponent: calculateIComponentPendulum,
        calculateJComponent: calculateJComponentPendulum,
        calculateKComponent: calculateKComponentPendulum,
        calculateIComponentLHP: calculateIComponentPendulumLHP,
        calculateJComponentLHP: calculateJComponentPendulumLHP,
        calculateKComponentLHP: calculateKComponentPendulumLHP,
    }
}
var methods = {
    phasePortrait: phasePortrait,
    sLHP: () => {
        let prev = [],
            arr = [{
                x: variables['input_x'],
                y: variables['input_y'],
                z: variables['input_z'],
            }],
            arr2 = [{
                x: 1,
                y: 0,
                z: 0
            }];
        let rkdef = new RungeKutta4(variables['input_sigma'], variables['input_rho'], variables['input_beta']),
            rksfz = new RungeKutta4(variables['input_sigma'], variables['input_rho'], variables['input_beta']);

        rkdef.setIComponent(systemsMap[system].calculateIComponent);
        rkdef.setJComponent(systemsMap[system].calculateJComponent);
        rkdef.setKComponent(systemsMap[system].calculateKComponent);
        rkdef.setMethod(systemsMap[system].m);

        rksfz.setIComponent(systemsMap[system].calculateIComponentLHP);
        rksfz.setJComponent(systemsMap[system].calculateJComponentLHP);
        rksfz.setKComponent(systemsMap[system].calculateKComponentLHP);
        rksfz.setMethod(systemsMap[system].m);


        arr = arr.concat(rkdef.calculate(
            arr[arr.length - 1].x,
            arr[arr.length - 1].y,
            arr[arr.length - 1].z,
            variables['input_t'],
            variables['input_h'],
            1,
            0));

        for (let i = variables['input_iterations_start']; i < variables['input_iterations']; i++) {
            arr = arr.concat(rkdef.calculate(
                arr[arr.length - 1].x,
                arr[arr.length - 1].y,
                arr[arr.length - 1].z,
                variables['input_t'],
                variables['input_h'],
                i + 1,
                i));

            rksfz.X11 = arr[arr.length - 1].x;
            rksfz.Y11 = arr[arr.length - 1].y;
            rksfz.Z11 = arr[arr.length - 1].z;

            arr2 = arr2.concat(rksfz.calculate(
                arr2[arr2.length - 1].x,
                arr2[arr2.length - 1].y,
                arr2[arr2.length - 1].z,
                variables['input_t'],
                variables['input_h'],
                i + 1,
                i));

            let sl = slhp(arr2);

            let n = xNorma(arr2[arr2.length - 1]);
            arr2[arr2.length - 1].x /= n;
            arr2[arr2.length - 1].y /= n;
            arr2[arr2.length - 1].z /= n;


            if (prev.length > 5 && prev.slice(prev.length - 6).filter((el) => el.toFixed(3) === sl.toFixed(3)).length === 5) {
                break;
            }
            prev.push(sl);
        }
        arr2.result = prev;
        return arr2;
    },
    LHPSpectre: () => {
        let arr1 = [{
                x: 1,
                y: 0,
                z: 0
            }],
            arr2 = [{
                x: 0,
                y: 1,
                z: 0
            }],
            arr3 = [{
                x: 0,
                y: 0,
                z: 1
            }],
            result = [];
        let rkdef = new RungeKutta4(variables['input_sigma'], variables['input_rho'], variables['input_beta']),
            rksfz = new RungeKutta4(variables['input_sigma'], variables['input_rho'], variables['input_beta']);

        rksfz.setIComponent(systemsMap[system].calculateIComponent);

        rksfz.setJComponent(systemsMap[system].calculateJComponent);

        rksfz.setKComponent(systemsMap[system].calculateKComponent);
        rksfz.setMethod(systemsMap[system].m);
        for (let i = variables['input_iterations_start']; i < variables['input_iterations']; i++) {
            arr1 = arr1.concat(rksfz.calculate(
                arr1[arr1.length - 1].x,
                arr1[arr1.length - 1].y,
                arr1[arr1.length - 1].z,
                variables['input_t'],
                variables['input_h'],
                i + 1,
                i));

            arr2 = arr2.concat(rksfz.calculate(
                arr2[arr2.length - 1].x,
                arr2[arr2.length - 1].y,
                arr2[arr2.length - 1].z,
                variables['input_t'],
                variables['input_h'],
                i + 1,
                i));

            arr3 = arr3.concat(rksfz.calculate(
                arr3[arr3.length - 1].x,
                arr3[arr3.length - 1].y,
                arr3[arr3.length - 1].z,
                variables['input_t'],
                variables['input_h'],
                i + 1,
                i));


            let n1 = xNorma(arr1[arr1.length - 1]);
            arr1[arr1.length - 1].x /= n1;
            arr1[arr1.length - 1].y /= n1;
            arr1[arr1.length - 1].z /= n1;


            arr2[arr2.length - 1] = yCalc(arr1[arr1.length - 1], arr2[arr2.length - 1]);
            let n2 = xNorma(arr2[arr2.length - 1]);
            arr2[arr2.length - 1].x /= n2;
            arr2[arr2.length - 1].y /= n2;
            arr2[arr2.length - 1].z /= n2;


            arr3[arr3.length - 1] = yCalc(arr1[arr1.length - 1], arr2[arr2.length - 1], arr1[arr1.length - 1]);
            let n3 = xNorma(arr2[arr2.length - 1]);
            arr3[arr3.length - 1].x /= n3;
            arr3[arr3.length - 1].y /= n3;
            arr3[arr3.length - 1].z /= n3;

            result.push({
                x: slhp(arr1),
                y: slhp(arr2),
                z: slhp(arr3),
            });
        }

        /*let res = {
            arr1,
            arr2, 
            arr3,
            result: [sum1, sum2, sum3]
        }*/
        return result;
    },
    projectionXY: () => {
        return phasePortrait().map((el) => {
            return {
                x: el.x,
                y: el.y,
                z: 0
            }
        })
    },
    projectionXZ: () => {
        return phasePortrait().map((el) => {
            return {
                x: el.x,
                y: 0,
                z: el.z
            }
        })
    },
    projectionYZ: () => {
        return phasePortrait().map((el) => {
            return {
                x: 0,
                y: el.y,
                z: el.z
            }
        })
    },

    planeXY: (z) => {
        let res = phasePortrait().reduce((prev, next) => {
            console.log((next.z + variables['input_h']) >= variables['input_planeXY'].toFixed(2), (next.z - variables['input_h']) <= variables['input_planeXY'].toFixed(2));

            if ((next.z + variables['input_h'] * 20) >= variables['input_planeXY'].toFixed(2) && (next.z - variables['input_h'] * 20) <= variables['input_planeXY'].toFixed(2)) {
                next.z = variables['input_planeXY'];
                next.c = 'rgb(0, 0, 0)';
                next.s = 5;
                prev.push(next);
            }
            return prev;
        }, []);
        res.plane = variables['input_planeXY'];
        return res;
    },

}





function xNorma(obj) {
    return Math.sqrt(obj.x * obj.x + obj.y * obj.y + obj.z * obj.z);
}

function yCalc(obj1, obj2) {
    return {
        x: obj2.x - scalarSum(obj1, obj2) * obj1.x,
        y: obj2.y - scalarSum(obj1, obj2) * obj1.y,
        z: obj2.z - scalarSum(obj1, obj2) * obj1.z
    };
}

function zCalc(obj1, obj2, obj3) {
    return {
        x: obj3.x - scalarSum(obj3, obj1) * obj1.x - scalarSum(obj3, obj2) * obj2.x,
        y: obj3.y - scalarSum(obj3, obj1) * obj1.y - scalarSum(obj3, obj2) * obj2.y,
        z: obj3.z - scalarSum(obj3, obj1) * obj1.z - scalarSum(obj3, obj2) * obj2.z
    };
}

function scalarSum(obj1, obj2) {
    return obj1.x * obj2.x + obj1.y * obj2.y + obj1.z * obj2.z
}

function hz(arr) {
    let res = 0;
    for (let i = 1; i < arr.length; i++) {
        res += Math.log(xNorma(arr[i]));
    }
    return res;
}

function slhp(arr) {
    return (1 / ( /*variables['input_count']*/ arr.length * variables['input_t'])) * hz(arr);
}


function phasePortrait() {
    rksfz = new RungeKutta4(variables['input_sigma'], variables['input_rho'], variables['input_beta'])

    rksfz.c = 1;
    rksfz.D = 4;
    rksfz.E = 9;
    rksfz.F = 2;

    rksfz.setIComponent(systemsMap[system].calculateIComponent);
    rksfz.setJComponent(systemsMap[system].calculateJComponent);
    rksfz.setKComponent(systemsMap[system].calculateKComponent);
    rksfz.setMethod(systemsMap[system].m);

    return rksfz.calculate(
        variables['input_x'],
        variables['input_y'],
        variables['input_z'],
        variables['input_t'],
        variables['input_h'],
        variables['input_iterations'],
        variables['input_iterations_start']);
}

//Lorents
function calculateIComponentLorents(x, y) {
    calculateIComponentLorents['x:' + x + 'y:' + y + 's:' + this._sigma] =
        calculateIComponentLorents['x:' + x + 'y:' + y + 's:' + this._sigma] || ((-this._sigma * x) + (this._sigma * y));
    return calculateIComponentLorents['x:' + x + 'y:' + y + 's:' + this._sigma];
}

function calculateJComponentLorents(x, y, z) {
    calculateJComponentLorents['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho] =
        calculateJComponentLorents['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho] || ((this._rho * x) - y - (x * z));
    return calculateJComponentLorents['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho];
}

function calculateKComponentLorents(x, y, z) {
    calculateKComponentLorents['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta] =
        calculateKComponentLorents['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta] || ((x * y) - (this._beta * z))
    return calculateKComponentLorents['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta];
}


function calculateIComponentLorentsLHP(x, y) {
    calculateIComponentLorentsLHP['x:' + x + 'y' + y + 's' + this._sigma] =
        calculateIComponentLorentsLHP['x:' + x + 'y' + y + 's' + this._sigma] || this._sigma * (y - x)
    return calculateIComponentLorentsLHP['x:' + x + 'y' + y + 's' + this._sigma];
}

function calculateJComponentLorentsLHP(x, y, z) {
    calculateJComponentLorentsLHP['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho + 'z1' + this.Z11 + 'x1' + this.X11] =
        calculateJComponentLorentsLHP['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho + 'z1' + this.Z11 + 'x1' + this.X11] || (this._rho - this.Z11) * x - y - this.X11 * z;
    return calculateJComponentLorentsLHP['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho + 'z1' + this.Z11 + 'x1' + this.X11];
}

function calculateKComponentLorentsLHP(x, y, z) {
    calculateKComponentLorentsLHP['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta + 'x1' + this.X11 + 'y1' + this.Y11] =
        calculateKComponentLorentsLHP['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta + 'x1' + this.X11 + 'y1' + this.Y11] || this.Y11 * x + this.X11 * y - this._beta * z
    return calculateKComponentLorentsLHP['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta + 'x1' + this.X11 + 'y1' + this.Y11];
}



//Rossler
function calculateIComponentRossler(y, z) {
    calculateIComponentRossler['y:' + y + 'z' + z] =
        calculateIComponentRossler['y:' + y + 'z' + z] || -y - z
    return calculateIComponentRossler['y:' + y + 'z' + z];
}

function calculateJComponentRossler(x, y) {
    calculateJComponentRossler['x:' + x + 'y' + y + 's' + this._sigma] =
        calculateJComponentRossler['x:' + x + 'y' + y + 's' + this._sigma] || x + this._sigma * y;
    return calculateJComponentRossler['x:' + x + 'y' + y + 's' + this._sigma];
}

function calculateKComponentRossler(x, z) {
    calculateKComponentRossler['x:' + x + 'z' + z + 'r' + this._rho + 'b' + this._beta] =
        calculateKComponentRossler['x:' + x + 'z' + z + 'r' + this._rho + 'b' + this._beta] || this._rho + z * (x - this._beta)
    return calculateKComponentRossler['x:' + x + 'z' + z + 'r' + this._rho + 'b' + this._beta];
}


function calculateIComponentRosslerLHP(y, z) {
    calculateIComponentRosslerLHP['y:' + y + 'z' + z] =
        calculateIComponentRosslerLHP['y:' + y + 'z' + z] || -y - z
    return calculateIComponentRosslerLHP['y:' + y + 'z' + z];
}

function calculateJComponentRosslerLHP(x, y) {
    calculateJComponentRosslerLHP['x:' + x + 'y' + y + 's' + this._sigma] =
        calculateJComponentRosslerLHP['x:' + x + 'y' + y + 's' + this._sigma] || x + this._sigma * y;
    return calculateJComponentRosslerLHP['x:' + x + 'y' + y + 's' + this._sigma];
}

function calculateKComponentRosslerLHP(x, z) {
    calculateKComponentRosslerLHP['x:' + x + 'z' + z + 'z1' + this.Z11 + 'b' + this._beta + 'x1' + this.X11] =
        calculateKComponentRosslerLHP['x:' + x + 'z' + z + 'z1' + this.Z11 + 'b' + this._beta + 'x1' + this.X11] || x * this.Z11 + z * (-this._beta + this.X11)
    return calculateKComponentRosslerLHP['x:' + x + 'z' + z + 'z1' + this.Z11 + 'b' + this._beta + 'x1' + this.X11];
}


//Pendulum
function calculateIComponentPendulum(x, y, z) {
    return this.c * x - y * z - (1 / 8) * (x * x * y + y * y * y);
}

function calculateJComponentPendulum(x, y, z) {
    return this.c * y + x * z + (1 / 8) * (x * x * x + x * y * y) + 1;
}

function calculateKComponentPendulum(x, y, z) {
    return this.D * y + this.E * z + this.F;
}


function calculateIComponentPendulumLHP(y, z) {
    calculateIComponentPendulumLHP['y:' + y + 'z' + z] =
        calculateIComponentPendulumLHP['y:' + y + 'z' + z] || -y - z
    return calculateIComponentPendulumLHP['y:' + y + 'z' + z];
}

function calculateJComponentPendulumLHP(x, y) {
    calculateJComponentPendulumLHP['x:' + x + 'y' + y + 's' + this._sigma] =
        calculateJComponentPendulumLHP['x:' + x + 'y' + y + 's' + this._sigma] || x + this._sigma * y;
    return calculateJComponentPendulumLHP['x:' + x + 'y' + y + 's' + this._sigma];
}

function calculateKComponentPendulumLHP(x, z) {
    calculateKComponentPendulumLHP['x:' + x + 'z' + z + 'z1' + this.Z11 + 'b' + this._beta + 'x1' + this.X11] =
        calculateKComponentPendulumLHP['x:' + x + 'z' + z + 'z1' + this.Z11 + 'b' + this._beta + 'x1' + this.X11] || x * this.Z11 + z * (-this._beta + this.X11)
    return calculateKComponentPendulumLHP['x:' + x + 'z' + z + 'z1' + this.Z11 + 'b' + this._beta + 'x1' + this.X11];
}






function pendulum() {
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
    I1 = this.calculateIComponent(this.X1, this.Y1, this.Z1);
    J1 = this.calculateJComponent(this.X1, this.Y1, this.Z1);
    K1 = this.calculateKComponent(this.X1, this.Y1, this.Z1);

    //приближение 2-го порядка
    I2 = this.calculateIComponent(this.X1 + (this.h / 2) * I1, this.Y1 + (this.h / 2) * J1, this.Z1 + (this.h / 2) * K1);
    J2 = this.calculateJComponent(this.X1 + (this.h / 2) * I1, this.Y1 + (this.h / 2) * J1, this.Z1 + (this.h / 2) * K1);
    K2 = this.calculateKComponent(this.X1 + (this.h / 2) * I1, this.Y1 + (this.h / 2) * J1, this.Z1 + (this.h / 2) * K1);

    //приближение 3-го порядка
    I3 = this.calculateIComponent(this.X1 + (this.h / 2) * I2, this.Y1 + (this.h / 2) * J2, this.Z1 + (this.h / 2) * K2);
    J3 = this.calculateJComponent(this.X1 + (this.h / 2) * I2, this.Y1 + (this.h / 2) * J2, this.Z1 + (this.h / 2) * K2);
    K3 = this.calculateKComponent(this.X1 + (this.h / 2) * I2, this.X1 + (this.h / 2) * J2, this.Z1 + (this.h / 2) * K2);

    //приближение 4-го порядка
    I4 = this.calculateIComponent(this.X1 + (this.h / 2) * I3, this.Y1 + (this.h / 2) * J3, this.Z1 + (this.h / 2) * K3);
    J4 = this.calculateJComponent(this.X1 + (this.h / 2) * I3, this.Y1 + (this.h / 2) * J3, this.Z1 + (this.h / 2) * K3);
    K4 = this.calculateKComponent(this.X1 + (this.h / 2) * I3, this.X1 + (this.h / 2) * J3, this.Z1 + (this.h / 2) * K3);

    //Расширение ряда Тейлора в 3-х размерностях
    this.X1 = this.X1 + (this.h / 6) * (I1 + 2 * I2 + 2 * I3 + I4);
    this.Y1 = this.Y1 + (this.h / 6) * (J1 + 2 * J2 + 2 * J3 + J4);
    this.Z1 = this.Z1 + (this.h / 6) * (K1 + 2 * K2 + 2 * K3 + K4);

    return { x: this.X1, y: this.Y1, z: this.Z1 };
}

function lorents() {
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
    I1 = this.calculateIComponent(this.X1, this.Y1, this.Z1);
    J1 = this.calculateJComponent(this.X1, this.Y1, this.Z1);
    K1 = this.calculateKComponent(this.X1, this.Y1, this.Z1);

    //приближение 2-го порядка
    I2 = this.calculateIComponent(this.X1 + (this.h / 2) * I1, this.Y1 + (this.h / 2) * J1, this.Z1 + (this.h / 2) * K1);
    J2 = this.calculateJComponent(this.X1 + (this.h / 2) * I1, this.Y1 + (this.h / 2) * J1, this.Z1 + (this.h / 2) * K1);
    K2 = this.calculateKComponent(this.X1 + (this.h / 2) * I1, this.Y1 + (this.h / 2) * J1, this.Z1 + (this.h / 2) * K1);

    //приближение 3-го порядка
    I3 = this.calculateIComponent(this.X1 + (this.h / 2) * I2, this.Y1 + (this.h / 2) * J2, this.Z1 + (this.h / 2) * K2);
    J3 = this.calculateJComponent(this.X1 + (this.h / 2) * I2, this.Y1 + (this.h / 2) * J2, this.Z1 + (this.h / 2) * K2);
    K3 = this.calculateKComponent(this.X1 + (this.h / 2) * I2, this.X1 + (this.h / 2) * J2, this.Z1 + (this.h / 2) * K2);

    //приближение 4-го порядка
    I4 = this.calculateIComponent(this.X1 + (this.h / 2) * I3, this.Y1 + (this.h / 2) * J3, this.Z1 + (this.h / 2) * K3);
    J4 = this.calculateJComponent(this.X1 + (this.h / 2) * I3, this.Y1 + (this.h / 2) * J3, this.Z1 + (this.h / 2) * K3);
    K4 = this.calculateKComponent(this.X1 + (this.h / 2) * I3, this.X1 + (this.h / 2) * J3, this.Z1 + (this.h / 2) * K3);

    //Расширение ряда Тейлора в 3-х размерностях
    this.X1 = this.X1 + (this.h / 6) * (I1 + 2 * I2 + 2 * I3 + I4);
    this.Y1 = this.Y1 + (this.h / 6) * (J1 + 2 * J2 + 2 * J3 + J4);
    this.Z1 = this.Z1 + (this.h / 6) * (K1 + 2 * K2 + 2 * K3 + K4);

    return { x: this.X1, y: this.Y1, z: this.Z1 };
}

function rossler() {
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
    I1 = this.calculateIComponent(this.Y1, this.Z1);
    J1 = this.calculateJComponent(this.X1, this.Y1);
    K1 = this.calculateKComponent(this.X1, this.Z1);

    //приближение 2-го порядка
    I2 = this.calculateIComponent(this.Y1 + (this.h / 2) * J1, this.Z1 + (this.h / 2) * K1);
    J2 = this.calculateJComponent(this.X1 + (this.h / 2) * I1, this.Y1 + (this.h / 2) * J1);
    K2 = this.calculateKComponent(this.X1 + (this.h / 2) * I1, this.Z1 + (this.h / 2) * K1);

    //приближение 3-го порядка
    I3 = this.calculateIComponent(this.Y1 + (this.h / 2) * J2, this.Z1 + (this.h / 2) * K2);
    J3 = this.calculateJComponent(this.X1 + (this.h / 2) * I2, this.Y1 + (this.h / 2) * J2);
    K3 = this.calculateKComponent(this.X1 + (this.h / 2) * I2, this.Z1 + (this.h / 2) * K2);

    //приближение 4-го порядка
    I4 = this.calculateIComponent(this.Y1 + (this.h / 2) * J3, this.Z1 + (this.h / 2) * K3);
    J4 = this.calculateJComponent(this.X1 + (this.h / 2) * I3, this.Y1 + (this.h / 2) * J3);
    K4 = this.calculateKComponent(this.X1 + (this.h / 2) * I3, this.Z1 + (this.h / 2) * K3);

    //Расширение ряда Тейлора в 3-х размерностях
    this.X1 = this.X1 + (this.h / 6) * (I1 + 2 * I2 + 2 * I3 + I4);
    this.Y1 = this.Y1 + (this.h / 6) * (J1 + 2 * J2 + 2 * J3 + J4);
    this.Z1 = this.Z1 + (this.h / 6) * (K1 + 2 * K2 + 2 * K3 + K4);

    return { x: this.X1, y: this.Y1, z: this.Z1 };
}
