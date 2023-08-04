import React from "react";
import educationLogo from "../../assests/icons/ic_education.svg";

const ReferralEducationDetails = () => {
  const education = [
    {
      startMonth: "Jun",
      startYear: "2020",
      endMonth: "Present",
      endYear: "",
      degreeName: "UX Designer II",
      collegeName: "Glowhomes Technologies | New Delhi | Full Time | Design",
      subjectName:
        "Worked on design explorations and execution for e-commerce flatform for construction industry. Worked on design explorations and execution for e-commerce flatform for construction industry.”",
    },
    {
      startMonth: "Apr",
      startYear: "2018",
      endMonth: "Mar",
      endYear: "2020",
      degreeName: "UX Designer I",
      collegeName: "Microsoft | Gurgaon | Full Time | Design",
      subjectName:
        "Worked on design explorations and execution for e-commerce flatform for construction industry. Worked on design explorations and execution for e-commerce flatform for construction industry.”",
    },
    {
      startMonth: "Apr",
      startYear: "2018",
      endMonth: "Mar",
      endYear: "2020",
      degreeName: "UX Designer",
      collegeName: "Microsoft | Gurgaon | Full Time | Design",
      subjectName:
        "Worked on design explorations and execution for e-commerce flatform for construction industry. Worked on design explorations and execution for e-commerce flatform for construction industry.”",
    },
  ];
  return (
    <div className="p-3 pt-0">
      <div className="my-3">
        <span className="fw-bold fs-24">
          <img
            style={{ marginRight: "14px" }}
            src={educationLogo}
            alt={educationLogo}
          />
          Education and Academics
        </span>
      </div>
      <div>
        {education.map((edu) => {
          return (
            <>
              <div className="">
                <div className="pt-3 ps-2">
                  <div>
                    <span className="card-badge">
                      {edu.startMonth} {edu.startYear} - {edu.endMonth}{" "}
                      {edu.endYear}
                    </span>
                  </div>
                  <div className="title-card py-3">{edu.degreeName}</div>
                  <div className="card-subtitle">{edu.collegeName}</div>
                  <div className="card-content">{edu.subjectName}</div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ReferralEducationDetails;
