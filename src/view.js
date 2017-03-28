var inputs_map = {},
    variables = {},
    system = 'sys1';

$(document).ready(() => {
    let inputs_keys = ['input_x',
            'input_count',
            'input_y',
            'input_z',
            'input_sigma',
            'input_rho',
            'input_beta',
            'input_t',
            'input_h',
            'input_iterations',
            'input_iterations_start',
            'input_planeXY',
        ],
        systems_keys = ['sys1', 'sys2', 'sys3'],
        methods_keys = [
            'phasePortrait',
            'sLHP',
            'LHPSpectre',
            'projectionXY',
            'projectionXZ',
            'projectionYZ',
            'planeXY',
        ],
        methods_map = {
            'phasePortrait': true
        },
        plotElement;
    let button = $('#' + 'build');
    inputs_keys.map((el) => {
        inputs_map[el] = $('#' + el);
    });

    // inputs
    for (let key in inputs_map) {
        variables[key] = eval(inputs_map[key].val());
        inputs_map[key]
            .on('change paste keyup',
                debounce(1000, function(e) {
                    variables[key] = eval(inputs_map[key].val());
                    if (key === 'input_count') {
                        inputs_map['input_h'].val((variables['input_iterations'] - variables['input_iterations_start']) / variables[key]);
                        variables['input_h'] = eval(inputs_map['input_h'].val());
                    }
                    if (key === 'input_h') {
                        inputs_map['input_count'].val((variables['input_iterations'] - variables['input_iterations_start']) / variables['input_h']);
                        variables['input_count'] = eval(inputs_map['input_count'].val());
                    }
                    /*let tmp = onUpdateData();
                    plotElement.update(tmp);*/
                })
            );
    }


    // methods
    methods_keys.map((el) => {
        $('#' + el).on('click',
            debounce(1000, function(e) {
                methods_map[this.value] = this.checked;
                /*let tmp = onUpdateData();
                $('#' + el + '_result').text(tmp[el] && tmp[el].result)
                plotElement.update(tmp);*/
            })
        );
    })

    systems_keys.map((el) => {
        $('#' + el).on('click',
            debounce(100, function(e) {
                system = this.id;
                /*let tmp = onUpdateData();
                $('#' + el + '_result').text(tmp[el] && tmp[el].result)
                plotElement.update(tmp);*/
                if (system === 'sys2') {
                    $('#input_sigma_label').text('a');
                    $('#input_rho_label').text('b');
                    $('#input_beta_label').text('c');

                    /*$('#input_sigma').val(0.2);
                    $('#input_rho').val(0.2);
                    $('#input_beta').val(14);
                    $('#input_x').val(1);
                    $('#input_y').val(1);
                    $('#input_z').val(1);
                    $('#input_h').val(0.5);*/
                }
                if (system === 'sys1') {
                    $('#input_sigma_label').text('Sigma');
                    $('#input_rho_label').text('r');
                    $('#input_beta_label').text('b');

                    /*$('#input_sigma').val(10);
                    $('#input_rho').val(28);
                    $('#input_beta').val('8/3');
                    $('#input_x').val(1);
                    $('#input_y').val(0);
                    $('#input_z').val(0);
                    $('#input_h').val(0.01);*/
                }

                for (let key in inputs_map) {
                    variables[key] = eval(inputs_map[key].val());
                }
                console.log(variables)
            })
        );
    })

    button.on('click', () => {
        plot(onUpdateData()).then((el) => plotElement = el);
    });

    function onUpdateData() {
        let res = {};
        for (let m in methods_map) {
            if (methods_map[m]) {
                res[m] = methods[m](variables[m])
                console.log(methods[m])
            }
        }
        console.log(res)
        return res;
    }

    function debounce(wait, func, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };


});
