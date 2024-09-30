import React, { useState } from "react";
import "./sidebar.css";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { SiProtondrive } from "react-icons/si";
import { RiComputerFill } from "react-icons/ri";
import { FaShareAltSquare, FaTrashAlt } from "react-icons/fa";
import { VscDebugStart } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";

const Sidebar = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null); // For main dropdowns
  const [openSubMenu, setOpenSubMenu] = useState(null); // For second-level sub-menus

  const handleSideBarOpen = () => {
    setSideBarOpen(!sideBarOpen);
    setOpenDropdown(null)
  };

  const toggleDropdown = (menu) => {
    setSideBarOpen(true);
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
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
      <div className="side-bar-content">
        {/* My Drive */}
        <div className="side-bar-menu-box">
          <div
            className="side-bar-link"
            onClick={() => toggleDropdown("myDrive")}
          >
            <SiProtondrive className="side-bar-link-icon" />
            <p style={{ display: sideBarOpen ? "block" : "none" }}>My Drive</p>
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
              {/* <div className="sub-menu-link"> */}
              <div
                className="sub-menu-link"
                onClick={() => toggleSubMenu("file1")}
              >
                <p>File 1</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubMenu === "file1"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubMenu === "file1" && (
                <div className="second-sub-menu-box">
                  <p className="second-sub-menu-link">File 1 content 1 </p>
                  <p className="second-sub-menu-link">File 1 content 2</p>
                </div>
              )}
              {/* </div> */}
              {/* <div className="sub-menu-link"> */}
              <div
                className="sub-menu-link"
                onClick={() => toggleSubMenu("file2")}
              >
                <p>File 2</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubMenu === "file2"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubMenu === "file2" && (
                <div className="second-sub-menu-box">
                  <p className="second-sub-menu-link">File 2 content 1 </p>
                  <p className="second-sub-menu-link">File 2 content 2</p>
                </div>
              )}
            </div>
            // </div>
          )}
        </div>

        {/* Computer */}
        <div className="side-bar-menu-box">
          <div
            className="side-bar-link"
            onClick={() => toggleDropdown("computer")}
          >
            <RiComputerFill className="side-bar-link-icon" />
            <p style={{ display: sideBarOpen ? "block" : "none" }}>Computer</p>
            <span
              className="down-arrow"
              style={{ display: sideBarOpen ? "flex" : "none" }}
            >
              <IoIosArrowDown
                className="down-arrow-icon"
                style={{
                  transform:
                    openDropdown === "computer"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              />
            </span>
          </div>

          {openDropdown === "computer" && (
            <div className="sub-menu-box">
              <div
                className="sub-menu-link"
                onClick={() => toggleSubMenu("pc1")}
              >
                <p>PC 1</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubMenu === "pc1"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubMenu === "pc1" && (
                <div className="second-sub-menu-box">
                  <p className="second-sub-menu-link">PC 1 content 1 </p>
                  <p className="second-sub-menu-link">PC 1 content 2</p>
                </div>
              )}
              <p className="sub-menu-link">PC 2</p>
            </div>
          )}
        </div>

        {/* Shared */}
        <div className="side-bar-menu-box">
          <div
            className="side-bar-link"
            onClick={() => toggleDropdown("shared")}
          >
            <FaShareAltSquare className="side-bar-link-icon" />
            <p style={{ display: sideBarOpen ? "block" : "none" }}>
              Shared with me
            </p>
            <span
              className="down-arrow"
              style={{ display: sideBarOpen ? "flex" : "none" }}
            >
              <IoIosArrowDown
                className="down-arrow-icon"
                style={{
                  transform:
                    openDropdown === "shared"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              />
            </span>
          </div>

          {openDropdown === "shared" && (
            <div className="sub-menu-box">
              <div
                className="sub-menu-link"
                onClick={() => toggleSubMenu("sharedFile1")}
              >
                <p>Shared File 1</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubMenu === "sharedFile1"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubMenu === "sharedFile1" && (
                <div className="second-sub-menu-box">
                  <p className="second-sub-menu-link">Shared content 1 </p>
                  <p className="second-sub-menu-link">Shared content 2</p>
                </div>
              )}
              <p className="sub-menu-link">Shared File 2</p>
            </div>
          )}
        </div>

        {/* Starred */}
        <div className="side-bar-menu-box">
          <div
            className="side-bar-link"
            onClick={() => toggleDropdown("starred")}
          >
            <VscDebugStart className="side-bar-link-icon" />
            <p style={{ display: sideBarOpen ? "block" : "none" }}>Starred</p>
            <span
              className="down-arrow"
              style={{ display: sideBarOpen ? "flex" : "none" }}
            >
              <IoIosArrowDown
                className="down-arrow-icon"
                style={{
                  transform:
                    openDropdown === "starred"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              />
            </span>
          </div>

          {openDropdown === "starred" && (
            <div className="sub-menu-box">
              <div
                className="sub-menu-link"
                onClick={() => toggleSubMenu("starredFile1")}
              >
                <p>Starred File 1</p>
                <span
                  className="down-arrow"
                  style={{ display: sideBarOpen ? "flex" : "none" }}
                >
                  <IoIosArrowDown
                    className="down-arrow-icon"
                    style={{
                      transform:
                        openSubMenu === "starredFile1"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                </span>
              </div>

              {openSubMenu === "starredFile1" && (
                <div className="second-sub-menu-box">
                  <p className="second-sub-menu-link">Starred content 1 </p>
                  <p className="second-sub-menu-link">Starred content 2</p>
                </div>
              )}
              <p className="sub-menu-link">Starred File 2</p>
            </div>
          )}
        </div>

        {/* Bin */}
        <div className="side-bar-menu-box">
          <div className="side-bar-link">
            <FaTrashAlt className="side-bar-link-icon" />
            <p style={{ display: sideBarOpen ? "block" : "none" }}>Bin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
