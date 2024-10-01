import React, { useContext, useState } from "react";
import "./sidebar.css";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { SiProtondrive } from "react-icons/si";
import { RiComputerFill } from "react-icons/ri";
import { GiArchiveResearch } from "react-icons/gi";
import { GrAchievement } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { AppContext } from "../../Context/AppContext";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { sideBarOpen, setSideBarOpen, toggleSidebar } = useContext(AppContext);
  const [openDropdown, setOpenDropdown] = useState(null); // For main dropdowns
  const [openSubMenu, setOpenSubMenu] = useState(null); // For second-level sub-menus
  const [openSubSubMenu, setOpenSubSubMenu] = useState(null); // For third-level sub-menus

  const handleSideBarOpen = () => {
    toggleSidebar();
    setOpenDropdown(null);
    setOpenSubMenu(null);
    setOpenSubSubMenu(null);
  };

  const toggleDropdown = (menu) => {
    setSideBarOpen(true);
    setOpenDropdown(openDropdown === menu ? null : menu);
    setOpenSubMenu(null);
    setOpenSubSubMenu(null);
  };

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
    setOpenSubSubMenu(null);
  };

  const toggleSubSubMenu = (menu) => {
    setOpenSubSubMenu(openSubSubMenu === menu ? null : menu);
  };

  return (
    <div className={`side-bar-container ${sideBarOpen ? "side-bar-open" : ""}`}>
      <div className="side-bar-header">
        <p
          className={`side-bar-title`}
          style={{ display: sideBarOpen ? "block" : "none" }}
        >
          Menu
        </p>
        <BsArrowLeftSquareFill
          className="side-bar-arrow"
          onClick={handleSideBarOpen}
          style={{ transform: sideBarOpen ? "rotate(0deg)" : "rotate(180deg)" }}
        />
      </div>

      <div className="side-bar-profile-box">
        <div className="side-bar-profile-header">
          <div className="side-bar-profile-img">
            <FaUserCircle />
          </div>
          <div
            className="side-bar-profile-name"
            style={{ display: sideBarOpen ? "block" : "none" }}
          >
            <p>Mr. Chaitanya Ravindra Choudhari</p>
          </div>
        </div>

        <div
          className="side-bar-profile-education-details"
          style={{ display: sideBarOpen ? "block" : "none" }}
        >
          <div className="side-bar-profile-content">
            <p>Id:</p>
            <p>QWER1234567890</p>
          </div>
          <div className="side-bar-profile-content">
            <p>Department:</p>
            <p>Inforamtion Technology</p>
          </div>
          <div className="side-bar-profile-content">
            <p>Degree:</p>
            <p>B.Tech</p>
          </div>
          <div className="side-bar-profile-content">
            <p>Passing Year:</p>
            <p>2021</p>
          </div>

          <div className="side-bar-profile-content">
            <Link>View Detail</Link>
          </div>
        </div>
      </div>

      <div className="side-bar-content">
        {/* My Drive */}
        <div className="side-bar-menu-box">
          <div
            className="side-bar-link"
            onClick={() => toggleDropdown("myDrive")}
          >
            <GiArchiveResearch className="side-bar-link-icon" />
            <p style={{ display: sideBarOpen ? "block" : "none" }}>Research</p>
            <span
              className="down-arrow"
              style={{ display: sideBarOpen ? "flex" : "none" }}
            >
              <IoIosArrowDown
                className="down-arrow-icon"
                style={{
                  transform:
                    openDropdown === "myDrive"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              />
            </span>
          </div>

          {openDropdown === "myDrive" && (
            <div className="sub-menu-box">
              {/* Publication */}
              <div
                className="sub-menu-link"
                onClick={() => toggleSubMenu("publication")}
              >
                <p>Publication</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubMenu === "publication"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubMenu === "publication" && (
                <div className="second-sub-menu-box">
                  {/* Conference */}
                  <div
                    className="second-sub-menu-link"
                    onClick={() => toggleSubSubMenu("conference")}
                  >
                    <p>Conference</p>
                    <span
                      className="down-arrow"
                      style={{ display: sideBarOpen ? "flex" : "none" }}
                    >
                      <IoIosArrowDown
                        className="down-arrow-icon"
                        style={{
                          transform:
                            openSubSubMenu === "conference"
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      />
                    </span>
                  </div>

                  {openSubSubMenu === "conference" && (
                    <div className="third-sub-menu-box">
                      <p
                        className="third-sub-menu-link"
                        onClick={() => {
                          /* Add your View Conference action here */
                        }}
                      >
                        View Conference
                      </p>
                      <Link
                        to="/addconferance"
                        className="third-sub-menu-link"
                        onClick={() => {
                          /* Add your Add Conference action here */
                        }}
                      >
                        Add Conference
                      </Link>
                    </div>
                  )}

                  {/* Journal */}
                  <div
                    className="second-sub-menu-link"
                    onClick={() => toggleSubSubMenu("journal")}
                  >
                    <p>Journal</p>
                    <span
                      className="down-arrow"
                      style={{ display: sideBarOpen ? "flex" : "none" }}
                    >
                      <IoIosArrowDown
                        className="down-arrow-icon"
                        style={{
                          transform:
                            openSubSubMenu === "journal"
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      />
                    </span>
                  </div>

                  {openSubSubMenu === "journal" && (
                    <div className="third-sub-menu-box">
                      <p
                        className="third-sub-menu-link"
                        onClick={() => {
                          /* Add your View Journal action here */
                        }}
                      >
                        View Journal
                      </p>
                      <p
                        className="third-sub-menu-link"
                        onClick={() => {
                          /* Add your Add Journal action here */
                        }}
                      >
                        Add Journal
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Proposal */}
              <div
                className="sub-menu-link"
                onClick={() => toggleSubMenu("proposal")}
              >
                <p>Proposal</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubMenu === "proposal"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubMenu === "proposal" && (
                <div className="second-sub-menu-box">
                  <p className="second-sub-menu-link">View Proposal</p>
                  <p className="second-sub-menu-link">Add New Proposal</p>
                </div>
              )}

              {/* Patent */}
              <div
                className="sub-menu-link"
                onClick={() => toggleSubMenu("patent")}
              >
                <p>Patent</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubMenu === "patent"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubMenu === "patent" && (
                <div className="second-sub-menu-box">
                  <p className="second-sub-menu-link">View Patent</p>
                  <p className="second-sub-menu-link">Add New Patent</p>
                </div>
              )}

              {/* Copyright */}
              <div
                className="sub-menu-link"
                onClick={() => toggleSubMenu("copyright")}
              >
                <p>Copyright</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubMenu === "copyright"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubMenu === "copyright" && (
                <div className="second-sub-menu-box">
                  <p className="second-sub-menu-link">View Copyright</p>
                  <p className="second-sub-menu-link">Add New Copyright</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FDP */}
        <div className="side-bar-menu-box">
          <div className="side-bar-link" onClick={() => toggleDropdown("fdp")}>
            <RiComputerFill className="side-bar-link-icon" />
            <p style={{ display: sideBarOpen ? "block" : "none" }}>FDP/STTP</p>
            <span
              className="down-arrow"
              style={{ display: sideBarOpen ? "flex" : "none" }}
            >
              <IoIosArrowDown
                className="down-arrow-icon"
                style={{
                  transform:
                    openDropdown === "fdp" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </span>
          </div>

          {openDropdown === "fdp" && (
            <div className="sub-menu-box">
              <div
                className="sub-menu-link"
                onClick={() => toggleSubSubMenu("viewFDP")}
              >
                <p>View FDP/STTP</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubSubMenu === "viewFDP"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubSubMenu === "viewFDP" && (
                <div className="third-sub-menu-box">
                  <p className="third-sub-menu-link">Detailed View</p>
                  <p className="third-sub-menu-link">Summary View</p>
                </div>
              )}

              <div
                className="sub-menu-link"
                onClick={() => toggleSubSubMenu("addFDP")}
              >
                <p>Add New FDP/STTP</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubSubMenu === "addFDP"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubSubMenu === "addFDP" && (
                <div className="third-sub-menu-box">
                  <p className="third-sub-menu-link">FDP/STTP Form</p>
                  <p className="third-sub-menu-link">Upload Documents</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SDP */}
        <div className="side-bar-menu-box">
          <div className="side-bar-link" onClick={() => toggleDropdown("sdp")}>
            <RiComputerFill className="side-bar-link-icon" />
            <p style={{ display: sideBarOpen ? "block" : "none" }}>SDP</p>
            <span
              className="down-arrow"
              style={{ display: sideBarOpen ? "flex" : "none" }}
            >
              <IoIosArrowDown
                className="down-arrow-icon"
                style={{
                  transform:
                    openDropdown === "sdp" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </span>
          </div>

          {openDropdown === "sdp" && (
            <div className="sub-menu-box">
              <div
                className="sub-menu-link"
                onClick={() => toggleSubSubMenu("viewSDP")}
              >
                <p>View SDP</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                ></span>
              </div>

              {openSubSubMenu === "viewSDP" && (
                <div className="third-sub-menu-box">
                  <p className="third-sub-menu-link">Detailed View</p>
                  <p className="third-sub-menu-link">Summary View</p>
                </div>
              )}

              <div
                className="sub-menu-link"
                onClick={() => toggleSubSubMenu("addSDP")}
              >
                <p>Add New SDP</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                ></span>
              </div>

              {openSubSubMenu === "addSDP" && (
                <div className="third-sub-menu-box">
                  <p className="third-sub-menu-link">SDP Form</p>
                  <p className="third-sub-menu-link">Upload Documents</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="side-bar-menu-box">
          <div
            className="side-bar-link"
            onClick={() => toggleDropdown("Achievements")}
          >
            <GrAchievement className="side-bar-link-icon" />
            <p style={{ display: sideBarOpen ? "block" : "none" }}>
              Achievements
            </p>
            <span
              className="down-arrow"
              style={{ display: sideBarOpen ? "flex" : "none" }}
            >
              <IoIosArrowDown
                className="down-arrow-icon"
                style={{
                  transform:
                    openDropdown === "Achievements"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              />
            </span>
          </div>

          {openDropdown === "Achievements" && (
            <div className="sub-menu-box">
              <div
                className="sub-menu-link"
                onClick={() => toggleSubSubMenu("viewAchievements")}
              >
                <p>View Achievements</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubSubMenu === "viewAchievements"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubSubMenu === "viewAchievements" && (
                <div className="third-sub-menu-box">
                  <p className="third-sub-menu-link">Detailed View</p>
                  <p className="third-sub-menu-link">Summary View</p>
                </div>
              )}

              <div
                className="sub-menu-link"
                onClick={() => toggleSubSubMenu("addAchievements")}
              >
                <p>Add New Achievements</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubSubMenu === "addAchievements"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubSubMenu === "addAchievements" && (
                <div className="third-sub-menu-box">
                  <p className="third-sub-menu-link">Achievement Form</p>
                  <p className="third-sub-menu-link">Upload Certificates</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
