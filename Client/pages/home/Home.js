import React, { useLayoutEffect } from "react";
import FirstZone from "./first-zone";
import SecondZone from "./second-zone";
import ThirdZone from "./third-zone";
import FourthZone from "./fourth-zone";

const memoGsap = async () => {
  const { gsap } = await import("gsap/dist/gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  gsap.core.globals("ScrollTrigger", ScrollTrigger);
  gsap.fromTo(
    "#welcome-text-1",
    {
      y: -50,
      opacity: 0
    },
    {
      scrollTrigger: {
        trigger: "#welcome-text-1"
      },
      y: 0,
      opacity: 1,
      duration: 0.3
    }
  );
  gsap.fromTo(
    "#welcome-text-2",
    {
      y: 50,
      opacity: 0
    },
    {
      scrollTrigger: {
        trigger: "#welcome-text-2"
      },
      y: 0,
      opacity: 1,
      duration: 0.3
    }
  );

  const secondZoneTimeline = gsap.timeline({
    scrollTrigger: {
      scroller: "#app",
      trigger: ".secondZone",
      start: "top center",
      end: "top"
    }
  });

  secondZoneTimeline
    .from(".secondZone p", {
      scale: 0.3,
      rotation: 45,
      autoAlpha: 0,
      ease: "power2",
      duration: 0.8
    })
    .from(
      ".secondZone .secondZoneRightPanel",
      {
        scale: 0.3,
        rotation: 45,
        autoAlpha: 0,
        ease: "power2",
        duration: 0.4
      },
      "-=0.6"
    )
    .from(
      ".secondZone .btn-try-now",
      {
        scale: 0.3,
        rotation: 45,
        autoAlpha: 0,
        ease: "power2",
        duration: 0.3
      },
      "-=.4"
    );
  const thirdZoneTimeline = gsap.timeline({
    scrollTrigger: {
      scroller: "#app",
      trigger: ".thirdZone",
      start: "top center",
      end: "top"
    }
  });

  thirdZoneTimeline
    .from(".thirdZone .thirdZoneRightPanel", {
      scale: 0.3,
      rotation: 45,
      autoAlpha: 0,
      ease: "power2",
      duration: 0.8
    })
    .from(
      ".thirdZone p",
      {
        scale: 0.3,
        rotation: 45,
        autoAlpha: 0,
        ease: "power2",
        duration: 0.4
      },
      "-=0.6"
    )
    .from(
      ".thirdZone .btn-try-now",
      {
        scale: 0.3,
        rotation: 45,
        autoAlpha: 0,
        ease: "power2",
        duration: 0.3
      },
      "-=.4"
    );
};
const Home = () => {
  useLayoutEffect(() => {
    if (window.innerWidth > 737) {
      memoGsap();
    } else {
      window.onload = () => {
        document.getElementById("welcome-text-1").style.zIndex = 1;
        document.getElementById("welcome-text-2").style.zIndex = 1;
      };
    }
  }, []);
  return (
    <>
      <FirstZone />
      <SecondZone />
      <ThirdZone />
      <FourthZone />
    </>
  );
};

export default Home;
