document.addEventListener('DOMContentLoaded', function() {
    const generateReportButton = document.getElementById('switch-toggle');
    generateReportButton.addEventListener('change', function() {
        const reportNameElement = document.querySelector('.actionList__item--selected');
        if (reportNameElement) {
            const reportName = reportNameElement.getAttribute('data-report');
            const filters = getFilters();
            
            if(!generateReportButton.checked){
                fetch(`/reports/fetchReportData?report=${reportName}${filters}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    updateTable(data, reportName); // Modified to pass reportName for conditional rendering
                    updatePagination(data.currentPage, data.totalPages, reportName); // Update pagination based on response and reportName
                })
                .catch(error => {
                    console.error('Error fetching report data:', error.message, '\n', error.stack);
                });
            }else{
                fetch(`/reports/fetchChartData?report=${reportName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    updateChart(data); // This function will now be implemented to update the chart with the fetched data
                })
                .catch(error => {
                    console.error('Error fetching chart data:', error.message, '\n', error.stack);
                });
            }
            

        } else {
            console.error('No report selected');
        }


    });

    document.getElementById('saveAsExcelButton').addEventListener('click', function() {
        const reportNameElement = document.querySelector('.actionList__item--selected');
        if (reportNameElement) {
            const filters = getFilters();
            //console.log('filters: ' + filters);
            const page = 1;
            const reportName = reportNameElement.getAttribute('data-report');
            //console.log(`Exporting data to Excel for report: ${reportName}`);
            window.location.href = `/reports/exportToExcel?report=${reportName}${filters}&page=${page}`;
        } else {
            console.error('Не выбран тип отчета!');
        }
    });
/*
    function fetchReportData(reportName, page = 1) {
        const filters = getFilters();
        console.log(`Fetching report data for report: ${reportName} with filters`);
        fetch(`/reports/fetchReportData?report=${reportName}${filters}&page=${page}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(`Report data fetched successfully for report: ${reportName}`);
                updateTable(data.data, reportName); // Modified to pass reportName for conditional rendering
                updatePagination(data.currentPage, data.totalPages, reportName); // Update pagination based on response and reportName
            })
            .catch(error => {
                console.error('Error fetching report data:', error.message, '\n', error.stack);
            });
    }
    */
/*
    function getFilters() {
        const month = document.getElementById("filtersDate").value;
        console.log('getFilters(): ', month);
        const year = document.getElementById("filtersYearSelect").value;
        const doctor = document.getElementById('filtersDoctorsSelect').value;
        const department = document.getElementById('filtersDepartmentSelect').value;
        let filters = '';
        if (month) filters += `&month=${month}`;
        if (year) filters += `&year=${year}`;
        if (doctor) filters += `&doctor=${encodeURIComponent(doctor)}`;
        if (department) filters += `&department=${encodeURIComponent(department)}`;
        return filters;
    }
*/
/*
    function updateTable(data, reportName) {
        console.log('Updating table with fetched data');
        const mainContainer = document.getElementById('mainContainer_1');
        mainContainer.innerHTML = ''; // Clear previous content
        mainContainer.style.display = 'block';
        console.log('updateTable: '+data[0])
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        if (data && data.length > 0) {
            const table = document.createElement('table');
            table.className = 'table';
            const thead = document.createElement('thead');
            const tr = document.createElement('tr');
            Object.keys(data[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                tr.appendChild(th);
            });
            thead.appendChild(tr);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            data.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            mainContainer.appendChild(table);
        } else {
            mainContainer.textContent = 'No data available for the selected report.';
        }
    }

    function updatePagination(currentPage, totalPages, reportName) {
        console.log(`Updating pagination for report: ${reportName}`);
        const paginationContainer = document.getElementById('paginationContainer');
        if (!paginationContainer) {
            console.error('Pagination container not found');
            return;
        }
        paginationContainer.innerHTML = ''; // Clear existing pagination buttons

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Предыдущий';
            prevButton.classList.add("button");
            prevButton.classList.add("index-table__excelButton");
            prevButton.onclick = () => fetchReportData(reportName, currentPage - 1);
            paginationContainer.appendChild(prevButton);
        }
        console.log('totalPages: ' + totalPages)
        if (currentPage <= totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Следующий';
            nextButton.classList.add("button");
            nextButton.classList.add("index-table__excelButton");
            nextButton.onclick = () => fetchReportData(reportName, currentPage + 1);
            paginationContainer.appendChild(nextButton);
        }
    }
*/
    

    // Automatically load data for Report_1 when the page loads
    fetchReportData('Report_1');
});

