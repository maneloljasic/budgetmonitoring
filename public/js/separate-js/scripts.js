let selectedDate = '';
let selectedDateFrom = '';
let selectedDateTo = '';
let selectedRangeDate = '';
let selectedRangeDate_1 = '';
let selectedRangeDate_2 = '';
let selectedRangeDepartment = '';
let selectedRangeDepartment1 = '';
$(document).ready(function() {


    /*
    |--------------------------------------------------------------------------
    | Select2 Search
    |--------------------------------------------------------------------------
    */

    const filtersMonthSelect = document.getElementById('filtersMonthSelect');
    filtersMonthSelect.addEventListener('change', function() {
        //console.log('Month select activated');
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                month: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersYearSelect = document.getElementById('filtersYearSelect');
    filtersYearSelect.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                year: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
/*
                $('#mainContainer_1').empty(); // Clear the previous content
                if (data.data && data.data.length > 0) {
                    var table = $('<table>').addClass('table');
                    var thead = $('<thead>');

                    reportName_ = $('.actionList__item--selected').data('report');
                    // Special case for Report Type 2:
                    if (reportName_ == 'Report_2') {
 
                        var headerRow = $('<tr>');
                        headerRow.append($('<th>').text(''));
                        headerRow.append($('<th>').text(''));
                        var th1 = $('<th>');
                        th1.text('Активы Фонда на ОСМС');
                        th1.attr('colspan',4);
                        th1.attr('bgColor','grey');
                        headerRow.append(th1);
                        
                        var th2 = $('<th>');
                        th2.text('Республиканский (БП 067, ПП 100) село');
                        th2.attr('colspan',4);
                        th2.attr('bgColor','grey');
                        headerRow.append(th2);

                        var th3 = $('<th>');
                        th3.text('ГОБМП Нац.фонд');
                        th3.attr('colspan',4);
                        th3.attr('bgColor','grey');
                        headerRow.append(th3);

                        thead.append(headerRow);
                        table.append(thead);
                    }
                    
                    var headerRow = $('<tr>');
                    Object.keys(data.data[0]).forEach(function(key) {
                        headerRow.append($('<th>').text(key));
                    });
                    thead.append(headerRow);
                    table.append(thead);

                    var tbody = $('<tbody>');
                    data.data.forEach(function(row) {
                        var tr = $('<tr>');
                        Object.values(row).forEach(function(value) {
                            tr.append($('<td>').text(value));
                        });
                        tbody.append(tr);
                    });
                    table.append(tbody);
                    $('#mainContainer_1').append(table);
                } else {
                    $('#mainContainer_1').text('No data available for the selected report.');
                }
*/
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersDoctorsSelect = document.getElementById('filtersDoctorsSelect');
    filtersDoctorsSelect.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                //month: selectedDate,
                //year: this.value,
                doctor: this.value,
                //department: department
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
       
                /*
                $('#mainContainer_1').empty(); // Clear the previous content
                if (data.data && data.data.length > 0) {
                    var table = $('<table>').addClass('table');
                    var thead = $('<thead>');

                    reportName_ = $('.actionList__item--selected').data('report');
                    // Special case for Report Type 2:
                    if (reportName_ == 'Report_2') {
 
                        var headerRow = $('<tr>');
                        headerRow.append($('<th>').text(''));
                        headerRow.append($('<th>').text(''));
                        var th1 = $('<th>');
                        th1.text('Активы Фонда на ОСМС');
                        th1.attr('colspan',4);
                        th1.attr('bgColor','grey');
                        headerRow.append(th1);
                        
                        var th2 = $('<th>');
                        th2.text('Республиканский (БП 067, ПП 100) село');
                        th2.attr('colspan',4);
                        th2.attr('bgColor','grey');
                        headerRow.append(th2);

                        var th3 = $('<th>');
                        th3.text('ГОБМП Нац.фонд');
                        th3.attr('colspan',4);
                        th3.attr('bgColor','grey');
                        headerRow.append(th3);

                        thead.append(headerRow);
                        table.append(thead);
                    }

                    if (reportName_ == 'Report_5') {
 
                        var headerRow = $('<tr>');
                        headerRow.append($('<th>').text(''));
                        headerRow.append($('<th>').text(''));
                        headerRow.append($('<th>').text(''));
                        headerRow.append($('<th>').text(''));
                        var th1 = $('<th>');
                        th1.text('дети 6-10 мес.');
                        th1.attr('colspan',3);
                        th1.attr('bgColor','grey');
                        headerRow.append(th1);
                        
                        var th2 = $('<th>');
                        th2.text('дети 2-4 года');
                        th2.attr('colspan',3);
                        th2.attr('bgColor','grey');
                        headerRow.append(th2);

                        var th3 = $('<th>');
                        th3.text('наверстывающий от 5 лет');
                        th3.attr('colspan',3);
                        th3.attr('bgColor','grey');
                        headerRow.append(th3);

                        var th4 = $('<th>');
                        th4.text('медработники');
                        th4.attr('colspan',3);
                        th4.attr('bgColor','grey');
                        headerRow.append(th4);

                        var th5 = $('<th>');
                        th5.text('выполнение всего');
                        th5.attr('colspan',2);
                        th5.attr('bgColor','grey');
                        headerRow.append(th5);

                        thead.append(headerRow);
                        table.append(thead);
                    }
                    
                    var headerRow = $('<tr>');
                    Object.keys(data.data[0]).forEach(function(key) {
                        headerRow.append($('<th>').text(key));
                    });
                    thead.append(headerRow);
                    table.append(thead);


                    if(reportName_ == 'Report_5'){
                        var headerRow = $('<tr>');
                        headerRow.append($('<th>').text(''));
                        headerRow.append($('<th>').text(''));
                        var th1 = $('<th>');
                        th1.text('Итого по ЕМЦРБ');
                        th1.attr('bgColor','#E5E4E3');
                        headerRow.append(th1);

                        //var headerRow = $('<tr>');
                        Object.values(data.header_data).forEach(function(key) {
                            headerRow.append($('<th>').text(key));
                        });
                        thead.append(headerRow);
                        table.append(thead);
                    }

                    var tbody = $('<tbody>');
                    data.data.forEach(function(row) {
                        var tr = $('<tr>');
                        Object.values(row).forEach(function(value) {
                            tr.append($('<td>').text(value));
                        });
                        tbody.append(tr);
                    });
                    table.append(tbody);
                    $('#mainContainer_1').append(table);
                } else {
                    $('#mainContainer_1').text('No data available for the selected report.');
                }
                */

            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersName_1_Select = document.getElementById('filtersName_1_Select');
    filtersName_1_Select.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_7',
                kzg_name: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersName_2_Select = document.getElementById('filtersName_2_Select');
    filtersName_2_Select.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                kzg_code: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersName_3_Select = document.getElementById('filtersName_3_Select');
    filtersName_3_Select.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                diagnosis_name: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersName_4_Select = document.getElementById('filtersName_4_Select');
    filtersName_4_Select.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_7',
                diagnosis_code: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersName_5_Select = document.getElementById('filtersName_5_Select');
    filtersName_5_Select.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_8',
                service_name: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersCSZNameSelect = document.getElementById('filtersCSZNameSelect');
    filtersCSZNameSelect.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                medicine_department_name: this.value
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersDistrictNameSelect = document.getElementById('filtersDistrictNameSelect');
    filtersDistrictNameSelect.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                district_number: this.value
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersCategoryNameSelect = document.getElementById('filtersCategoryNameSelect');
    filtersCategoryNameSelect.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                category: this.value
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersDepartmentSelect = document.getElementById('filtersDepartmentSelect');
    filtersDepartmentSelect.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                department: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersDepartmentSelectAjax = document.getElementById('filtersDepartmentSelectAjax');


 // Beggining SELECT2
/*
 $('#filtersDepartmentSelectAjax1').select2({
    placeholder: "Choose departments",
    multiple: true,
    ajax: {
        url: '/reports/getReportsDepList',
        type: 'GET',
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term, // search term
                page: params.page || 1,
                report: $('.actionList__item--selected').data('report') || 'Report_1' // Include report parameter
            };
        },
        processResults: function (data, params) {
            params.page = params.page || 1;
            return {
                results: data.data.map(item => ({
                    id: item.extract_department,
                    text: item.extract_department
                })),
                pagination: {
                    more: (params.page * 30) < data.total_count
                }
            };
        },
        cache: true
    }
});
*/
function initializeDepartment1Select() {
    $('[data-department2-select="true"]').each(function() {
        var $this = $(this); // Текущий элемент

        // Убеждаемся, что Select2 еще не инициализирован
        if (!$this.data('select2')) {
            // Оборачиваем каждый select своим div'ом для dropdownParent
            var wrapper = $('<div class="select2-wrapper"></div>').insertBefore($this);
            $this.appendTo(wrapper);

            $this.select2({
                placeholder: $this.data('placeholder') || 'Select an option',
                dropdownAutoWidth: true,
                dropdownParent: wrapper,
                width: '100%',
                tags: $this.data('tags') || false,
                allowClear: $this.data('allow-clear') || false,
                ajax: {
                    url: '/reports/getReportsDepList',
                    type: 'GET',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term, // search term
                            page: params.page || 1,
                            report: $('.actionList__item--selected').data('report') || 'Report_1' // Include report parameter
                        };
                    },
                    processResults: function (data, params) {
                        params.page = params.page || 1;
                        return {
                            results: data.data.map(item => ({
                                id: item.extract_department,
                                text: item.extract_department
                            })),
                            pagination: {
                                more: (params.page * 30) < data.total_count
                            }
                        };
                    },
                    cache: true
                }
            });
        }
    });
}

initializeDepartment1Select();

// Handle change event to collect selected options
$('#filtersDepartmentSelectAjax1').on('change', function() {
    const selectedOptions = $(this).val();
    selectedRangeDepartment = selectedOptions ? selectedOptions.join(',') : '';
    //console.log('selectedRangeDepartment:', selectedRangeDepartment);

    // Trigger AJAX call to fetch report data
    $.ajax({
        url: '/reports/fetchReportData',
        type: 'GET',
        data: { 
            report: $('.actionList__item--selected').data('report') || 'Report_1',
            department: selectedRangeDepartment,
        },
        success: function(data) {
            if (!document.getElementById('switch-toggle').checked) {
                updateTable(data, $('.actionList__item--selected').data('report'));
            } else {
                updateChart(data);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching report data:', error);
            $('#mainContainer_1').text('Failed to load data.');
        }
    });
});


 // Beggining SELECT2
/*
 $('#filtersDepartmentSelectAjax2').select2({
    placeholder: "Choose departments",
    multiple: true,
    ajax: {
        url: '/reports/getReportsDepList',
        type: 'GET',
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term, // search term
                page: params.page || 1,
                report: $('.actionList__item--selected').data('report') || 'Report_1' // Include report parameter
            };
        },
        processResults: function (data, params) {
            params.page = params.page || 1;
            return {
                results: data.data.map(item => ({
                    id: item.service_name,
                    text: item.service_name
                })),
                pagination: {
                    more: (params.page * 30) < data.total_count
                }
            };
        },
        cache: true
    }
});*/

// Handle change event to collect selected options
$('#filtersDepartmentSelectAjax2').on('change', function() {
    const selectedOptions = $(this).val();
    selectedRangeDepartment1 = selectedOptions ? selectedOptions.join(',') : '';
    //console.log('selectedRangeDepartment:', selectedRangeDepartment1);

    // Trigger AJAX call to fetch report data
    $.ajax({
        url: '/reports/fetchReportData',
        type: 'GET',
        data: { 
            report: $('.actionList__item--selected').data('report') || 'Report_1',
            service_name: selectedRangeDepartment1,
        },
        success: function(data) {
            if (!document.getElementById('switch-toggle').checked) {
                updateTable(data, $('.actionList__item--selected').data('report'));
            } else {
                updateChart(data);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching report data:', error);
            $('#mainContainer_1').text('Failed to load data.');
        }
    });
});

    /*
    $('#filtersDepartmentSelectAjax').select2({
        placeholder: "Choose departments"
    });

    $('#filtersDepartmentSelectAjax').on('change', function() {
        const selectedOptions = $(this).val();
        console.log('selectedRangeDepartment:', selectedRangeDepartment);
        //selectedRangeDepartment = '';

        
        selectedOptions.forEach(item => {
            selectedRangeDepartment += item + ',';
        });
        console.log('selectedRangeDepartment1:', selectedRangeDepartment);
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                department: selectedRangeDepartment,//this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });
*/
/*
    filtersDepartmentSelectAjax.addEventListener('input', function() {
        console.log('department: ' + this.value);
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                department: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });
*/
    const filtersDepartmentNameSelect = document.getElementById('filtersDepartmentNameSelect');
    filtersDepartmentNameSelect.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                department_name: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    const filtersProfileSelect = document.getElementById('filtersProfileSelect');
    filtersProfileSelect.addEventListener('input', function() {
        $.ajax({
            url: '/reports/fetchReportData',
            type: 'GET',
            data: { 
                report: $('.actionList__item--selected').data('report') || 'Report_1',
                profile: this.value,
            },
            success: function(data) {
                if(!document.getElementById('switch-toggle').checked)
                    updateTable(data, $('.actionList__item--selected').data('report'));
                else
                    updateChart(data);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching report data:', error);
                $('#mainContainer_1').text('Failed to load data.');
            }
        });
    });

    // Функция для инициализации Select2
    function initializeYearsSelect() {
        $('[data-years-select="true"]').each(function() {
            var $this = $(this); // Текущий элемент

            // Убеждаемся, что Select2 еще не инициализирован
            if (!$this.data('select2')) {
                // Оборачиваем каждый select своим div'ом для dropdownParent
                var wrapper = $('<div class="select2-wrapper"></div>').insertBefore($this);
                $this.appendTo(wrapper);

                $this.select2({
                    placeholder: $this.data('placeholder') || 'Select an option',
                    dropdownAutoWidth: true,
                    dropdownParent: wrapper,
                    width: '100%',
                    allowClear: true,

                    ajax: {
                        url: 'reports/fetchReportData',
                        type: "GET",
                        dataType: "json",
                        data: function (params) {
                          var query = {
                            report: $('.actionList__item--selected').data('report') || 'Report_1',
                            year: params.term
                          }
                    
                          // Query parameters will be ?search=[term]&type=public
                          return query;
                        },
                        processResults: function (data) {
                            if (chartInstance) { // Check if a chart instance exists
                                chartInstance.destroy(); // Destroy the existing chart instance
                            }
                            $('#chartCanvas').empty();
                            $('#mainContainer_1').empty(); // Clear the previous content
                            if (data.data && data.data.length > 0) {
                                var table = $('<table>').addClass('table');
                                var thead = $('<thead>');

                                reportName_ = $('.actionList__item--selected').data('report');
                                // Special case for Report Type 2:
                                if (reportName_ == 'Report_2') {
             
                                    var headerRow = $('<tr>');
                                    headerRow.append($('<th>').text(''));
                                    headerRow.append($('<th>').text(''));
                                    var th1 = $('<th>');
                                    th1.text('Активы Фонда на ОСМС');
                                    th1.attr('colspan',4);
                                    th1.attr('bgColor','grey');
                                    headerRow.append(th1);
                                    
                                    var th2 = $('<th>');
                                    th2.text('Республиканский (БП 067, ПП 100) село');
                                    th2.attr('colspan',4);
                                    th2.attr('bgColor','grey');
                                    headerRow.append(th2);

                                    var th3 = $('<th>');
                                    th3.text('ГОБМП Нац.фонд');
                                    th3.attr('colspan',4);
                                    th3.attr('bgColor','grey');
                                    headerRow.append(th3);

                                    thead.append(headerRow);
                                    table.append(thead);
                                }
                                var headerRow = $('<tr>');
                                Object.keys(data.data[0]).forEach(function(key) {
                                    //console.log('key: ' + key)
                                    headerRow.append($('<th>').text(key));
                                });
                                thead.append(headerRow);
                                table.append(thead);
        
                                var tbody = $('<tbody>');
                                data.data.forEach(function(row) {
                                    var tr = $('<tr>');
                                    Object.values(row).forEach(function(value) {
                                        tr.append($('<td>').text(value));
                                    });
                                    tbody.append(tr);
                                });
                                table.append(tbody);
                                $('#mainContainer_1').append(table);
                            } else {
                                $('#mainContainer_1').text('1/ No data available for the selected report.');
                            }
                            //console.log('data.data[0]: ' + data.data[0]);
                            // Transforms the top-level key of the response object from 'items' to 'results'
                            return {
                              results: data.data[0]
                            };
                       }
                    }


                });
            }
        });
    }

    //initializeYearsSelect();

    function initializeDoctorsSelect() {
        $('[data-doctors-select="true"]').each(function() {
            var $this = $(this); // Текущий элемент

            // Убеждаемся, что Select2 еще не инициализирован
            if (!$this.data('select2')) {
                // Оборачиваем каждый select своим div'ом для dropdownParent
                var wrapper = $('<div class="select2-wrapper"></div>').insertBefore($this);
                $this.appendTo(wrapper);

                $this.select2({
                    placeholder: $this.data('placeholder') || 'Select an option',
                    dropdownAutoWidth: true,
                    dropdownParent: wrapper,
                    width: '100%',
                    allowClear: true,
                    ajax: {
                        url: 'reports/fetchReportData',
                        type: "GET",
                        dataType: "json",
                        data: function (params) {
                          var query = {
                            report: $('.actionList__item--selected').data('report') || 'Report_1',
                            doctor: params.term
                          }
                    
                          // Query parameters will be ?search=[term]&type=public
                          return query;
                        },
                        processResults: function (data) {
                            //console.log(data[0])
                            if (chartInstance) { // Check if a chart instance exists
                                chartInstance.destroy(); // Destroy the existing chart instance
                            }
                            $('#chartCanvas').empty();
                            $('#mainContainer_1').empty(); // Clear the previous content
                            if (data.data && data.data.length > 0) {
                                var table = $('<table>').addClass('table');
                                var thead = $('<thead>');

                                reportName_ = $('.actionList__item--selected').data('report');
                                // Special case for Report Type 2:
                                if (reportName_ == 'Report_2') {
             
                                    var headerRow = $('<tr>');
                                    headerRow.append($('<th>').text(''));
                                    headerRow.append($('<th>').text(''));
                                    var th1 = $('<th>');
                                    th1.text('Активы Фонда на ОСМС');
                                    th1.attr('colspan',4);
                                    th1.attr('bgColor','grey');
                                    headerRow.append(th1);
                                    
                                    var th2 = $('<th>');
                                    th2.text('Республиканский (БП 067, ПП 100) село');
                                    th2.attr('colspan',4);
                                    th2.attr('bgColor','grey');
                                    headerRow.append(th2);

                                    var th3 = $('<th>');
                                    th3.text('ГОБМП Нац.фонд');
                                    th3.attr('colspan',4);
                                    th3.attr('bgColor','grey');
                                    headerRow.append(th3);

                                    thead.append(headerRow);
                                    table.append(thead);
                                }

                                var headerRow = $('<tr>');
                                Object.keys(data.data[0]).forEach(function(key) {
                                    headerRow.append($('<th>').text(key));
                                });
                                thead.append(headerRow);
                                table.append(thead);
        
                                var tbody = $('<tbody>');
                                data.data.forEach(function(row) {
                                    var tr = $('<tr>');
                                    Object.values(row).forEach(function(value) {
                                        tr.append($('<td>').text(value));
                                    });
                                    tbody.append(tr);
                                });
                                table.append(tbody);
                                $('#mainContainer_1').append(table);
                            } else {
                                $('#mainContainer_1').text('No data available for the selected report.');
                            }
                            // Transforms the top-level key of the response object from 'items' to 'results'
                            return {
                              results: data
                            };
                       }
                    }
                });
            }
        });
        
    }

    //initializeDoctorsSelect();

    function initializeDepartmentSelect() {
        $('[data-department1-select="true"]').each(function() {
            var $this = $(this); // Текущий элемент

            // Убеждаемся, что Select2 еще не инициализирован
            if (!$this.data('select2')) {
                // Оборачиваем каждый select своим div'ом для dropdownParent
                var wrapper = $('<div class="select2-wrapper"></div>').insertBefore($this);
                $this.appendTo(wrapper);

                $this.select2({
                    placeholder: $this.data('placeholder') || 'Select an option',
                    dropdownAutoWidth: true,
                    dropdownParent: wrapper,
                    width: '100%',
                    tags: $this.data('tags') || false,
                    allowClear: $this.data('allow-clear') || false,
                    ajax: {
                        url: '/reports/getReportsDepList',
                        type: 'GET',
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                q: params.term, // search term
                                page: params.page || 1,
                                report: $('.actionList__item--selected').data('report') || 'Report_1' // Include report parameter
                            };
                        },
                        processResults: function (data, params) {
                            params.page = params.page || 1;
                            return {
                                results: data.data.map(item => ({
                                    id: item.service_name,
                                    text: item.service_name
                                })),
                                pagination: {
                                    more: (params.page * 30) < data.total_count
                                }
                            };
                        },
                        cache: true
                    }
                });
            }
        });
    }

    initializeDepartmentSelect();

    new AirDatepicker('[data-air-datepicker]', {
        isMobile: true,
        autoClose: true,
        //view: 'days',
        minView: 'days',
        dateFormat: 'M',
        onRenderCell: function ({date, cellType}) {
            if (cellType === 'month' || cellType === 'year') {
                return {
                    disabled: true
                };
            }
        },
        onSelect: function({date, formattedDate, datepicker}) {
            selectedDate = formattedDate;  // Сохраняем выбранную дату в переменную
            //console.log('Selected date:', selectedDate);
            $.ajax({
                url: '/reports/fetchReportData',
                type: 'GET',
                data: { 
                    report: $('.actionList__item--selected').data('report') || 'Report_1',
                    month: selectedDate,
                },
                success: function(data) {
                    if(!document.getElementById('switch-toggle').checked)
                        updateTable(data, $('.actionList__item--selected').data('report'));
                    else
                        updateChart(data);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching report data:', error);
                    $('#mainContainer_1').text('Failed to load data.');
                }
            });
        }
    });

    // Data picker 01
    new AirDatepicker('[data-air-datepicker01]', {
        isMobile: true,
        autoClose: true,
        view: 'days',
        minView: 'days',
        dateFormat: 'yyyy-MM-dd',
        onRenderCell: function ({date, cellType}) {
           /*
            if (cellType === 'month' || cellType === 'year') {
                return {
                    disabled: true
                };
            }
            */
        },
        onSelect: function({date, formattedDate, datepicker}) {
            selectedDateFrom = formattedDate;  // Сохраняем выбранную дату в переменную
            //console.log('Selected date:', selectedDateFrom);
            $.ajax({
                url: '/reports/fetchReportData',
                type: 'GET',
                data: { 
                    report: $('.actionList__item--selected').data('report') || 'Report_3',
                    dateFrom: selectedDateFrom,
                    dateTo: selectedDateTo != '' ? selectedDateTo : ''
                },
                success: function(data) {
                    if(!document.getElementById('switch-toggle').checked)
                        updateTable(data, $('.actionList__item--selected').data('report'));
                    else
                        updateChart(data);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching report data:', error);
                    $('#mainContainer_1').text('Failed to load data.');
                }
            });
        }
    });

    // Data picker 02
    new AirDatepicker('[data-air-datepicker02]', {
        isMobile: true,
        autoClose: true,
        view: 'days',
        minView: 'days',
        dateFormat: 'yyyy-MM-dd',
        onRenderCell: function ({date, cellType}) {
            if (cellType === 'month' || cellType === 'year') {
                return {
                    disabled: true
                };
            }
        },
        onSelect: function({date, formattedDate, datepicker}) {
            selectedDateTo = formattedDate;  // Сохраняем выбранную дату в переменную
            //console.log('Selected date:', selectedDateTo);
            $.ajax({
                url: '/reports/fetchReportData',
                type: 'GET',
                data: { 
                    report: $('.actionList__item--selected').data('report') || 'Report_3',
                    dateFrom: selectedDateFrom != '' ? selectedDateFrom : '',
                    dateTo: selectedDateTo != '' ? selectedDateTo : ''
                },
                success: function(data) {
                    if(!document.getElementById('switch-toggle').checked)
                        updateTable(data, $('.actionList__item--selected').data('report'));
                    else
                        updateChart(data);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching report data:', error);
                    $('#mainContainer_1').text('Failed to load data.');
                }
            });
        }
    });

    // Data picker 04
    new AirDatepicker('[data-air-datepicker04]', {
        isMobile: true,
        autoClose: true,
        view: 'days',
        minView: 'days',
        dateFormat: 'yyyy-MM-dd',
        range: true,
        multipleDatesSeparator: ' - ',
        onRenderCell: function ({date, cellType}) {
            /*
            if (cellType === 'month' || cellType === 'year') {
                return {
                    disabled: true
                };
            }*/
        },
        onSelect: function({date, formattedDate, datepicker}) {
            selectedRangeDate = formattedDate;  // Сохраняем выбранную дату в переменную
            //console.log('____Selected Range date:', selectedRangeDate);
            if(selectedRangeDate.length != 0){
                //console.log('selectedRangeDate not empty: ');
                if(selectedRangeDate.length == 1){
                    selectedRangeDate = selectedRangeDate[0];
                    //console.log('From date: ' + selectedRangeDate[0]);
                }else{
                    selectedRangeDate = selectedRangeDate[0] + ' - ' + selectedRangeDate[1];
                }
                //console.log('SCRIPT.JS: selectedRangeDate: ' + selectedRangeDate);
            }
            $.ajax({
                url: '/reports/fetchReportData',
                type: 'GET',
                data: { 
                    report: $('.actionList__item--selected').data('report') || 'Report_6',
                    selectedRangeDate: selectedRangeDate
                },
                success: function(data) {
                    if(!document.getElementById('switch-toggle').checked)
                        updateTable(data, $('.actionList__item--selected').data('report'));
                    else
                        updateChart(data);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching report data:', error);
                    $('#mainContainer_1').text('Failed to load data.');
                }
            });
        }
    });

    // Data picker 05
    new AirDatepicker('[data-air-datepicker05]', {
        isMobile: true,
        autoClose: true,
        view: 'days',
        minView: 'days',
        dateFormat: 'yyyy-MM-dd',
        range: true,
        multipleDatesSeparator: ' - ',
        onRenderCell: function ({date, cellType}) {
            /*
            if (cellType === 'month' || cellType === 'year') {
                return {
                    disabled: true
                };
            }*/
        },
        onSelect: function({date, formattedDate, datepicker}) {
            selectedRangeDate_1 = formattedDate;  // Сохраняем выбранную дату в переменную
            //console.log('____Selected Range date:', selectedRangeDate);
            if(selectedRangeDate_1.length != 0){
                //console.log('selectedRangeDate not empty: ');
                if(selectedRangeDate_1.length == 1){
                    selectedRangeDate_1 = selectedRangeDate_1[0];
                    //console.log('From date: ' + selectedRangeDate[0]);
                }else{
                    selectedRangeDate_1 = selectedRangeDate_1[0] + ' - ' + selectedRangeDate_1[1];
                }
                //console.log('SCRIPT.JS: selectedRangeDate: ' + selectedRangeDate);
            }
            $.ajax({
                url: '/reports/fetchReportData',
                type: 'GET',
                data: { 
                    report: $('.actionList__item--selected').data('report') || 'Report_6',
                    selectedRangeDate_1: selectedRangeDate_1
                },
                success: function(data) {
                    if(!document.getElementById('switch-toggle').checked)
                        updateTable(data, $('.actionList__item--selected').data('report'));
                    else
                        updateChart(data);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching report data:', error);
                    $('#mainContainer_1').text('Failed to load data.');
                }
            });
        }
    });

    // Data picker 06
    new AirDatepicker('[data-air-datepicker06]', {
        isMobile: true,
        autoClose: true,
        view: 'days',
        minView: 'days',
        dateFormat: 'yyyy-MM-dd',
        range: true,
        multipleDatesSeparator: ' - ',
        onRenderCell: function ({date, cellType}) {
            /*
            if (cellType === 'month' || cellType === 'year') {
                return {
                    disabled: true
                };
            }*/
        },
        onSelect: function({date, formattedDate, datepicker}) {
            selectedRangeDate_2 = formattedDate;  // Сохраняем выбранную дату в переменную
            //console.log('____Selected Range date:', selectedRangeDate);
            if(selectedRangeDate_2.length != 0){
                //console.log('selectedRangeDate not empty: ');
                if(selectedRangeDate_2.length == 1){
                    selectedRangeDate_2 = selectedRangeDate_2[0];
                    //console.log('From date: ' + selectedRangeDate[0]);
                }else{
                    selectedRangeDate_2 = selectedRangeDate_2[0] + ' - ' + selectedRangeDate_2[1];
                }
                //console.log('SCRIPT.JS: selectedRangeDate: ' + selectedRangeDate);
            }
            $.ajax({
                url: '/reports/fetchReportData',
                type: 'GET',
                data: { 
                    report: $('.actionList__item--selected').data('report') || 'Report_6',
                    selectedRangeDate_2: selectedRangeDate_2
                },
                success: function(data) {
                    if(!document.getElementById('switch-toggle').checked)
                        updateTable(data, $('.actionList__item--selected').data('report'));
                    else
                        updateChart(data);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching report data:', error);
                    $('#mainContainer_1').text('Failed to load data.');
                }
            });
        }
    });

});


