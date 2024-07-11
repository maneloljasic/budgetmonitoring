const db = require('../db');
const ExcelJS = require('exceljs');

exports.getReportsPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  //console.log(req.query.message);
  try {
    //const result = await db.query('SELECT year, month, extract_department, doctor_full_name, count_treated_cases, sum_treated_cases FROM test.plan_doctors LIMIT 20');
    query = 'SELECT extract_department, profile, plan, payment_amount, plan_complete FROM prod.plan_completion WHERE 1=1';
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    //console.log('Fetching data for reports page from test.plan_doctors.');
    const result = await db.query(query);
    if (result.rows.length === 0) {
      //console.log('No data found for the reports in test.plan_doctors.');
      return res.render('reports', { title: 'Reports', data: [], message: 'No data available from test.plan_doctors.' });
    }
    res.render('reports', { title: 'Reports', data: result.rows, user_bio: req.query.message });
  } catch (error) {
    console.error(`Error fetching data for reports page from test.plan_doctors: ${error.message}\n${error.stack}`);
    next(error);
  }
};

exports.getReportsDepList = async (req, res, next) => {
  const reportType = req.query.report;
  //console.log('getReportsDepList: ' +reportType);
  try {
    //const result = await db.query('SELECT year, month, extract_department, doctor_full_name, count_treated_cases, sum_treated_cases FROM test.plan_doctors LIMIT 20');
    query = '';
    if(reportType === 'Report_8'){
      query = 'SELECT DISTINCT service_name FROM prod.analysis_summary';
    } else if(reportType === 'Report_6'){
      query = 'SELECT DISTINCT extract_department FROM prod.plan_urgently_completion';
    }
    //console.log('Fetching data for reports page from test.plan_doctors.');
    const result = await db.query(query);
    if (result.rows.length === 0) {
      //console.log('No data found for the reports in test.plan_doctors.');
      return res.json({ title: 'Reports', data: [], message: 'No data available from test.plan_doctors.' });
    }
    res.json({ title: 'Reports', data: result.rows });
  } catch (error) {
    console.error(`Error fetching data for reports page from test.plan_doctors: ${error.message}\n${error.stack}`);
    next(error);
  }
};

