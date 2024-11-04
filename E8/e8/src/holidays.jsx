import { all } from "axios";
import React, { useState, useEffect } from "react";

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [year, setYear] = useState(2024);
  const [province, setProvince] = useState("all");

  const fetchHolidays = async (year, province) => {
    try {
        let url = `https://canada-holidays.ca/api/v1/holidays?year=${year}`;
        if (province !== "all") {
            url += `&province=${province}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setHolidays(data.holidays || []);
    } catch (error) {
        setHolidays([]);
    }  
  };

  useEffect(() => {
    fetchHolidays(year, province);
  }, [year, province]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  };

  return (
    <div>
      <style jsx>{`
        * {
          font-family: "Arial";
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        tr:hover {
          background-color: #f5f5f5;
        }

        th {
          background-color: #4caf50;
          color: white;
        }
      `}</style>

      <h1>Holidays</h1>
      <label htmlFor="year-filter">Filter by Year:</label>
      <select id="year-filter" value={year} onChange={handleYearChange}>
        {Array.from({ length: 11 }, (_, i) => 2020 + i).map((yearOption) => (
            <option key={yearOption} value={yearOption}>
                {yearOption}
            </option>
        ))}
      </select>

      <label htmlFor="province-filter">Filter by Province:</label>
      <select id="province-filter" value={province} onChange={handleProvinceChange}>
        <option value="all">All Provinces</option>
        <option value="nl">Newfoundland and Labrador</option>
        <option value="pe">Prince Edward Island</option>
        <option value="ns">Nova Scotia</option>
        <option value="nb">New Brunswick</option>
        <option value="qc">Quebec</option>
        <option value="on">Ontario</option>
        <option value="mb">Manitoba</option>
        <option value="sk">Saskatchewan</option>
        <option value="ab">Alberta</option>
        <option value="bc">British Columbia</option>
        <option value="yt">Yukon</option>
        <option value="nt">Northwest Territories</option>
        <option value="nu">Nunavut</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Name (FR)</th> <th>Provinces</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday) => (
            <tr key={holiday.id}>
              <td>{holiday.date}</td>
              <td>{holiday.nameEn}</td>
              <td>{holiday.nameFr}</td>
              <td>
                {holiday.federal
                  ? "Federal"
                  : holiday.provinces.map((pr) => pr.id).join(" ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}