function updateChart(data) {
    //console.log(`Updating chart for report: ${reportName}`);
    var reportType = $('.actionList__item--selected').data('report') || 'Report_1'; // Ensure this matches the active report selection
    //const month = document.getElementById("filtersDate").value;
    const month = document.getElementById("filtersMonthSelect").value;
    const year = document.getElementById("filtersYearSelect").value;
    const doctor = document.getElementById('filtersDoctorsSelect').value;
    const medicine_department_name = document.getElementById('filtersCSZNameSelect').value;
    const selectedRangeDate = document.getElementById("filtersDate4").value;
    const selectedRangeDate_1 = document.getElementById("filtersDate5").value;
    const kzg_code = document.getElementById('filtersName_2_Select').value;
    const kzg_name = document.getElementById('filtersName_1_Select').value;
    const diagnosis_name = document.getElementById('filtersName_3_Select').value;
    const diagnosis_code = document.getElementById('filtersName_4_Select').value;
    const service_name = document.getElementById('filtersName_5_Select').value;

    if (!reportType) {
        console.error('No report selected for diagram generation.');
        return;
    }
    $.ajax({
        url: '/reports/fetchChartData',
        type: 'GET',
        data: { report: reportType,
                month: month,
                year: year,
                doctor: doctor,
                medicine_department_name: medicine_department_name,
                selectedRangeDate: selectedRangeDate,
                selectedRangeDate_1: selectedRangeDate_1,
                kzg_code: kzg_code,
                kzg_name: kzg_name,
                diagnosis_name: diagnosis_name,
                diagnosis_code: diagnosis_code,
                service_name: service_name
         },
        success: function(data) {
            if (chartInstance) { // Check if a chart instance exists
                chartInstance.destroy(); // Destroy the existing chart instance
            }
            if (chartInstance1) { // Check if a chart instance exists
                chartInstance1.destroy(); // Destroy the existing chart instance
            }
            if (chartInstance2) { // Check if a chart instance exists
                chartInstance2.destroy(); // Destroy the existing chart instance
            }
            if (chartInstance3) { // Check if a chart instance exists
                chartInstance3.destroy(); // Destroy the existing chart instance
            }
            if (data && data.labels && data.dataSets_1) {
                if(reportType == 'Report_1'){
                    $('#mainContainer_1').hide();
                    $('#chartCanvas1').hide();
                    $('#chartCanvas2').hide();
                    $('#chartCanvas3').hide();
                    $('#chartCanvas4').hide();
                    $('#chart1_title').hide();
                    $('#chart1_title1').hide();
                    $('#chart1_title2').hide();
                    $('#chart1_title3').hide();
                    $('#chart1_title4').hide();
                    $('#chartCanvas').show();
                    $('#chart1_title').show();
                    $('#chart1_title').html("<center><b><font size=5>Исполнение бюджета по врачам</font></b></center>");
                    var ctx = document.getElementById('chartCanvas').getContext('2d');
                    chartInstance = new Chart(ctx, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_1
                        },
                        options: {}
                    });
                } else if(reportType == 'Report_2'){
                    $('#mainContainer_1').hide();
                    $('#chartCanvas').show();
                    $('#chartCanvas1').show();
                    $('#chartCanvas2').show();
                    $('#chartCanvas3').hide();
                    $('#chartCanvas4').hide();
                    $('#chart1_title').show();
                    $('#chart1_title1').show();
                    $('#chart1_title2').show();
                    $('#chart1_title3').hide();
                    $('#chart1_title4').hide();
                    $('#chart1_title').html("<center><b><font size=5>Активы Фонда на ОСМС</font></b></center>");
                    $('#chart1_title1').html("<center><b><font size=5>Республиканский (БП 067, ПП 100) село</font></b></center>");
                    $('#chart1_title2').html("<center><b><font size=5>ГОБМП Нац.фонд</font></b></center>");
                    var ctx = document.getElementById('chartCanvas').getContext('2d');
                    var ctx1 = document.getElementById('chartCanvas1').getContext('2d');
                    var ctx2 = document.getElementById('chartCanvas2').getContext('2d');
                    chartInstance = new Chart(ctx, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_1
                        },
                        options: {}
                    });
                    chartInstance1 = new Chart(ctx1, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_2
                        },
                        options: {}
                    });
                    chartInstance2 = new Chart(ctx2, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_3
                        },
                        options: {}
                    });
                } else if(reportType == 'Report_3'){
                    $('#mainContainer_1').hide();
                    $('#chartCanvas1').hide();
                    $('#chartCanvas2').hide();
                    $('#chartCanvas3').hide();
                    $('#chartCanvas4').hide();
                    $('#chart1_title').hide();
                    $('#chart1_title1').hide();
                    $('#chart1_title2').hide();
                    $('#chart1_title3').hide();
                    $('#chart1_title4').hide();
                    $('#chartCanvas').show();
                    $('#chart1_title').show();
                    $('#chart1_title').html('<center><b><font size=5>Диализ и палат</font></b></center>');
                    var ctx = document.getElementById('chartCanvas').getContext('2d');
                    chartInstance = new Chart(ctx, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_1
                        },
                        options: {}
                    });
                } else if(reportType == 'Report_4'){
                    $('#mainContainer_1').hide();
                    $('#chartCanvas1').hide();
                    $('#chartCanvas2').hide();
                    $('#chartCanvas3').hide();
                    $('#chartCanvas4').hide();
                    $('#chart1_title').hide();
                    $('#chart1_title1').hide();
                    $('#chart1_title2').hide();
                    $('#chart1_title3').hide();
                    $('#chart1_title4').hide();
                    $('#chartCanvas').show();
                    $('#chart1_title').show();
                    $('#chart1_title').html('<center><b><font size=5>СВОД по весовым коэффициентам</font></b></center>');
                    var ctx = document.getElementById('chartCanvas').getContext('2d');
                    chartInstance = new Chart(ctx, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_1
                        },
                        options: {}
                    });
                } else if(reportType == 'Report_5'){
                    $('#mainContainer_1').hide();
                    $('#chartCanvas').show();
                    $('#chartCanvas1').show();
                    $('#chartCanvas2').show();
                    $('#chartCanvas3').show();
                    $('#chartCanvas4').show();
                    $('#chart1_title').show();
                    $('#chart1_title1').show();
                    $('#chart1_title2').show();
                    $('#chart1_title3').show();
                    $('#chart1_title4').show();
                    $('#chart1_title').html("<center><b><font size=5>дети 6-10 мес.</font></b></center>");
                    $('#chart1_title1').html("<center><b><font size=5>дети 2-4 года</font></b></center>");
                    $('#chart1_title2').html("<center><b><font size=5>наверстывающий от 5 лет</font></b></center>");
                    $('#chart1_title3').html("<center><b><font size=5>медработники</font></b></center>");
                    var ctx = document.getElementById('chartCanvas').getContext('2d');
                    var ctx1 = document.getElementById('chartCanvas1').getContext('2d');
                    var ctx2 = document.getElementById('chartCanvas2').getContext('2d');
                    var ctx3 = document.getElementById('chartCanvas3').getContext('2d');
                    chartInstance = new Chart(ctx, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_1
                        },
                        options: {}
                    });
                    chartInstance1 = new Chart(ctx1, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_2
                        },
                        options: {}
                    });
                    chartInstance2 = new Chart(ctx2, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_3
                        },
                        options: {}
                    });
                    chartInstance3 = new Chart(ctx3, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_4
                        },
                        options: {}
                    });
                } else if(reportType == 'Report_6'){
                    $('#mainContainer_1').hide();
                    $('#chartCanvas').show();
                    $('#chartCanvas1').show();
                    $('#chartCanvas2').show();
                    $('#chartCanvas3').hide();
                    $('#chartCanvas4').hide();
                    $('#chart1_title').show();
                    $('#chart1_title1').show();
                    $('#chart1_title2').show();
                    $('#chart1_title3').hide();
                    $('#chart1_title4').hide();
                    $('#chart1_title').html("<center><b><font size=5>ОСМС</font></b></center>");
                    $('#chart1_title1').html("<center><b><font size=5>ГОБМП</font></b></center>");
                    $('#chart1_title2').html("<center><b><font size=5>Нац.фонд</font></b></center>");
                    var ctx = document.getElementById('chartCanvas').getContext('2d');
                    var ctx1 = document.getElementById('chartCanvas1').getContext('2d');
                    var ctx2 = document.getElementById('chartCanvas2').getContext('2d');
                    chartInstance = new Chart(ctx, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_1
                        },
                        options: {}
                    });
                    chartInstance1 = new Chart(ctx1, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_2
                        },
                        options: {}
                    });
                    chartInstance2 = new Chart(ctx2, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_3
                        },
                        options: {}
                    });
                } else if(reportType == 'Report_7'){
                    $('#mainContainer_1').hide();
                    $('#chartCanvas1').hide();
                    $('#chartCanvas2').hide();
                    $('#chartCanvas3').hide();
                    $('#chartCanvas4').hide();
                    $('#chart1_title').hide();
                    $('#chart1_title1').hide();
                    $('#chart1_title2').hide();
                    $('#chart1_title3').hide();
                    $('#chart1_title4').hide();
                    $('#chartCanvas').show();
                    $('#chart1_title').show();
                    $('#chart1_title').html('<center><b><font size=5>Терапевтический</font></b></center>');
                    var ctx = document.getElementById('chartCanvas').getContext('2d');
                    chartInstance = new Chart(ctx, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_1
                        },
                        options: {}
                    });
                } else if(reportType == 'Report_8'){
                    $('#mainContainer_1').hide();
                    $('#chartCanvas1').hide();
                    $('#chartCanvas2').hide();
                    $('#chartCanvas3').hide();
                    $('#chartCanvas4').hide();
                    $('#chart1_title').hide();
                    $('#chart1_title1').hide();
                    $('#chart1_title2').hide();
                    $('#chart1_title3').hide();
                    $('#chart1_title4').hide();
                    $('#chartCanvas').show();
                    $('#chart1_title').show();
                    $('#chart1_title').html("<center><b><font size=5>СВОД по анализам</font></b></center>");
                    var ctx = document.getElementById('chartCanvas').getContext('2d');
                    chartInstance = new Chart(ctx, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_1
                        },
                        options: {}
                    });
                } else if(reportType == 'Report_9'){
                    $('#mainContainer_1').hide();
                    $('#chartCanvas1').hide();
                    $('#chartCanvas2').hide();
                    $('#chartCanvas3').hide();
                    $('#chartCanvas4').hide();
                    $('#chart1_title').hide();
                    $('#chart1_title1').hide();
                    $('#chart1_title2').hide();
                    $('#chart1_title3').hide();
                    $('#chart1_title4').hide();
                    $('#chartCanvas').show();
                    $('#chart1_title').show();
                    $('#chart1_title').html("<center><b><font size=5>Освоение КДУ услуги поликлиника</font></b></center>");
                    var ctx = document.getElementById('chartCanvas').getContext('2d');
                    chartInstance = new Chart(ctx, { // Create a new chart instance
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: data.dataSets_1
                        },
                        options: {}
                    });
                }
            } else {
                $('#mainContainer_1').text('No chart data available for the selected report.');
                $('#chartCanvas').hide();
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching chart data:', error.message, '\n', error.stack);
            $('#mainContainer_1').text('Failed to load chart data.');
        }
    });
}
function getFilters() {
    //console.log('selectedRangeDepartment: ' + selectedRangeDepartment);
    //const month = document.getElementById("filtersDate").value;
    const month = document.getElementById("filtersMonthSelect").value;
    const dateFrom = document.getElementById("filtersDate1").value;
    const dateTo = document.getElementById("filtersDate2").value;
    const selectedRangeDate = document.getElementById("filtersDate4").value;
    const selectedRangeDate_1 = document.getElementById("filtersDate5").value;
    const selectedRangeDate_2 = document.getElementById("filtersDate6").value;
    const year = document.getElementById("filtersYearSelect").value;
    const doctor = document.getElementById('filtersDoctorsSelect').value;
    //const department = document.getElementById('filtersDepartmentSelect').value;
    const department = ($('.actionList__item--selected').data('report') == 'Report_6') ? selectedRangeDepartment : document.getElementById('filtersDepartmentSelect').value;
    const profile = document.getElementById('filtersProfileSelect').value;
    const department_name = document.getElementById('filtersDepartmentNameSelect').value;
    const medicine_department_name = document.getElementById('filtersCSZNameSelect').value;
    const district_number = document.getElementById('filtersDistrictNameSelect').value;
    const category = document.getElementById('filtersCategoryNameSelect').value;
    const kzg_code = document.getElementById('filtersName_2_Select').value;
    const kzg_name = document.getElementById('filtersName_1_Select').value;
    const diagnosis_name = document.getElementById('filtersName_3_Select').value;
    const diagnosis_code = document.getElementById('filtersName_4_Select').value;
    const service_name = ($('.actionList__item--selected').data('report') == 'Report_8') ? selectedRangeDepartment1 : document.getElementById('filtersName_5_Select').value;
    //console.log('department: ' + department);
    const dates = selectedRangeDate.split(" - ");
    if (dates.length === 2) {
        const startDate = dates[0];
        const endDate = dates[1];
        //console.log('startDate: ' + startDate); // "2024-06-01"
        //console.log('endDate: ' + endDate);   // "2024-06-02"
    } else if (dates.length === 1) {
        const startDate = dates[0];
        //console.log('startDate: ' + startDate); // "2024-06-01"
    } else {
        //console.log('empty date string');
    }

    let filters = '';
    if (month) filters += `&month=${month}`;
    if (dateFrom) filters += `&dateFrom=${dateFrom}`;
    if (dateTo) filters += `&dateTo=${dateTo}`;
    if (year) filters += `&year=${year}`;
    if (doctor) filters += `&doctor=${encodeURIComponent(doctor)}`;
    if (department) filters += `&department=${encodeURIComponent(department)}`;
    if (profile) filters += `&profile=${encodeURIComponent(profile)}`;
    if (department_name) filters += `&department_name=${encodeURIComponent(department_name)}`;
    if (medicine_department_name) filters += `&medicine_department_name=${encodeURIComponent(medicine_department_name)}`;
    if (district_number) filters += `&district_number=${encodeURIComponent(district_number)}`;
    if (category) filters += `&category=${encodeURIComponent(category)}`;
    if (selectedRangeDate) filters += `&selectedRangeDate=${encodeURIComponent(selectedRangeDate)}`;
    if (selectedRangeDate_1) filters += `&selectedRangeDate_1=${encodeURIComponent(selectedRangeDate_1)}`;
    if (selectedRangeDate_2) filters += `&selectedRangeDate_2=${encodeURIComponent(selectedRangeDate_2)}`;
    if (kzg_code) filters += `&kzg_code=${encodeURIComponent(kzg_code)}`;
    if (kzg_name) filters += `&kzg_name=${encodeURIComponent(kzg_name)}`;
    if (diagnosis_name) filters += `&diagnosis_name=${encodeURIComponent(diagnosis_name)}`;
    if (diagnosis_code) filters += `&diagnosis_code=${encodeURIComponent(diagnosis_code)}`;
    if (service_name) filters += `&service_name=${encodeURIComponent(service_name)}`;
    return filters;
}