exports.fetchReportData = async (req, res, next) => {
  var reportType;
  const queryParams = [];
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  try {
    let query;
    let main_query;
    reportType = req.query.report;
    const month = req.query.month;
    const year = req.query.year;
    const doctor = req.query.doctor;
    const department = req.query.department;
    const department_name = req.query.department_name;
    const profile = req.query.profile;
    const dateFrom = req.query.dateFrom ? req.query.dateFrom : '';
    const dateTo = req.query.dateTo ? req.query.dateTo : '';
    const medicine_department_name = req.query.medicine_department_name;
    const doctor_full_name = req.query.doctor_full_name;
    const district_number = req.query.district_number;
    const category = req.query.category;
    const selectedRangeDate = req.query.selectedRangeDate;
    const selectedRangeDate_1 = req.query.selectedRangeDate_1;
    const selectedRangeDate_2 = req.query.selectedRangeDate_2;

    const kzg_code = req.query.kzg_code;
    const kzg_name = req.query.kzg_name;
    const diagnosis_name = req.query.diagnosis_name;
    const diagnosis_code = req.query.diagnosis_code;

    const service_name = req.query.service_name;

    if (reportType === 'Report_2') {
      //query = 'SELECT extract_department, profile,'+
      //' plan, payment_amount, plan_complete FROM prod.plan_completion WHERE 1=1';
      main_query_1 = "WITH distinct_months AS ( "+
      "SELECT DISTINCT extract_department, profile "+
      "FROM prod.plan_completion WHERE 1=1 ";
      
      main_query_2 = "), "+
        "aggregated_data AS ( "+
          "SELECT "+
          "pc.extract_department, "+
          "pc.profile, "+
          "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.plan ELSE 0 END) AS plan_1, "+
          "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.payment_amount ELSE 0 END) AS payment_amount_1, "+
          "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.plan_complete ELSE 0 END) AS plan_complete_1, "+
          "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.sum_count_treated ELSE 0 END) AS sum_count_treated_1, "+
          "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.plan ELSE 0 END) AS plan_2, "+
          "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.payment_amount ELSE 0 END) AS payment_amount_2, "+
          "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.plan_complete ELSE 0 END) AS plan_complete_2, "+
          "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.sum_count_treated ELSE 0 END) AS sum_count_treated_2, "+
          "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.plan ELSE 0 END) AS plan_3, "+
          "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.payment_amount ELSE 0 END) AS payment_amount_3, "+
          "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.plan_complete ELSE 0 END) AS plan_complete_3, "+
          "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.sum_count_treated ELSE 0 END) AS sum_count_treated_3 "+
          "FROM "+
          "distinct_months dm "+
          "JOIN "+
          "prod.plan_completion pc ON dm.extract_department = pc.extract_department AND dm.profile = pc.profile "+
          "GROUP BY "+
          "pc.extract_department, pc.profile "+
          "), "+
          "monthly_totals AS ( "+
            "SELECT "+
            "extract_department, "+
            "profile, "+
            "SUM(plan_1) AS total_plan_1, "+
            "SUM(payment_amount_1) AS total_payment_amount_1, "+
            "SUM(plan_complete_1) AS total_plan_complete_1, "+
            "SUM(sum_count_treated_1) AS total_sum_count_treated_1, "+
            "SUM(plan_2) AS total_plan_2, "+
            "SUM(payment_amount_2) AS total_payment_amount_2, "+
            "SUM(plan_complete_2) AS total_plan_complete_2, "+
            "SUM(sum_count_treated_2) AS total_sum_count_treated_2, "+
            "SUM(plan_3) AS total_plan_3, "+
            "SUM(payment_amount_3) AS total_payment_amount_3, "+
            "SUM(plan_complete_3) AS total_plan_complete_3, "+
            "SUM(sum_count_treated_3) AS total_sum_count_treated_3 "+
            "FROM "+
            "aggregated_data "+
            "GROUP BY "+
            "extract_department, profile "+
            ") "+
            "SELECT * FROM monthly_totals "+
            "ORDER BY extract_department, profile";  

      if (month) {
        main_query_1 += ` AND month = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        main_query_1 += ` AND year = $${queryParams.length + 1}`;
        queryParams.push(year);
      }
      if (department) {
        main_query_1 += ` AND extract_department ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${department}%`);
      }
      if (profile) {
        main_query_1 += ` AND profile ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${profile}%`);
      }
      main_query = main_query_1+main_query_2;
      //console.log('main_query: ' + main_query);
      query = main_query_1+main_query_2 + ` LIMIT ${limit} OFFSET ${offset}`;
      //console.log('Fetching report data for Report_2 with filters.');
    } else if (reportType === 'Report_1') {
      main_query_1 = "WITH osms_data AS ( "+
      "SELECT "+
      "extract_department, "+
      "doctor_full_name, "+
      "SUM(count_treated_cases) AS count_treated_cases_osms, "+
      "SUM(sum_treated_cases) AS sum_treated_cases_osms "+
      "FROM "+
      "prod.plan_doctors "+
      "WHERE "+
      "finance_source = 'Активы Фонда на ОСМС'";
      
      main_query_2 = " GROUP BY "+
      "extract_department, "+ 
      "doctor_full_name "+
      "), "+
      "bp067_pp100_data AS ( "+
        "SELECT "+
        "extract_department, "+
        "doctor_full_name, "+
        "SUM(count_treated_cases) AS count_treated_cases_bp067_pp100, "+
        "SUM(sum_treated_cases) AS sum_treated_cases_bp067_pp100 "+
        "FROM "+
        "prod.plan_doctors "+
        "WHERE "+
        "finance_source = 'Республиканский (БП 067, ПП 100) село'";

      main_query_3 = " GROUP BY "+
      "extract_department, "+
      "doctor_full_name "+
      "), "+
      "gobmp_data AS ( "+
        "SELECT "+
        "extract_department, "+
        "doctor_full_name, "+
        "SUM(count_treated_cases) AS count_treated_cases_gobmp, "+
        "SUM(sum_treated_cases) AS sum_treated_cases_gobmp "+
        "FROM "+
        "prod.plan_doctors "+
        "WHERE "+
        "finance_source = 'ГОБМП Нац.фонд'";

        main_query_4 = " GROUP BY "+
        "extract_department, "+ 
        "doctor_full_name "+
        ") "+
        "SELECT "+
        "COALESCE(osms_data.extract_department, bp067_pp100_data.extract_department, gobmp_data.extract_department) AS extract_department, "+
        "COALESCE(osms_data.doctor_full_name, bp067_pp100_data.doctor_full_name, gobmp_data.doctor_full_name) AS doctor_full_name, "+
        "COALESCE(osms_data.count_treated_cases_osms, 0) AS count_treated_cases_osms, "+
        "COALESCE(osms_data.sum_treated_cases_osms, 0) AS sum_treated_cases_osms, "+
        "COALESCE(bp067_pp100_data.count_treated_cases_bp067_pp100, 0) AS count_treated_cases_bp067_pp100, "+
        "COALESCE(bp067_pp100_data.sum_treated_cases_bp067_pp100, 0) AS sum_treated_cases_bp067_pp100, "+
        "COALESCE(gobmp_data.count_treated_cases_gobmp, 0) AS count_treated_cases_gobmp, "+
        "COALESCE(gobmp_data.sum_treated_cases_gobmp, 0) AS sum_treated_cases_gobmp, "+
        "COALESCE(osms_data.count_treated_cases_osms, 0) +  "+
        "COALESCE(bp067_pp100_data.count_treated_cases_bp067_pp100, 0) +  "+
        "COALESCE(gobmp_data.count_treated_cases_gobmp, 0) AS count_treated_cases, "+
        "COALESCE(osms_data.sum_treated_cases_osms, 0) +  "+
        "COALESCE(bp067_pp100_data.sum_treated_cases_bp067_pp100, 0) +  "+
        "COALESCE(gobmp_data.sum_treated_cases_gobmp, 0) AS sum_treated_cases "+
        "FROM "+
        "osms_data "+
        "FULL OUTER JOIN bp067_pp100_data "+
        "ON osms_data.extract_department = bp067_pp100_data.extract_department "+
        "AND osms_data.doctor_full_name = bp067_pp100_data.doctor_full_name "+
        "FULL OUTER JOIN gobmp_data "+
        "ON COALESCE(osms_data.extract_department, bp067_pp100_data.extract_department) = gobmp_data.extract_department  "+
        "AND COALESCE(osms_data.doctor_full_name, bp067_pp100_data.doctor_full_name) = gobmp_data.doctor_full_name "+
        "ORDER BY "+
        "extract_department ASC, doctor_full_name ASC";

      if (month) {
        main_query_1 += ` AND month = $${queryParams.length + 1}`;
        main_query_2 += ` AND month = $${queryParams.length + 1}`;
        main_query_3 += ` AND month = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        main_query_1 += ` AND year = $${queryParams.length + 1}`;
        main_query_2 += ` AND year = $${queryParams.length + 1}`;
        main_query_3 += ` AND year = $${queryParams.length + 1}`;
        queryParams.push(year);
      }
      if (doctor) {
        main_query_1 += ` AND doctor_full_name ILIKE $${queryParams.length + 1}`;
        main_query_2 += ` AND doctor_full_name ILIKE $${queryParams.length + 1}`;
        main_query_3 += ` AND doctor_full_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${doctor}%`);
      }
      if (department) {
        main_query_1 += ` AND extract_department ILIKE $${queryParams.length + 1}`;
        main_query_2 += ` AND extract_department ILIKE $${queryParams.length + 1}`;
        main_query_3 += ` AND extract_department ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${department}%`);
      }
      query = main_query_1+main_query_2 + main_query_3 + main_query_4 + ` LIMIT ${limit} OFFSET ${offset}`;
      //console.log('Fetching report data for Report_1 with filters.');
    } else if (reportType === 'Report_3') {
      query = 'SELECT month, year, profile, plan, payment_amount, patient_count, plan_complete FROM prod.dialis_chamber WHERE 1=1';

      if (month) {
        query += ` AND month = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        query += ` AND year = $${queryParams.length + 1}`;
        queryParams.push(year);
      }
      if (doctor) {
        //query += ` AND doctor_full_name ILIKE $${queryParams.length + 1}`;
        //queryParams.push(`%${doctor}%`);
      }
      if (profile) {
        query += ` AND profile ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${profile}%`);
      }

      query += ` LIMIT ${limit} OFFSET ${offset}`;
      //console.log('Fetching report data for Report_3 with filters.');
    } else if (reportType === 'Report_4') {
      //query = 'SELECT * FROM prod.weight_factor_report WHERE 1=1';
      query = "WITH date_ranges AS ( "+
        "SELECT "+
        "department_description, "+
        "load_period, "+
        "TO_DATE(SPLIT_PART(load_period, '—', 1), 'YYYY-MM-DD') AS start_date, "+
        "TO_DATE(SPLIT_PART(load_period, '—', 2), 'YYYY-MM-DD') AS end_date, "+
        "yy, "+
        "mm, "+
        "total_treated, "+
        "cases_weight_0_5, "+
        "cases_weight_0_5_1, "+
        "cases_weight_1_2, "+
        "cases_weight_2_3, "+
        "cases_weight_3_5, "+
        "cases_weight_5_10, "+
        "cases_weight_10_20, "+
        "cases_weight_20_30, "+
        "cases_weight_30_m "+
        "FROM "+
        "prod.weight_factor_report "+
        ") "+
        "SELECT "+
        "dr.department_description, "+
        "dr.load_period, "+
        "dr.start_date, "+
        "dr.end_date, "+
        "dr.yy, "+
        "dr.mm, "+
        "dr.total_treated, "+
        "dr.cases_weight_0_5, "+
        "dr.cases_weight_0_5_1, "+
        "dr.cases_weight_1_2, "+
        "dr.cases_weight_2_3, "+
        "dr.cases_weight_3_5, "+
        "dr.cases_weight_5_10, "+
        "dr.cases_weight_10_20, "+
        "dr.cases_weight_20_30, "+
        "dr.cases_weight_30_m "+
        "FROM "+
        "date_ranges dr WHERE 1=1";

      if (selectedRangeDate_2) {
        const dates = selectedRangeDate_2.split(" - ");
        if (dates.length === 2) {
            const startDate = dates[0];
            const endDate = dates[1];
            //console.log('SERVER: startDate: ' + startDate); // "2024-06-01"
            //console.log('SERVER: endDate: ' + endDate);   // "2024-06-02"
            query += ` AND dr.start_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);

            query += ` AND dr.end_date <= $${queryParams.length + 1}`;
            queryParams.push(`%${endDate}%`);

        } else if (dates.length === 1) {
            const startDate = dates[0];
            //console.log('startDate: ' + startDate); // "2024-06-01"
            query += ` AND dr.start_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);
        }
      }
      if (month) {
        query += ` AND dr.mm = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        query += ` AND dr.yy = $${queryParams.length + 1}`;
        queryParams.push(year);
      }
      if (department_name) {
        query += ` AND dr.department_description ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${department_name}%`);
      }
      query += ` LIMIT ${limit} OFFSET ${offset}`;
      //console.log('Fetching report data for Report_4 with filters.' + query);
    } else if (reportType === 'Report_5') {
      //query = 'SELECT extract_department, profile,'+
      //' plan, payment_amount, plan_complete FROM prod.plan_completion WHERE 1=1';
      main_query_1 = "SELECT "+
      "md.medicine_department_name, "+
      "md.doctor_full_name, "+
      "md.district_number, "+
      "SUM(md.dmi_plan) AS dmi_plan, "+
      "MAX(c1.plan) AS plan_дети_6_10_месяцев, "+
      "MAX(c1.completed) AS completed_дети_6_10_месяцев, "+
      "MAX(c1.category_completed_percent) AS category_completed_percent_дети_6_10_месяцев, "+
      "MAX(c1.total_department_category_plan) AS total_department_category_plan_дети_6_10_месяцев, "+
      "MAX(c1.total_department_category_completed) AS total_department_category_completed_6_10_месяцев, "+
      "MAX(c1.total_department_category_completed_percent) AS total_department_category_completed_percent_6_10_месяцев, "+
      "MAX(c1.total_emcrb_category_plan) AS total_emcrb_category_plan_дети_6_10_месяцев, "+
	    "MAX(c1.total_emcrb_category_completed) AS total_emcrb_category_completed_дети_6_10_месяцев, "+
	    "MAX(c1.total_emcrb_category_completed_percent) AS total_emcrb_category_completed_percent_дети_6_10_месяц, "+
      "MAX(c2.plan) AS plan_дети_2_4_года, "+
      "MAX(c2.completed) AS completed_дети_2_4_года, "+
      "MAX(c2.category_completed_percent) AS category_completed_percent_дети_2_4_года, "+
      "MAX(c2.total_department_category_plan) AS total_department_category_plan_дети_2_4_года, "+
      "MAX(c2.total_department_category_completed) AS total_department_category_completed_дети_2_4_года, "+
      "MAX(c2.total_department_category_completed_percent) AS total_department_category_completed_percent_дети_2_4_года, "+
      "MAX(c2.total_emcrb_category_plan) AS total_emcrb_category_plan_дети_2_4_года, "+
      "MAX(c2.total_emcrb_category_completed) AS total_emcrb_category_completed_дети_2_4_года, "+
      "MAX(c2.total_emcrb_category_completed_percent) AS total_emcrb_category_completed_percent_дети_2_4_года, "+
      "MAX(c3.plan) AS plan_наверстывающий, "+
      "MAX(c3.completed) AS completed_наверстывающий, "+
      "MAX(c3.category_completed_percent) AS category_completed_percent_наверстывающий, "+
      "MAX(c3.total_department_category_plan) AS total_department_category_plan_наверстывающий, "+
      "MAX(c3.total_department_category_completed) AS total_department_category_completed_наверстывающий, "+
      "MAX(c3.total_department_category_completed_percent) AS total_department_category_completed_percent_наверстывающий, "+
      "MAX(c3.total_emcrb_category_plan) AS total_emcrb_category_plan_наверстывающий, "+
	    "MAX(c3.total_emcrb_category_completed) AS total_emcrb_category_completed_наверстывающий, "+
      "MAX(c3.total_emcrb_category_completed_percent) AS total_emcrb_category_completed_percent_наверстывающий, "+
      "MAX(c4.plan) AS plan_медработники, "+
      "MAX(c4.completed) AS completed_медработники, "+
      "MAX(c4.category_completed_percent) AS category_completed_percent_медработники, "+
      "MAX(c4.total_department_category_plan) AS total_department_category_plan_медработники, "+
      "MAX(c4.total_department_category_completed) AS total_department_category_completed_медработники, "+
      "MAX(c4.total_department_category_completed_percent) AS total_department_category_completed_percent_медработники, "+
      "MAX(c4.total_emcrb_category_plan) AS total_emcrb_category_plan_медработники, "+
      "MAX(c4.total_emcrb_category_completed) AS total_emcrb_category_completed_медработники, "+
      "MAX(c4.total_emcrb_category_completed_percent) AS total_emcrb_category_completed_percent_медработники, "+
      "MAX(md.total_completed) AS total_completed, "+
      "MAX(md.district_completed_percent) AS district_completed_percent, "+
      "MAX(md.total_emcrb_dmi_plan) AS total_emcrb_dmi_plan, "+
      "MAX(md.total_emcrb_completed) AS total_emcrb_completed, "+
      "MAX(md.total_emcrb_completed_percent) AS total_emcrb_completed_percent "+
      "FROM "+
      "prod.dmi_completion md "+
      "LEFT JOIN ( "+
        "SELECT "+
        "medicine_department_name, "+
        "doctor_full_name, "+
        "district_number, "+
        "plan, "+
        "completed, "+
        "category_completed_percent, "+
        "total_department_category_plan, "+
        "total_department_category_completed, "+
        "total_department_category_completed_percent, "+
        "total_emcrb_category_plan, "+
        "total_emcrb_category_completed, "+
        "total_emcrb_category_completed_percent "+
        "FROM "+
        "prod.dmi_completion "+
        "WHERE "+
        "category = 'дети 6-10 месяцев' "+
      ") c1 ON md.medicine_department_name = c1.medicine_department_name "+
      "AND md.doctor_full_name = c1.doctor_full_name "+
      "AND md.district_number = c1.district_number "+
      "LEFT JOIN ( "+
        "SELECT "+
        "medicine_department_name, "+
        "doctor_full_name, "+
        "district_number, "+
        "plan, "+
        "completed, "+
        "category_completed_percent, "+
        "total_department_category_plan, "+
        "total_department_category_completed, "+
        "total_department_category_completed_percent, "+
        "total_emcrb_category_plan, "+
        "total_emcrb_category_completed, "+
        "total_emcrb_category_completed_percent "+
        "FROM "+
        "prod.dmi_completion "+
        "WHERE "+
        "category = 'дети 2-4 года'"+
      ") c2 ON md.medicine_department_name = c2.medicine_department_name "+
      "AND md.doctor_full_name = c2.doctor_full_name "+
      "AND md.district_number = c2.district_number "+
      "LEFT JOIN ( "+
        "SELECT "+
        "medicine_department_name, "+
        "doctor_full_name, "+
        "district_number, "+
        "plan, "+
        "completed, "+
        "category_completed_percent, "+
        "total_department_category_plan, "+
        "total_department_category_completed, "+
        "total_department_category_completed_percent, "+
        "total_emcrb_category_plan, "+
        "total_emcrb_category_completed, "+
        "total_emcrb_category_completed_percent "+
        "FROM "+
        "prod.dmi_completion "+
        "WHERE "+
        "category = 'наверстывающий'"+
      ") c3 ON md.medicine_department_name = c3.medicine_department_name "+
      "AND md.doctor_full_name = c3.doctor_full_name "+
      "AND md.district_number = c3.district_number "+
      "LEFT JOIN ( "+
        "SELECT "+
        "medicine_department_name, "+
        "doctor_full_name, "+
        "district_number, "+
        "plan, "+
        "completed, "+
        "category_completed_percent, "+
        "total_department_category_plan, "+
        "total_department_category_completed, "+
        "total_department_category_completed_percent, "+
        "total_emcrb_category_plan, "+
        "total_emcrb_category_completed, "+
        "total_emcrb_category_completed_percent "+
        "FROM "+
        "prod.dmi_completion "+
        "WHERE "+
        "category = 'медработники'"+
    ") c4 ON md.medicine_department_name = c4.medicine_department_name "+
      "AND md.doctor_full_name = c4.doctor_full_name "+
      "AND md.district_number = c4.district_number WHERE 1=1";

      main_query_2 = " GROUP BY "+
      "md.medicine_department_name, "+
      "md.doctor_full_name, "+
      "md.district_number";

      if (medicine_department_name) {
        main_query_1 += ` AND md.medicine_department_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${medicine_department_name}%`);
      }
      if (doctor) {
        main_query_1 += ` AND md.doctor_full_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${doctor}%`);
      }
      if (district_number) {
        main_query_1 += ` AND md.district_number = $${queryParams.length + 1}`;
        queryParams.push(district_number);
      }
      main_query = main_query_1+main_query_2;
      //console.log('main_query: ' + main_query);
      query = main_query_1+main_query_2 + ` LIMIT ${limit} OFFSET ${offset}`;
      //console.log('Fetching report data for Report_2 with filters.');
    } else if (reportType === 'Report_6') {
      //query = 'SELECT extract_department, profile,'+
      //' plan, payment_amount, plan_complete FROM prod.plan_completion WHERE 1=1';
      main_query_1 = "WITH osms_data AS (" +
        "SELECT " +
        "extract_department, " +
        "total AS total_1, " +
        "urgently_patient_count AS urgently_patient_count_1, " +
        "percent_urgently_patient AS percent_urgently_patient_1, " +
        "urgently_patient_amount AS urgently_patient_amount_1, " +
        "planned_patient_count AS planned_patient_count_1, " +
        "percent_planned_patient AS percent_planned_patient_1, " +
        "planned_patient_amount AS planned_patient_amount_1, " +
        "null::integer AS urgently_patient_count_2, " +
        "null::numeric AS percent_urgently_patient_2, " +
        "null::integer AS urgently_patient_amount_2, " +
        "null::integer AS planned_patient_count_2, " +
        "null::integer AS percent_planned_patient_2, " +
        "null::integer AS planned_patient_amount_2, " +
        "null::integer AS urgently_patient_count_3, " +
        "null::numeric AS percent_urgently_patient_3, " +
        "null::integer AS urgently_patient_amount_3, " +
        "null::integer AS planned_patient_count_3, " +
        "null::integer AS percent_planned_patient_3, " +
        "null::integer AS planned_patient_amount_3 " +
        "FROM  " +
        "prod.plan_urgently_completion " +
        "WHERE " +
        "finance_source = 'ОСМС'";

      main_query_2 = "), "+
      "bp067_pp100_data AS ("+
          "SELECT "+
          "extract_department, "+
          "total AS total_1, "+
          "null::integer AS urgently_patient_count_1, "+
          "null::numeric AS percent_urgently_patient_1, "+
          "null::integer AS urgently_patient_amount_1, "+
          "null::integer AS planned_patient_count_1, "+
          "null::integer AS percent_planned_patient_1, "+
          "null::integer AS planned_patient_amount_1, "+
          "urgently_patient_count AS urgently_patient_count_2, "+
          "percent_urgently_patient AS percent_urgently_patient_2, "+
          "urgently_patient_amount AS urgently_patient_amount_2, "+
          "planned_patient_count AS planned_patient_count_2, "+
          "percent_planned_patient AS percent_planned_patient_2, "+
          "planned_patient_amount AS planned_patient_amount_2, "+
          "null::integer AS urgently_patient_count_3, "+
          "null::numeric AS percent_urgently_patient_3, "+
          "null::integer AS urgently_patient_amount_3, "+
          "null::integer AS planned_patient_count_3, "+
          "null::integer AS percent_planned_patient_3, "+
          "null::integer AS planned_patient_amount_3 "+
          "FROM "+
          "prod.plan_urgently_completion "+
          "WHERE "+
          "finance_source = 'ГОБМП'";
              
      main_query_3 = "), "+
      "nacfond_data AS ("+
          "SELECT "+
              "extract_department,"+
              "total AS total_1, "+
              "null::integer AS urgently_patient_count_1, "+
              "null::numeric AS percent_urgently_patient_1, "+
              "null::integer AS urgently_patient_amount_1, "+
              "null::integer AS planned_patient_count_1, "+
              "null::integer AS percent_planned_patient_1, "+
              "null::integer AS planned_patient_amount_1, "+
              "null::integer AS urgently_patient_count_2, "+
              "null::numeric AS percent_urgently_patient_2, "+
              "null::integer AS urgently_patient_amount_2, "+
              "null::integer AS planned_patient_count_2, "+
              "null::integer AS percent_planned_patient_2, "+
              "null::integer AS planned_patient_amount_2, "+
              "urgently_patient_count AS urgently_patient_count_3, "+
              "percent_urgently_patient AS percent_urgently_patient_3, "+
              "urgently_patient_amount AS urgently_patient_amount_3, "+
              "planned_patient_count AS planned_patient_count_3, "+
              "percent_planned_patient AS percent_planned_patient_3, "+
              "planned_patient_amount AS planned_patient_amount_3 "+
              "FROM  "+
              "prod.plan_urgently_completion "+
              "WHERE  "+
              "finance_source = 'Нац.Фонд'";

      main_query_4 = ")"+
      //"-- Combining the subqueries with UNION"+
      " SELECT "+
          "extract_department, "+
          "SUM(total_1) AS total_1, "+ 
          "SUM(urgently_patient_count_1) AS urgently_patient_count_1, "+
          "AVG(percent_urgently_patient_1) AS percent_urgently_patient_1, "+
          "SUM(urgently_patient_amount_1) AS urgently_patient_amount_1, "+
          "SUM(planned_patient_count_1) AS planned_patient_count_1, "+
          "AVG(percent_planned_patient_1) AS percent_planned_patient_1, "+
          "SUM(planned_patient_amount_1) AS planned_patient_amount_1, "+
          "SUM(urgently_patient_count_2) AS urgently_patient_count_2, "+
          "AVG(percent_urgently_patient_2) AS percent_urgently_patient_2, "+
          "SUM(urgently_patient_amount_2) AS urgently_patient_amount_2, "+
          "SUM(planned_patient_count_2) AS planned_patient_count_2, "+
          "AVG(percent_planned_patient_2) AS percent_planned_patient_2, "+
          "SUM(planned_patient_amount_2) AS planned_patient_amount_2, "+
          "SUM(urgently_patient_count_3) AS urgently_patient_count_3, "+
          "AVG(percent_urgently_patient_3) AS percent_urgently_patient_3, "+
          "SUM(urgently_patient_amount_3) AS urgently_patient_amount_3, "+
          "SUM(planned_patient_count_3) AS planned_patient_count_3, "+
          "AVG(percent_planned_patient_3) AS percent_planned_patient_3, "+
          "SUM(planned_patient_amount_3) AS planned_patient_amount_3 "+
          "FROM ( "+
            "SELECT "+
            "extract_department, "+
            "total_1, "+
            "urgently_patient_count_1, "+
            "percent_urgently_patient_1, "+
            "urgently_patient_amount_1, "+
            "planned_patient_count_1, "+
            "percent_planned_patient_1, "+
            "planned_patient_amount_1, "+
            "urgently_patient_count_2, "+
            "percent_urgently_patient_2, "+
            "urgently_patient_amount_2, "+
            "planned_patient_count_2, "+
            "percent_planned_patient_2, "+
            "planned_patient_amount_2, "+
            "urgently_patient_count_3, "+
            "percent_urgently_patient_3, "+
            "urgently_patient_amount_3, "+
            "planned_patient_count_3, "+
            "percent_planned_patient_3, "+
            "planned_patient_amount_3 "+
            "FROM "+
            "osms_data "+
            "UNION ALL "+
            "SELECT "+
            "extract_department, "+
            "total_1, "+
            "urgently_patient_count_1, "+
            "percent_urgently_patient_1, "+
            "urgently_patient_amount_1, "+
            "planned_patient_count_1, "+
            "percent_planned_patient_1, "+
            "planned_patient_amount_1, "+
            "urgently_patient_count_2, "+
            "percent_urgently_patient_2, "+
            "urgently_patient_amount_2, "+
            "planned_patient_count_2, "+
            "percent_planned_patient_2, "+
            "planned_patient_amount_2, "+
            "urgently_patient_count_3, "+
            "percent_urgently_patient_3, "+
            "urgently_patient_amount_3, "+
            "planned_patient_count_3, "+
            "percent_planned_patient_3, "+
            "planned_patient_amount_3 "+
            "FROM "+
            "bp067_pp100_data "+
            "UNION ALL "+
            "SELECT "+
            "extract_department, "+
            "total_1, "+
            "urgently_patient_count_1, "+
            "percent_urgently_patient_1, "+
            "urgently_patient_amount_1, "+
            "planned_patient_count_1, "+
            "percent_planned_patient_1, "+
            "planned_patient_amount_1, "+
            "urgently_patient_count_2, "+
            "percent_urgently_patient_2, "+
            "urgently_patient_amount_2, "+
            "planned_patient_count_2, "+
            "percent_planned_patient_2, "+
            "planned_patient_amount_2, "+
            "urgently_patient_count_3, "+
            "percent_urgently_patient_3, "+
            "urgently_patient_amount_3, "+
            "planned_patient_count_3, "+
            "percent_planned_patient_3, "+
            "planned_patient_amount_3 "+
            "FROM "+
            "nacfond_data "+
            ") subquery "+
            "GROUP BY "+
            "extract_department "+
            "ORDER BY "+
            "extract_department ";     
      if (selectedRangeDate) {
        const dates = selectedRangeDate.split(" - ");
        if (dates.length === 2) {
            const startDate = dates[0];
            const endDate = dates[1];
            //console.log('SERVER: startDate: ' + startDate); // "2024-06-01"
            //console.log('SERVER: endDate: ' + endDate);   // "2024-06-02"
            main_query_1 += ` AND discharge_date >= $${queryParams.length + 1}`;
            main_query_2 += ` AND discharge_date >= $${queryParams.length + 1}`;
            main_query_3 += ` AND discharge_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);

            main_query_1 += ` AND discharge_date <= $${queryParams.length + 1}`;
            main_query_2 += ` AND discharge_date <= $${queryParams.length + 1}`;
            main_query_3 += ` AND discharge_date <= $${queryParams.length + 1}`;
            queryParams.push(`%${endDate}%`);

        } else if (dates.length === 1) {
            const startDate = dates[0];
            //console.log('startDate: ' + startDate); // "2024-06-01"
            main_query_1 += ` AND discharge_date >= $${queryParams.length + 1}`;
            main_query_2 += ` AND discharge_date >= $${queryParams.length + 1}`;
            main_query_3 += ` AND discharge_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);
        }
      }
      if (department) {
        let departments = department.split(',').filter(Boolean);
        let homMany_ = 0;
        departments.forEach(item => {
          if(homMany_ == 0){
            main_query_1 += ` AND extract_department = $${queryParams.length + 1}`;
            main_query_2 += ` AND extract_department = $${queryParams.length + 1}`;
            main_query_3 += ` AND extract_department = $${queryParams.length + 1}`;
            queryParams.push(item);
            //console.log('_________________item: ' + item); 
          }else if(homMany_ > 0){
            main_query_1 += ` OR extract_department = $${queryParams.length + 1}`;
            main_query_2 += ` OR extract_department = $${queryParams.length + 1}`;
            main_query_3 += ` OR extract_department = $${queryParams.length + 1}`;
            queryParams.push(item);
            //console.log('_________________item: ' + item); 
          }
          homMany_++;
        });
      }
      main_query = main_query_1+main_query_2+main_query_3+main_query_4;
      //console.log('___main_query: ' + main_query);
      query = main_query_1+main_query_2+main_query_3+main_query_4 + ` LIMIT ${limit} OFFSET ${offset}`;
      //console.log('Fetching report data for Report_2 with filters.');
    } else if (reportType === 'Report_7') {
      query = 'SELECT * FROM prod.therapist WHERE 1=1';

      if (dateFrom) {
        query += ` AND start_date >= $${queryParams.length + 1}`;
        queryParams.push(`%${dateFrom}%`);
      } 
      if (dateTo) {
        query += ` AND end_date <= $${queryParams.length + 1}`;
        queryParams.push(`%${dateTo}%`);
      }
      if (month) {
        query += ` AND month = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        query += ` AND year = $${queryParams.length + 1}`;
        queryParams.push(year);
      } 
      if (kzg_code) {
        query += ` AND kzg_code = $${queryParams.length + 1}`;
        queryParams.push(kzg_code);
      }
      if (kzg_name) {
        query += ` AND kzg_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${kzg_name}%`);
      }
      if (diagnosis_name) {
        query += ` AND mkb_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${diagnosis_name}%`);
      }
      if (diagnosis_code) {
        query += ` AND mkb_code ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${diagnosis_code}%`);
      }
      query += ` LIMIT ${limit} OFFSET ${offset}`;
      //console.log('Fetching report data for Report_4 with filters.' + query);
    } else if (reportType === 'Report_8') {
      
     main_query_1 = "SELECT service_name, "+
                    "SUM(inpatient) as total_inpatient, "+
                    "SUM(polyclinic) as total_polyclinic, "+
                    "SUM(inpatient_polyclinic_count) as total_inpatient_polyclinic_count, "+
                    "SUM(inpatient_polyclinic_revenue) as total_inpatient_polyclinic_revenue "+
                    "FROM prod.analysis_summary WHERE 1=1";
      
      main_query_2 = " GROUP BY service_name "+
                     "ORDER BY service_name";

      if (selectedRangeDate_1) {
        const dates = selectedRangeDate_1.split(" - ");
        if (dates.length === 2) {
            const startDate = dates[0];
            const endDate = dates[1];
            //console.log('SERVER: startDate: ' + startDate); // "2024-06-01"
            //console.log('SERVER: endDate: ' + endDate);   // "2024-06-02"
            main_query_1 += ` AND service_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);

            main_query_1 += ` AND service_date <= $${queryParams.length + 1}`;
            queryParams.push(`%${endDate}%`);

        } else if (dates.length === 1) {
            const startDate = dates[0];
            //console.log('startDate: ' + startDate); // "2024-06-01"
            main_query_1 += ` AND service_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);
        }
      }
      if (service_name) {
        let departments = service_name.split(',').filter(Boolean);
        let homMany_ = 0;
        departments.forEach(item => {
          if(homMany_ == 0){
            main_query_1 += ` AND service_name ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${item}%`);
            //console.log('_________________item: ' + item); 
          }else if(homMany_ > 0){
            main_query_1 += ` OR service_name ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${item}%`);
            //console.log('_________________item: ' + item); 
          }
          homMany_++;
        });
      }
      query = main_query_1 + main_query_2;
      query += ` LIMIT ${limit} OFFSET ${offset}`;
      //console.log('Fetching report data for Report_1 with filters.');
    } else if (reportType === 'Report_9') {
      //query = 'SELECT extract_department, profile,'+
      //' plan, payment_amount, plan_complete FROM prod.plan_completion WHERE 1=1';
      main_query_1 = "SELECT "+
      "finance_source_cd, "+
      "service_name, "+
      "SUM(plan_amount) AS sum_plan_amount, "+
      "SUM(fact_amount) AS sum_fact_amount, "+
      "SUM(fact_quantity) AS sum_fact_quantity, "+
      "AVG(completion_percent) AS sum_completion_percent "+
      "FROM "+
      "prod.contract_plan_execution WHERE 1=1";

      main_query_2 = " GROUP BY "+
      "finance_source_cd, service_name "+
      "ORDER BY "+
      "finance_source_cd, service_name";

      if (month) {
        main_query_1 += ` AND mm = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        main_query_1 += ` AND yy = $${queryParams.length + 1}`;
        queryParams.push(year);
      }

      main_query = main_query_1+main_query_2;
      //console.log('main_query: ' + main_query);
      query = main_query_1+main_query_2 + ` LIMIT ${limit} OFFSET ${offset}`;
      //console.log('Fetching report data for Report_2 with filters.');
    } else {
      //console.error('Invalid report type selected');
      return res.status(400).json({ error: 'Invalid report type selected' });
    }

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {

      return res.json({ message: 'Данные не найдены.' });
    }

    // Check if the report type is Report_1 and modify column names for the front-end
    if (reportType === 'Report_1') {
      const modifiedData = result.rows.map(row => ({
        "Ф.И.О. врача": row.doctor_full_name,
        "Отделение": row.extract_department,
        "  Количество случаев  ": row.count_treated_cases == null ? '' : formatNumber(row.count_treated_cases),
        "  Сумма пролеченных случаев  ": row.sum_treated_cases == null ? '' : formatNumber(row.sum_treated_cases),
        "Количество случаев  ": row.count_treated_cases_osms == null ? '' : formatNumber(row.count_treated_cases_osms),
        "Сумма пролеченных случаев  ": row.sum_treated_cases_osms == null ? '' : formatNumber(row.sum_treated_cases_osms),
        "Количество случаев ": row.count_treated_cases_bp067_pp100 == null ? '' : formatNumber(row.count_treated_cases_bp067_pp100),
        "Сумма пролеченных случаев ": row.sum_treated_cases_bp067_pp100 == null ? '' : formatNumber(row.sum_treated_cases_bp067_pp100),
        " Количество случаев": row.count_treated_cases_gobmp == null ? '' : formatNumber(row.count_treated_cases_gobmp),
        " Сумма пролеченных случаев": row.sum_treated_cases_gobmp == null ? '' : formatNumber(row.sum_treated_cases_gobmp)
      }));

      query1 = 'SELECT count(year) as total FROM prod.plan_doctors';
      const count_entries = await db.query(query1);
      res.json({data: modifiedData, currentPage: page, totalPages: Math.ceil(count_entries.rows[0].total / limit)});

    } else if(reportType === 'Report_2') {
      const modifiedData = result.rows.map(row => ({
        "Отделение": row.extract_department,
        "Профиль": row.profile,
        "План ": row.total_plan_1 == null ? '' : formatNumber(row.total_plan_1),
        "Предъявленная сумма к оплате ": row.total_payment_amount_1 == null? '' : formatNumber(row.total_payment_amount_1),
        "% Исполнения ": row.total_plan_complete_1 == null ? '' : formatNumber(row.total_plan_complete_1),
        "Количество случаев ": row.total_sum_count_treated_1 == null ? '' : formatNumber(row.total_sum_count_treated_1),
        " План": row.total_plan_2 == null ? '' : formatNumber(row.total_plan_2),
        " Предъявленная сумма к оплате": row.total_payment_amount_2 == null? '': formatNumber(row.total_payment_amount_2),
        " % Исполнения": row.total_plan_complete_2 == null ? '' : formatNumber(row.total_plan_complete_2),
        " Количество случаев": row.total_sum_count_treated_2 == null ? '' : formatNumber(row.total_sum_count_treated_2),
        "План  ": row.total_plan_3 == null ? '' : formatNumber(row.total_plan_3),
        "Предъявленная сумма к оплате  ": row.total_payment_amount_3 == null? '': formatNumber(row.total_payment_amount_3),
        "% Исполнения  ": row.total_plan_complete_3 == null ? '' : formatNumber(row.total_plan_complete_3),
        "Количество случаев  ": row.total_sum_count_treated_3 == null ? '' : formatNumber(row.total_sum_count_treated_3)
      })); 

      //query1 = 'SELECT count(year) as total FROM prod.plan_completion';
      //console.log(modifiedData);
      const count_entries1 = await db.query(main_query, queryParams);
      if (count_entries1.rows.length === 0) {
        //console.log(`No data found for the selected report: ${reportType}.`);
        return res.json({ message: 'No data available for the selected report.' });
      }
      res.json({data: modifiedData, currentPage: page, totalPages: Math.ceil(count_entries1.rowCount / limit)});
    } else if (reportType === 'Report_3') {
      const modifiedData = result.rows.map(row => ({
        "Год": row.year,
        "Месяц": row.month,
        "Профиль": row.profile,
        "План, тг": row.plan == null ? '' : formatNumberWithSpaces(row.plan),
        "Предъявленная сумма к оплате": row.payment_amount == null ? '' : formatNumberWithSpaces(row.payment_amount),
        "% Исполнения": row.plan_complete == null ? '' : formatNumberWithSpaces(row.plan_complete),
        "Количество случаев": row.patient_count
      }));

      query1 = 'SELECT count(year) as total FROM prod.dialis_chamber';
      const count_entries = await db.query(query1);
      res.json({data: modifiedData, currentPage: page, totalPages: Math.ceil(count_entries.rows[0].total / limit)});
    } else if (reportType === 'Report_4') {
      const modifiedData = result.rows.map(row => ({
        "Наименование отделения": row.department_description,
        "Всего пролечено за отчетный период": row.total_treated,
        "Количество случаев с весовым коэффицентом до 0.5": row.cases_weight_0_5,
        "Количество случаев с весовым коэффицентом от 0.5 до 1": row.cases_weight_0_5_1,
        "Количество случаев с весовым коэффицентом от 1 до 2": row.cases_weight_1_2,
        "Количество случаев с весовым коэффицентом от 2 до 3": row.cases_weight_2_3,
        "Количество случаев с весовым коэффицентом от 3 до 5": row.cases_weight_3_5,
        "Количество случаев с весовым коэффицентом от 5 до 10": row.cases_weight_5_10,
        "Количество случаев с весовым коэффицентом от 10 до 20": row.cases_weight_10_20,
        "Количество случаев с весовым коэффицентом от 20 до 30": row.cases_weight_20_30,
        "Количество случаев с весовым коэффицентом свыше 30": row.cases_weight_30_m
      }));

      query1 = 'SELECT count(load_timestamp) as total FROM prod.weight_factor_report';
      const count_entries = await db.query(query1);
      res.json({data: modifiedData, currentPage: page, totalPages: Math.ceil(count_entries.rows[0].total / limit)});
    } else if (reportType === 'Report_5') {
      const modifiedData = result.rows.map(row => ({
        "Наименование ЦСЗ,ЦПМСП и СВА": row.medicine_department_name,
        "Ф.И.О. врача": row.doctor_full_name,
        "№": row.district_number,
        "ДМИ план всего": row.dmi_plan,
        "подлежит по РПН ": row.plan_дети_6_10_месяцев,
        "выполнение ": row.completed_дети_6_10_месяцев,
        "% выполнения ": row.category_completed_percent_дети_6_10_месяцев,
        "подлежит по РПН  ": row.plan_дети_2_4_года,
        "выполнение  ": row.completed_дети_2_4_года,
        "% выполнения  ": row.category_completed_percent_дети_2_4_года,
        "подлежит по РПН   ": row.plan_наверстывающий,
        "выполнение   ": row.completed_наверстывающий,
        "% выполнения   ": row.category_completed_percent_наверстывающий,
        " подлежит по РПН   ": row.plan_медработники,
        " выполнение   ": row.completed_медработники,
        " % выполнения   ": row.category_completed_percent_медработники,
        "  выполнение   ": row.total_completed,
        "  % выполнения   ": row.district_completed_percent
      }));

      query1 = 'SELECT count(load_timestamp) as total FROM prod.dmi_completion';
      const count_entries = await db.query(query1);
      //const header_data = result.rows[0].total_emcrb_dmi_plan;

      const header_data = {
        "h_1": result.rows[0].total_emcrb_dmi_plan,
        "h_2": result.rows[0].total_emcrb_category_plan_дети_6_10_месяцев,
        "h_3": result.rows[0].total_emcrb_category_completed_дети_6_10_месяцев,
        "h_4": result.rows[0].total_emcrb_category_completed_percent_дети_6_10_месяц,
        "h_5 ": result.rows[0].total_emcrb_category_plan_дети_2_4_года,
        "h_6": result.rows[0].total_emcrb_category_completed_дети_2_4_года,
        "h_7": result.rows[0].total_emcrb_category_completed_percent_дети_2_4_года,
        "h_8": result.rows[0].total_emcrb_category_plan_наверстывающий,
        "h_9": result.rows[0].total_emcrb_category_completed_наверстывающий,
        "h_10": result.rows[0].total_emcrb_category_completed_percent_наверстывающ,
        "h_11": result.rows[0].total_emcrb_category_plan_медработники,
        "h_12": result.rows[0].total_emcrb_category_completed_медработники,
        "h_13": result.rows[0].total_emcrb_category_completed_percent_медработники,
        "h_14": result.rows[0].total_emcrb_completed,
        "h_15": result.rows[0].total_emcrb_completed_percent
      };

      //console.log('header_data: ' + header_data)

      res.json({data: modifiedData, header_data: header_data, currentPage: page, totalPages: Math.ceil(count_entries.rows[0].total / limit)});
    } else if(reportType === 'Report_6') {
      const modifiedData = result.rows.map(row => ({
        "Отделение": row.extract_department,
        "Всего": row.total_1,
        "кол-во пациентов экстренно ": row.urgently_patient_count_1,// == null ? '' : formatNumber(row.urgently_patient_count_1),
        "% вып.пациентов экстренно ": row.percent_urgently_patient_1 == null ? '' : formatNumber(row.percent_urgently_patient_1),
        "сумма ": row.urgently_patient_amount_1 == null? '' : formatNumber(row.urgently_patient_amount_1),
        "кол-во пациентов плановых ": row.planned_patient_count_1,
        "%вып., пациентов плановых ": row.percent_planned_patient_1 == null ? '' : formatNumber(row.percent_planned_patient_1),
        "  сумма ": row.planned_patient_amount_1 == null? '': formatNumber(row.planned_patient_amount_1),
        " кол-во пациентов экстренно ": row.urgently_patient_count_2,// == null ? '' : formatNumberWithSpaces(row.urgently_patient_count_2),
        " % вып.пациентов экстренно ": row.percent_urgently_patient_2 == null? '': formatNumber(row.percent_urgently_patient_2),
        " сумма ": row.urgently_patient_amount_2 == null? '' : formatNumber(row.urgently_patient_amount_2),
        " кол-во пациентов плановых ": row.planned_patient_count_2,
        " %вып., пациентов плановых ": row.percent_planned_patient_2 == null? '' : formatNumber(row.percent_planned_patient_2),
        " сумма  ": row.planned_patient_amount_2,// == null? '': formatNumberWithSpaces(row.planned_patient_amount_2),
        " кол-во пациентов экстренно  ": row.urgently_patient_count_3 == null ? '' : formatNumber(row.urgently_patient_count_3),
        " % вып.пациентов экстренно  ": row.percent_urgently_patient_3 == null? '' : formatNumber(row.percent_urgently_patient_3),
        "  сумма   ": row.urgently_patient_amount_3 == null? '' : formatNumber(row.urgently_patient_amount_3),
        " кол-во пациентов плановых  ": row.planned_patient_count_3,
        " %вып., пациентов плановых  ": row.percent_planned_patient_3 == null? '' : formatNumber(row.percent_planned_patient_3),
        " сумма    ": row.planned_patient_amount_3 == null? '': formatNumber(row.planned_patient_amount_3),
      })); 

      //query1 = 'SELECT count(year) as total FROM prod.plan_completion';
      //console.log(modifiedData);
      const count_entries1 = await db.query(main_query, queryParams);
      if (count_entries1.rows.length === 0) {
        //console.log(`No data found for the selected report: ${reportType}.`);
        return res.json({ message: 'No data available for the selected report.' });
      }
      res.json({data: modifiedData, currentPage: page, totalPages: Math.ceil(count_entries1.rowCount / limit)});
    } else if (reportType === 'Report_7') {
      const modifiedData = result.rows.map(row => ({
        "Год": row.year,
        "Месяц": row.month,
        "Группа КЗГ (Наименование)": row.kzg_name,
        "Группа КЗГ (Код)": row.kzg_code,
        "Диагноз по МКБ-10 (Наименование)": row.mkb_name,
        "Диагноз по МКБ-10 (Код)": row.mkb_code,
        "Всего пролечено за отчетный период": row.total_treated == null ? '' : formatNumber(row.total_treated),
        "Всего к оплате": row.total_submitted == null ? '' : formatNumber(row.total_submitted),
        "Количество случаев с весовым коэффицентом до 0.5": row.cases_weight_0_5 == null ? '' : formatNumber(row.cases_weight_0_5),
        "Количество случаев с весовым коэффицентом от 0.5 до 1": row.cases_weight_0_5_1 == null ? '' : formatNumber(row.cases_weight_0_5_1),
        "Количество случаев с весовым коэффицентом от 1 до 2": row.cases_weight_1_2 == null ? '' : formatNumber(row.cases_weight_1_2),
        "Количество случаев с весовым коэффицентом от 2 до 3": row.cases_weight_2_3 == null ? '' : formatNumber(row.cases_weight_2_3),
        "Количество случаев с весовым коэффицентом от 3 до 5": row.cases_weight_3_5 == null ? '' : formatNumber(row.cases_weight_3_5),
        "Количество случаев с весовым коэффицентом от 5 до 10": row.cases_weight_5_10 == null ? '' : formatNumber(row.cases_weight_5_10),
        "Количество случаев с весовым коэффицентом от 10 до 20": row.cases_weight_10_20 == null ? '' : formatNumber(row.cases_weight_10_20),
        "Количество случаев с весовым коэффицентом от 20 до 30": row.cases_weight_20_30 == null ? '' : formatNumber(row.cases_weight_20_30),
        "Количество случаев с весовым коэффицентом свыше 30": row.cases_weight_30_m == null ? '' : formatNumber(row.cases_weight_30_m)
      }));

      query1 = 'SELECT count(load_timestamp) as total FROM prod.therapist';
      const count_entries = await db.query(query1);
      res.json({data: modifiedData, currentPage: page, totalPages: Math.ceil(count_entries.rows[0].total / limit)});
    } else if (reportType === 'Report_8') {
      const modifiedData = result.rows.map(row => ({
        "Наименование отделения/виды услуг": row.service_name,
        "Стационар": row.total_inpatient == null ? '' : formatNumber(row.total_inpatient),
        'ПМСП и поликлиника': row.total_polyclinic == null ? '' : formatNumber(row.total_polyclinic),
        "Всего": row.total_inpatient_polyclinic_count == null ? '' : formatNumber(row.total_inpatient_polyclinic_count),
        "Доход": row.total_inpatient_polyclinic_revenue == null ? '' : formatNumber(row.total_inpatient_polyclinic_revenue)      
      }));

        let sum_total_inpatient = 0;
        let sum_total_polyclinic = 0;
        let sum_total_inpatient_polyclinic_count = 0;
        let sum_total_inpatient_polyclinic_revenue = 0;
        // Adding data rows
        result.rows.forEach(row => {
          const inpatientValue = parseInt(row.total_inpatient, 10); // Convert to integer
          sum_total_inpatient += inpatientValue;
          const polyclinicValue = parseInt(row.total_polyclinic, 10); // Convert to integer
          sum_total_polyclinic += polyclinicValue;
          const inpatient_polyclinic_countValue = parseInt(row.total_inpatient_polyclinic_count, 10); // Convert to integer
          sum_total_inpatient_polyclinic_count += inpatient_polyclinic_countValue;
          const inpatient_polyclinic_revenueValue = parseInt(row.total_inpatient_polyclinic_revenue, 10); // Convert to integer
          sum_total_inpatient_polyclinic_revenue += inpatient_polyclinic_revenueValue;
        });

        //console.log('Total sum of total_inpatients:', sum_total_inpatient);

      const header_data = {
        "Количество_1": sum_total_inpatient == null ? '' : formatNumber(sum_total_inpatient),
        "Количество_2": sum_total_polyclinic == null ? '' : formatNumber(sum_total_polyclinic),
        "Количество_3": sum_total_inpatient_polyclinic_count == null ? '' : formatNumber(sum_total_inpatient_polyclinic_count),
        "Количество_4": sum_total_inpatient_polyclinic_revenue == null ? '' : formatNumber(sum_total_inpatient_polyclinic_revenue)        
      };

      query1 = 'SELECT count(load_timestamp) as total FROM prod.analysis_summary';
      const count_entries = await db.query(query1);
      res.json({data: modifiedData, header_data: header_data, currentPage: page, totalPages: Math.ceil(count_entries.rows[0].total / limit)});

    } else if (reportType === 'Report_9') {
      const modifiedData = result.rows.map(row => ({
        "Наименование услуг": row.service_name,
        "План": row.sum_plan_amount == null ? '' : formatNumber(row.sum_plan_amount),
        "Факт": row.sum_fact_amount == null ? '' : formatNumber(row.sum_fact_amount),
        "Количество": row.sum_fact_quantity == null ? '' : formatNumber(row.sum_fact_quantity),
        "%Исполнения": row.sum_completion_percent == null ? '' : formatNumber(row.sum_completion_percent),
        "Источник": row.finance_source_cd
      }));

      query1 = 'SELECT count(load_timestamp) as total FROM prod.contract_plan_execution';
      const count_entries = await db.query(query1);
      res.json({data: modifiedData, currentPage: page, totalPages: Math.ceil(count_entries.rows[0].total / limit)});

    } else {
      res.json({data: result.rows, currentPage: page, totalPages: Math.ceil(result.rowCount / limit)});
    }
  } catch (error) {
    console.error(`Error fetching report data for report type: ${reportType} with filters: ${error.message}\n${error.stack}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.fetchChartData = async (req, res, next) => {
  const queryParams = [];
  let query;
  let query_1;
  const reportType = req.query.report;
  const month = req.query.month;
  const year = req.query.year;
  const doctor = req.query.doctor;
  const dateFrom = req.query.dateFrom ? req.query.dateFrom : '';
  const dateTo = req.query.dateTo ? req.query.dateTo : '';
  const medicine_department_name = req.query.medicine_department_name;
  const selectedRangeDate = req.query.selectedRangeDate;
  const selectedRangeDate_1 = req.query.selectedRangeDate_1;
  const kzg_code = req.query.kzg_code;
  const kzg_name = req.query.kzg_name;
  const diagnosis_name = req.query.diagnosis_name;
  const diagnosis_code = req.query.diagnosis_code;
  const service_name = req.query.service_name;

  try {
    //console.log(`Fetching chart data for report type: ${reportType}`);
    if (reportType === 'Report_1') {
      query = 'SELECT month, SUM(count_treated_cases) as total_cases, SUM(sum_treated_cases) as total_sum FROM prod.plan_doctors WHERE 1=1';
      query_1 = ' GROUP BY month ORDER BY month';
      if (doctor) {
        query += ` AND doctor_full_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${doctor}%`);
      } else {
        query += ' AND doctor_full_name IN ('+
          'SELECT DISTINCT doctor_full_name '+ 
          'FROM prod.plan_doctors '+
          'LIMIT 10)';
      }
      if (month) {
        query += ` AND month = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        query += ` AND year = $${queryParams.length + 1}`;
        queryParams.push(year);
      }
      query = query + query_1;
    } else if (reportType === 'Report_2') {
      // Adjusted to include a query for Report_2 chart data
      /*
      query = "SELECT "+
      "month, "+
      //"extract_department, "+
      //"profile, "+
      "SUM(CASE WHEN finance_source = 'Активы Фонда на ОСМС' THEN plan ELSE NULL END) AS plan_1, "+
      "SUM(CASE WHEN finance_source = 'Активы Фонда на ОСМС' THEN payment_amount ELSE NULL END) AS payment_amount_1, "+
      "SUM(CASE WHEN finance_source = 'Активы Фонда на ОСМС' THEN plan_complete ELSE NULL END) AS plan_complete_1, "+
      "SUM(CASE WHEN finance_source = 'Активы Фонда на ОСМС' THEN sum_count_treated ELSE NULL END) AS sum_count_treated_1, "+

      "SUM(CASE WHEN finance_source = 'Республиканский (БП 067, ПП 100) село' THEN plan ELSE NULL END) AS plan_2, "+
      "SUM(CASE WHEN finance_source = 'Республиканский (БП 067, ПП 100) село' THEN payment_amount ELSE NULL END) AS payment_amount_2, "+
      "SUM(CASE WHEN finance_source = 'Республиканский (БП 067, ПП 100) село' THEN plan_complete ELSE NULL END) AS plan_complete_2, "+
      "SUM(CASE WHEN finance_source = 'Республиканский (БП 067, ПП 100) село' THEN sum_count_treated ELSE NULL END) AS sum_count_treated_2, "+
      
      "SUM(CASE WHEN finance_source = 'ГОБМП Нац.фонд' THEN plan ELSE NULL END) AS plan_3, "+
      "SUM(CASE WHEN finance_source = 'ГОБМП Нац.фонд' THEN payment_amount ELSE NULL END) AS payment_amount_3, "+
      "SUM(CASE WHEN finance_source = 'ГОБМП Нац.фонд' THEN plan_complete ELSE NULL END) AS plan_complete_3, "+
      "SUM(CASE WHEN finance_source = 'ГОБМП Нац.фонд' THEN sum_count_treated ELSE NULL END) AS sum_count_3 "+
      "FROM "+
      "prod.plan_completion WHERE 1=1";

      query_1 = " GROUP BY "+
      "extract_department, profile, month "+
      "ORDER BY "+
      "extract_department, profile";
      */

      query = "WITH distinct_months AS ( "+
              "SELECT DISTINCT month "+
              "FROM prod.plan_completion WHERE 1=1 ";
      query_1 = "), "+
      "aggregated_data AS ( "+
        "SELECT  "+
        "dm.month, "+
        "pc.extract_department, "+
        "pc.profile, "+

        "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.plan ELSE 0 END) AS plan_1, "+
        "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.payment_amount ELSE 0 END) AS payment_amount_1, "+
        "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.plan_complete ELSE 0 END) AS plan_complete_1, "+
        "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.sum_count_treated ELSE 0 END) AS sum_count_treated_1, "+
        
        "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.plan ELSE 0 END) AS plan_2, "+
        "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.payment_amount ELSE 0 END) AS payment_amount_2, "+
        "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.plan_complete ELSE 0 END) AS plan_complete_2, "+
        "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.sum_count_treated ELSE 0 END) AS sum_count_treated_2, "+
        
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.plan ELSE 0 END) AS plan_3, "+
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.payment_amount ELSE 0 END) AS payment_amount_3, "+
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.plan_complete ELSE 0 END) AS plan_complete_3, "+
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.sum_count_treated ELSE 0 END) AS sum_count_treated_3 "+
        "FROM  "+
            "distinct_months dm "+
        "JOIN  "+
            "prod.plan_completion pc ON dm.month = pc.month "+
        "GROUP BY  "+
            "dm.month, pc.extract_department, pc.profile "+
        "), "+
        "monthly_totals AS ( "+
            "SELECT "+
                "month, "+
                "SUM(plan_1) AS total_plan_1, "+
                "SUM(payment_amount_1) AS total_payment_amount_1, "+
                "SUM(plan_complete_1) AS total_plan_complete_1, "+
                "SUM(sum_count_treated_1) AS total_sum_count_treated_1, "+
                "SUM(plan_2) AS total_plan_2, "+
                "SUM(payment_amount_2) AS total_payment_amount_2, "+
                "SUM(plan_complete_2) AS total_plan_complete_2, "+
                "SUM(sum_count_treated_2) AS total_sum_count_treated_2, "+
                "SUM(plan_3) AS total_plan_3, "+
                "SUM(payment_amount_3) AS total_payment_amount_3, "+
                "SUM(plan_complete_3) AS total_plan_complete_3, "+
                "SUM(sum_count_treated_3) AS total_sum_count_treated_3 "+
            "FROM  "+
                "aggregated_data "+
            "GROUP BY  "+
                "month "+
        ") "+
        "SELECT * FROM monthly_totals "+
        "ORDER BY month;";

      if (month) {
        query += ` AND month = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        query += ` AND year = $${queryParams.length + 1}`;
        queryParams.push(year);
      }
      query = query + query_1;
      //console.log(`Fetching chart data for Report_2 with columns month, total_plan, total_payment.`);
    } else if (reportType === 'Report_3') {
      query = 'SELECT month, SUM(payment_amount) as total_payment_amount, SUM(patient_count) as total_patient_count, SUM(plan_complete) as total_plan_complete FROM prod.dialis_chamber WHERE 1=1';
      query_1 = ' GROUP BY month ORDER BY month';
      if (month) {
        query += ` AND month = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        query += ` AND year = $${queryParams.length + 1}`;
        queryParams.push(year);
      }
      query = query + query_1;
    } else if (reportType === 'Report_4') {
      query = 'SELECT department_description, '+
          'SUM (cases_weight_0_5) as total_cases_weight_0_5, '+
          'SUM (cases_weight_0_5_1) as total_cases_weight_0_5_1, '+
          'SUM (cases_weight_1_2) as total_cases_weight_1_2, '+
          'SUM (cases_weight_2_3) as total_cases_weight_2_3, '+
          'SUM (cases_weight_3_5) as total_cases_weight_3_5, '+
          'SUM (cases_weight_5_10) as total_cases_weight_5_10, '+
          'SUM (cases_weight_10_20) as total_cases_weight_10_20, '+
          'SUM (cases_weight_20_30) as total_cases_weight_20_30, '+
          'SUM (cases_weight_30_m) as total_cases_weight_30_m '+
          'FROM prod.weight_factor_report WHERE 1=1';
      query_1 = ' GROUP BY department_description ORDER BY department_description';

      if (dateFrom) {
        query += ` AND start_date >= $${queryParams.length + 1}`;
        queryParams.push(`%${dateFrom}%`);
      } 
      if (dateTo) {
        query += ` AND end_date <= $${queryParams.length + 1}`;
        queryParams.push(`%${dateTo}%`);
      } 
      query = query + query_1;
    } else if (reportType === 'Report_5') {
      query = "SELECT "+
      "medicine_department_name, "+
      "SUM(dmi_plan) AS dmi_plan, "+
      "SUM(CASE WHEN category = 'дети 6-10 месяцев' THEN plan ELSE 0 END) AS plan_дети_6_10_месяцев, "+
      "SUM(CASE WHEN category = 'дети 6-10 месяцев' THEN completed ELSE 0 END) AS completed_дети_6_10_месяцев, "+
      "CASE "+
      "WHEN SUM(CASE WHEN category = 'дети 6-10 месяцев' THEN completed ELSE 0 END) > 0 THEN "+
      "SUM(CASE WHEN category = 'дети 6-10 месяцев' THEN category_completed_percent * completed ELSE 0 END) / SUM(CASE WHEN category = 'дети 6-10 месяцев' THEN completed ELSE 0 END) "+
      "ELSE 0 "+
      "END AS category_completed_percent_дети_6_10_месяцев, "+
      "SUM(CASE WHEN category = 'дети 2-4 года' THEN plan ELSE 0 END) AS plan_дети_2_4_года, "+
      "SUM(CASE WHEN category = 'дети 2-4 года' THEN completed ELSE 0 END) AS completed_дети_2_4_года, "+
      "CASE "+
      "WHEN SUM(CASE WHEN category = 'дети 2-4 года' THEN completed ELSE 0 END) > 0 THEN "+
      "SUM(CASE WHEN category = 'дети 2-4 года' THEN category_completed_percent * completed ELSE 0 END) / SUM(CASE WHEN category = 'дети 2-4 года' THEN completed ELSE 0 END) "+
      "ELSE 0 "+
      "END AS category_completed_percent_дети_2_4_года, "+
      "SUM(CASE WHEN category = 'наверстывающий' THEN plan ELSE 0 END) AS plan_наверстывающий, "+
      "SUM(CASE WHEN category = 'наверстывающий' THEN completed ELSE 0 END) AS completed_наверстывающий, "+
      "CASE  "+
      "WHEN SUM(CASE WHEN category = 'наверстывающий' THEN completed ELSE 0 END) > 0 THEN  "+
      "SUM(CASE WHEN category = 'наверстывающий' THEN category_completed_percent * completed ELSE 0 END) / SUM(CASE WHEN category = 'наверстывающий' THEN completed ELSE 0 END) "+
      "ELSE 0 "+
      "END AS category_completed_percent_наверстывающий, "+
      "SUM(CASE WHEN category = 'медработники' THEN plan ELSE 0 END) AS plan_медработники, "+
      "SUM(CASE WHEN category = 'медработники' THEN completed ELSE 0 END) AS completed_медработники, "+
      "CASE  "+
      "WHEN SUM(CASE WHEN category = 'медработники' THEN completed ELSE 0 END) > 0 THEN  "+
      "SUM(CASE WHEN category = 'медработники' THEN category_completed_percent * completed ELSE 0 END) / SUM(CASE WHEN category = 'медработники' THEN completed ELSE 0 END) "+
      "ELSE 0 "+
      "END AS category_completed_percent_медработники, "+
      "MAX(total_completed) AS total_completed, "+
      "MAX(district_completed_percent) AS district_completed_percent "+
      "FROM "+
      "prod.dmi_completion WHERE 1=1";
      query_1 = " GROUP BY "+
      "medicine_department_name";

      if (medicine_department_name) {
        query += ` AND medicine_department_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${medicine_department_name}%`);
      }

      query = query + query_1;
    } else if (reportType === 'Report_6') {
      // Adjusted to include a query for Report_2 chart data
      query = "WITH distinct_months AS ( "+
              "SELECT DISTINCT discharge_date "+
              "FROM prod.plan_urgently_completion WHERE 1=1 ";
      query_1 = "), "+
      "aggregated_data AS ( "+
        "SELECT  "+
        "dm.discharge_date, "+
        "pc.extract_department, "+

        "SUM(CASE WHEN pc.finance_source = 'ОСМС' THEN pc.urgently_patient_count ELSE 0 END) AS urgently_patient_count_1, "+
        "SUM(CASE WHEN pc.finance_source = 'ОСМС' THEN pc.percent_urgently_patient ELSE 0 END) AS percent_urgently_patient_1, "+
        "SUM(CASE WHEN pc.finance_source = 'ОСМС' THEN pc.urgently_patient_amount ELSE 0 END) AS urgently_patient_amount_1, "+
        "SUM(CASE WHEN pc.finance_source = 'ОСМС' THEN pc.planned_patient_count ELSE 0 END) AS planned_patient_count_1, "+
        "SUM(CASE WHEN pc.finance_source = 'ОСМС' THEN pc.percent_planned_patient ELSE 0 END) AS percent_planned_patient_1, "+
        "SUM(CASE WHEN pc.finance_source = 'ОСМС' THEN pc.planned_patient_amount ELSE 0 END) AS planned_patient_amount_1, "+
        
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП' THEN pc.urgently_patient_count ELSE 0 END) AS urgently_patient_count_2, "+
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП' THEN pc.percent_urgently_patient ELSE 0 END) AS percent_urgently_patient_2, "+
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП' THEN pc.urgently_patient_amount ELSE 0 END) AS urgently_patient_amount_2, "+
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП' THEN pc.planned_patient_count ELSE 0 END) AS planned_patient_count_2, "+
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП' THEN pc.percent_planned_patient ELSE 0 END) AS percent_planned_patient_2, "+
        "SUM(CASE WHEN pc.finance_source = 'ГОБМП' THEN pc.planned_patient_amount ELSE 0 END) AS planned_patient_amount_2, "+
        
        "SUM(CASE WHEN pc.finance_source = 'Нац.фонд' THEN pc.urgently_patient_count ELSE 0 END) AS urgently_patient_count_3, "+
        "SUM(CASE WHEN pc.finance_source = 'Нац.фонд' THEN pc.percent_urgently_patient ELSE 0 END) AS percent_urgently_patient_3, "+
        "SUM(CASE WHEN pc.finance_source = 'Нац.фонд' THEN pc.urgently_patient_amount ELSE 0 END) AS urgently_patient_amount_3, "+
        "SUM(CASE WHEN pc.finance_source = 'Нац.фонд' THEN pc.planned_patient_count ELSE 0 END) AS planned_patient_count_3, "+
        "SUM(CASE WHEN pc.finance_source = 'Нац.фонд' THEN pc.percent_planned_patient ELSE 0 END) AS percent_planned_patient_3, "+
        "SUM(CASE WHEN pc.finance_source = 'Нац.фонд' THEN pc.planned_patient_amount ELSE 0 END) AS planned_patient_amount_3 "+

        "FROM  "+
            "distinct_months dm "+
        "JOIN  "+
            "prod.plan_urgently_completion pc ON dm.discharge_date = pc.discharge_date "+
        "GROUP BY  "+
            "dm.discharge_date, pc.extract_department "+
        "), "+
        "monthly_totals AS ( "+
            "SELECT "+
                "discharge_date, "+
                "SUM(urgently_patient_count_1) AS total_urgently_patient_count_1, "+
                "SUM(percent_urgently_patient_1) AS total_percent_urgently_patient_1, "+
                "SUM(urgently_patient_amount_1) AS total_urgently_patient_amount_1, "+
                "SUM(planned_patient_count_1) AS total_planned_patient_count_1, "+
                "SUM(percent_planned_patient_1) AS total_percent_planned_patient_1, "+
                "SUM(planned_patient_amount_1) AS total_planned_patient_amount_1, "+
                "SUM(urgently_patient_count_2) AS total_urgently_patient_count_2, "+
                "SUM(percent_urgently_patient_2) AS total_percent_urgently_patient_2, "+
                "SUM(urgently_patient_amount_2) AS total_urgently_patient_amount_2, "+
                "SUM(planned_patient_count_2) AS total_planned_patient_count_2, "+
                "SUM(percent_planned_patient_2) AS total_percent_planned_patient_2, "+
                "SUM(planned_patient_amount_2) AS total_planned_patient_amount_2, "+
                "SUM(urgently_patient_count_3) AS total_urgently_patient_count_3, "+
                "SUM(percent_urgently_patient_3) AS total_percent_urgently_patient_3, "+
                "SUM(urgently_patient_amount_3) AS total_urgently_patient_amount_3, "+
                "SUM(planned_patient_count_3) AS total_planned_patient_count_3, "+
                "SUM(percent_planned_patient_3) AS total_percent_planned_patient_3, "+
                "SUM(planned_patient_amount_3) AS total_planned_patient_amount_3 "+
            "FROM  "+
                "aggregated_data "+
            "GROUP BY  "+
                "discharge_date "+
        ") "+
        "SELECT * FROM monthly_totals "+
        "ORDER BY discharge_date;";

      if (selectedRangeDate) {
        const dates = selectedRangeDate.split(" - ");
        if (dates.length === 2) {
            const startDate = dates[0];
            const endDate = dates[1];
            //console.log('SERVER: startDate: ' + startDate); // "2024-06-01"
            //console.log('SERVER: endDate: ' + endDate);   // "2024-06-02"
            query += ` AND discharge_date >= $${queryParams.length + 1}`;
            //main_query_2 += ` AND discharge_date >= $${queryParams.length + 1}`;
            //main_query_3 += ` AND discharge_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);

            query += ` AND discharge_date <= $${queryParams.length + 1}`;
            //main_query_2 += ` AND discharge_date <= $${queryParams.length + 1}`;
            //main_query_3 += ` AND discharge_date <= $${queryParams.length + 1}`;
            queryParams.push(`%${endDate}%`);

        } else if (dates.length === 1) {
            const startDate = dates[0];
            //console.log('startDate: ' + startDate); // "2024-06-01"
            query += ` AND discharge_date >= $${queryParams.length + 1}`;
            //main_query_2 += ` AND discharge_date >= $${queryParams.length + 1}`;
            //main_query_3 += ` AND discharge_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);
        }
      }

      query = query + query_1;
      //console.log(`Fetching chart data for Report_2 with columns month, total_plan, total_payment.`);
    } else if (reportType === 'Report_7') {
      query = "SELECT month, "+
          "SUM (total_treated) as total_total_treated, "+
          "SUM (total_submitted) as total_total_submitted, "+
          "SUM (cases_weight_0_5) as total_cases_weight_0_5, "+
          "SUM (cases_weight_0_5_1) as total_cases_weight_0_5_1, "+
          "SUM (cases_weight_1_2) as total_cases_weight_1_2, "+
          "SUM (cases_weight_2_3) as total_cases_weight_2_3, "+
          "SUM (cases_weight_3_5) as total_cases_weight_3_5, "+
          "SUM (cases_weight_5_10) as total_cases_weight_5_10, "+
          "SUM (cases_weight_10_20) as total_cases_weight_10_20, "+
          "SUM (cases_weight_20_30) as total_cases_weight_20_30, "+
          "SUM (cases_weight_30_m) as total_cases_weight_30_m "+
          "FROM prod.therapist WHERE 1=1 ";
      query_1 = ' GROUP BY month ORDER BY month';

      if (dateFrom) {
        query += ` AND start_date >= $${queryParams.length + 1}`;
        queryParams.push(`%${dateFrom}%`);
      } 
      if (dateTo) {
        query += ` AND end_date <= $${queryParams.length + 1}`;
        queryParams.push(`%${dateTo}%`);
      }
      if (month) {
        query += ` AND month = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        query += ` AND year = $${queryParams.length + 1}`;
        queryParams.push(year);
      } 
      if (kzg_code) {
        query += ` AND kzg_code = $${queryParams.length + 1}`;
        queryParams.push(kzg_code);
      }
      if (kzg_name) {
        query += ` AND kzg_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${kzg_name}%`);
      }
      if (diagnosis_name) {
        query += ` AND mkb_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${diagnosis_name}%`);
      }
      if (diagnosis_code) {
        query += ` AND mkb_code ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${diagnosis_code}%`);
      } 
      query = query + query_1;
    } else if (reportType === 'Report_8') {
      query = "SELECT service_name, "+
      "SUM(inpatient) as total_inpatient_1, "+ 
      "SUM(polyclinic) as total_polyclinic_1, "+
      "SUM(inpatient_polyclinic_count) as total_inpatient_polyclinic_count_1, "+
      "SUM(inpatient_polyclinic_revenue) as total_inpatient_polyclinic_revenuec_1 "+
      "FROM prod.analysis_summary WHERE 1=1";
      query_1 = ' GROUP BY service_name ORDER BY service_name';
      if (selectedRangeDate_1) {
        const dates = selectedRangeDate_1.split(" - ");
        if (dates.length === 2) {
            const startDate = dates[0];
            const endDate = dates[1];
            //console.log('SERVER: startDate: ' + startDate); // "2024-06-01"
            //console.log('SERVER: endDate: ' + endDate);   // "2024-06-02"
            query += ` AND service_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);

            query += ` AND service_date <= $${queryParams.length + 1}`;
            queryParams.push(`%${endDate}%`);

        } else if (dates.length === 1) {
            const startDate = dates[0];
            //console.log('startDate: ' + startDate); // "2024-06-01"
            query += ` AND service_date >= $${queryParams.length + 1}`;
            queryParams.push(`%${startDate}%`);
        }
      }
      if (service_name) {
        query += ` AND service_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${service_name}%`);
      }
      query = query + query_1;
    } else if (reportType === 'Report_9') {
      query = "SELECT "+
      "finance_source_cd, "+
      "service_name, "+
      "SUM(plan_amount) AS sum_plan_amount, "+
      "SUM(fact_amount) AS sum_fact_amount "+
      "FROM "+
      "prod.contract_plan_execution WHERE 1=1";

      query_1 = " GROUP BY "+
      "finance_source_cd, service_name "+
      "ORDER BY "+
      "finance_source_cd, service_name";

      if (month) {
        query += ` AND mm = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        query += ` AND yy = $${queryParams.length + 1}`;
        queryParams.push(year);
      }

      query = query + query_1;
    } else {
      //console.log(`No chart data query defined for report type: ${reportType}`);
      return res.status(400).json({ error: `No chart data query defined for report type: ${reportType}` });
    }

    const queryResult = await db.query(query, queryParams);
    //console.log(`Chart data fetched successfully for report type: ${reportType}`);
    const labels = queryResult.rows.map(row => row.month);
    let dataSets_1, dataSets_2, dataSets_3;
    if (reportType === 'Report_1') {
      const dataCases = queryResult.rows.map(row => row.total_cases);
      const dataSum = queryResult.rows.map(row => row.total_sum);
      dataSets_1 = [{ label: 'Количество случаев', data: dataCases, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
    ],
    borderWidth: 2
      }, { label: 'Сумма пролеченных случаев', data: dataSum, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }];
      res.json({ labels, dataSets_1: dataSets_1});
    } else if (reportType === 'Report_2') {
      const total_payment_amount_1 = queryResult.rows.map(row => row.total_payment_amount_1);
      const total_plan_complete_1 = queryResult.rows.map(row => row.total_plan_complete_1);
      const total_sum_count_treated_1 = queryResult.rows.map(row => row.total_sum_count_treated_1);

      const total_payment_amount_2 = queryResult.rows.map(row => row.total_payment_amount_2);
      const total_plan_complete_2 = queryResult.rows.map(row => row.total_plan_complete_2);
      const total_sum_count_treated_2 = queryResult.rows.map(row => row.total_sum_count_treated_2);

      const total_payment_amount_3 = queryResult.rows.map(row => row.total_payment_amount_3);
      const total_plan_complete_3 = queryResult.rows.map(row => row.total_plan_complete_3);
      const total_sum_count_treated_3 = queryResult.rows.map(row => row.total_sum_count_treated_3);

      dataSets_1 = [{ label: 'Предъявленная сумма к оплате', data: total_payment_amount_1, borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }, 
                  { label: '% Исполнения', data: total_plan_complete_1, borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'Количество случаев', data: total_sum_count_treated_1, borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }];
        dataSets_2 = [{ label: 'Предъявленная сумма к оплате', data: total_payment_amount_2, borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }, 
                  { label: '% Исполнения', data: total_plan_complete_2, borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'Количество случаев', data: total_sum_count_treated_2, borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }];
        dataSets_3 = [{ label: 'Предъявленная сумма к оплате', data: total_payment_amount_3, borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }, 
                  { label: '% Исполнения', data: total_plan_complete_3, borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'Количество случаев', data: total_sum_count_treated_3, borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }];
                  res.json({ labels, dataSets_1: dataSets_1, dataSets_2: dataSets_2, dataSets_3: dataSets_3});
    } else if (reportType === 'Report_3') {
      const total_payment_amount = queryResult.rows.map(row => row.total_payment_amount);
      const total_patient_count = queryResult.rows.map(row => row.total_patient_count);
      const total_plan_complete = queryResult.rows.map(row => row.total_plan_complete);
      dataSets_1 = [{ label: 'Предъявленная сумма к оплате', data: total_payment_amount, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
    ],
    borderWidth: 2
      }, { label: 'Количество случаев', data: total_patient_count, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: '% Исполнения случаев', data: total_plan_complete, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }];
      res.json({ labels, dataSets_1: dataSets_1});
    } else if (reportType === 'Report_4') {
      const total_cases_weight_0_5 = queryResult.rows.map(row => row.total_cases_weight_0_5);
      const total_cases_weight_0_5_1 = queryResult.rows.map(row => row.total_cases_weight_0_5_1);
      const total_cases_weight_1_2 = queryResult.rows.map(row => row.total_cases_weight_1_2);
      const total_cases_weight_2_3 = queryResult.rows.map(row => row.total_cases_weight_2_3);
      const total_cases_weight_3_5 = queryResult.rows.map(row => row.total_cases_weight_3_5);
      const total_cases_weight_5_10 = queryResult.rows.map(row => row.total_cases_weight_5_10);
      const total_cases_weight_10_20 = queryResult.rows.map(row => row.total_cases_weight_10_20);
      const total_cases_weight_20_30 = queryResult.rows.map(row => row.total_cases_weight_20_30);
      const total_cases_weight_30_m = queryResult.rows.map(row => row.total_cases_weight_30_m);

      dataSets_1 = [{ label: 'Количество случаев с весовым коэффицентом до 0.5', data: total_cases_weight_0_5, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
    ],
    borderWidth: 2
      }, { label: 'Количество случаев с весовым коэффицентом от 0.5 до 1', data: total_cases_weight_0_5_1, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 1 до 2', data: total_cases_weight_1_2, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 2 до 3', data: total_cases_weight_2_3, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 3 до 5', data: total_cases_weight_3_5, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 5 до 10', data: total_cases_weight_5_10, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 10 до 20', data: total_cases_weight_10_20, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 20 до 30', data: total_cases_weight_20_30, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом свыше 30', data: total_cases_weight_30_m, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 90, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }];
      const labels = queryResult.rows.map(row => row.department_description);
      res.json({ labels, dataSets_1: dataSets_1});
    } else if (reportType === 'Report_5') {

      const plan_дети_6_10_месяцев = queryResult.rows.map(row => row.plan_дети_6_10_месяцев);
      const completed_дети_6_10_месяцев = queryResult.rows.map(row => row.completed_дети_6_10_месяцев);
      const category_completed_percent_дети_6_10_месяцев = queryResult.rows.map(row => row.category_completed_percent_дети_6_10_месяцев);
      
      const plan_дети_2_4_года = queryResult.rows.map(row => row.plan_дети_2_4_года);
      const completed_дети_2_4_года = queryResult.rows.map(row => row.completed_дети_2_4_года);
      const category_completed_percent_дети_2_4_года = queryResult.rows.map(row => row.category_completed_percent_дети_2_4_года);
      
      const plan_наверстывающий = queryResult.rows.map(row => row.plan_наверстывающий);
      const completed_наверстывающий = queryResult.rows.map(row => row.completed_наверстывающий);
      const category_completed_percent_наверстывающий = queryResult.rows.map(row => row.category_completed_percent_наверстывающий);
      
      const plan_медработники = queryResult.rows.map(row => row.plan_медработники);
      const completed_медработники = queryResult.rows.map(row => row.completed_медработники);
      const category_completed_percent_медработники = queryResult.rows.map(row => row.category_completed_percent_медработники);

      dataSets_1 = [{ label: 'подлежит по РПН', data: plan_дети_6_10_месяцев, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
    ],
    borderWidth: 2
      }, { label: 'выполнение', data: completed_дети_6_10_месяцев, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: '% выполнения', data: category_completed_percent_дети_6_10_месяцев, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }];

      dataSets_2 = [{ label: 'подлежит по РПН', data: plan_дети_2_4_года, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'выполнение', data: completed_дети_2_4_года, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: '% выполнения', data: category_completed_percent_дети_2_4_года, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }]

      dataSets_3 = [{ label: 'подлежит по РПН', data: plan_наверстывающий, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'выполнение', data: completed_наверстывающий, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: '% выполнения', data: category_completed_percent_наверстывающий, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 90, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }];

      dataSets_4 = [{ label: 'подлежит по РПН', data: plan_медработники, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'выполнение', data: completed_медработники, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: '% выполнения', data: category_completed_percent_медработники, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 90, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }];


      const labels = queryResult.rows.map(row => row.medicine_department_name);
      res.json({ labels, dataSets_1: dataSets_1, dataSets_2: dataSets_2, dataSets_3: dataSets_3, dataSets_4: dataSets_4});
    } else if (reportType === 'Report_6') {

      const total_urgently_patient_count_1 = queryResult.rows.map(row => row.total_urgently_patient_count_1);
      const total_percent_urgently_patient_1 = queryResult.rows.map(row => row.total_percent_urgently_patient_1);
      const total_urgently_patient_amount_1 = queryResult.rows.map(row => row.total_urgently_patient_amount_1);
      const total_planned_patient_count_1 = queryResult.rows.map(row => row.total_planned_patient_count_1);
      const total_percent_planned_patient_1 = queryResult.rows.map(row => row.total_percent_planned_patient_1);
      const total_planned_patient_amount_1 = queryResult.rows.map(row => row.total_planned_patient_amount_1);

      const total_urgently_patient_count_2 = queryResult.rows.map(row => row.total_urgently_patient_count_2);
      const total_percent_urgently_patient_2 = queryResult.rows.map(row => row.total_percent_urgently_patient_2);
      const total_urgently_patient_amount_2 = queryResult.rows.map(row => row.total_urgently_patient_amount_2);
      const total_planned_patient_count_2 = queryResult.rows.map(row => row.total_planned_patient_count_2);
      const total_percent_planned_patient_2 = queryResult.rows.map(row => row.total_percent_planned_patient_2);
      const total_planned_patient_amount_2 = queryResult.rows.map(row => row.total_planned_patient_amount_2);

      const total_urgently_patient_count_3 = queryResult.rows.map(row => row.total_urgently_patient_count_3);
      const total_percent_urgently_patient_3 = queryResult.rows.map(row => row.total_percent_urgently_patient_3);
      const total_urgently_patient_amount_3 = queryResult.rows.map(row => row.total_urgently_patient_amount_3);
      const total_planned_patient_count_3 = queryResult.rows.map(row => row.total_planned_patient_count_3);
      const total_percent_planned_patient_3 = queryResult.rows.map(row => row.total_percent_planned_patient_3);
      const total_planned_patient_amount_3 = queryResult.rows.map(row => row.total_planned_patient_amount_3);

      dataSets_1 = [{ label: 'кол-во пациентов экстренно', data: total_urgently_patient_count_1, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }, 
                  { label: '% вып.пациентов экстренно', data: total_percent_urgently_patient_1, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'сумма', data: total_urgently_patient_amount_1, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'кол-во пациентов плановых', data: total_planned_patient_count_1, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: '%вып., пациентов плановых', data: total_percent_planned_patient_1, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'сумма', data: total_planned_patient_amount_1, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }];

      dataSets_2 = [{ label: 'кол-во пациентов экстренно', data: total_urgently_patient_count_2, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }, 
                  { label: '% вып.пациентов экстренно', data: total_percent_urgently_patient_2, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'сумма', data: total_urgently_patient_amount_2, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'кол-во пациентов плановых', data: total_planned_patient_count_2, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: '%вып., пациентов плановых', data: total_percent_planned_patient_2, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'сумма', data: total_planned_patient_amount_2, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }];
      
      dataSets_3 = [{ label: 'кол-во пациентов экстренно', data: total_urgently_patient_count_3, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }, 
                  { label: '% вып.пациентов экстренно', data: total_percent_urgently_patient_3, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'сумма', data: total_urgently_patient_amount_3, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'кол-во пациентов плановых', data: total_planned_patient_count_3, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: '%вып., пациентов плановых', data: total_percent_planned_patient_3, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 },
                  { label: 'сумма', data: total_planned_patient_amount_3, 
                  borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                  ],
                  borderWidth: 2 }];
      
      const labels = queryResult.rows.map(row => row.discharge_date);
      res.json({ labels, dataSets_1: dataSets_1, dataSets_2: dataSets_2, dataSets_3: dataSets_3});
    } else if (reportType === 'Report_7') {
      const total_total_treated = queryResult.rows.map(row => row.total_total_treated);
      const total_total_submitted = queryResult.rows.map(row => row.total_total_submitted);
      const total_cases_weight_0_5 = queryResult.rows.map(row => row.total_cases_weight_0_5);
      const total_cases_weight_0_5_1 = queryResult.rows.map(row => row.total_cases_weight_0_5_1);
      const total_cases_weight_1_2 = queryResult.rows.map(row => row.total_cases_weight_1_2);
      const total_cases_weight_2_3 = queryResult.rows.map(row => row.total_cases_weight_2_3);
      const total_cases_weight_3_5 = queryResult.rows.map(row => row.total_cases_weight_3_5);
      const total_cases_weight_5_10 = queryResult.rows.map(row => row.total_cases_weight_5_10);
      const total_cases_weight_10_20 = queryResult.rows.map(row => row.total_cases_weight_10_20);
      const total_cases_weight_20_30 = queryResult.rows.map(row => row.total_cases_weight_20_30);
      const total_cases_weight_30_m = queryResult.rows.map(row => row.total_cases_weight_30_m);

      dataSets_1 = [{ label: 'Всего пролечено за отчетный период', data: total_total_treated, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
    ],
    borderWidth: 2
      }, { label: 'Всего к оплате', data: total_total_submitted, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом до 0.5', data: total_cases_weight_0_5, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 0.5 до 1', data: total_cases_weight_0_5_1, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 1 до 2', data: total_cases_weight_1_2, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 2 до 3', data: total_cases_weight_2_3, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 3 до 5', data: total_cases_weight_3_5, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 5 до 10', data: total_cases_weight_5_10, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Количество случаев с весовым коэффицентом от 10 до 20', data: total_cases_weight_10_20, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 90, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 },
      { label: 'Количество случаев с весовым коэффицентом от 20 до 30', data: total_cases_weight_20_30, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 90, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 },
      { label: 'Количество случаев с весовым коэффицентом свыше 30', data: total_cases_weight_30_m, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 90, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }];
      const labels = queryResult.rows.map(row => row.month);
      res.json({ labels, dataSets_1: dataSets_1});
    } else if (reportType === 'Report_8') {
      const total_inpatient_1 = queryResult.rows.map(row => row.total_inpatient_1);
      const total_polyclinic_1 = queryResult.rows.map(row => row.total_polyclinic_1);
      const total_inpatient_polyclinic_count_1 = queryResult.rows.map(row => row.total_inpatient_polyclinic_count_1);
      const total_inpatient_polyclinic_revenuec_1 = queryResult.rows.map(row => row.total_inpatient_polyclinic_revenuec_1);
      dataSets_1 = [{ label: 'Стационар', data: total_inpatient_1, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
    ],
    borderWidth: 2
      }, 
      { label: 'ПМСП и поликлиника', data: total_polyclinic_1, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }, 
      { label: 'Всего', data: total_inpatient_polyclinic_count_1, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 },
      { label: 'Доход', data: total_inpatient_polyclinic_revenuec_1, backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }];
      const labels = queryResult.rows.map(row => row.service_name);
      res.json({ labels, dataSets_1: dataSets_1});
    } else if (reportType === 'Report_9') {
      const sum_plan_amount = queryResult.rows.map(row => row.sum_plan_amount);
      const sum_fact_amount = queryResult.rows.map(row => row.sum_fact_amount);

      dataSets_1 = [{ label: 'Сумма по плану', data: sum_plan_amount, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
    ],
    borderWidth: 2
      }, 
      { label: 'Фактическая сумма', data: sum_fact_amount, 
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 2 }];
      const labels = queryResult.rows.map(row => row.service_name);
      res.json({ labels, dataSets_1: dataSets_1});
    }
    
  } catch (error) {
    console.error(`Error fetching chart data for report type: ${reportType}: ${error.message}\n${error.stack}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.exportToExcel = async (req, res, next) => {
  const queryParams = [];
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  try {
    let query;
    let main_query;
    let main_query_1, main_query_2, main_query_3, main_query_4;
    reportType = req.query.report;
    const month = req.query.month;
    const year = req.query.year;
    const doctor = req.query.doctor;
    const department = req.query.department;
    const department_name = req.query.department_name;
    const profile = req.query.profile;
    const dateFrom = req.query.dateFrom ? req.query.dateFrom : '';
    const dateTo = req.query.dateTo ? req.query.dateTo : '';
    const medicine_department_name = req.query.medicine_department_name;
    const doctor_full_name = req.query.doctor_full_name;
    const district_number = req.query.district_number;
    const selectedRangeDate = req.query.selectedRangeDate;
    const selectedRangeDate_1 = req.query.selectedRangeDate_1;

    const kzg_code = req.query.kzg_code;
    const kzg_name = req.query.kzg_name;
    const diagnosis_name = req.query.diagnosis_name;
    const diagnosis_code = req.query.diagnosis_code;
    const service_name = req.query.service_name;
    // Creating a new Excel workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report Data');

    if (reportType === 'Report_1') {
        // Adding column headers
        worksheet.columns = [
          { header: 'Год', key: 'year', width: 10 },
          { header: 'Месяц', key: 'month', width: 10 },
          { header: 'Отделение', key: 'extract_department', width: 55 },
          { header: 'Ф.И.О. врача', key: 'doctor_full_name', width: 55 },
          { header: 'Количество случаев', key: 'count_treated_cases', width: 20 },
          { header: 'Сумма пролеченных случаев', key: 'sum_treated_cases', width: 35 },
        ];

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { horizontal: 'center' };

        query = 'SELECT year, month, extract_department, doctor_full_name, count_treated_cases, sum_treated_cases FROM prod.plan_doctors WHERE 1=1';

        if (month) {
          query += ` AND month = $${queryParams.length + 1}`;
          queryParams.push(month);
        }
        if (year) {
          query += ` AND year = $${queryParams.length + 1}`;
          queryParams.push(year);
        }
        if (doctor) {
          query += ` AND doctor_full_name ILIKE $${queryParams.length + 1}`;
          queryParams.push(`%${doctor}%`);
        }
        if (department) {
          query += ` AND extract_department ILIKE $${queryParams.length + 1}`;
          queryParams.push(`%${department}%`);
        }
        //query += ` LIMIT ${limit} OFFSET ${offset}`;

        // Fetching data for the Excel file
        const queryResult = await db.query(query, queryParams);
        const rows = queryResult.rows;

        // Adding data rows
        rows.forEach(row => {
          worksheet.addRow({
            year: row.year,
            month: row.month,
            extract_department: row.extract_department,
            doctor_full_name: row.doctor_full_name,
            count_treated_cases: row.count_treated_cases,
            sum_treated_cases: row.sum_treated_cases == null ? '' : formatNumberWithSpaces(row.sum_treated_cases)
          });
        });

    } else if (reportType === 'Report_2') {
        // Adding column headers
        // Define the top headers
        worksheet.getCell('C1').value = 'Активы Фонда на ОСМС';
        worksheet.getCell('G1').value = 'Республиканский (БП 067, ПП 100) село';
        worksheet.getCell('K1').value = 'ГОБМП Нац.фонд';

        // Merge cells for the top headers
        worksheet.mergeCells('C1', 'F1'); // Merges C1 to F1
        worksheet.mergeCells('G1', 'J1'); // Merges G1 to J1
        worksheet.mergeCells('K1', 'N1'); // Merges K1 to N1

        // Define the lower headers
        worksheet.getCell('A2').value = 'Отделение выписки';
        worksheet.getCell('B2').value = 'Профиль';
        worksheet.getCell('C2').value = 'План, тг';
        worksheet.getCell('D2').value = 'Предъявленная сумма к оплате';
        worksheet.getCell('E2').value = '% Исполнения';
        worksheet.getCell('F2').value = 'Количество случаев';
        worksheet.getCell('G2').value = 'План, тг';
        worksheet.getCell('H2').value = 'Предъявленная сумма к оплате';
        worksheet.getCell('I2').value = '% Исполнения';
        worksheet.getCell('J2').value = 'Количество случаев';
        worksheet.getCell('K2').value = 'План, тг';
        worksheet.getCell('L2').value = 'Предъявленная сумма к оплате';
        worksheet.getCell('M2').value = '% Исполнения';
        worksheet.getCell('N2').value = 'Количество случаев';

        main_query_1 = "WITH distinct_months AS ( "+
        "SELECT DISTINCT extract_department, profile "+
        "FROM prod.plan_completion WHERE 1=1 ";
        
        main_query_2 = "), "+
          "aggregated_data AS ( "+
            "SELECT "+
            "pc.extract_department, "+
            "pc.profile, "+
            "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.plan ELSE 0 END) AS plan_1, "+
            "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.payment_amount ELSE 0 END) AS payment_amount_1, "+
            "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.plan_complete ELSE 0 END) AS plan_complete_1, "+
            "SUM(CASE WHEN pc.finance_source = 'Активы Фонда на ОСМС' THEN pc.sum_count_treated ELSE 0 END) AS sum_count_treated_1, "+
            "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.plan ELSE 0 END) AS plan_2, "+
            "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.payment_amount ELSE 0 END) AS payment_amount_2, "+
            "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.plan_complete ELSE 0 END) AS plan_complete_2, "+
            "SUM(CASE WHEN pc.finance_source = 'Республиканский (БП 067, ПП 100) село' THEN pc.sum_count_treated ELSE 0 END) AS sum_count_treated_2, "+
            "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.plan ELSE 0 END) AS plan_3, "+
            "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.payment_amount ELSE 0 END) AS payment_amount_3, "+
            "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.plan_complete ELSE 0 END) AS plan_complete_3, "+
            "SUM(CASE WHEN pc.finance_source = 'ГОБМП Нац.фонд' THEN pc.sum_count_treated ELSE 0 END) AS sum_count_treated_3 "+
            "FROM "+
            "distinct_months dm "+
            "JOIN "+
            "prod.plan_completion pc ON dm.extract_department = pc.extract_department AND dm.profile = pc.profile "+
            "GROUP BY "+
            "pc.extract_department, pc.profile "+
            "), "+
            "monthly_totals AS ( "+
              "SELECT "+
              "extract_department, "+
              "profile, "+
              "SUM(plan_1) AS total_plan_1, "+
              "SUM(payment_amount_1) AS total_payment_amount_1, "+
              "SUM(plan_complete_1) AS total_plan_complete_1, "+
              "SUM(sum_count_treated_1) AS total_sum_count_treated_1, "+
              "SUM(plan_2) AS total_plan_2, "+
              "SUM(payment_amount_2) AS total_payment_amount_2, "+
              "SUM(plan_complete_2) AS total_plan_complete_2, "+
              "SUM(sum_count_treated_2) AS total_sum_count_treated_2, "+
              "SUM(plan_3) AS total_plan_3, "+
              "SUM(payment_amount_3) AS total_payment_amount_3, "+
              "SUM(plan_complete_3) AS total_plan_complete_3, "+
              "SUM(sum_count_treated_3) AS total_sum_count_treated_3 "+
              "FROM "+
              "aggregated_data "+
              "GROUP BY "+
              "extract_department, profile "+
              ") "+
              "SELECT * FROM monthly_totals "+
              "ORDER BY extract_department, profile";
        
        
      if (month) {
        main_query_1 += ` AND month = $${queryParams.length + 1}`;
        queryParams.push(month);
      }
      if (year) {
        main_query_1 += ` AND year = $${queryParams.length + 1}`;
        queryParams.push(year);
      }

      if (department) {
        main_query_1 += ` AND extract_department ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${department}%`);
      }
      if (profile) {
        main_query_1 += ` AND profile ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${profile}%`);
      }

      query = main_query_1+main_query_2;

      // Fetching data for the Excel file
      const queryResult = await db.query(query, queryParams);
      const rows = queryResult.rows;

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(2).font = { bold: true };
      worksheet.getRow(1).alignment = { horizontal: 'center' };
      worksheet.getRow(2).alignment = { horizontal: 'center' };

       // Set specific column widths
      worksheet.columns = [
        { key: 'A', width: 80 }, // Column A width
        { key: 'B', width: 80 }, // Column B width
        { key: 'C', width: 25 }, // Column C width
        { key: 'D', width: 35 }, // Column D width
        { key: 'E', width: 25 }, // Column E width
        { key: 'F', width: 25 },  // Column F width
        { key: 'G', width: 25 },
        { key: 'H', width: 35 },
        { key: 'I', width: 25 },
        { key: 'J', width: 25 },
        { key: 'K', width: 25 },
        { key: 'L', width: 35 },
        { key: 'M', width: 25 },
        { key: 'N', width: 25 }
      ];

      // Adding data rows
      rows.forEach((row, rowIndex) => {
        const excelRow = worksheet.getRow(rowIndex+3); // Start from row 3
        excelRow.getCell('A').value = row.extract_department,
        excelRow.getCell('B').value = row.profile,
        excelRow.getCell('C').value = row.total_plan_1 == null ? '' : formatNumber(row.total_plan_1),
        excelRow.getCell('D').value = row.total_payment_amount_1 == null ? '' : formatNumber(row.total_payment_amount_1),
        excelRow.getCell('E').value = row.total_plan_complete_1 == null ? '' : formatNumber(row.total_plan_complete_1),
        excelRow.getCell('F').value = row.total_sum_count_treated_1 == null ? '' : formatNumber(row.total_sum_count_treated_1),
        excelRow.getCell('G').value = row.total_plan_2 == null ? '' : formatNumber(row.total_plan_2),
        excelRow.getCell('H').value = row.total_payment_amount_2 == null ? '' : formatNumber(row.total_payment_amount_2),
        excelRow.getCell('I').value = row.total_plan_complete_2 == null ? '' : formatNumber(row.total_plan_complete_2),
        excelRow.getCell('J').value = row.total_sum_count_treated_2 == null ? '' : formatNumber(row.total_sum_count_treated_2),
        excelRow.getCell('K').value = row.total_plan_3 == null ? '' : formatNumber(row.total_plan_3),
        excelRow.getCell('L').value = row.total_payment_amount_3 == null ? '' : formatNumber(row.total_payment_amount_3),
        excelRow.getCell('M').value = row.total_plan_complete_3 == null ? '' : formatNumber(row.total_plan_complete_3),
        excelRow.getCell('N').value = row.total_sum_count_treated_3 == null ? '' : formatNumber(row.total_sum_count_treated_3)

        // Center align the cells
        excelRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        excelRow.commit(); // Save the row to the worksheet
      });
  } else if (reportType === 'Report_3') {
    // Adding column headers
    // Define the top headers
    worksheet.getCell('D1').value = 'Активы Фонда на ОСМС';
    // Merge cells for the top headers
    worksheet.mergeCells('D1', 'G1'); // Merges C1 to F1
    // Define the lower headers
    worksheet.getCell('A2').value = 'Год';
    worksheet.getCell('B2').value = 'Месяц';
    worksheet.getCell('C2').value = 'Профиль';
    worksheet.getCell('D2').value = 'План, тг';
    worksheet.getCell('E2').value = 'Предъявленная сумма к оплате';
    worksheet.getCell('F2').value = '% Исполнения';
    worksheet.getCell('G2').value = 'Количество случаев';

    query = 'SELECT month, year, profile, plan, payment_amount, patient_count, plan_complete FROM prod.dialis_chamber WHERE 1=1';

    if (month) {
      query += ` AND month = $${queryParams.length + 1}`;
      queryParams.push(month);
    }
    if (year) {
      query += ` AND year = $${queryParams.length + 1}`;
      queryParams.push(year);
    }
    if (profile) {
      query += ` AND profile ILIKE $${queryParams.length + 1}`;
      queryParams.push(profile);
    }
    query += ` LIMIT ${limit} OFFSET ${offset}`;

  const queryResult = await db.query(query, queryParams);
  const rows = queryResult.rows;

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(2).font = { bold: true };
  worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true};
  worksheet.getRow(1).alignment = { horizontal: 'center' };

   // Set specific column widths
  worksheet.columns = [
    { key: 'A', width: 15 }, // Column A width
    { key: 'B', width: 15 }, // Column B width
    { key: 'C', width: 35 }, // Column C width
    { key: 'D', width: 25 }, // Column D width
    { key: 'E', width: 25 }, // Column E width
    { key: 'F', width: 25 },  // Column F width
    { key: 'G', width: 25 }
  ];

  // Adding data rows
  rows.forEach((row, rowIndex) => {
    const excelRow = worksheet.getRow(rowIndex+3); // Start from row 3
    excelRow.getCell('A').value = row.year,
    excelRow.getCell('B').value = row.month,
    excelRow.getCell('C').value = row.profile,
    excelRow.getCell('D').value = row.plan == null ? '' : formatNumberWithSpaces(row.plan),
    excelRow.getCell('E').value = row.payment_amount == null ? '' : formatNumberWithSpaces(row.payment_amount),
    excelRow.getCell('F').value = row.plan_complete == null ? '' : formatNumberWithSpaces(row.plan_complete),
    excelRow.getCell('G').value = row.patient_count
    // Center align the cells
    excelRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    excelRow.commit(); // Save the row to the worksheet
  });
}  else if (reportType === 'Report_4') {
  // Adding column headers

  // Define the lower headers
  worksheet.getCell('A1').value = 'Наименование отделения';
  worksheet.getCell('B1').value = 'Всего пролечено за отчетный период';
  worksheet.getCell('C1').value = 'Количество случаев с весовым коэффицентом до 0.5';
  worksheet.getCell('D1').value = 'Количество случаев с весовым коэффицентом от 0.5 до 1';
  worksheet.getCell('E1').value = 'Количество случаев с весовым коэффицентом от 1 до 2';
  worksheet.getCell('F1').value = 'Количество случаев с весовым коэффицентом от 2 до 3';
  worksheet.getCell('G1').value = 'Количество случаев с весовым коэффицентом от 3 до 5';
  worksheet.getCell('H1').value = 'Количество случаев с весовым коэффицентом от 5 до 10';
  worksheet.getCell('I1').value = 'Количество случаев с весовым коэффицентом от 10 до 20';
  worksheet.getCell('J1').value = 'Количество случаев с весовым коэффицентом от 20 до 30';
  worksheet.getCell('K1').value = 'Количество случаев с весовым коэффицентом свыше 30';

  query = 'SELECT * FROM prod.weight_factor_report WHERE 1=1';

  if (dateFrom) {
    query += ` AND start_date >= $${queryParams.length + 1}`;
    queryParams.push(`%${dateFrom}%`);
  } 
  if (dateTo) {
    query += ` AND end_date <= $${queryParams.length + 1}`;
    queryParams.push(`%${dateTo}%`);
  } 
  if (department_name) {
    query += ` AND department_description ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${department_name}%`);
  }
  query += ` LIMIT ${limit} OFFSET ${offset}`;

const queryResult = await db.query(query, queryParams);
const rows = queryResult.rows;

worksheet.getRow(1).font = { bold: true };
worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true};
worksheet.getRow(2).alignment = { horizontal: 'center' };

 // Set specific column widths
