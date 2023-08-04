import React, { useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import { isCheckValue } from "../utils/utils";
import { updateProfilePicture } from "../_services/candidate.service";
import { getLocalStorage } from "../utils/storage";
import toaster from "../utils/toaster";
import { useStoreActions } from "easy-peasy";
import { USER_ID } from "../constants/keys";

function ProfileCompletionBar({ customCssClass, candidateDetails }) {
  const saveCandidateDetails = useStoreActions(
    (actions) => actions.candidate.saveCandidateDetails
  );

  useEffect(() => {
    if (customCssClass == null || customCssClass == undefined) {
      customCssClass = "";
    }
  }, [candidateDetails, customCssClass]);

  const updateProfilePercentage = (finalPercent) => {
    if (finalPercent) {
      const profilePicUpdateObject = {
        photoId: candidateDetails?.basicDetailsResponse?.photoId,
        uploadPhoto: "",
        workStatus: candidateDetails?.basicDetailsResponse?.workStatus,
        dob: candidateDetails?.basicDetailsResponse?.dob,
        experienceOverall:
          candidateDetails?.basicDetailsResponse?.experienceOverall,
        gender: candidateDetails?.basicDetailsResponse?.gender,
        currentAddress: candidateDetails?.basicDetailsResponse?.currentAddress,
        areaPinCode: candidateDetails?.basicDetailsResponse?.areaPinCode,
        permanentAddress:
          candidateDetails?.basicDetailsResponse?.permanentAddress,
        languageId: candidateDetails?.basicDetailsResponse?.languageId,
        proficiency: candidateDetails?.basicDetailsResponse?.proficiency,
        profileCompletion: finalPercent,
      };
      updateProfilePicture(profilePicUpdateObject)
        .then((data) => {
          const userId = getLocalStorage(USER_ID);
          if (userId) {
            saveCandidateDetails(userId);
          }
        })
        .catch((err) => {
          toaster("error", "Couldn't update profile");
        });
    }
  };

  useEffect(() => {
    updateProfilePercentage(
      checkProfileProgressPercentagePreferences()?.percent
    );
  }, []);

  const checkProfileProgressPercentagePreferences = () => {
    if (candidateDetails) {
      let totalParameters = 16;
      let percentage = {
        name: null,
        phone: null,
        email: null,
        currentRole: null,
        currentCompany: null,
        status: null,
        location: null,
        resume: null,
        professionalExp: null,
        education: null,
        keySkills: null,
        industries: null,
        functions: null,
        whyHireMe: null,
        links: null,
        profilePic: null,
      };

      let errorMessage = "";

      // preferences percentage
      if (isCheckValue(candidateDetails?.userRegistrationDetails?.name)) {
        percentage.name = 1;
      } else {
        errorMessage = "Please add name";
      }

      if (isCheckValue(candidateDetails?.userRegistrationDetails?.mobile)) {
        percentage.phone = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Mobile number";
        }
      }

      if (isCheckValue(candidateDetails?.userRegistrationDetails?.email)) {
        percentage.email = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Email";
        }
      }

      if (
        isCheckValue(
          candidateDetails?.additionalInfoProfileResponse?.currentDesignation
        )
      ) {
        percentage.currentRole = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Current Designation";
        }
      }

      if (
        isCheckValue(candidateDetails?.additionalInfoProfileResponse?.company)
      ) {
        percentage.currentCompany = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Current Company";
        }
      }

      if (
        isCheckValue(
          candidateDetails?.additionalInfoProfileResponse?.jobSearchStatus
        )
      ) {
        percentage.status = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Job search Status";
        }
      }

      if (
        isCheckValue(
          candidateDetails?.additionalInfoProfileResponse?.currentLocation
        )
      ) {
        percentage.location = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Location";
        }
      }

      if (isCheckValue(candidateDetails?.userResumeResponse)) {
        percentage.resume = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Resume";
        }
      }

      if (isCheckValue(candidateDetails?.workExperienceResponse)) {
        percentage.professionalExp = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Professional Experience";
        }
      }
      if (isCheckValue(candidateDetails?.educationalExperienceResponse)) {
        percentage.education = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Professional Experience";
        }
      }
      if (isCheckValue(candidateDetails?.skillsResponse?.keySkills)) {
        percentage.keySkills = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Skills";
        }
      }

      if (isCheckValue(candidateDetails?.skillsResponse?.industries)) {
        percentage.industries = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Industries";
        }
      }

      if (isCheckValue(candidateDetails?.skillsResponse?.functions)) {
        percentage.functions = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Functions";
        }
      }
      if (
        isCheckValue(candidateDetails?.additionalInfoProfileResponse?.aboutMe)
      ) {
        percentage.whyHireMe = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Why you should hire me ";
        }
      }
      if (isCheckValue(candidateDetails?.socialLinksResponses)) {
        percentage.links = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add SocialLink";
        }
      }
      if (
        isCheckValue(
          candidateDetails?.basicDetailsResponse?.profilePicDownloadURL
        )
      ) {
        percentage.profilePic = 1;
      } else {
        if (errorMessage === "") {
          errorMessage = "Please add Profile Picture";
        }
      }

      let finalPercent = Math.round(
        ((percentage.name +
          percentage.phone +
          percentage.email +
          percentage.currentRole +
          percentage.currentCompany +
          percentage.status +
          percentage.location +
          percentage.resume +
          percentage.professionalExp +
          percentage.education +
          percentage.keySkills +
          percentage.industries +
          percentage.functions +
          percentage.whyHireMe +
          percentage.links +
          percentage.profilePic) /
          totalParameters) *
          100
      );

      // updateProfilePercentage(finalPercent);

      let finalRemain =
        percentage.name +
        percentage.phone +
        percentage.email +
        percentage.currentRole +
        percentage.currentCompany +
        percentage.status +
        percentage.location +
        percentage.resume +
        percentage.professionalExp +
        percentage.education +
        percentage.keySkills +
        percentage.industries +
        percentage.functions +
        percentage.whyHireMe +
        percentage.links +
        percentage.profilePic;
      return {
        percent: finalPercent,
        remain: finalRemain,
        error: errorMessage,
      };
    }
  };

  return (
    <div className={`${customCssClass} percentage `}>
      <span className="fw-700">
        {checkProfileProgressPercentagePreferences()?.percent}%
      </span>
      <br />
      Profile Updated
      <ProgressBar
        now={checkProfileProgressPercentagePreferences()?.percent}
        style={{ height: "0.5rem", width: "5.5rem", marginTop: "0.3rem" }}
      />
    </div>
  );
}

export default ProfileCompletionBar;
