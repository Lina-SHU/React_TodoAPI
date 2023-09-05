import { Outlet } from "react-router-dom";
import mainLogo from'../assets/logo.png';

function Auth() {
    return (<>
        <div id="loginPage" className="bg-yellow">
            <div className="conatiner loginPage vhContainer">
                <div className="side">
                    <a href="#">
                        <img className="logoImg" src="../assets/logo.png" alt="" />
                    </a>
                    <img className="d-m-n" src={mainLogo} alt="workImg" />
                </div>
                <div>
                    {/* 指定渲染位置 */}
                    <Outlet />
                </div>
            </div>
        </div>
    </>)
}

export default Auth;