worksheet.columns = [
  { key: 'A', width: 50 }, // Column A width
  { key: 'B', width: 50 }, // Column B width
  { key: 'C', width: 25 }, // Column C width
  { key: 'D', width: 35 }, // Column D width
  { key: 'E', width: 25 }, // Column E width
  { key: 'F', width: 25 },  // Column F width
  { key: 'G', width: 25 },
  { key: 'H', width: 35 },
  { key: 'I', width: 25 },
  { key: 'J', width: 25 },
  { key: 'K', width: 25 }
];

// Adding data rows
rows.forEach((row, rowIndex) => {
  const excelRow = worksheet.getRow(rowIndex+2); // Start from row 3
  excelRow.getCell('A').value = row.department_description,
  excelRow.getCell('B').value = row.total_treated,
  excelRow.getCell('C').value = row.cases_weight_0_5,
  excelRow.getCell('D').value = row.cases_weight_0_5_1,
  excelRow.getCell('E').value = row.cases_weight_1_2,
  excelRow.getCell('F').value = row.cases_weight_2_3,
  excelRow.getCell('G').value = row.cases_weight_3_5,
  excelRow.getCell('H').value = row.cases_weight_5_10,
  excelRow.getCell('I').value = row.cases_weight_10_20,
  excelRow.getCell('J').value = row.cases_weight_20_30,
  excelRow.getCell('K').value = row.cases_weight_30_m,
  // Center align the cells
  excelRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  excelRow.commit(); // Save the row to the worksheet
});
} else if (reportType === 'Report_5') {
  // Adding column headers
  // Define the top headers
  worksheet.getCell('E1').value = 'дети 6-10 мес.';
  worksheet.getCell('H1').value = 'дети 2-4 года';
  worksheet.getCell('K1').value = 'наверстывающий от 5 лет';
  worksheet.getCell('N1').value = 'медработники';
  worksheet.getCell('Q1').value = 'выполнение всего';

  // Merge cells for the top headers
  worksheet.mergeCells('E1', 'G1'); // Merges C1 to F1
  worksheet.mergeCells('H1', 'J1'); // Merges G1 to J1
  worksheet.mergeCells('K1', 'M1'); // Merges K1 to N1
  worksheet.mergeCells('N1', 'P1'); // Merges K1 to N1

  // Define the lower headers
  worksheet.getCell('A2').value = 'Наименование ЦСЗ,ЦПМСП и СВА ';
  worksheet.getCell('B2').value = 'Ф.И.О. врача';
  worksheet.getCell('C2').value = '№';
  worksheet.getCell('D2').value = 'ДМИ план всего';
  worksheet.getCell('E2').value = 'подлежит по РПН';
  worksheet.getCell('F2').value = 'выполнение';
  worksheet.getCell('G2').value = '% выполнения';
  worksheet.getCell('H2').value = 'подлежит по РПН';
  worksheet.getCell('I2').value = 'выполнение';
  worksheet.getCell('J2').value = '% выполнения';
  worksheet.getCell('K2').value = 'подлежит по РПН';
  worksheet.getCell('L2').value = 'выполнение';
  worksheet.getCell('M2').value = '% Исполнения';
  worksheet.getCell('N2').value = 'подлежит по РПН';
  worksheet.getCell('O2').value = 'выполнение';
  worksheet.getCell('P2').value = '% Исполнения';
  worksheet.getCell('Q2').value = 'выполнение';
  worksheet.getCell('R2').value = '% Исполнения';
  


  main_query_1 = "SELECT "+
      "md.medicine_department_name, "+
      "md.doctor_full_name, "+
      "md.district_number, "+
      "SUM(md.dmi_plan) AS dmi_plan, "+
      "MAX(c1.plan) AS plan_дети_6_10_месяцев, "+
      "MAX(c1.completed) AS completed_дети_6_10_месяцев, "+
      "MAX(c1.category_completed_percent) AS category_completed_percent_дети_6_10_месяцев, "+
      "MAX(c1.total_department_category_plan) AS total_department_category_plan_дети_6_10_месяцев, "+
      "MAX(c1.total_department_category_completed) AS total_department_category_completed_6_10_месяцев, "+
      "MAX(c1.total_department_category_completed_percent) AS total_department_category_completed_percent_6_10_месяцев, "+
      "MAX(c1.total_emcrb_category_plan) AS total_emcrb_category_plan_дети_6_10_месяцев, "+
	    "MAX(c1.total_emcrb_category_completed) AS total_emcrb_category_completed_дети_6_10_месяцев, "+
	    "MAX(c1.total_emcrb_category_completed_percent) AS total_emcrb_category_completed_percent_дети_6_10_месяц, "+
      "MAX(c2.plan) AS plan_дети_2_4_года, "+
      "MAX(c2.completed) AS completed_дети_2_4_года, "+
      "MAX(c2.category_completed_percent) AS category_completed_percent_дети_2_4_года, "+
      "MAX(c2.total_department_category_plan) AS total_department_category_plan_дети_2_4_года, "+
      "MAX(c2.total_department_category_completed) AS total_department_category_completed_дети_2_4_года, "+
      "MAX(c2.total_department_category_completed_percent) AS total_department_category_completed_percent_дети_2_4_года, "+
      "MAX(c2.total_emcrb_category_plan) AS total_emcrb_category_plan_дети_2_4_года, "+
      "MAX(c2.total_emcrb_category_completed) AS total_emcrb_category_completed_дети_2_4_года, "+
      "MAX(c2.total_emcrb_category_completed_percent) AS total_emcrb_category_completed_percent_дети_2_4_года, "+
      "MAX(c3.plan) AS plan_наверстывающий, "+
      "MAX(c3.completed) AS completed_наверстывающий, "+
      "MAX(c3.category_completed_percent) AS category_completed_percent_наверстывающий, "+
      "MAX(c3.total_department_category_plan) AS total_department_category_plan_наверстывающий, "+
      "MAX(c3.total_department_category_completed) AS total_department_category_completed_наверстывающий, "+
      "MAX(c3.total_department_category_completed_percent) AS total_department_category_completed_percent_наверстывающий, "+
      "MAX(c3.total_emcrb_category_plan) AS total_emcrb_category_plan_наверстывающий, "+
	    "MAX(c3.total_emcrb_category_completed) AS total_emcrb_category_completed_наверстывающий, "+
      "MAX(c3.total_emcrb_category_completed_percent) AS total_emcrb_category_completed_percent_наверстывающий, "+
      "MAX(c4.plan) AS plan_медработники, "+
      "MAX(c4.completed) AS completed_медработники, "+
      "MAX(c4.category_completed_percent) AS category_completed_percent_медработники, "+
      "MAX(c4.total_department_category_plan) AS total_department_category_plan_медработники, "+
      "MAX(c4.total_department_category_completed) AS total_department_category_completed_медработники, "+
      "MAX(c4.total_department_category_completed_percent) AS total_department_category_completed_percent_медработники, "+
      "MAX(c4.total_emcrb_category_plan) AS total_emcrb_category_plan_медработники, "+
      "MAX(c4.total_emcrb_category_completed) AS total_emcrb_category_completed_медработники, "+
      "MAX(c4.total_emcrb_category_completed_percent) AS total_emcrb_category_completed_percent_медработники, "+
      "MAX(md.total_completed) AS total_completed, "+
      "MAX(md.district_completed_percent) AS district_completed_percent, "+
      "MAX(md.total_emcrb_dmi_plan) AS total_emcrb_dmi_plan, "+
      "MAX(md.total_emcrb_completed) AS total_emcrb_completed, "+
      "MAX(md.total_emcrb_completed_percent) AS total_emcrb_completed_percent, "+
      "MAX(md.total_department_dmi_plan) AS total_department_dmi_plan "+
      "FROM "+
      "prod.dmi_completion md "+
      "LEFT JOIN ( "+
        "SELECT "+
        "medicine_department_name, "+
        "doctor_full_name, "+
        "district_number, "+
        "plan, "+
        "completed, "+
        "category_completed_percent, "+
        "total_department_category_plan, "+
        "total_department_category_completed, "+
        "total_department_category_completed_percent, "+
        "total_emcrb_category_plan, "+
        "total_emcrb_category_completed, "+
        "total_emcrb_category_completed_percent "+
        "FROM "+
        "prod.dmi_completion "+
        "WHERE "+
        "category = 'дети 6-10 месяцев' "+
      ") c1 ON md.medicine_department_name = c1.medicine_department_name "+
      "AND md.doctor_full_name = c1.doctor_full_name "+
      "AND md.district_number = c1.district_number "+
      "LEFT JOIN ( "+
        "SELECT "+
        "medicine_department_name, "+
        "doctor_full_name, "+
        "district_number, "+
        "plan, "+
        "completed, "+
        "category_completed_percent, "+
        "total_department_category_plan, "+
        "total_department_category_completed, "+
        "total_department_category_completed_percent, "+
        "total_emcrb_category_plan, "+
        "total_emcrb_category_completed, "+
        "total_emcrb_category_completed_percent "+
        "FROM "+
        "prod.dmi_completion "+
        "WHERE "+
        "category = 'дети 2-4 года'"+
      ") c2 ON md.medicine_department_name = c2.medicine_department_name "+
      "AND md.doctor_full_name = c2.doctor_full_name "+
      "AND md.district_number = c2.district_number "+
      "LEFT JOIN ( "+
        "SELECT "+
        "medicine_department_name, "+
        "doctor_full_name, "+
        "district_number, "+
        "plan, "+
        "completed, "+
        "category_completed_percent, "+
        "total_department_category_plan, "+
        "total_department_category_completed, "+
        "total_department_category_completed_percent, "+
        "total_emcrb_category_plan, "+
        "total_emcrb_category_completed, "+
        "total_emcrb_category_completed_percent "+
        "FROM "+
        "prod.dmi_completion "+
        "WHERE "+
        "category = 'наверстывающий'"+
      ") c3 ON md.medicine_department_name = c3.medicine_department_name "+
      "AND md.doctor_full_name = c3.doctor_full_name "+
      "AND md.district_number = c3.district_number "+
      "LEFT JOIN ( "+
        "SELECT "+
        "medicine_department_name, "+
        "doctor_full_name, "+
        "district_number, "+
        "plan, "+
        "completed, "+
        "category_completed_percent, "+
        "total_department_category_plan, "+
        "total_department_category_completed, "+
        "total_department_category_completed_percent, "+
        "total_emcrb_category_plan, "+
        "total_emcrb_category_completed, "+
        "total_emcrb_category_completed_percent "+
        "FROM "+
        "prod.dmi_completion "+
        "WHERE "+
        "category = 'медработники'"+
    ") c4 ON md.medicine_department_name = c4.medicine_department_name "+
      "AND md.doctor_full_name = c4.doctor_full_name "+
      "AND md.district_number = c4.district_number WHERE 1=1 ";

      main_query_2 = " GROUP BY "+
      "md.medicine_department_name, "+
      "md.doctor_full_name, "+
      "md.district_number";

      if (medicine_department_name) {
        main_query_1 += ` AND md.medicine_department_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${medicine_department_name}%`);
      }
      if (doctor) {
        main_query_1 += ` AND md.doctor_full_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${doctor}%`);
      }
      if (district_number) {
        main_query_1 += ` AND md.district_number ILIKE $${queryParams.length + 1}`;
        queryParams.push(district_number);
      }

      query = main_query_1+main_query_2;

