export const filterfeaturedJobs = (array) => {
  let promotedJobs = [];
  let finalarr = [];
  array.forEach((job) => {
    if (job?.isPromoted === true) {
      promotedJobs.push(job);
    } else {
      finalarr.push(job);
    }
  });
  let promotedJobIndex = 0;
  for (let i = 0; i < promotedJobs.length; i++) {
    finalarr.splice(promotedJobIndex * 3, 0, promotedJobs[i]);
    promotedJobIndex++;
  }
  return finalarr;
};
