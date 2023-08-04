import { isPropertySignature } from "typescript";
import AboutMe from "../../../components/about_me";
import useWindowDimensions from "../../../utils/use_window_dimension";

const AboutMePage = (props) => {
  // const BREAKPOINT_TABLET_VIEW = 780;
  // const { width } = useWindowDimensions();
  // if (width < BREAKPOINT_TABLET_VIEW) {
  //   props?.setSmartViewScreenDisplay(false);
  // }
  return (
    <div>
      <AboutMe
        toggler={props.toggler}
        showAboutMe={props.showAboutMe}
        setShowAboutMe={props.setShowAboutMe}
        candidateDetails={props.candidateDetails}
        isApplyForJobComponent={false}
      />
    </div>
  );
};

export default AboutMePage;