// Fetching data for the Excel file
const queryResult = await db.query(query, queryParams);
const rows = queryResult.rows;

worksheet.getRow(1).font = { bold: true };
worksheet.getRow(2).font = { bold: true };
worksheet.getRow(1).alignment = { horizontal: 'center' };
worksheet.getRow(2).alignment = { horizontal: 'center' };

 // Set specific column widths
worksheet.columns = [
  { key: 'A', width: 60 }, // Column A width
  { key: 'B', width: 60 }, // Column B width
  { key: 'C', width: 10 }, // Column C width
  { key: 'D', width: 25 }, // Column D width
  { key: 'E', width: 25 }, // Column E width
  { key: 'F', width: 25 },  // Column F width
  { key: 'G', width: 25 },
  { key: 'H', width: 25 },
  { key: 'I', width: 25 },
  { key: 'J', width: 25 },
  { key: 'K', width: 25 },
  { key: 'L', width: 25 },
  { key: 'M', width: 25 },
  { key: 'N', width: 25 },
  { key: 'O', width: 25 },
  { key: 'P', width: 25 },
  { key: 'Q', width: 25 },
  { key: 'R', width: 25 },
];

let cur_medicine_department_name = '';
let prev_medicine_department_name = '';
let inserCondition = false;
let Occurences = 0;
// Adding data rows
let rowIndex = 3; // Start from row 3



