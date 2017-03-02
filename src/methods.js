var methods = {
    phasePortrait: phasePortrait,
    sLHP: () => {
        let vertex = {
                x: 1,
                y: 0,
                z: 0
            },
            prev = Number.MIN_SAFE_INTEGER,
            /*arr = [{
                x: variables['input_x'],
                y: variables['input_y'],
                z: variables['input_z'],
            }];*/
            arr = [vertex];
        let rkdef = new RungeKutta4(variables['input_sigma'], variables['input_rho'], variables['input_beta']),
            rksfz = new RungeKutta4(variables['input_sigma'], variables['input_rho'], variables['input_beta']);

        rksfz.setIComponent(calculateIComponent);

        rksfz.setJComponent(calculateJComponent);

        rksfz.setKComponent(calculateKComponent);

        for (let i = variables['input_iterations_start']; i < variables['input_iterations']; i++) {
            arr = arr.concat(rksfz.calculate(
                arr[arr.length - 1].x,
                arr[arr.length - 1].y,
                arr[arr.length - 1].z,
                variables['input_t'],
                variables['input_h'],
                i + 1,
                i));

            let n = xNorma(arr[arr.length - 1]);
            arr[arr.length - 1].x /= n;
            arr[arr.length - 1].y /= n;
            arr[arr.length - 1].z /= n;


            let sl = slhp(arr);
            console.log(sl)
            if (prev.toFixed(7) === sl.toFixed(7) && prev != 0 && sl != 0) {
                console.log(prev.toFixed(7) === sl.toFixed(7));
                break;
            }
            prev = sl !== 0 ? Math.max(prev, sl) : prev;
        }
        arr.result = prev;
        return arr;
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

        rksfz.setIComponent(calculateIComponent);
        rksfz.setJComponent(calculateJComponent);
        rksfz.setKComponent(calculateKComponent);

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
    return (1 / (variables['input_count'] * variables['input_iterations'])) * hz(arr);
}


function phasePortrait() {
    return (new RungeKutta4(variables['input_sigma'], variables['input_rho'], variables['input_beta']))
        .calculate(
            variables['input_x'],
            variables['input_y'],
            variables['input_z'],
            variables['input_t'],
            variables['input_h'],
            variables['input_iterations'],
            variables['input_iterations_start']);
}


function calculateIComponent(x, y) {
    calculateIComponent['x:' + x + 'y' + y + 's' + this._sigma] =
        calculateIComponent['x:' + x + 'y' + y + 's' + this._sigma] || this._sigma * (y - x)
    return calculateIComponent['x:' + x + 'y' + y + 's' + this._sigma];
}

function calculateJComponent(x, y, z) {
    calculateJComponent['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho + 'z1' + this.Z1 + 'x1' + this.X1] = 
        calculateJComponent['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho + 'z1' + this.Z1 + 'x1' + this.X1] || (this._rho - this.Z1) * x - y - this.X1 * z;
    return calculateJComponent['x:' + x + 'y' + y + 'z' + z + 'r' + this._rho + 'z1' + this.Z1 + 'x1' + this.X1];
}

function calculateKComponent(x, y, z) {
    calculateKComponent['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta + 'x1' + this.X1 + 'y1' + this.Y1] = 
        calculateKComponent['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta + 'x1' + this.X1 + 'y1' + this.Y1] || this.Y1 * x + this.X1 * y - this._beta * z
    return calculateKComponent['x:' + x + 'y' + y + 'z' + z + 'b' + this._beta + 'x1' + this.X1 + 'y1' + this.Y1];
}
