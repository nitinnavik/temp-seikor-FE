import React from "react";

const ReferralProfessionalExperience = () => {
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
      degreeName: "UX Designer",
      collegeName: "Microsoft | Gurgaon | Full Time | Design",
      subjectName:
        "Worked on design explorations and execution for e-commerce flatform for construction industry. Worked on design explorations and execution for e-commerce flatform for construction industry.”",
    },
  ];
  return (
    <div className="p-3">
      <div className="title-card my-4 fw-600 fs-16 pb-0 mb-2">
        Professional Experience
      </div>
      <div>
        {education.map((edu) => {
          return (
            <>
              <div className="card-container">
                <div className="pt-3 ">
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

export default ReferralProfessionalExperience;