// Buffers to hold non null values for totals
let _total_department_category_plan_дети_6_10_месяцев;
let _total_department_category_completed_6_10_месяцев;
let _total_department_category_completed_percent_6_10_месяцев;
let _total_department_category_plan_дети_2_4_года;
let _total_department_category_completed_дети_2_4_года;
let _total_department_category_completed_percent_дети_2_4_год;
let _total_department_category_plan_наверстывающий;
let _total_department_category_completed_наверстывающи;
let _total_department_category_completed_percent_наверстыв;
let _total_department_category_plan_медработники;
let _total_department_category_completed_медработники;
let _total_department_category_completed_percent_медработн;

let _total_emcrb_dmi_plan;
let _total_emcrb_category_plan_дети_6_10_месяцев;
let _total_emcrb_category_completed_дети_6_10_месяцев;
let _total_emcrb_category_completed_percent_дети_6_10_месяц;
let _total_emcrb_category_plan_дети_2_4_года;
let _total_emcrb_category_completed_дети_2_4_года;
let _total_emcrb_category_completed_percent_дети_2_4_года;
let _total_emcrb_category_plan_наверстывающий;
let _total_emcrb_category_completed_наверстывающий;
let _total_emcrb_category_completed_percent_наверстывающ;
let _total_emcrb_category_plan_медработники;
let _total_emcrb_category_completed_медработники;
let _total_emcrb_category_completed_percent_медработники;
let _total_emcrb_completed;
let _total_emcrb_completed_percen;

