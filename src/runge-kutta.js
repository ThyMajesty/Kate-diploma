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
        funcs.forEach(function (el, i) {
            nres[i] = rk4(pres[i], x, h, el);
        });
        results.push({
            x: x,
            res: nres.slice()
        });
        pres = nres.slice();
        x += h;
    }
    return results;
}

function f(x, y) {
    return y / x + x * x;
}

///PLOT

Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-line1.csv', function (err, rows) {
    function unpack(rows, key) {
        return rows.map(function (row) {
            return row[key];
        });
    }
    var x = unpack(rows, 'x');
    var y = unpack(rows, 'y');
    var z = unpack(rows, 'z');
    var c = unpack(rows, 'color');

    var tmp = rk4DS(1, 2.5, 0.1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [f, f, f, f, f, f, f, f, f, f, f, f]);
    console.log(x,y,z);

    var x = tmp.map(function (el) {
            return Array(el.res.length).fill(el.x);
        }).reduce(function(prev, next) {
        	return prev.concat(next);
        }, []),
    	y = tmp.map(function (el) {
            return el.res;
        }).reduce(function(prev, next) {
        	return prev.concat(next);
        }, []),
        z = tmp.map(function (el) {
            return Array(el.res.length).fill(0);
        }).reduce(function(prev, next) {
        	return prev.concat(next);
        }, []);
    console.log(x,y,z);


    Plotly.plot('myDiv', [{
        type: 'scatter3d',
        mode: 'lines',
        x: x,
        y: y,
        z: z,
        opacity: 1,
        line: {
            width: 6,
            //color: c,
            reversescale: false
        }
    }], {
        height: 640
    });
});