function updateTable(dataIn, reportName) {
    const reportName_ = document.querySelector('.actionList__item--selected').getAttribute('data-report');
  
    const mainContainer = document.getElementById('mainContainer_1');
    mainContainer.innerHTML = ''; // Clear previous content
    mainContainer.style.display = 'block';
    
    if (reportName_ == 'Report_1') {
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        $('#chartCanvas1').hide();
        $('#chartCanvas2').hide();
        $('#chartCanvas3').hide();
        $('#chart1_title').hide();
        $('#chart1_title1').hide();
        $('#chart1_title2').hide();
        $('#chart1_title3').hide();
        $('#filter_01').hide();
        $('#filter_02').hide();
        $('#filter_03').show();
        $('#filter_04').hide();
        $('#filter_05').hide();
        $('#filter_06').hide();
        $('#filter_5').hide();
        $('#filter_1').hide();
        $('#filter_2').show();
        $('#filter_3').show();
        $('#filter_4').show();
        $('#filter_4_ajax').hide();
        $('#filter_5_ajax').hide();
        $('#filter_6').hide();
        $('#filter_7').hide();
        $('#filter_8').hide();
        $('#filter_9').hide();
        $('#filter_10').hide();
        $('#filter_11').hide();
        $('#filter_12').hide();
        $('#filter_13').hide();
        $('#filter_14').hide();
    } 
    if (reportName_ == 'Report_2') {
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        $('#chartCanvas1').hide();
        $('#chartCanvas2').hide();
        $('#chartCanvas3').hide();
        $('#chart1_title').hide();
        $('#chart1_title1').hide();
        $('#chart1_title2').hide();
        $('#chart1_title3').hide();
        $('#filter_04').hide();
        $('#filter_01').hide();
        $('#filter_02').hide();
        $('#filter_03').show();
        $('#filter_05').hide();
        $('#filter_06').hide();
        $('#filter_5').show();
        $('#filter_1').hide();
        $('#filter_2').show();
        $('#filter_3').hide();
        $('#filter_4').show();
        $('#filter_4_ajax').hide();
        $('#filter_5_ajax').hide();
        $('#filter_6').hide();
        $('#filter_7').hide();
        $('#filter_8').hide();
        $('#filter_9').hide();
        $('#filter_10').hide();
        $('#filter_11').hide();
        $('#filter_12').hide();
        $('#filter_13').hide();
        $('#filter_14').hide();
    } 
    if (reportName_ == 'Report_3') {
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        $('#chartCanvas1').hide();
        $('#chartCanvas2').hide();
        $('#chartCanvas3').hide();
        $('#chart1_title').hide();
        $('#chart1_title1').hide();
        $('#chart1_title2').hide();
        $('#chart1_title3').hide();
        $('#filter_01').hide();
        $('#filter_02').hide();
        $('#filter_03').show();
        $('#filter_04').hide();
        $('#filter_05').hide();
        $('#filter_06').hide();
        $('#filter_5').show();
        $('#filter_1').hide();
        $('#filter_2').show();
        $('#filter_3').hide();
        $('#filter_4').hide();
        $('#filter_4_ajax').hide();
        $('#filter_5_ajax').hide();
        $('#filter_6').hide();
        $('#filter_7').hide();
        $('#filter_8').hide();
        $('#filter_9').hide();
        $('#filter_10').hide();
        $('#filter_11').hide();
        $('#filter_12').hide();
        $('#filter_13').hide();
        $('#filter_14').hide();
    }
    if (reportName_ == 'Report_4') {
        //console.log('Report_4');
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        $('#chartCanvas1').hide();
        $('#chartCanvas2').hide();
        $('#chartCanvas3').hide();
        $('#chart1_title').hide();
        $('#chart1_title1').hide();
        $('#chart1_title2').hide();
        $('#chart1_title3').hide();
        $('#filter_01').hide();
        $('#filter_02').hide();
        $('#filter_03').show();
        $('#filter_04').hide();
        $('#filter_05').hide();
        $('#filter_06').show();
        $('#filter_1').hide();
        $('#filter_2').show();
        $('#filter_3').hide();
        $('#filter_4').hide();
        $('#filter_4_ajax').hide();
        $('#filter_5_ajax').hide();
        $('#filter_5').hide();
        $('#filter_6').show();
        $('#filter_7').hide();
        $('#filter_8').hide();
        $('#filter_9').hide();
        $('#filter_10').hide();
        $('#filter_11').hide();
        $('#filter_12').hide();
        $('#filter_13').hide();
        $('#filter_14').hide();
    }
    if (reportName_ == 'Report_5') {
        //console.log('Report_5');
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        $('#chartCanvas1').hide();
        $('#chartCanvas2').hide();
        $('#chartCanvas3').hide();
        $('#chart1_title').hide();
        $('#chart1_title1').hide();
        $('#chart1_title2').hide();
        $('#chart1_title3').hide();
        $('#filter_01').hide();
        $('#filter_02').hide();
        $('#filter_03').hide();
        $('#filter_04').hide();
        $('#filter_05').hide();
        $('#filter_06').hide();
        $('#filter_1').hide();
        $('#filter_2').hide();
        $('#filter_3').show();
        $('#filter_4').hide();
        $('#filter_4_ajax').hide();
        $('#filter_5_ajax').hide();
        $('#filter_5').hide();
        $('#filter_6').hide();
        $('#filter_7').show();
        $('#filter_8').show();
        $('#filter_9').hide();
        $('#filter_10').hide();
        $('#filter_11').hide();
        $('#filter_12').hide();
        $('#filter_13').hide();
        $('#filter_14').hide();
    }
    if (reportName_ == 'Report_6') {
        //console.log('Report_6');
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        $('#chartCanvas1').hide();
        $('#chartCanvas2').hide();
        $('#chartCanvas3').hide();
        $('#chart1_title').hide();
        $('#chart1_title1').hide();
        $('#chart1_title2').hide();
        $('#chart1_title3').hide();
        $('#filter_01').hide();
        $('#filter_02').hide();
        $('#filter_03').hide();
        $('#filter_04').show();
        $('#filter_05').hide();
        $('#filter_06').hide();
        $('#filter_1').hide();
        $('#filter_2').hide();
        $('#filter_3').hide();
        $('#filter_4').hide();
        $('#filter_4_ajax').show();
        $('#filter_5_ajax').hide();
        $('#filter_5').hide();
        $('#filter_6').hide();
        $('#filter_7').hide();
        $('#filter_8').hide();
        $('#filter_9').hide();
        $('#filter_10').hide();
        $('#filter_11').hide();
        $('#filter_12').hide();
        $('#filter_13').hide();
        $('#filter_14').hide();
    }
    if (reportName_ == 'Report_7') {
        //console.log('Report_4');
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        $('#chartCanvas1').hide();
        $('#chartCanvas2').hide();
        $('#chartCanvas3').hide();
        $('#chart1_title').hide();
        $('#chart1_title1').hide();
        $('#chart1_title2').hide();
        $('#chart1_title3').hide();
        $('#filter_01').show();
        $('#filter_02').show();
        $('#filter_03').show();
        $('#filter_04').hide();
        $('#filter_05').hide();
        $('#filter_06').hide();
        $('#filter_1').hide();
        $('#filter_2').show();
        $('#filter_3').hide();
        $('#filter_4').hide();
        $('#filter_4_ajax').hide();
        $('#filter_5_ajax').hide();
        $('#filter_5').hide();
        $('#filter_6').hide();
        $('#filter_7').hide();
        $('#filter_8').hide();
        $('#filter_9').hide();
        $('#filter_10').show();
        $('#filter_11').show();
        $('#filter_12').show();
        $('#filter_13').show();
        $('#filter_14').hide();
    }
    if (reportName_ == 'Report_8') {
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        $('#chartCanvas1').hide();
        $('#chartCanvas2').hide();
        $('#chartCanvas3').hide();
        $('#chart1_title').hide();
        $('#chart1_title1').hide();
        $('#chart1_title2').hide();
        $('#chart1_title3').hide();
        $('#filter_01').hide();
        $('#filter_02').hide();
        $('#filter_03').hide();
        $('#filter_04').hide();
        $('#filter_05').show();
        $('#filter_06').hide();
        $('#filter_5').hide();
        $('#filter_1').hide();
        $('#filter_2').hide();
        $('#filter_3').hide();
        $('#filter_4').hide();
        $('#filter_4_ajax').hide();
        $('#filter_5_ajax').show();
        $('#filter_6').hide();
        $('#filter_7').hide();
        $('#filter_8').hide();
        $('#filter_9').hide();
        $('#filter_10').hide();
        $('#filter_11').hide();
        $('#filter_12').hide();
        $('#filter_13').hide();
        $('#filter_14').hide();
    }
    if (reportName_ == 'Report_9') {
        $('#mainContainer_1').show();
        $('#chartCanvas').hide();
        $('#chartCanvas1').hide();
        $('#chartCanvas2').hide();
        $('#chartCanvas3').hide();
        $('#chart1_title').hide();
        $('#chart1_title1').hide();
        $('#chart1_title2').hide();
        $('#chart1_title3').hide();
        $('#filter_01').hide();
        $('#filter_02').hide();
        $('#filter_03').show();
        $('#filter_04').hide();
        $('#filter_05').hide();
        $('#filter_06').hide();
        $('#filter_5').hide();
        $('#filter_1').hide();
        $('#filter_2').show();
        $('#filter_3').hide();
        $('#filter_4').hide();
        $('#filter_4_ajax').hide();
        $('#filter_5_ajax').hide();
        $('#filter_6').hide();
        $('#filter_7').hide();
        $('#filter_8').hide();
        $('#filter_9').hide();
        $('#filter_10').hide();
        $('#filter_11').hide();
        $('#filter_12').hide();
        $('#filter_13').hide();
        $('#filter_14').hide();
    }
    $('#mainContainer_1').show();
    $('#chartCanvas').hide();
    $('#chartCanvas1').hide();
    $('#chartCanvas2').hide();
    $('#chart1_title').hide();
    $('#chart1_title1').hide();
    $('#chart1_title2').hide();
    //fetchSelectData();

    if (dataIn.data && dataIn.data.length > 0) {
        const table = document.createElement('table');
        table.className = 'table';
        const thead = document.createElement('thead');

        if (reportName_ == 'Report_1') {
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = '';
            tr.appendChild(th);

            const th1 = document.createElement('th');
            th1.textContent = '';
            tr.appendChild(th1);

            const th1_1 = document.createElement('th');
            th1_1.textContent = '';
            tr.appendChild(th1_1);

            const th1_2 = document.createElement('th');
            th1_2.textContent = '';
            tr.appendChild(th1_2);

            const th2 = document.createElement('th');
            th2.textContent = 'Активы Фонда на ОСМС';
            th2.colSpan = 2;
            th2.bgColor = 'grey';
            tr.appendChild(th2);

            const th3 = document.createElement('th');
            th3.textContent = 'Республиканский (БП 067, ПП 100) село';
            th3.colSpan = 2;
            th3.bgColor = 'grey';
            tr.appendChild(th3);

            const th4 = document.createElement('th');
            th4.textContent = 'ГОБМП Нац.фонд';
            th4.colSpan = 2;
            th4.bgColor = 'grey';
            tr.appendChild(th4);

            thead.appendChild(tr);
            table.appendChild(thead);
        }

        // Special case for Report Type 2:
        if (reportName_ == 'Report_2') {
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = '';
            tr.appendChild(th);

            const th1 = document.createElement('th');
            th1.textContent = '';
            tr.appendChild(th1);

            const th2 = document.createElement('th');
            th2.textContent = 'Активы Фонда на ОСМС';
            th2.colSpan = 4;
            th2.bgColor = 'grey';
            tr.appendChild(th2);

            const th3 = document.createElement('th');
            th3.textContent = 'Республиканский (БП 067, ПП 100) село';
            th3.colSpan = 4;
            th3.bgColor = 'grey';
            tr.appendChild(th3);

            const th4 = document.createElement('th');
            th4.textContent = 'ГОБМП Нац.фонд';
            th4.colSpan = 4;
            th4.bgColor = 'grey';
            tr.appendChild(th4);

            thead.appendChild(tr);
            table.appendChild(thead);
        }
        // Special case for Report Type 2:
        if (reportName_ == 'Report_5') {

            

            const tr = document.createElement('tr');
            
            const th = document.createElement('th');
            th.textContent = '';
            tr.appendChild(th);

            const th1 = document.createElement('th');
            th1.textContent = '';
            tr.appendChild(th1);

            const th2 = document.createElement('th');
            th2.textContent = '';
            tr.appendChild(th2);

            const th3 = document.createElement('th');
            th3.textContent = '';
            tr.appendChild(th3);

            const th4 = document.createElement('th');
            th4.textContent = 'дети 6-10 мес.';
            th4.colSpan = 3;
            th4.bgColor = 'grey';
            tr.appendChild(th4);

            const th5 = document.createElement('th');
            th5.textContent = 'дети 2-4 года';
            th5.colSpan = 3;
            th5.bgColor = 'grey';
            tr.appendChild(th5);

            const th6 = document.createElement('th');
            th6.textContent = 'наверстывающий от 5 лет';
            th6.colSpan = 3;
            th6.bgColor = 'grey';
            tr.appendChild(th6);

            const th7 = document.createElement('th');
            th7.textContent = 'медработники';
            th7.colSpan = 3;
            th7.bgColor = 'grey';
            tr.appendChild(th7);

            const th8 = document.createElement('th');
            th8.textContent = 'выполнение всего';
            th8.colSpan = 2;
            th8.bgColor = 'grey';
            tr.appendChild(th8);

            thead.appendChild(tr);
            table.appendChild(thead);

        }

        // Special case for Report Type 2:
        if (reportName_ == 'Report_6') {
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = '';
            tr.appendChild(th);

            const th1 = document.createElement('th');
            th1.textContent = '';
            tr.appendChild(th1);

            const th2 = document.createElement('th');
            th2.textContent = 'ОСМС';
            th2.colSpan = 6;
            th2.bgColor = 'grey';
            tr.appendChild(th2);

            const th3 = document.createElement('th');
            th3.textContent = 'ГОБМП';
            th3.colSpan = 6;
            th3.bgColor = 'grey';
            tr.appendChild(th3);

            const th4 = document.createElement('th');
            th4.textContent = 'Нац.Фонд';
            th4.colSpan = 6;
            th4.bgColor = 'grey';
            tr.appendChild(th4);

            thead.appendChild(tr);
            table.appendChild(thead);
        }

        const tr = document.createElement('tr');
        Object.keys(dataIn.data[0]).forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            if (!(key === 'Источник' && (reportName_ === 'Report_9'))) tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);


        if(reportName_ == 'Report_5'){
            const tr11 = document.createElement('tr');

            const th11 = document.createElement('th');
            th11.textContent = '';
            tr11.appendChild(th11);

            const th12 = document.createElement('th');
            th12.textContent = '';
            tr11.appendChild(th12);

            const th13 = document.createElement('th');
            th13.textContent = 'Итого по ЕМЦРБ';
            th13.bgColor = '#E5E4E3';
            tr11.appendChild(th13);

            
            Object.values(dataIn.header_data).forEach(value => {
                const th = document.createElement('th');
                th.textContent = value;
                th.bgColor = '#E5E4E3';
                tr11.appendChild(th);
            });
            thead.appendChild(tr11);
            table.appendChild(thead);
        }

        if(reportName_ == 'Report_8'){
            const tr11 = document.createElement('tr');

            const th13 = document.createElement('th');
            th13.textContent = 'Итого';
            th13.bgColor = '#E5E4E3';
            tr11.appendChild(th13);

            
            Object.values(dataIn.header_data).forEach(value => {
                const th = document.createElement('th');
                th.textContent = value;
                th.bgColor = '#E5E4E3';
                tr11.appendChild(th);
            });
            thead.appendChild(tr11);
            table.appendChild(thead);
        }

        if(reportName_ == 'Report_9'){
            const tbody = document.createElement('tbody');
            let source_current, source_prev = '';
            dataIn.data.forEach(row => {
                
                source_current = row['Источник'];
                if(source_prev !== source_current){
                    source_prev = source_current;
                    //console.log('Источник ' + row['Источник'] + ' Наименование услуг ' + row['Наименование услуг']);
                    const tr = document.createElement('tr');
                    const td = document.createElement('td');
                    td.colSpan = 5;
                    td.bgColor = 'grey';
                    td.style.textAlign = 'center';  // Center the text horizontally
                    td.style.verticalAlign = 'middle';  // Center the text vertically
                    td.style.padding = '10px';  // Add some padding for better appearance
                    td.textContent = row['Источник'];
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                }
                const tr = document.createElement('tr');
                Object.entries(row).forEach(([key, value]) => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    if (key !== 'Источник') tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            mainContainer.appendChild(table);
        } else {
            const tbody = document.createElement('tbody');
            dataIn.data.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            mainContainer.appendChild(table);
        }
    } else {
        mainContainer.textContent = 'No data available for the selected report.';
    }
}

function updatePagination(currentPage, totalPages, reportName) {

    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) {
        console.error('Pagination container not found');
        return;
    }
    paginationContainer.innerHTML = ''; // Clear existing pagination buttons

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Предыдущий';
        prevButton.classList.add("button");
        prevButton.classList.add("index-table__excelButton");
        prevButton.onclick = () => fetchReportData(reportName, currentPage - 1);
        paginationContainer.appendChild(prevButton);
    }
    
    if (currentPage <= totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Следующий';
        nextButton.classList.add("button");
        nextButton.classList.add("index-table__excelButton");
        nextButton.onclick = () => fetchReportData(reportName, currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
}

function fetchReportData(reportName, page = 1) {
    const filters = getFilters();
   //console.log('!!!!!!!!!!!!!!!!!!!!  fetchReportData !!!!!!!!!!!!!!!!!!!!!!!!!!! ');
    fetch(`/reports/fetchReportData?report=${reportName}${filters}&page=${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            //console.log(data);
            //console.log(`Report data fetched successfully for report: ${reportName}`);
            updateTable(data, reportName); // Modified to pass reportName for conditional rendering
            updatePagination(data.currentPage, data.totalPages, reportName); // Update pagination based on response and reportName
        })
        .catch(error => {
            console.error('Error fetching report data:', error.message, '\n', error.stack);
        });
}

function fetchSelectData() {
    $.ajax({
        url: '/reports/getReportsDepList',
        type: 'GET',
        data: { 
            report: $('.actionList__item--selected').data('report') || 'Report_1',
            //month: this.value,
        },
        success: function(data) {
            //console.log(data.data);
            populateSelect(data.data);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching report data:', error);
        }
    });
}

function populateSelect(data) {
    const selectElement = document.getElementById('filtersDepartmentSelectAjax');
    // Clear existing options
    selectElement.innerHTML = '<option></option>';

    // Add new options
    data.forEach(department => {
        //console.log('department: ' + department['extract_department']);
        const option = document.createElement('option');
        option.value = department['extract_department'];//department.value;  // Assuming the object has a `value` property
        option.textContent = department['extract_department'];//department.name;  // Assuming the object has a `name` property
        selectElement.appendChild(option);
    });
}