rows.forEach((row, index) => {
  cur_medicine_department_name = row.medicine_department_name;
  if(cur_medicine_department_name != prev_medicine_department_name){
    prev_medicine_department_name = cur_medicine_department_name;
    Occurences++;
    if(Occurences > 1){
      inserCondition = true;
    }
  }

  //if(row.total_department_category_plan_дети_6_10_месяцев)
  //  _total_department_category_plan_дети_6_10_месяцев = row.total_department_category_plan_дети_6_10_месяцев;

  _total_department_category_plan_дети_6_10_месяцев = row.total_department_category_plan_дети_6_10_месяцев || _total_department_category_plan_дети_6_10_месяцев;
  _total_department_category_completed_6_10_месяцев = row.total_department_category_completed_6_10_месяцев || _total_department_category_completed_6_10_месяцев;
  _total_department_category_completed_percent_6_10_месяцев = row.total_department_category_completed_percent_6_10_месяцев || _total_department_category_completed_percent_6_10_месяцев;
  _total_department_category_plan_дети_2_4_года = row.total_department_category_plan_дети_2_4_года || _total_department_category_plan_дети_2_4_года;
  _total_department_category_completed_дети_2_4_года = row.total_department_category_completed_дети_2_4_года || _total_department_category_completed_дети_2_4_года;
  _total_department_category_completed_percent_дети_2_4_год = row.total_department_category_completed_percent_дети_2_4_год || _total_department_category_completed_percent_дети_2_4_год;
  _total_department_category_plan_наверстывающий = row.total_department_category_plan_наверстывающий || _total_department_category_plan_наверстывающий;
  _total_department_category_completed_наверстывающи = row.total_department_category_completed_наверстывающи || _total_department_category_completed_наверстывающи;
  _total_department_category_completed_percent_наверстыв = row.total_department_category_completed_percent_наверстыв || _total_department_category_completed_percent_наверстыв;
  _total_department_category_plan_медработники = row.total_department_category_plan_медработники || _total_department_category_plan_медработники;
  _total_department_category_completed_медработники = row.total_department_category_completed_медработники || _total_department_category_completed_медработники;
  _total_department_category_completed_percent_медработн = row.total_department_category_completed_percent_медработн || _total_department_category_completed_percent_медработн;

  _total_emcrb_dmi_plan = row.total_emcrb_dmi_plan || _total_emcrb_dmi_plan;
  _total_emcrb_category_plan_дети_6_10_месяцев = row.total_emcrb_category_plan_дети_6_10_месяцев || _total_emcrb_category_plan_дети_6_10_месяцев;
  _total_emcrb_category_completed_дети_6_10_месяцев = row.total_emcrb_category_completed_дети_6_10_месяцев || _total_emcrb_category_completed_дети_6_10_месяцев;
  _total_emcrb_category_completed_percent_дети_6_10_месяц = row.total_emcrb_category_completed_percent_дети_6_10_месяц || _total_emcrb_category_completed_percent_дети_6_10_месяц;
  _total_emcrb_category_plan_дети_2_4_года = row.total_emcrb_category_plan_дети_2_4_года || _total_emcrb_category_plan_дети_2_4_года;
  _total_emcrb_category_completed_дети_2_4_года = row.total_emcrb_category_completed_дети_2_4_года || _total_emcrb_category_completed_дети_2_4_года;
  _total_emcrb_category_completed_percent_дети_2_4_года = row.total_emcrb_category_completed_percent_дети_2_4_года || _total_emcrb_category_completed_percent_дети_2_4_года;
  _total_emcrb_category_plan_наверстывающий = row.total_emcrb_category_plan_наверстывающий || _total_emcrb_category_plan_наверстывающий;
  _total_emcrb_category_completed_наверстывающий = row.total_emcrb_category_completed_наверстывающий || _total_emcrb_category_completed_наверстывающий;
  _total_emcrb_category_completed_percent_наверстывающ = row.total_emcrb_category_completed_percent_наверстывающ || _total_emcrb_category_completed_percent_наверстывающ;
  _total_emcrb_category_plan_медработники = row.total_emcrb_category_plan_медработники || _total_emcrb_category_plan_медработники;
  _total_emcrb_category_completed_медработники = row.total_emcrb_category_completed_медработники || _total_emcrb_category_completed_медработники;
  _total_emcrb_category_completed_percent_медработники = row.total_emcrb_category_completed_percent_медработники || _total_emcrb_category_completed_percent_медработники;
  _total_emcrb_completed = row.total_emcrb_completed || _total_emcrb_completed;
  _total_emcrb_completed_percent = row.total_emcrb_completed_percent || _total_emcrb_completed_percent;
   // Check the condition for medicine_department_name
   if (inserCondition) {  
    // Insert a new row below the current row
    //rowIndex++;
    //console.log('!!!!!!!!!!!!!!!   inserCondition !!!!!!!!!!!!!!!!!  rowIndex: ' + rowIndex);
    //console.log(row.medicine_department_name);
    //rowIndex++; // Increment rowIndex for the next main row
    const excelRow = worksheet.getRow(rowIndex); // Start from row 3
    excelRow.getCell('A').value = '',
    excelRow.getCell('B').value = 'Итого',
    excelRow.getCell('C').value = '',
    excelRow.getCell('D').value = row.total_department_dmi_plan,
    excelRow.getCell('E').value = _total_department_category_plan_дети_6_10_месяцев,//row.total_department_category_plan_дети_6_10_месяцев,
    excelRow.getCell('F').value = _total_department_category_completed_6_10_месяцев,
    excelRow.getCell('G').value = _total_department_category_completed_percent_6_10_месяцев,
    excelRow.getCell('H').value = _total_department_category_plan_дети_2_4_года,
    excelRow.getCell('I').value = _total_department_category_completed_дети_2_4_года,
    excelRow.getCell('J').value = _total_department_category_completed_percent_дети_2_4_год,
    excelRow.getCell('K').value = _total_department_category_plan_наверстывающий,
    excelRow.getCell('L').value = _total_department_category_completed_наверстывающи,
    excelRow.getCell('M').value = _total_department_category_completed_percent_наверстыв,
    excelRow.getCell('N').value = _total_department_category_plan_медработники,
    excelRow.getCell('O').value = _total_department_category_completed_медработники,
    excelRow.getCell('P').value = _total_department_category_completed_percent_медработн,
    excelRow.getCell('Q').value = row.total_completed,
    excelRow.getCell('R').value = row.district_completed_percent,

    // Center align the cells
    excelRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    excelRow.commit(); // Save the row to the worksheet

    // Increment the rowIndex to account for the inserted row
    //rowIndex++;
    inserCondition = false;
    Occurences = 1;
    rowIndex++;
  }

  //console.log('rowIndex: ' + rowIndex + ', medicine_department_name: ' + row.medicine_department_name + '___row.total_department_category_plan_дети_6_10_месяцев: ' + row.total_department_category_plan_дети_6_10_месяцев);
  const excelRow = worksheet.getRow(rowIndex); // Start from row 3
  excelRow.getCell('A').value = row.medicine_department_name,
  excelRow.getCell('B').value = row.doctor_full_name,
  excelRow.getCell('C').value = row.district_number,
  excelRow.getCell('D').value = row.dmi_plan,// == null ? '' : formatNumberWithSpaces(row.dmi_plan),
  excelRow.getCell('E').value = row.plan_дети_6_10_месяцев,
  excelRow.getCell('F').value = row.completed_дети_6_10_месяцев,
  excelRow.getCell('G').value = row.category_completed_percent_дети_6_10_месяцев,// == null ? '' : formatNumberWithSpaces(row.category_completed_percent_дети_6_10_месяцев),
  excelRow.getCell('H').value = row.plan_дети_2_4_года,// == null ? '' : formatNumberWithSpaces(row.plan_дети_2_4_года),
  excelRow.getCell('I').value = row.completed_дети_2_4_года,
  excelRow.getCell('J').value = row.category_completed_percent_дети_2_4_года,
  excelRow.getCell('K').value = row.plan_наверстывающий,// == null ? '' : formatNumberWithSpaces(row.plan_наверстывающий),
  excelRow.getCell('L').value = row.completed_наверстывающий,// == null ? '' : formatNumberWithSpaces(row.completed_наверстывающий),
  excelRow.getCell('M').value = row.category_completed_percent_наверстывающий,
  excelRow.getCell('N').value = row.plan_медработники,
  excelRow.getCell('O').value = row.completed_медработники,
  excelRow.getCell('P').value = row.category_completed_percent_медработники,
  excelRow.getCell('Q').value = row.total_completed,
  excelRow.getCell('R').value = row.district_completed_percent

  // Center align the cells
  excelRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  excelRow.commit(); // Save the row to the worksheet

  rowIndex++;


// Check if it's the last iteration
if (index === rows.length - 1){
  //console.log('index: ' + index + ', rows.length - 1: ' + (rows.length - 1));
    // Insert a new row below the current row
    //console.log('!!!!!!!!!!!!!!!   inserCondition !!!!!!!!!!!!!!!!!  rowIndex: ' + rowIndex);
    //console.log(row.medicine_department_name);
    //rowIndex++; // Increment rowIndex for the next main row
    const excelRow = worksheet.getRow(rowIndex); // Start from row 3
    excelRow.getCell('A').value = '',
    excelRow.getCell('B').value = 'Итого',
    excelRow.getCell('C').value = '',
    excelRow.getCell('D').value = row.total_department_dmi_plan,
    excelRow.getCell('E').value = _total_department_category_plan_дети_6_10_месяцев,//row.total_department_category_plan_дети_6_10_месяцев,
    excelRow.getCell('F').value = _total_department_category_completed_6_10_месяцев,
    excelRow.getCell('G').value = _total_department_category_completed_percent_6_10_месяцев,
    excelRow.getCell('H').value = _total_department_category_plan_дети_2_4_года,
    excelRow.getCell('I').value = _total_department_category_completed_дети_2_4_года,
    excelRow.getCell('J').value = _total_department_category_completed_percent_дети_2_4_год,
    excelRow.getCell('K').value = _total_department_category_plan_наверстывающий,
    excelRow.getCell('L').value = _total_department_category_completed_наверстывающи,
    excelRow.getCell('M').value = _total_department_category_completed_percent_наверстыв,
    excelRow.getCell('N').value = _total_department_category_plan_медработники,
    excelRow.getCell('O').value = _total_department_category_completed_медработники,
    excelRow.getCell('P').value = _total_department_category_completed_percent_медработн,
    excelRow.getCell('Q').value = row.total_completed,
    excelRow.getCell('R').value = row.district_completed_percent,

    // Center align the cells
    excelRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    excelRow.commit(); // Save the row to the worksheet

    // Increment the rowIndex to account for the inserted row
    //rowIndex++;
    inserCondition = false;
    Occurences = 1;
    rowIndex++;

    // Inserting the total EMCRB at the very end
    const excelRow1 = worksheet.getRow(rowIndex); // Start from row 3
    excelRow1.getCell('A').value = '',
    excelRow1.getCell('B').value = 'Итого по ЕМЦРБ',
    excelRow1.getCell('C').value = '',
    excelRow1.getCell('D').value = _total_emcrb_dmi_plan,
    excelRow1.getCell('E').value = _total_emcrb_category_plan_дети_6_10_месяцев,//row.total_department_category_plan_дети_6_10_месяцев,
    excelRow1.getCell('F').value = _total_emcrb_category_completed_дети_6_10_месяцев,
    excelRow1.getCell('G').value = _total_emcrb_category_completed_percent_дети_6_10_месяц,
    excelRow1.getCell('H').value = _total_emcrb_category_plan_дети_2_4_года,
    excelRow1.getCell('I').value = _total_emcrb_category_completed_дети_2_4_года,
    excelRow1.getCell('J').value = _total_emcrb_category_completed_percent_дети_2_4_года,
    excelRow1.getCell('K').value = _total_emcrb_category_plan_наверстывающий,
    excelRow1.getCell('L').value = _total_emcrb_category_completed_наверстывающий,
    excelRow1.getCell('M').value = _total_emcrb_category_completed_percent_наверстывающ,
    excelRow1.getCell('N').value = _total_emcrb_category_plan_медработники,
    excelRow1.getCell('O').value = _total_emcrb_category_completed_медработники,
    excelRow1.getCell('P').value = _total_emcrb_category_completed_percent_медработники,
    excelRow1.getCell('Q').value = _total_emcrb_completed,
    excelRow1.getCell('R').value = _total_emcrb_completed_percent,

    // Center align the cells
    excelRow1.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    excelRow1.commit(); // Save the row to the worksheet
}

});
} else if (reportType === 'Report_6') {
  // Adding column headers
  // Define the top headers
  worksheet.getCell('C1').value = 'ОСМС';
  worksheet.getCell('G1').value = 'ГОБМП';
  worksheet.getCell('K1').value = 'Нац.фонд';

  // Merge cells for the top headers
  worksheet.mergeCells('C1', 'H1'); // Merges C1 to F1
  worksheet.mergeCells('I1', 'N1'); // Merges G1 to J1
  worksheet.mergeCells('O1', 'T1'); // Merges K1 to N1

  // Define the lower headers
  worksheet.getCell('A2').value = 'Отделение';
  worksheet.getCell('B2').value = 'Всего';
  worksheet.getCell('C2').value = 'кол-во пациентов экстренно';
  worksheet.getCell('D2').value = '% вып.пациентов экстренно';
  worksheet.getCell('E2').value = 'сумма';
  worksheet.getCell('F2').value = 'кол-во пациентов плановых';
  worksheet.getCell('G2').value = '%вып., пациентов плановых';
  worksheet.getCell('H2').value = 'сумма';

  worksheet.getCell('I2').value = 'кол-во пациентов экстренно';
  worksheet.getCell('J2').value = '% вып.пациентов экстренно';
  worksheet.getCell('K2').value = 'сумма';
  worksheet.getCell('L2').value = 'кол-во пациентов плановых';
  worksheet.getCell('M2').value = '%вып., пациентов плановых';
  worksheet.getCell('N2').value = 'сумма';
  
  worksheet.getCell('O2').value = 'кол-во пациентов экстренно';
  worksheet.getCell('P2').value = '% вып.пациентов экстренно';
  worksheet.getCell('Q2').value = 'сумма';
  worksheet.getCell('R2').value = 'кол-во пациентов плановых';
  worksheet.getCell('S2').value = '%вып., пациентов плановых';
  worksheet.getCell('T2').value = 'сумма';

  main_query_1 = "WITH osms_data AS (" +
        "SELECT " +
        "extract_department, " +
        "total AS total_1, " +
        "urgently_patient_count AS urgently_patient_count_1, " +
        "percent_urgently_patient AS percent_urgently_patient_1, " +
        "urgently_patient_amount AS urgently_patient_amount_1, " +
        "planned_patient_count AS planned_patient_count_1, " +
        "percent_planned_patient AS percent_planned_patient_1, " +
        "planned_patient_amount AS planned_patient_amount_1, " +
        "null::integer AS urgently_patient_count_2, " +
        "null::numeric AS percent_urgently_patient_2, " +
        "null::integer AS urgently_patient_amount_2, " +
        "null::integer AS planned_patient_count_2, " +
        "null::integer AS percent_planned_patient_2, " +
        "null::integer AS planned_patient_amount_2, " +
        "null::integer AS urgently_patient_count_3, " +
        "null::numeric AS percent_urgently_patient_3, " +
        "null::integer AS urgently_patient_amount_3, " +
        "null::integer AS planned_patient_count_3, " +
        "null::integer AS percent_planned_patient_3, " +
        "null::integer AS planned_patient_amount_3 " +
        "FROM  " +
        "prod.plan_urgently_completion " +
        "WHERE " +
        "finance_source = 'ОСМС'";

      main_query_2 = "), "+
      "bp067_pp100_data AS ("+
          "SELECT "+
          "extract_department, "+
          "total AS total_1, "+
          "null::integer AS urgently_patient_count_1, "+
          "null::numeric AS percent_urgently_patient_1, "+
          "null::integer AS urgently_patient_amount_1, "+
          "null::integer AS planned_patient_count_1, "+
          "null::integer AS percent_planned_patient_1, "+
          "null::integer AS planned_patient_amount_1, "+
          "urgently_patient_count AS urgently_patient_count_2, "+
          "percent_urgently_patient AS percent_urgently_patient_2, "+
          "urgently_patient_amount AS urgently_patient_amount_2, "+
          "planned_patient_count AS planned_patient_count_2, "+
          "percent_planned_patient AS percent_planned_patient_2, "+
          "planned_patient_amount AS planned_patient_amount_2, "+
          "null::integer AS urgently_patient_count_3, "+
          "null::numeric AS percent_urgently_patient_3, "+
          "null::integer AS urgently_patient_amount_3, "+
          "null::integer AS planned_patient_count_3, "+
          "null::integer AS percent_planned_patient_3, "+
          "null::integer AS planned_patient_amount_3 "+
          "FROM "+
          "prod.plan_urgently_completion "+
          "WHERE "+
          "finance_source = 'ГОБМП'";
              
      main_query_3 = "), "+
      "nacfond_data AS ("+
          "SELECT "+
              "extract_department,"+
              "total AS total_1, "+
              "null::integer AS urgently_patient_count_1, "+
              "null::numeric AS percent_urgently_patient_1, "+
              "null::integer AS urgently_patient_amount_1, "+
              "null::integer AS planned_patient_count_1, "+
              "null::integer AS percent_planned_patient_1, "+
              "null::integer AS planned_patient_amount_1, "+
              "null::integer AS urgently_patient_count_2, "+
              "null::numeric AS percent_urgently_patient_2, "+
              "null::integer AS urgently_patient_amount_2, "+
              "null::integer AS planned_patient_count_2, "+
              "null::integer AS percent_planned_patient_2, "+
              "null::integer AS planned_patient_amount_2, "+
              "urgently_patient_count AS urgently_patient_count_3, "+
              "percent_urgently_patient AS percent_urgently_patient_3, "+
              "urgently_patient_amount AS urgently_patient_amount_3, "+
              "planned_patient_count AS planned_patient_count_3, "+
              "percent_planned_patient AS percent_planned_patient_3, "+
              "planned_patient_amount AS planned_patient_amount_3 "+
              "FROM  "+
              "prod.plan_urgently_completion "+
              "WHERE  "+
              "finance_source = 'Нац.Фонд'";

      main_query_4 = ")"+
      //"-- Combining the subqueries with UNION"+
      " SELECT "+
          "extract_department, "+
          "SUM(total_1) AS total_1, "+ 
          "SUM(urgently_patient_count_1) AS urgently_patient_count_1, "+
          "AVG(percent_urgently_patient_1) AS percent_urgently_patient_1, "+
          "SUM(urgently_patient_amount_1) AS urgently_patient_amount_1, "+
          "SUM(planned_patient_count_1) AS planned_patient_count_1, "+
          "AVG(percent_planned_patient_1) AS percent_planned_patient_1, "+
          "SUM(planned_patient_amount_1) AS planned_patient_amount_1, "+
          "SUM(urgently_patient_count_2) AS urgently_patient_count_2, "+
          "AVG(percent_urgently_patient_2) AS percent_urgently_patient_2, "+
          "SUM(urgently_patient_amount_2) AS urgently_patient_amount_2, "+
          "SUM(planned_patient_count_2) AS planned_patient_count_2, "+
          "AVG(percent_planned_patient_2) AS percent_planned_patient_2, "+
          "SUM(planned_patient_amount_2) AS planned_patient_amount_2, "+
          "SUM(urgently_patient_count_3) AS urgently_patient_count_3, "+
          "AVG(percent_urgently_patient_3) AS percent_urgently_patient_3, "+
          "SUM(urgently_patient_amount_3) AS urgently_patient_amount_3, "+
          "SUM(planned_patient_count_3) AS planned_patient_count_3, "+
          "AVG(percent_planned_patient_3) AS percent_planned_patient_3, "+
          "SUM(planned_patient_amount_3) AS planned_patient_amount_3 "+
          "FROM ( "+
            "SELECT "+
            "extract_department, "+
            "total_1, "+
            "urgently_patient_count_1, "+
            "percent_urgently_patient_1, "+
            "urgently_patient_amount_1, "+
            "planned_patient_count_1, "+
            "percent_planned_patient_1, "+
            "planned_patient_amount_1, "+
            "urgently_patient_count_2, "+
            "percent_urgently_patient_2, "+
            "urgently_patient_amount_2, "+
            "planned_patient_count_2, "+
            "percent_planned_patient_2, "+
            "planned_patient_amount_2, "+
            "urgently_patient_count_3, "+
            "percent_urgently_patient_3, "+
            "urgently_patient_amount_3, "+
            "planned_patient_count_3, "+
            "percent_planned_patient_3, "+
            "planned_patient_amount_3 "+
            "FROM "+
            "osms_data "+
            "UNION ALL "+
            "SELECT "+
            "extract_department, "+
            "total_1, "+
            "urgently_patient_count_1, "+
            "percent_urgently_patient_1, "+
            "urgently_patient_amount_1, "+
            "planned_patient_count_1, "+
            "percent_planned_patient_1, "+
            "planned_patient_amount_1, "+
            "urgently_patient_count_2, "+
            "percent_urgently_patient_2, "+
            "urgently_patient_amount_2, "+
            "planned_patient_count_2, "+
            "percent_planned_patient_2, "+
            "planned_patient_amount_2, "+
            "urgently_patient_count_3, "+
            "percent_urgently_patient_3, "+
            "urgently_patient_amount_3, "+
            "planned_patient_count_3, "+
            "percent_planned_patient_3, "+
            "planned_patient_amount_3 "+
            "FROM "+
            "bp067_pp100_data "+
            "UNION ALL "+
            "SELECT "+
            "extract_department, "+
            "total_1, "+
            "urgently_patient_count_1, "+
            "percent_urgently_patient_1, "+
            "urgently_patient_amount_1, "+
            "planned_patient_count_1, "+
            "percent_planned_patient_1, "+
            "planned_patient_amount_1, "+
            "urgently_patient_count_2, "+
            "percent_urgently_patient_2, "+
            "urgently_patient_amount_2, "+
            "planned_patient_count_2, "+
            "percent_planned_patient_2, "+
            "planned_patient_amount_2, "+
            "urgently_patient_count_3, "+
            "percent_urgently_patient_3, "+
            "urgently_patient_amount_3, "+
            "planned_patient_count_3, "+
            "percent_planned_patient_3, "+
            "planned_patient_amount_3 "+
            "FROM "+
            "nacfond_data "+
            ") subquery "+
            "GROUP BY "+
            "extract_department "+
            "ORDER BY "+
            "extract_department ";  

if (selectedRangeDate) {
  const dates = selectedRangeDate.split(" - ");
  if (dates.length === 2) {
      const startDate = dates[0];
      const endDate = dates[1];
      //console.log('SERVER: startDate: ' + startDate); // "2024-06-01"
      //console.log('SERVER: endDate: ' + endDate);   // "2024-06-02"
      main_query_1 += ` AND discharge_date >= $${queryParams.length + 1}`;
      main_query_2 += ` AND discharge_date >= $${queryParams.length + 1}`;
      main_query_3 += ` AND discharge_date >= $${queryParams.length + 1}`;
      queryParams.push(`%${startDate}%`);

      main_query_1 += ` AND discharge_date <= $${queryParams.length + 1}`;
      main_query_2 += ` AND discharge_date <= $${queryParams.length + 1}`;
      main_query_3 += ` AND discharge_date <= $${queryParams.length + 1}`;
      queryParams.push(`%${endDate}%`);

  } else if (dates.length === 1) {
      const startDate = dates[0];
      //console.log('startDate: ' + startDate); // "2024-06-01"
      main_query_1 += ` AND discharge_date >= $${queryParams.length + 1}`;
      main_query_2 += ` AND discharge_date >= $${queryParams.length + 1}`;
      main_query_3 += ` AND discharge_date >= $${queryParams.length + 1}`;
      queryParams.push(`%${startDate}%`);
  }
}
//console.log('IN EXCEL: department: ' + department)
if (department) {
  let departments = department.split(',').filter(Boolean);
  let homMany_ = 0;
  departments.forEach(item => {
    if(homMany_ == 0){
      main_query_1 += ` AND extract_department = $${queryParams.length + 1}`;
      main_query_2 += ` AND extract_department = $${queryParams.length + 1}`;
      main_query_3 += ` AND extract_department = $${queryParams.length + 1}`;
      queryParams.push(item);
      //console.log('_________________item: ' + item); 
    }else if(homMany_ > 0){
      main_query_1 += ` OR extract_department = $${queryParams.length + 1}`;
      main_query_2 += ` OR extract_department = $${queryParams.length + 1}`;
      main_query_3 += ` OR extract_department = $${queryParams.length + 1}`;
      queryParams.push(item);
      //console.log('_________________item: ' + item); 
    }
    homMany_++;
  });
}

query = main_query_1+main_query_2+main_query_3+main_query_4;

// Fetching data for the Excel file
const queryResult = await db.query(query, queryParams);
const rows = queryResult.rows;

worksheet.getRow(1).font = { bold: true };
worksheet.getRow(2).font = { bold: true };
worksheet.getRow(1).alignment = { horizontal: 'center' };
worksheet.getRow(2).alignment = { horizontal: 'center' };

 // Set specific column widths
worksheet.columns = [
  { key: 'A', width: 50 }, // Column A width
  { key: 'B', width: 20 }, // Column B width
  { key: 'C', width: 35 }, // Column C width
  { key: 'D', width: 30 }, // Column D width
  { key: 'E', width: 20 }, // Column E width
  { key: 'F', width: 35 },  // Column F width
  { key: 'G', width: 35 },
  { key: 'H', width: 20 },
  { key: 'I', width: 35 },
  { key: 'J', width: 30 },
  { key: 'K', width: 20 },
  { key: 'L', width: 30 },
  { key: 'M', width: 30 },
  { key: 'N', width: 20 },
  { key: 'O', width: 35 },
  { key: 'P', width: 35 },
  { key: 'Q', width: 20 },
  { key: 'R', width: 35 },
  { key: 'S', width: 35 },
  { key: 'T', width: 20 }
];

// Adding data rows
rows.forEach((row, rowIndex) => {
  const excelRow = worksheet.getRow(rowIndex+3); // Start from row 3
  excelRow.getCell('A').value = row.extract_department,
  excelRow.getCell('B').value = row.total_1,
  excelRow.getCell('C').value = row.urgently_patient_count_1 == null ? '' : formatNumber(row.urgently_patient_count_1),
  excelRow.getCell('D').value = row.percent_urgently_patient_1 == null ? '' : formatNumber(row.percent_urgently_patient_1),
  excelRow.getCell('E').value = row.urgently_patient_amount_1 == null ? '' : formatNumber(row.urgently_patient_amount_1),
  excelRow.getCell('F').value = row.planned_patient_count_1 == null ? '' : formatNumber(row.planned_patient_count_1),
  excelRow.getCell('G').value = row.percent_planned_patient_1 == null ? '' : formatNumber(row.percent_planned_patient_1),
  excelRow.getCell('H').value = row.planned_patient_amount_1 == null ? '' : formatNumber(row.planned_patient_amount_1),
  excelRow.getCell('I').value = row.urgently_patient_count_2 == null ? '' : formatNumber(row.urgently_patient_count_2),
  excelRow.getCell('J').value = row.percent_urgently_patient_2 == null ? '' : formatNumber(row.percent_urgently_patient_2),
  excelRow.getCell('K').value = row.urgently_patient_amount_2 == null ? '' : formatNumber(row.urgently_patient_amount_2),
  excelRow.getCell('L').value = row.planned_patient_count_2 == null ? '' : formatNumber(row.planned_patient_count_2),
  excelRow.getCell('M').value = row.percent_planned_patient_2 == null ? '' : formatNumber(row.percent_planned_patient_2),
  excelRow.getCell('N').value = row.planned_patient_amount_2 == null ? '' : formatNumber(row.planned_patient_amount_2),
  excelRow.getCell('O').value = row.urgently_patient_count_3 == null ? '' : formatNumber(row.urgently_patient_count_3),
  excelRow.getCell('P').value = row.percent_urgently_patient_3 == null ? '' : formatNumber(row.percent_urgently_patient_3),
  excelRow.getCell('Q').value = row.urgently_patient_amount_3 == null ? '' : formatNumber(row.urgently_patient_amount_3),
  excelRow.getCell('R').value = row.planned_patient_count_3 == null ? '' : formatNumber(row.planned_patient_count_3),
  excelRow.getCell('S').value = row.percent_planned_patient_3 == null ? '' : formatNumber(row.percent_planned_patient_3),
  excelRow.getCell('T').value = row.planned_patient_amount_3 == null ? '' : formatNumber(row.planned_patient_amount_3)

  // Center align the cells
  excelRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  excelRow.commit(); // Save the row to the worksheet
});
} else if (reportType === 'Report_7') {
  // Adding column headers

  // Define the lower headers
  worksheet.getCell('A1').value = 'Год';
  worksheet.getCell('B1').value = 'Месяц';
  worksheet.getCell('C1').value = 'Группа КЗГ (Наименование)';
  worksheet.getCell('D1').value = 'Группа КЗГ (Код)';
  worksheet.getCell('E1').value = 'Диагноз по МКБ-10 (Наименование)';
  worksheet.getCell('F1').value = 'Диагноз по МКБ-10 (Код)';
  worksheet.getCell('G1').value = 'Всего пролечено за отчетный период';
  worksheet.getCell('H1').value = 'Всего к оплате';
  worksheet.getCell('I1').value = 'Количество случаев с весовым коэффицентом до 0.5';
  worksheet.getCell('J1').value = 'Количество случаев с весовым коэффицентом от 0.5 до 1';
  worksheet.getCell('K1').value = 'Количество случаев с весовым коэффицентом от 1 до 2';
  worksheet.getCell('L1').value = 'Количество случаев с весовым коэффицентом от 2 до 3';
  worksheet.getCell('M1').value = 'Количество случаев с весовым коэффицентом от 3 до 5';
  worksheet.getCell('N1').value = 'Количество случаев с весовым коэффицентом от 5 до 10';
  worksheet.getCell('O1').value = 'Количество случаев с весовым коэффицентом от 10 до 20';
  worksheet.getCell('P1').value = 'Количество случаев с весовым коэффицентом от 20 до 30';
  worksheet.getCell('Q1').value = 'Количество случаев с весовым коэффицентом свыше 30';

  query = 'SELECT * FROM prod.therapist WHERE 1=1';

  if (dateFrom) {
    query += ` AND start_date >= $${queryParams.length + 1}`;
    queryParams.push(`%${dateFrom}%`);
  } 
  if (dateTo) {
    query += ` AND end_date <= $${queryParams.length + 1}`;
    queryParams.push(`%${dateTo}%`);
  }
  if (month) {
    query += ` AND month = $${queryParams.length + 1}`;
    queryParams.push(month);
  }
  if (year) {
    query += ` AND year = $${queryParams.length + 1}`;
    queryParams.push(year);
  } 
  if (kzg_code) {
    query += ` AND kzg_code = $${queryParams.length + 1}`;
    queryParams.push(kzg_code);
  }
  if (kzg_name) {
    query += ` AND kzg_name ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${kzg_name}%`);
  }
  if (diagnosis_name) {
    query += ` AND mkb_name ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${diagnosis_name}%`);
  }
  if (diagnosis_code) {
    query += ` AND mkb_code ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${diagnosis_code}%`);
  }
  //query += ` LIMIT ${limit} OFFSET ${offset}`;

