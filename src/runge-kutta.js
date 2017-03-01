///RUNGE-KUTTA

function rk4(y, x, dx, f) {
    var k1 = dx * f(x, y),
        k2 = dx * f(x + dx / 2.0, y + k1 / 2.0),
        k3 = dx * f(x + dx / 2.0, y + k2 / 2.0),
        k4 = dx * f(x + dx, y + k3);
    return y + (k1 + 2.0 * k2 + 2.0 * k3 + k4) / 6.0;
}

function rk4DS(x, b, h, arrY, funcs) {
    var results = [],
        pres = arrY.slice(),
        nres = [];
    results.push({
        x: x,
        res: pres.slice()
    });
    while (x < b) {
        funcs.forEach(function(el, i) {
            nres[i] = rk4(pres[i], x, h, el);
        });
        x = (x + h).toFixed(2) - 0;
        results.push({
            x: x,
            res: nres.slice()
        });
        pres = nres.slice();
    }
    return results;
}

function f(x, y) {
    return y / x + x * x;
}






function calc(X1, Y1, Z1, T1, h, _iterations) {
    var arr = [],
        _sigma = 10,
        _rho = 28,
        _beta = 2;


    function CalculateLorenzIComponent(x, y, t) {
        return t * ((-_sigma * x) + (_sigma * y));
    }

    function CalculateLorenzJComponent(x, y, z, t) {
        return t * ((_rho * x) - y - (x * z));
    }

    function CalculateLorenzKComponent(x, y, z, t) {
        return t * ((x * y) - (_beta * z));
    }
    for (var n = 0; n < _iterations; n++) {

        var
            I1 = 0,
            I2 = 0,
            I3 = 0,
            J1 = 0,
            J2 = 0,
            J3 = 0,
            K1 = 0,
            K2 = 0,
            K3 = 0;
        //приближение 1-го порядка
        I1 = CalculateLorenzIComponent(X1, Y1, T1);
        J1 = CalculateLorenzJComponent(X1, Y1, Z1, T1);
        K1 = CalculateLorenzKComponent(X1, Y1, Z1, T1);

        //приближение 2-го порядка
        I2 = CalculateLorenzIComponent(X1 + (h / 2) * I1, Y1 + (h / 2) * J1, T1 + (h / 2));
        J2 = CalculateLorenzJComponent(X1 + (h / 2) *
            I1, Y1 + (h / 2) * J1, Z1 + (h / 2) * K1, T1 + h / 2);
        K2 = CalculateLorenzKComponent(X1 + (h / 2) *
            I1, Y1 + (h / 2) * J1, Z1 + (h / 2) * K1, T1 + (h / 2));

        //приближение 3-го порядка
        I3 = CalculateLorenzIComponent(X1 + (h / 2) * I2, Y1 + (h / 2) * J2, T1 + h / 2);
        J3 = CalculateLorenzJComponent(X1 + (h / 2) *
            I2, Y1 + (h / 2) * J2, Z1 + (h / 2) * K1, T1 + (h / 2));
        K3 = CalculateLorenzKComponent(X1 + (h / 2) *
            I2, X1 + (h / 2) * J2, Z1 + (h / 2) * K1, T1 + (h / 2));

        //приближение 4-го порядка
        I4 = CalculateLorenzIComponent(X1 + (h / 2) * I3, Y1 + (h / 2) * J3, T1 + (h / 2));
        J4 = CalculateLorenzJComponent(X1 + (h / 2) *
            I3, Y1 + (h / 2) * J3, Z1 + (h / 2) * K1, T1 + (h / 2));
        K4 = CalculateLorenzKComponent(X1 + (h / 2) *
            I3, X1 + (h / 2) * J3, Z1 + (h / 2) * K1, T1 + (h / 2));

        //Расширение ряда Тейлора в 3-х размерностях
        var X2 = X1 + (h / 6) * (I1 + 2 * I2 + 2 * I3 + I4);
        var Y2 = Y1 + (h / 6) * (J1 + 2 * J2 + 2 * J3 + J4);
        var Z2 = Z1 + (h / 6) * (K1 + 2 * K2 + 2 * K3 + J4);

        X1 = X2;
        Y1 = Y2;
        Z1 = Z2;
        arr.push({ x: X1, y: Y1, z: Z1 });
    }
    return arr;
}

//X1, Y1, Z1, T1, h, _iterations
console.log(calc(20, 20, 20, 0.1, 0.2, 2500))
