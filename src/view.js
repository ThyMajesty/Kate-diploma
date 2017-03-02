var inputs_map = {},
    variables = {};

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
            'input_iterations_start'
        ],
        methods_keys = [
            'phasePortrait',
            'sLHP',
            'LHPSpectre'
        ],
        methods_map = {
            'phasePortrait': true
        },
        plotElement;

    inputs_keys.map((el) => {
        inputs_map[el] = $('#' + el);
    });

    // inputs
    for (let key in inputs_map) {
        variables[key] = eval(inputs_map[key].val());
        inputs_map[key]
            .on('change paste keyup', () => {
                variables[key] = eval(inputs_map[key].val());
                if (key === 'input_count') {
                    inputs_map['input_h'].val((variables['input_iterations'] - variables['input_iterations_start']) / variables[key]);
                    variables['input_h'] = eval(inputs_map['input_h'].val());
                }
                if (key === 'input_h') {
                    inputs_map['input_count'].val((variables['input_iterations'] - variables['input_iterations_start']) / variables['input_h']);
                    variables['input_count'] = eval(inputs_map['input_count'].val());
                }

                plotElement.update(onUpdateData());
            });
    }


    // methods
    methods_keys.map((el) => {
        $('#' + el).on('click', function () {
            methods_map[this.value] = this.checked;
            plotElement.update(onUpdateData());
        });
    })

    plot(onUpdateData()).then((el) => plotElement = el);

    function onUpdateData() {
        let res = {};
        for(let m in methods_map) {
            if(methods_map[m]){
                res[m] = methods[m]()
            }
        }
        console.log(res)
        return res;
    }
});