const queryResult = await db.query(query, queryParams);
const rows = queryResult.rows;

worksheet.getRow(1).font = { bold: true };
worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true};
worksheet.getRow(2).alignment = { horizontal: 'center' };

 // Set specific column widths
worksheet.columns = [
  { key: 'A', width: 15 }, // Column A width
  { key: 'B', width: 15 }, // Column B width
  { key: 'C', width: 35 }, // Column C width
  { key: 'D', width: 20 }, // Column D width
  { key: 'E', width: 35 }, // Column E width
  { key: 'F', width: 25 },  // Column F width
  { key: 'G', width: 25 },
  { key: 'H', width: 35 },
  { key: 'I', width: 25 },
  { key: 'J', width: 25 },
  { key: 'K', width: 25 }
];

// Adding data rows
rows.forEach((row, rowIndex) => {
  const excelRow = worksheet.getRow(rowIndex+2); // Start from row 3
  excelRow.getCell('A').value = row.year,
  excelRow.getCell('B').value = row.month,
  excelRow.getCell('C').value = row.kzg_name,
  excelRow.getCell('D').value = row.kzg_code,
  excelRow.getCell('E').value = row.mkb_name,
  excelRow.getCell('F').value = row.mkb_code,
  excelRow.getCell('G').value = row.total_treated == null ? '' : formatNumber(row.total_treated),
  excelRow.getCell('H').value = row.total_submitted == null ? '' : formatNumber(row.total_submitted),
  excelRow.getCell('I').value = row.cases_weight_0_5 == null ? '' : formatNumber(row.cases_weight_0_5),
  excelRow.getCell('J').value = row.cases_weight_0_5_1 == null ? '' : formatNumber(row.cases_weight_0_5_1),
  excelRow.getCell('K').value = row.cases_weight_1_2 == null ? '' : formatNumber(row.cases_weight_1_2),
  excelRow.getCell('L').value = row.cases_weight_2_3 == null ? '' : formatNumber(row.cases_weight_2_3),
  excelRow.getCell('M').value = row.cases_weight_3_5 == null ? '' : formatNumber(row.cases_weight_3_5),
  excelRow.getCell('N').value = row.cases_weight_5_10 == null ? '' : formatNumber(row.cases_weight_5_10),
  excelRow.getCell('O').value = row.cases_weight_10_20 == null ? '' : formatNumber(row.cases_weight_10_20),
  excelRow.getCell('P').value = row.cases_weight_20_30 == null ? '' : formatNumber(row.cases_weight_20_30),
  excelRow.getCell('Q').value = row.cases_weight_30_m == null ? '' : formatNumber(row.cases_weight_30_m)
  // Center align the cells
  excelRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });

  excelRow.commit(); // Save the row to the worksheet
});
} else if (reportType === 'Report_8') {
  // Adding column headers

  // Define the lower headers
  worksheet.getCell('A1').value = 'Наименование отделения/виды услуг';
  worksheet.getCell('B1').value = 'Стационар';
  worksheet.getCell('C1').value = 'ПМСП и поликлиника';
  worksheet.getCell('D1').value = 'Всего';
  worksheet.getCell('E1').value = 'Доход';

  main_query_1 = "SELECT service_name, "+
                    "SUM(inpatient) as total_inpatient, "+
                    "SUM(polyclinic) as total_polyclinic, "+
                    "SUM(inpatient_polyclinic_count) as total_inpatient_polyclinic_count, "+
                    "SUM(inpatient_polyclinic_revenue) as total_inpatient_polyclinic_revenue "+
                    "FROM prod.analysis_summary WHERE 1=1";
      
  main_query_2 = " GROUP BY service_name "+
                  "ORDER BY service_name";
      
  if (selectedRangeDate_1) {
    const dates = selectedRangeDate_1.split(" - ");
    if (dates.length === 2) {
      const startDate = dates[0];
      const endDate = dates[1];

      main_query_1 += ` AND service_date >= $${queryParams.length + 1}`;
      queryParams.push(`%${startDate}%`);

      main_query_1 += ` AND service_date <= $${queryParams.length + 1}`;
      queryParams.push(`%${endDate}%`);

    } else if (dates.length === 1) {
        const startDate = dates[0];
        main_query_1 += ` AND service_date >= $${queryParams.length + 1}`;
        queryParams.push(`%${startDate}%`);
    }
  }
  if (service_name) {
    let departments = service_name.split(',').filter(Boolean);
    let homMany_ = 0;
    departments.forEach(item => {
      if(homMany_ == 0){
        main_query_1 += ` AND service_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${item}%`);
        //console.log('_________________item: ' + item); 
      }else if(homMany_ > 0){
        main_query_1 += ` OR service_name ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${item}%`);
        //console.log('_________________item: ' + item); 
      }
      homMany_++;
    });
  }
  query = main_query_1 + main_query_2;
  //query += ` LIMIT ${limit} OFFSET ${offset}`;

