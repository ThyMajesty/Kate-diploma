///PLOT

Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-line1.csv', function (err, rows) {
    function unpack(rows, key) {
        return rows.map(function (row) {
            return row[key];
        });
    }
    /*var x = unpack(rows, 'x');
    var y = unpack(rows, 'y');
    var z = unpack(rows, 'z');*/

    var x = [];
    var y = [];
    var z = [];
    var c = unpack(rows, 'color');



    var tmp = rk4DS(1, 2.5, 0.03, [0, 0, 0], funcs);
    var blya = calc(20, 20, 20, 0.1, 0.2, 2500);

    x = blya.map((el)=> el.x);
    y = blya.map((el)=> el.y);
    z = blya.map((el)=> el.z);
    //console.log(x,y,z);

    /*var x = tmp.map(function (el) {
            return el.x;
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
        }, []);*/
    console.log('x :',x,'y :',y,'z :',z);


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