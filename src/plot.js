var
    plot = null;
$(document).ready(() => {
    plot = function plot(values) {
        let data = buildTracesFromValues(values);
        return Plotly.plot('myDiv', data, {
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            },
             //hovermode: 'closest',
            height: 780
        }).then(el => {
            el.update = function(values) {
                if (this) {
                    this.data = buildTracesFromValues(values);
                    Plotly.redraw(this);
                }
            }
            return el;
        });
    }

    function buildTracesFromValues(values) {
        let data = [];
        for (v in values) {
            data.push({
                name: v + ' lines',
                type: 'scatter3d',
                mode: 'lines',
                x: values[v].map((el) => el.x),
                y: values[v].map((el) => el.y),
                z: values[v].map((el) => el.z),
                opacity: 1,
                line: {
                    width: 1,
                    //color: c,
                    reversescale: false
                }
            });
            /*data.push({
                name: v + ' dots',
                type: 'scatter3d',
                mode: 'markers',
                x: values[v].map((el) => el.x),
                y: values[v].map((el) => el.y),
                z: values[v].map((el) => el.z),
                opacity: 2,
                marker: {
                    size: values[v].map((el) => el.s || 3),
                    color: values[v].map((el) => el.c || 'rgb(13, 80, 80)'),
                    color: 'rgb(13, 80, 80)',
                    //size: values[v].map((el) => el.s) || 1
                }
            });*/
            /*if(values[v].plane) {

            }*/
        }
        return data;
    }
});