const queryResult = await db.query(query, queryParams);
const rows = queryResult.rows;

worksheet.getRow(1).font = { bold: true };
worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true};
worksheet.getRow(2).alignment = { horizontal: 'center' };

 // Set specific column widths
worksheet.columns = [
  { key: 'A', width: 30 }, // Column A width
  { key: 'B', width: 15 }, // Column B width
  { key: 'C', width: 30 }, // Column C width
  { key: 'D', width: 20 }, // Column D width
  { key: 'E', width: 20 }, // Column E width
];

// Adding data rows
rows.forEach((row, rowIndex) => {
  const excelRow = worksheet.getRow(rowIndex+2); // Start from row 3
  excelRow.getCell('A').value = row.service_name,
  excelRow.getCell('B').value = row.total_inpatient == null ? '' : formatNumber(row.total_inpatient),
  excelRow.getCell('C').value = row.total_polyclinic == null ? '' : formatNumber(row.total_polyclinic),
  excelRow.getCell('D').value = row.total_inpatient_polyclinic_count == null ? '' : formatNumber(row.total_inpatient_polyclinic_count),
  excelRow.getCell('E').value = row.total_inpatient_polyclinic_revenue == null ? '' : formatNumber(row.total_inpatient_polyclinic_revenue) 
  // Center align the cells
  excelRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });

  excelRow.commit(); // Save the row to the worksheet

  if ((rowIndex) === rows.length - 1)
  {
    let sum_total_inpatient = 0;
    let sum_total_polyclinic = 0;
    let sum_total_inpatient_polyclinic_count = 0;
    let sum_total_inpatient_polyclinic_revenue = 0;
    // Adding data rows
    rows.forEach(row => {
      const inpatientValue = parseInt(row.total_inpatient, 10); // Convert to integer
      sum_total_inpatient += inpatientValue;
      const polyclinicValue = parseInt(row.total_polyclinic, 10); // Convert to integer
      sum_total_polyclinic += polyclinicValue;
      const inpatient_polyclinic_countValue = parseInt(row.total_inpatient_polyclinic_count, 10); // Convert to integer
      sum_total_inpatient_polyclinic_count += inpatient_polyclinic_countValue;
      const inpatient_polyclinic_revenueValue = parseInt(row.total_inpatient_polyclinic_revenue, 10); // Convert to integer
      sum_total_inpatient_polyclinic_revenue += inpatient_polyclinic_revenueValue;
    });
    const excelRow = worksheet.getRow(rowIndex+3); // Start from row 3
    excelRow.getCell('A').value = 'Итого',
    excelRow.getCell('B').value = sum_total_inpatient == null ? '' : formatNumber(sum_total_inpatient),
    excelRow.getCell('C').value = sum_total_polyclinic == null ? '' : formatNumber(sum_total_polyclinic),
    excelRow.getCell('D').value = sum_total_inpatient_polyclinic_count == null ? '' : formatNumber(sum_total_inpatient_polyclinic_count),
    excelRow.getCell('E').value = sum_total_inpatient_polyclinic_revenue == null ? '' : formatNumber(sum_total_inpatient_polyclinic_revenue),
    // Center align the cells
    excelRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true,  bold: true };
    });
  
    excelRow.commit(); // Save the row to the worksheet
  }


});
} else if (reportType === 'Report_9') {
  // Adding column headers

  // Define the lower headers
  worksheet.getCell('A1').value = 'Наименование услуг';
  worksheet.getCell('B1').value = 'План';
  worksheet.getCell('C1').value = 'Факт';
  worksheet.getCell('D1').value = 'Количество';
  worksheet.getCell('E1').value = '%Исполнения';

  main_query_1 = "SELECT "+
      "finance_source_cd, "+
      "service_name, "+
      "SUM(plan_amount) AS sum_plan_amount, "+
      "SUM(fact_amount) AS sum_fact_amount, "+
      "SUM(fact_quantity) AS sum_fact_quantity, "+
      "AVG(completion_percent) AS sum_completion_percent "+
      "FROM "+
      "prod.contract_plan_execution WHERE 1=1";

  main_query_2 = " GROUP BY "+
  "finance_source_cd, service_name "+
  "ORDER BY "+
  "finance_source_cd, service_name";

  if (month) {
    main_query_1 += ` AND mm = $${queryParams.length + 1}`;
    queryParams.push(month);
  }
  if (year) {
    main_query_1 += ` AND yy = $${queryParams.length + 1}`;
    queryParams.push(year);
  }
  //query += ` LIMIT ${limit} OFFSET ${offset}`;
  query = main_query_1+main_query_2;

const queryResult = await db.query(query, queryParams);
const rows = queryResult.rows;

worksheet.getRow(1).font = { bold: true };
worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true};
worksheet.getRow(2).alignment = { horizontal: 'center' };

 // Set specific column widths
worksheet.columns = [
  { key: 'A', width: 30 }, // Column A width
  { key: 'B', width: 15 }, // Column B width
  { key: 'C', width: 30 }, // Column C width
  { key: 'D', width: 20 }, // Column D width
  { key: 'E', width: 20 }, // Column E width
];

let source_current, source_prev = '';
// Adding data rows
let index = 2;
rows.forEach((row, rowIndex) => {
  source_current = row.finance_source_cd;
  if(source_prev !== source_current){
    source_prev = source_current;
    worksheet.mergeCells(`A${index}:C${index}`);
    const excelRow = worksheet.getRow(index); // Start from row 3
    excelRow.getCell('A').value = row.finance_source_cd;
    excelRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
    excelRow.commit(); // Save the row to the worksheet
    index++;
  } 
  const excelRow = worksheet.getRow(index); // Start from row 3
  excelRow.getCell('A').value = row.service_name,
  excelRow.getCell('B').value = row.sum_plan_amount == null ? '' : formatNumber(row.sum_plan_amount),
  excelRow.getCell('C').value = row.sum_fact_amount == null ? '' : formatNumber(row.sum_fact_amount),
  excelRow.getCell('D').value = row.sum_fact_quantity == null ? '' : formatNumber(row.sum_fact_quantity),
  excelRow.getCell('E').value = row.sum_completion_percent == null ? '' : formatNumber(row.sum_completion_percent),
  // Center align the cells
  excelRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  excelRow.commit(); // Save the row to the worksheet
  index++;
  
/*
  if ((rowIndex) === rows.length - 1)
  {
    const excelRow = worksheet.getRow(rowIndex+3); // Start from row 3
    excelRow.getCell('A').value = 'Итого',
    excelRow.getCell('B').value = row.total_inpatient,
    excelRow.getCell('C').value = row.total_polyclinic,
    excelRow.getCell('D').value = row.total_count,
    excelRow.getCell('E').value = row.total_revenue,
    // Center align the cells
    excelRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true,  bold: true };
    });
  
    excelRow.commit(); // Save the row to the worksheet
  }
*/

});
}

    // Setting headers to make browser download file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

    // Writing Excel file to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(`Error exporting data to Excel: ${error.message}\n${error.stack}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

function formatNumberWithSpaces(value) {
  // Convert the number to a string with fixed two decimal places
  const parts = value.toFixed(2).split('.');

  // Add spaces to the integer part
  const integerPartWithSpaces = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Join the integer and decimal parts
  return `${integerPartWithSpaces}.${parts[1]}`;
}

function formatNumber(num) {
  // Convert num to a number in case it is not already
  num = Number(num);

  // Round the number to 2 decimal places
  num = num.toFixed(2);

  // Convert number to string and split into integer and fractional parts
  let [integerPart, fractionalPart] = num.toString().split('.');

  // Add spaces to the integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Join the integer part and fractional part back together
  return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
}
