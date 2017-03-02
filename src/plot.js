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
            data.push({
                name: v + ' dots',
                type: 'scatter3d',
                mode: 'markers',
                x: values[v].map((el) => el.x),
                y: values[v].map((el) => el.y),
                z: values[v].map((el) => el.z),
                opacity: 1,
                marker: {
                    color: 'rgb(0, 0, 0)',
                    size: 1
                }
            });
        }
        return data;
    }
});
