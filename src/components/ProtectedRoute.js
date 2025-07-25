import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Profile",
      paths: ["/profile"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/profile"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const adminMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Profile",
      paths: ["/profile"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/profile"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/admin/exams/edit") &&
        paths.includes("/admin/exams")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/user/write-exam") &&
        paths.includes("/user/write-exam")
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-primary text-white flex justify-between items-center px-4 py-3 sticky top-0 z-30 shadow">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="ri-menu-line"></i>
          </button>
          <span className="font-bold text-xl tracking-wide">QUIZ Application</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-base">{user?.name}</span>
          <span className="text-xs bg-black text-primary px-2 py-1 rounded">{user?.isAdmin ? "Admin" : "User"}</span>
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col bg-white border-r w-56 min-h-screen fixed top-0 left-0 z-20 pt-20 shadow-lg">
        <nav className="flex flex-col gap-2 mt-4">
          {menu.map((item, index) => (
            <button
              key={index}
              className={`flex items-center gap-3 px-6 py-3 text-base rounded-l-full transition-colors duration-150 font-medium hover:bg-primary/10 hover:text-primary focus:outline-none ${getIsActiveOrNot(item.paths) ? "bg-primary text-white" : "text-gray-700"}`}
              onClick={item.onClick}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Sidebar Drawer (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative w-64 bg-white shadow-lg h-full flex flex-col pt-8 z-50">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-primary"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="ri-close-line"></i>
            </button>
            <nav className="flex flex-col gap-2 mt-8">
              {menu.map((item, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-3 px-6 py-3 text-base rounded-l-full transition-colors duration-150 font-medium hover:bg-primary/10 hover:text-primary focus:outline-none ${getIsActiveOrNot(item.paths) ? "bg-primary text-white" : "text-gray-700"}`}
                  onClick={() => {
                    setSidebarOpen(false);
                    item.onClick();
                  }}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:pl-56 pt-6 transition-all duration-200">
        <div className="max-w-7xl w-full mx-auto px-2">{children}</div>
      </main>
    </div>
  );
}

export default ProtectedRoute;
